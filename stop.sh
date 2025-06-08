#!/bin/bash

# 🛑 Lyfe's Doc Editor 停止脚本
# 作者: Lyfe
# 项目: https://github.com/laifu2025/lyfes-doc-editor
# 功能: 停止前端和后端服务

echo "🛑 正在停止 Lyfe's Doc Editor 服务..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 停止前端服务器
echo -e "${BLUE}停止前端服务器...${NC}"
pkill -f "react-scripts start" 2>/dev/null
pkill -f "webpack-dev-server" 2>/dev/null
pkill -f "node.*start.js" 2>/dev/null

# 停止后端服务器
echo -e "${BLUE}停止后端服务器...${NC}"
pkill -f "node.*server.js" 2>/dev/null

# 等待进程结束
sleep 2

# 检查是否还有进程在运行
if pgrep -f "react-scripts start" > /dev/null || pgrep -f "node.*server.js" > /dev/null; then
    echo -e "${YELLOW}⚠️  强制停止剩余进程...${NC}"
    pkill -9 -f "react-scripts start" 2>/dev/null
    pkill -9 -f "node.*server.js" 2>/dev/null
fi

# 清理日志文件
if [ -f "backend.log" ]; then
    echo -e "${BLUE}清理日志文件...${NC}"
    rm -f backend.log
fi

echo -e "${GREEN}✅ 所有服务已停止${NC}"
echo "================================"
echo "如需重新启动，请运行: ./start.sh"