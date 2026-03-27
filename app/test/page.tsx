'use client';

import { useState } from 'react';
import { imageProcessor } from '@/lib/api';

export default function TestPage() {
  const [status, setStatus] = useState<string>('准备测试...');
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  const testApiHealth = async () => {
    setLoading(true);
    setStatus('测试API健康检查...');
    
    try {
      const response = await fetch('/api/process');
      const data = await response.json();
      
      if (response.ok) {
        setStatus(`✅ API健康检查通过: ${data.status}`);
        setApiStats(data);
      } else {
        setStatus(`❌ API健康检查失败: ${response.status}`);
      }
    } catch (error) {
      setStatus(`❌ 网络错误: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const testRemoveBgApi = async () => {
    setLoading(true);
    setStatus('测试Remove.bg API连接...');
    
    // 使用一个小的测试图片（1x1透明像素）
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    try {
      const result = await imageProcessor.processImage(testImage, {
        size: 'preview',
        type: 'auto',
      });
      
      if (result.success) {
        setStatus('✅ Remove.bg API连接成功！');
        setApiStats(imageProcessor.getStats());
      } else {
        setStatus(`❌ Remove.bg API错误: ${result.error?.message}`);
      }
    } catch (error) {
      setStatus(`❌ 测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const runFullTest = async () => {
    await testApiHealth();
    await testRemoveBgApi();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ImageMatte API 测试页面</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API 测试</h2>
          
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700 font-medium">当前状态:</p>
            <p className={`mt-1 ${status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-blue-600'}`}>
              {status}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={runFullTest}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '测试中...' : '运行完整测试'}
            </button>
            
            <button
              onClick={testApiHealth}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              测试API健康
            </button>
            
            <button
              onClick={testRemoveBgApi}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              测试Remove.bg API
            </button>
          </div>
          
          {apiStats && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">API 统计信息</h3>
              <pre className="text-sm bg-gray-900 text-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(apiStats, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">部署状态</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800">✅ GitHub 仓库</h3>
              <p className="text-green-700 mt-1">
                代码已推送到: <a href="https://github.com/hxl999/image-background-remover3" className="underline" target="_blank" rel="noopener noreferrer">hxl999/image-background-remover3</a>
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800">🔧 部署配置</h3>
              <ul className="text-blue-700 mt-2 space-y-1">
                <li>• GitHub Actions 工作流已配置</li>
                <li>• Cloudflare Pages 部署指南已创建</li>
                <li>• 一键部署脚本已就绪</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800">🚀 下一步操作</h3>
              <ol className="text-yellow-700 mt-2 space-y-2">
                <li>1. 按照 <code className="bg-yellow-100 px-1 rounded">DEPLOYMENT.md</code> 配置 Cloudflare</li>
                <li>2. 在 GitHub 设置 Secrets</li>
                <li>3. 手动触发部署工作流</li>
                <li>4. 访问: <code className="bg-yellow-100 px-1 rounded">https://imagematte.pages.dev</code></li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>测试页面仅用于验证API功能，部署后可删除</p>
          <p className="mt-1">主页面: <a href="/" className="text-blue-600 hover:underline">返回首页</a></p>
        </div>
      </div>
    </div>
  );
}