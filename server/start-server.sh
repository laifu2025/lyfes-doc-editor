#!/bin/bash

# ✅ Markdown编辑器后端服务器启动脚本
# 作者: Lyfe
# 用途: 启动Node.js后端服务，支持文档保存到服务器

echo "🚀 正在启动Markdown编辑器后端服务器..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js未安装，请先安装Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm未安装，请先安装npm"
    exit 1
fi

# 进入服务器目录
cd "$(dirname "$0")"

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: package.json文件不存在"
    exit 1
fi

# 安装依赖
echo "📦 正在安装依赖包..."
if npm install; then
    echo "✅ 依赖包安装成功"
else
    echo "❌ 依赖包安装失败"
    exit 1
fi

# 创建必要的目录
mkdir -p documents uploads logs

# 设置环境变量
export NODE_ENV=production
export PORT=${PORT:-3002}

echo "📁 文档存储目录: $(pwd)/documents"
echo "📁 上传文件目录: $(pwd)/uploads"
echo "🌐 服务器端口: $PORT"

# 启动服务器
echo "🎯 正在启动服务器..."
if node server.js; then
    echo "✅ 服务器启动成功"
else
    echo "❌ 服务器启动失败"
    exit 1
fi 