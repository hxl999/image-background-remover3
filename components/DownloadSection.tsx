'use client';

import { useState } from 'react';
import { Download, Share2, Copy, Check, ExternalLink } from 'lucide-react';

const FORMAT_OPTIONS = [
  { id: 'png', label: 'PNG', description: '透明背景，最佳质量', icon: '🖼️' },
  { id: 'jpg', label: 'JPG', description: '白色背景，较小文件', icon: '📷' },
  { id: 'webp', label: 'WebP', description: '现代格式，平衡', icon: '🌐' },
];

const SIZE_OPTIONS = [
  { id: 'original', label: '原始尺寸', value: 'original' },
  { id: '800', label: '800×800', value: '800', description: '电商标准' },
  { id: '1080', label: '1080×1080', value: '1080', description: '社交媒体' },
  { id: '1920', label: '1920×1080', value: '1920', description: '高清壁纸' },
  { id: 'custom', label: '自定义', value: 'custom' },
];

const QUALITY_OPTIONS = [
  { id: 'high', label: '高质量', value: 90, description: '最佳视觉效果' },
  { id: 'medium', label: '中等', value: 75, description: '平衡质量与大小' },
  { id: 'low', label: '压缩', value: 50, description: '最小文件大小' },
];

export default function DownloadSection() {
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedSize, setSelectedSize] = useState('original');
  const [selectedQuality, setSelectedQuality] = useState('high');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleDownload = () => {
    // 模拟下载
    alert(`开始下载：${selectedFormat.toUpperCase()} 格式，${selectedSize === 'custom' ? `${customWidth}×${customHeight}` : selectedSize}，${selectedQuality} 质量`);
    
    // 这里实际会触发文件下载
    // const link = document.createElement('a');
    // link.href = processedImageUrl;
    // link.download = `ImageMatte_${new Date().getTime()}.${selectedFormat}`;
    // link.click();
  };

  const handleCopyLink = () => {
    const link = `https://imagematte.app/result/${Date.now()}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateShare = () => {
    const newShareUrl = `https://imagematte.app/share/${Math.random().toString(36).substr(2, 9)}`;
    setShareUrl(newShareUrl);
  };

  const handleOpenInNewTab = () => {
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* 格式选择 */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">输出格式</h4>
        <div className="grid gap-2">
          {FORMAT_OPTIONS.map((format) => (
            <button
              key={format.id}
              className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-center">
                <span className="mr-3 text-xl">{format.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{format.label}</p>
                  <p className="text-xs text-gray-500">{format.description}</p>
                </div>
              </div>
              {selectedFormat === format.id && (
                <Check size={16} className="text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 尺寸选择 */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">输出尺寸</h4>
        <div className="grid grid-cols-2 gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size.id}
              className={`rounded-lg border p-3 text-center transition-colors ${
                selectedSize === size.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedSize(size.value)}
            >
              <p className="font-medium text-gray-900">{size.label}</p>
              {size.description && (
                <p className="mt-1 text-xs text-gray-500">{size.description}</p>
              )}
            </button>
          ))}
        </div>

        {/* 自定义尺寸输入 */}
        {selectedSize === 'custom' && (
          <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  宽度 (px)
                </label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="例如：800"
                  min="100"
                  max="4096"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  高度 (px)
                </label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="例如：600"
                  min="100"
                  max="4096"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              建议保持宽高比，最大 4096×4096
            </p>
          </div>
        )}
      </div>

      {/* 质量选择 */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">输出质量</h4>
        <div className="grid grid-cols-3 gap-2">
          {QUALITY_OPTIONS.map((quality) => (
            <button
              key={quality.id}
              className={`rounded-lg border p-3 text-center transition-colors ${
                selectedQuality === quality.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedQuality(quality.id)}
            >
              <p className="font-medium text-gray-900">{quality.label}</p>
              <p className="mt-1 text-xs text-gray-500">{quality.value}%</p>
              <p className="mt-1 text-xs text-gray-500">{quality.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 下载按钮 */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-medium text-white shadow-md hover:shadow-lg transition-all"
        >
          <Download size={18} />
          <span>下载图片</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? '已复制' : '复制链接'}</span>
          </button>
          <button
            onClick={handleGenerateShare}
            className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            <Share2 size={18} />
            <span>生成分享</span>
          </button>
        </div>
      </div>

      {/* 分享链接 */}
      {shareUrl && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium text-blue-900">分享链接已生成</h4>
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
            >
              <ExternalLink size={12} />
              <span>新窗口打开</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-gray-700"
            />
            <button
              onClick={handleCopyLink}
              className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              复制
            </button>
          </div>
          <p className="mt-2 text-xs text-blue-700">
            此链接 24 小时内有效，任何人可访问
          </p>
        </div>
      )}

      {/* 使用统计 */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">本月剩余额度</p>
            <p className="text-2xl font-bold text-gray-900">50 张</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">已使用</p>
            <p className="text-lg font-bold text-gray-900">0 张</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-0 rounded-full bg-green-500"></div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          免费额度每月重置，升级计划获得更多额度
        </p>
      </div>
    </div>
  );
}