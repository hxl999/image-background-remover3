'use client';

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Copy, Sparkles } from 'lucide-react';
import { imageProcessor, formatFileSize } from '@/lib/api';

export default function ImageUploadZone() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // 验证文件
    const validation = imageProcessor.validateFile(file);
    if (!validation.valid) {
      setError(validation.error || '文件验证失败');
      return;
    }

    setError(null);
    setProcessResult(null);

    try {
      const dataURL = await imageProcessor.fileToDataURL(file);
      setImage(dataURL);
      setFileName(file.name);
    } catch (err) {
      setError('读取文件失败，请重试');
      console.error('File read error:', err);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFileSelect(file);
            break;
          }
        }
      }
    },
    [handleFileSelect]
  );

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setFileName('');
    setProcessResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  const handleCopyLink = useCallback(() => {
    const urlToCopy = processResult || image;
    if (urlToCopy) {
      navigator.clipboard.writeText(urlToCopy);
      alert('图片链接已复制到剪贴板');
    }
  }, [image, processResult]);

  const handleProcessImage = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await imageProcessor.processImage(image, {
        size: 'auto',
        type: 'auto',
      });

      if (result.success && result.data) {
        setProcessResult(result.data);
        alert(`背景去除成功！处理时间：${result.metadata?.processingTime || 0}ms`);
      } else {
        setError(result.error?.message || '背景去除失败');
      }
    } catch (err) {
      setError('处理过程中发生错误，请重试');
      console.error('Process error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [image]);

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onPaste={handlePaste}
      >
        {image ? (
          <div className="space-y-4">
            <div className="relative mx-auto max-w-md">
              <div className="relative">
                <img
                  src={processResult || image}
                  alt={processResult ? "去除背景后" : "原图"}
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
                {processResult && (
                  <div className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                    已处理
                  </div>
                )}
                <button
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
              
              {processResult && (
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    <Sparkles size={12} className="mr-1" />
                    背景已成功去除
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {processResult ? '透明背景 PNG' : '原始图片'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1 rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                  disabled={isProcessing}
                >
                  <Copy size={14} />
                  <span>复制链接</span>
                </button>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <p className="mt-1 text-xs text-red-600">
                    请检查图片格式或稍后重试
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Upload size={24} className="text-gray-500" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-gray-900">
              拖拽图片到这里
            </h4>
            <p className="mb-4 text-sm text-gray-600">
              或点击选择文件，支持 Ctrl+V 粘贴
            </p>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow">
              <Upload size={16} className="mr-2" />
              选择图片
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
              />
            </label>
            <p className="mt-4 text-xs text-gray-500">
              支持 JPG、PNG、WebP，最大 10MB，最高 4K 分辨率
            </p>
          </>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3">
        <button
          className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          disabled={!image || isProcessing}
          onClick={handleProcessImage}
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              处理中...
            </>
          ) : (
            <>
              <Sparkles size={18} className="mr-2" />
              {processResult ? '重新处理' : '开始去除背景'}
            </>
          )}
        </button>
        <button
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!image || isProcessing}
          onClick={handleRemoveImage}
        >
          重新选择
        </button>
        <button
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:isProcessing"
          onClick={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }}
          disabled={isProcessing}
        >
          添加更多图片
        </button>
      </div>

      {/* 上传提示 */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-start">
          <div className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
            <span className="text-xs font-bold text-blue-600">💡</span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">使用技巧</p>
            <ul className="mt-1 space-y-1 text-xs text-blue-700">
              <li>• 人像照片效果最佳，确保人物与背景对比明显</li>
              <li>• 电商产品图建议使用纯色背景</li>
              <li>• 复杂背景可能需要手动调整边缘</li>
              <li>• 使用 Ctrl+V 快速粘贴剪贴板中的图片</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}