import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // 使用Edge Runtime，适合Cloudflare

export async function POST(request: NextRequest) {
  try {
    // 1. 验证请求
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json' },
        { status: 400 }
      );
    }

    // 2. 解析请求体
    const body = await request.json();
    const { image, options = {} } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // 3. 验证图片数据（Base64格式）
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Expected data URL' },
        { status: 400 }
      );
    }

    // 4. 获取API Key
    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      console.error('Remove.bg API key is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 5. 提取Base64数据
    const base64Data = image.split(',')[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    // 6. 调用Remove.bg API
    console.log('Calling Remove.bg API...');
    const startTime = Date.now();

    const formData = new FormData();
    const blob = await fetch(image).then(res => res.blob());
    formData.append('image_file', blob, 'image.jpg');
    formData.append('size', options.size || 'auto');
    formData.append('type', options.type || 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    const processingTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', response.status, errorText);
      
      let errorMessage = 'Background removal failed';
      if (response.status === 402) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (response.status === 400) {
        errorMessage = 'Invalid image or unsupported format';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment.';
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      );
    }

    // 7. 获取处理结果
    const resultBlob = await response.blob();
    const resultBuffer = await resultBlob.arrayBuffer();
    
    // 在Edge Runtime中使用TextDecoder处理Base64
    const bytes = new Uint8Array(resultBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const resultBase64 = btoa(binary);
    const resultDataUrl = `data:image/png;base64,${resultBase64}`;

    // 8. 返回成功响应
    return NextResponse.json({
      success: true,
      data: resultDataUrl,
      metadata: {
        processingTime,
        originalSize: blob.size,
        resultSize: resultBlob.size,
        format: 'png',
        width: 0, // Remove.bg不返回尺寸信息
        height: 0,
      },
    });

  } catch (error) {
    console.error('API processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 健康检查端点
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ImageMatte Background Removal API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}