'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, RefreshCw, Grid, Check } from 'lucide-react';

const BACKGROUND_COLORS = [
  { name: '透明', value: 'transparent', class: 'bg-transparent border' },
  { name: '白色', value: '#ffffff', class: 'bg-white' },
  { name: '黑色', value: '#000000', class: 'bg-black' },
  { name: '灰色', value: '#f3f4f6', class: 'bg-gray-100' },
  { name: '蓝色', value: '#3b82f6', class: 'bg-blue-500' },
  { name: '绿色', value: '#10b981', class: 'bg-green-500' },
];

export default function PreviewSection() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedBackground, setSelectedBackground] = useState('transparent');
  const [showGrid, setShowGrid] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'result'>('split');

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleBackgroundSelect = (color: string) => {
    setSelectedBackground(color);
  };

  return (
    <div className="space-y-4">
      {/* 视图模式选择 */}
      <div className="flex rounded-lg border border-gray-200 p-1">
        {[
          { id: 'split', label: '对比视图', icon: '🔄' },
          { id: 'original', label: '原图', icon: '📷' },
          { id: 'result', label: '结果', icon: '🎯' },
        ].map((mode) => (
          <button
            key={mode.id}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              viewMode === mode.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setViewMode(mode.id as any)}
          >
            <span className="mr-2">{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>

      {/* 预览区域 */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <div
          className="flex h-64 items-center justify-center"
          style={{
            backgroundColor: selectedBackground === 'transparent' ? 'transparent' : selectedBackground,
            backgroundImage: showGrid
              ? `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`
              : 'none',
            backgroundSize: showGrid ? '20px 20px' : 'auto',
            backgroundPosition: showGrid ? '0 0, 0 10px, 10px -10px, -10px 0px' : '0 0',
          }}
        >
          {viewMode === 'split' ? (
            <div className="flex h-full w-full">
              <div className="flex-1 border-r border-gray-300 p-4">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-2xl">📷</span>
                    </div>
                    <p className="text-sm text-gray-600">原图预览</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-sm text-gray-600">去除背景后</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <span className="text-3xl">
                  {viewMode === 'original' ? '📷' : '🎯'}
                </span>
              </div>
              <p className="text-gray-600">
                {viewMode === 'original'
                  ? '上传图片后查看原图'
                  : '处理完成后查看结果'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                缩放级别: {zoomLevel}%
              </p>
            </div>
          )}
        </div>

        {/* 缩放控制 */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 rounded-lg bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm">
          <button
            onClick={handleZoomOut}
            className="rounded p-1 hover:bg-gray-100"
            disabled={zoomLevel <= 25}
          >
            <ZoomOut size={16} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700">{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            className="rounded p-1 hover:bg-gray-100"
            disabled={zoomLevel >= 400}
          >
            <ZoomIn size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleResetZoom}
            className="ml-2 rounded p-1 hover:bg-gray-100"
          >
            <RefreshCw size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* 背景颜色选择 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">背景颜色</h4>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center space-x-1 rounded-lg px-3 py-1.5 text-xs font-medium ${
              showGrid
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Grid size={12} />
            <span>{showGrid ? '隐藏网格' : '显示网格'}</span>
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {BACKGROUND_COLORS.map((color) => (
            <button
              key={color.value}
              className={`relative h-10 rounded-lg border ${color.class} ${
                selectedBackground === color.value
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
              onClick={() => handleBackgroundSelect(color.value)}
              title={color.name}
            >
              {selectedBackground === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check size={16} className="text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>点击颜色切换背景</span>
          <span>网格模式检查边缘</span>
        </div>
      </div>

      {/* 图像信息 */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-900">图像信息</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-500">原始尺寸</p>
            <p className="font-medium text-gray-900">-- × -- px</p>
          </div>
          <div>
            <p className="text-gray-500">文件大小</p>
            <p className="font-medium text-gray-900">-- MB</p>
          </div>
          <div>
            <p className="text-gray-500">处理时间</p>
            <p className="font-medium text-gray-900">-- 秒</p>
          </div>
          <div>
            <p className="text-gray-500">结果格式</p>
            <p className="font-medium text-gray-900">PNG (透明)</p>
          </div>
        </div>
      </div>
    </div>
  );
}