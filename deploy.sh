#!/bin/bash

# ImageMatte 一键部署脚本
# 使用方法：./deploy.sh

set -e

echo "🚀 ImageMatte 部署脚本"
echo "======================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

echo "📦 安装依赖..."
npm ci

echo "🔧 设置环境变量..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# Remove.bg API Configuration
REMOVEBG_API_KEY=wnPqYWXaesV49H3yUvp3eToA

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=ImageMatte
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF
    echo "✅ 创建 .env.local 文件"
else
    echo "✅ .env.local 文件已存在"
fi

echo "🏗️  构建项目..."
npm run build

echo "✅ 构建完成！"

# 检查是否安装了 wrangler
if command -v wrangler &> /dev/null; then
    echo "🔍 检测到 Cloudflare Wrangler"
    read -p "是否部署到 Cloudflare Pages？(y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 部署到 Cloudflare Pages..."
        wrangler pages deploy .next --project-name=imagematte
        echo "✅ 部署完成！"
        echo "🌐 网站地址: https://imagematte.pages.dev"
    fi
else
    echo "📝 Cloudflare Wrangler 未安装"
    echo "如需部署到 Cloudflare Pages，请运行:"
    echo "  npm install -g wrangler"
    echo "  wrangler login"
    echo "  wrangler pages deploy .next --project-name=imagematte"
fi

echo ""
echo "🎉 本地运行:"
echo "  npm run dev"
echo "  然后打开 http://localhost:3000"
echo ""
echo "📚 详细部署指南请查看 DEPLOYMENT.md"