'use client';

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Copy } from 'lucide-react';

export default function ImageUploadZone() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件（JPG、PNG、WebP）');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
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
  }, []);

  const handleCopyLink = useCallback(() => {
    if (image) {
      navigator.clipboard.writeText(image);
      alert('图片链接已复制到剪贴板');
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
              <img
                src={image}
                alt="预览"
                className="mx-auto max-h-64 rounded-lg object-contain"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-2">
                <ImageIcon size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                  {fileName}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1 rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                <Copy size={14} />
                <span>复制链接</span>
              </button>
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
          className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={!image}
        >
          🪄 开始去除背景
        </button>
        <button
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!image}
          onClick={handleRemoveImage}
        >
          重新选择
        </button>
        <button
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
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