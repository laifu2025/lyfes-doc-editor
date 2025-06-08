#!/bin/bash

# 🚀 Lyfe's Doc Editor 快速启动脚本
# 作者: Lyfe
# 项目: https://github.com/laifu2025/lyfes-doc-editor

echo "🚀 Lyfe's Doc Editor 快速启动"
echo "=========================="

# 停止可能运行的旧服务
echo "🛑 停止旧服务..."
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
sleep 2

# 启动后端服务器
echo "🌐 启动后端服务器..."
cd server
node server.js &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏰ 等待后端服务器启动..."
sleep 5

# 检查后端
if curl -s http://localhost:3002/api/health > /dev/null; then
    echo "✅ 后端服务器启动成功"
else
    echo "❌ 后端服务器启动失败"
    exit 1
fi

# 启动前端服务器
echo "🎨 启动前端服务器..."
npm start &
FRONTEND_PID=$!

# 等待前端启动
echo "⏰ 等待前端服务器启动..."
sleep 15

# 检查前端
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 前端服务器启动成功"
else
    echo "⚠️  前端服务器可能还在启动中..."
fi

echo ""
echo "🎉 启动完成！"
echo "📱 前端: http://localhost:3000"
echo "🔌 后端: http://localhost:3002/api"
echo ""
echo "按 Ctrl+C 停止服务"

# 打开浏览器
open http://localhost:3000 2>/dev/null || true

# 等待中断信号
trap 'echo ""; echo "🛑 停止服务..."; pkill -f "react-scripts start"; pkill -f "node.*server.js"; exit' INT

# 保持脚本运行
while true; do
    sleep 60
done