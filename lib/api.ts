export interface ProcessOptions {
  size?: 'auto' | 'preview' | 'full' | 'medium' | 'hd' | '4k';
  type?: 'auto' | 'person' | 'product' | 'car';
  format?: 'png' | 'jpg' | 'zip';
  crop?: boolean;
  scale?: string;
  position?: string;
  channels?: 'rgba' | 'alpha';
  roi?: string;
  bg_color?: string;
  bg_image_url?: string;
}

export interface ProcessResponse {
  success: boolean;
  data?: string; // Base64 encoded image
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    processingTime: number;
    originalSize: number;
    resultSize: number;
    format: string;
    width?: number;
    height?: number;
  };
}

export interface ApiStats {
  requests: number;
  successes: number;
  failures: number;
  totalProcessingTime: number;
}

class ImageProcessor {
  private static instance: ImageProcessor;
  private stats: ApiStats = {
    requests: 0,
    successes: 0,
    failures: 0,
    totalProcessingTime: 0,
  };

  private constructor() {}

  static getInstance(): ImageProcessor {
    if (!ImageProcessor.instance) {
      ImageProcessor.instance = new ImageProcessor();
    }
    return ImageProcessor.instance;
  }

  async processImage(
    imageData: string, // Base64 or Data URL
    options: ProcessOptions = {}
  ): Promise<ProcessResponse> {
    this.stats.requests++;

    try {
      // 验证图片数据
      if (!this.validateImageData(imageData)) {
        throw new Error('Invalid image data format');
      }

      const startTime = Date.now();

      // 调用API
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          options: {
            size: options.size || 'auto',
            type: options.type || 'auto',
            ...options,
          },
        }),
      });

      const processingTime = Date.now() - startTime;
      this.stats.totalProcessingTime += processingTime;

      const data = await response.json();

      if (!response.ok) {
        this.stats.failures++;
        return {
          success: false,
          error: {
            code: `API_${response.status}`,
            message: data.error || 'Background removal failed',
            details: data.details,
          },
        };
      }

      this.stats.successes++;
      return {
        success: true,
        data: data.data,
        metadata: {
          ...data.metadata,
          processingTime,
        },
      };

    } catch (error) {
      this.stats.failures++;
      console.error('Image processing error:', error);

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
          details: error,
        },
      };
    }
  }

  private validateImageData(imageData: string): boolean {
    // 检查是否是有效的Base64或Data URL
    if (!imageData) return false;

    // Data URL格式: data:image/[format];base64,[data]
    if (imageData.startsWith('data:image/')) {
      const parts = imageData.split(',');
      if (parts.length !== 2) return false;
      
      const [header, data] = parts;
      if (!header.includes('base64')) return false;
      if (!data || data.trim() === '') return false;

      // 验证Base64格式
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Regex.test(data);
    }

    // 纯Base64格式
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(imageData);
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    // 检查文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: `不支持的文件格式: ${file.type}。请上传 JPG、PNG 或 WebP 格式的图片。`,
      };
    }

    // 检查文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `文件太大: ${(file.size / 1024 / 1024).toFixed(2)}MB。最大支持 10MB。`,
      };
    }

    // 检查文件名
    if (!file.name || file.name.trim() === '') {
      return {
        valid: false,
        error: '文件名无效',
      };
    }

    return { valid: true };
  }

  fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  dataURLToBlob(dataURL: string): Blob {
    const [header, data] = dataURL.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([arrayBuffer], { type: mimeType });
  }

  downloadImage(dataURL: string, filename: string = 'ImageMatte.png'): void {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStats(): ApiStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = {
      requests: 0,
      successes: 0,
      failures: 0,
      totalProcessingTime: 0,
    };
  }

  getAverageProcessingTime(): number {
    if (this.stats.successes === 0) return 0;
    return this.stats.totalProcessingTime / this.stats.successes;
  }

  getSuccessRate(): number {
    if (this.stats.requests === 0) return 100;
    return (this.stats.successes / this.stats.requests) * 100;
  }
}

// 导出单例实例
export const imageProcessor = ImageProcessor.getInstance();

// 工具函数
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getImageDimensions(dataURL: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = dataURL;
  });
}

export function compressImage(
  dataURL: string, 
  quality: number = 0.8, 
  maxWidth: number = 4096
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // 按比例缩放
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为WebP格式（如果支持）
      const format = 'image/webp';
      const compressedDataURL = canvas.toDataURL(format, quality);
      
      resolve(compressedDataURL);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = dataURL;
  });
}