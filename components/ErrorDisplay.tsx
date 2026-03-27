'use client';

import { useState } from 'react';
import { AlertTriangle, XCircle, Info, RefreshCw, HelpCircle } from 'lucide-react';

const ERROR_TYPES = [
  {
    id: 'file_too_large',
    title: '文件过大',
    message: '图片大小超过10MB限制',
    solution: '请压缩图片或选择较小的文件',
    icon: '📁',
    severity: 'warning',
  },
  {
    id: 'invalid_format',
    title: '格式不支持',
    message: '仅支持 JPG、PNG、WebP 格式',
    solution: '请转换图片格式后重试',
    icon: '🖼️',
    severity: 'warning',
  },
  {
    id: 'api_limit',
    title: '额度已用完',
    message: '本月免费额度（50张）已用完',
    solution: '请等待下月重置或升级计划',
    icon: '💰',
    severity: 'error',
  },
  {
    id: 'network_error',
    title: '网络错误',
    message: '无法连接到处理服务器',
    solution: '请检查网络连接后重试',
    icon: '🌐',
    severity: 'error',
  },
  {
    id: 'processing_failed',
    title: '处理失败',
    message: 'AI无法识别图片主体',
    solution: '请尝试更换图片或手动调整',
    icon: '🤖',
    severity: 'error',
  },
  {
    id: 'timeout',
    title: '处理超时',
    message: '处理时间超过15秒限制',
    solution: '请尝试较小的图片或稍后重试',
    icon: '⏱️',
    severity: 'warning',
  },
];

const HELP_TIPS = [
  '确保图片清晰，主体与背景对比明显',
  '人像照片效果最佳，避免复杂背景',
  '图片分辨率建议在 1000×1000 到 4000×4000 之间',
  '如有问题，可尝试裁剪图片突出主体',
  '免费版每月50张额度，请合理使用',
];

export default function ErrorDisplay() {
  const [activeError, setActiveError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSimulateError = (errorId: string) => {
    setActiveError(errorId);
    setShowHelp(false);
  };

  const handleClearError = () => {
    setActiveError(null);
  };

  const handleRetry = () => {
    alert('正在重试...');
    setActiveError(null);
  };

  const selectedError = ERROR_TYPES.find(error => error.id === activeError);

  return (
    <div className="space-y-4">
      {/* 错误模拟按钮 */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">错误模拟</h4>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900"
          >
            <HelpCircle size={14} />
            <span>{showHelp ? '隐藏提示' : '查看提示'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {ERROR_TYPES.map((error) => (
            <button
              key={error.id}
              className={`flex items-center space-x-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                activeError === error.id
                  ? error.severity === 'error'
                    ? 'border-red-300 bg-red-50'
                    : 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => handleSimulateError(error.id)}
            >
              <span className="text-lg">{error.icon}</span>
              <span className="font-medium text-gray-900">{error.title}</span>
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500">
          点击按钮模拟各种错误情况，了解错误处理流程
        </p>
      </div>

      {/* 错误详情显示 */}
      {selectedError && (
        <div
          className={`rounded-lg border p-4 ${
            selectedError.severity === 'error'
              ? 'border-red-300 bg-red-50'
              : 'border-yellow-300 bg-yellow-50'
          }`}
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div
                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                  selectedError.severity === 'error'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {selectedError.severity === 'error' ? (
                  <XCircle size={14} />
                ) : (
                  <AlertTriangle size={14} />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {selectedError.title}
                </h4>
                <p className="mt-1 text-sm text-gray-700">
                  {selectedError.message}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearError}
              className="rounded p-1 hover:bg-white/50"
            >
              <span className="text-lg">×</span>
            </button>
          </div>

          <div className="mb-4 rounded-lg bg-white/70 p-3">
            <div className="flex items-start">
              <Info size={14} className="mr-2 mt-0.5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">解决方案</p>
                <p className="mt-1 text-sm text-gray-700">
                  {selectedError.solution}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRetry}
              className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <RefreshCw size={14} />
              <span>重试</span>
            </button>
            <button
              onClick={handleClearError}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              忽略错误
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              查看帮助
            </button>
          </div>
        </div>
      )}

      {/* 帮助提示 */}
      {showHelp && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-blue-900">使用提示</h4>
            <button
              onClick={() => setShowHelp(false)}
              className="rounded p-1 hover:bg-blue-100"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
          <ul className="space-y-2">
            {HELP_TIPS.map((tip, index) => (
              <li key={index} className="flex items-start">
                <div className="mr-2 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-xs font-bold text-blue-600">✓</span>
                </div>
                <span className="text-sm text-blue-800">{tip}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg bg-white/70 p-3">
            <p className="text-sm font-medium text-blue-900">技术支持</p>
            <p className="mt-1 text-sm text-blue-700">
              如问题持续存在，请联系 support@imagematte.app
            </p>
          </div>
        </div>
      )}

      {/* 错误统计 */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">今日错误</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">98.5%</p>
            <p className="text-xs text-gray-600">成功率</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">3.2s</p>
            <p className="text-xs text-gray-600">平均处理</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-[98.5%] rounded-full bg-green-500"></div>
        </div>
        <p className="mt-2 text-center text-xs text-gray-500">
          系统运行稳定，错误率低于行业标准
        </p>
      </div>
    </div>
  );
}