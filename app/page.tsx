import ImageUploadZone from '@/components/ImageUploadZone';
import PreviewSection from '@/components/PreviewSection';
import DownloadSection from '@/components/DownloadSection';
import LoadingState from '@/components/LoadingState';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">ImageMatte</h1>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                AI Powered
              </span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                首页
              </a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                功能
              </a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                定价
              </a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                帮助
              </a>
            </nav>
            <button className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-shadow">
              开始使用
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 标题区域 */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            一键去除图片背景
            <span className="block text-3xl font-normal text-gray-600 md:text-4xl">
              3秒完成，无需PS技能
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            上传图片，AI自动识别并去除背景，支持电商产品图、人像摄影、设计素材等多种场景
          </p>
        </div>

        {/* 核心功能区域 */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 左侧：上传区域 */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">上传图片</h3>
                <ImageUploadZone />
                <div className="mt-6">
                  <LoadingState />
                  <ErrorDisplay />
                </div>
              </div>
            </div>

            {/* 右侧：信息区域 */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">预览结果</h3>
                <PreviewSection />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">下载选项</h3>
                <DownloadSection />
              </div>

              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
                <h4 className="mb-2 font-medium text-gray-900">使用提示</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    支持 JPG、PNG、WebP 格式
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    最大文件大小：10MB
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    最高分辨率：4K (4096×4096)
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                    免费额度：每月50张
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特性展示 */}
        <div className="mt-16">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">为什么选择 ImageMatte？</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">极速处理</h4>
              <p className="text-sm text-gray-600">AI算法优化，平均3秒完成背景去除</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">精准识别</h4>
              <p className="text-sm text-gray-600">智能边缘处理，头发丝细节完美保留</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl">🆓</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">免费使用</h4>
              <p className="text-sm text-gray-600">每月50张免费额度，满足日常需求</p>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600" />
                <span className="text-lg font-bold text-gray-900">ImageMatte</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">AI图片背景去除工具</p>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>© 2026 ImageMatte. All rights reserved.</p>
              <p className="mt-1">
                基于 Remove.bg API 构建 ·{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  隐私政策
                </a>{' '}
                ·{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  服务条款
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}