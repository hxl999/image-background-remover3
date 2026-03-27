'use client';

import { useState, useEffect } from 'react';
import { Loader2, Clock, Zap, CheckCircle } from 'lucide-react';

const PROCESSING_STEPS = [
  { id: 'upload', label: '上传中', icon: '📤', duration: 1 },
  { id: 'analyzing', label: '分析图片', icon: '🔍', duration: 2 },
  { id: 'processing', label: 'AI处理', icon: '🤖', duration: 3 },
  { id: 'optimizing', label: '优化边缘', icon: '🎯', duration: 2 },
  { id: 'finalizing', label: '完成', icon: '✅', duration: 1 },
];

export default function LoadingState() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(9); // 总预估时间（秒）

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);
    setEstimatedTime(9);
  };

  const cancelProcessing = () => {
    setIsProcessing(false);
    setCurrentStep(0);
    setProgress(0);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const totalDuration = PROCESSING_STEPS.reduce((sum, step) => sum + step.duration, 0);
    let currentTime = 0;

    const interval = setInterval(() => {
      currentTime += 0.1;
      const newProgress = (currentTime / totalDuration) * 100;
      setProgress(Math.min(newProgress, 100));

      // 更新当前步骤
      let stepTime = 0;
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        stepTime += PROCESSING_STEPS[i].duration;
        if (currentTime <= stepTime) {
          setCurrentStep(i);
          break;
        }
      }

      // 更新预估剩余时间
      const remainingTime = totalDuration - currentTime;
      setEstimatedTime(Math.max(0, Math.ceil(remainingTime)));

      if (currentTime >= totalDuration) {
        clearInterval(interval);
        // 处理完成，3秒后重置
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep(0);
          setProgress(0);
        }, 3000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing) {
    return (
      <div className="text-center">
        <button
          onClick={startProcessing}
          className="inline-flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Zap size={18} />
          <span>模拟处理过程</span>
        </button>
        <p className="mt-2 text-sm text-gray-500">
          点击按钮查看完整的处理流程动画
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 进度条 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm font-medium text-gray-900">
              {PROCESSING_STEPS[currentStep].label}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock size={14} />
            <span>约 {estimatedTime} 秒</span>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>{Math.round(progress)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* 处理步骤 */}
      <div className="grid grid-cols-5 gap-2">
        {PROCESSING_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`relative rounded-lg p-3 text-center ${
              index < currentStep
                ? 'bg-green-50 border border-green-200'
                : index === currentStep
                ? 'bg-blue-50 border border-blue-300'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="mb-2 text-2xl">{step.icon}</div>
            <p className="text-xs font-medium text-gray-900">{step.label}</p>
            <p className="mt-1 text-xs text-gray-500">{step.duration}s</p>
            
            {/* 状态指示器 */}
            <div className="absolute -top-1 -right-1">
              {index < currentStep ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : index === currentStep ? (
                <div className="h-4 w-4 animate-ping rounded-full bg-blue-500" />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* 处理详情 */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">当前步骤</p>
            <p className="font-medium text-gray-900">
              {PROCESSING_STEPS[currentStep].label}
            </p>
          </div>
          <div>
            <p className="text-gray-500">步骤进度</p>
            <p className="font-medium text-gray-900">
              {currentStep + 1} / {PROCESSING_STEPS.length}
            </p>
          </div>
          <div>
            <p className="text-gray-500">已用时间</p>
            <p className="font-medium text-gray-900">
              {Math.round((progress / 100) * 9)} 秒
            </p>
          </div>
          <div>
            <p className="text-gray-500">剩余时间</p>
            <p className="font-medium text-gray-900">{estimatedTime} 秒</p>
          </div>
        </div>
      </div>

      {/* 处理提示 */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex">
          <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
            <span className="text-xs font-bold text-blue-600">💡</span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">处理进行中</p>
            <ul className="mt-1 space-y-1 text-xs text-blue-700">
              <li>• AI正在分析图片内容并识别主体</li>
              <li>• 复杂图片可能需要更长时间</li>
              <li>• 处理过程中请不要关闭页面</li>
              <li>• 完成后自动显示预览结果</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 取消按钮 */}
      <div className="text-center">
        <button
          onClick={cancelProcessing}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          取消处理
        </button>
        <p className="mt-2 text-xs text-gray-500">
          取消后可以重新上传图片
        </p>
      </div>
    </div>
  );
}