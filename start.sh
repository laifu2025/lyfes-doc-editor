#!/bin/bash

# 🚀 Lyfe's Doc Editor 一键启动脚本
# 作者: Lyfe
# 项目: https://github.com/laifu2025/lyfes-doc-editor
# 功能: 同时启动前端和后端服务

echo "🚀 Lyfe's Doc Editor 启动脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Node.js是否安装
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ 错误: Node.js未安装${NC}"
        echo "请访问 https://nodejs.org/ 下载安装Node.js"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js已安装: $(node -v)${NC}"
}

# 检查npm是否安装
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ 错误: npm未安装${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ npm已安装: $(npm -v)${NC}"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        echo -e "${YELLOW}⚠️  端口 $port 被占用，正在尝试释放...${NC}"
        
        # 尝试优雅地关闭可能的旧进程
        if [ "$port" = "3000" ]; then
            pkill -f "react-scripts start" 2>/dev/null || true
            pkill -f "webpack-dev-server" 2>/dev/null || true
        elif [ "$port" = "3002" ]; then
            pkill -f "node.*server.js" 2>/dev/null || true
        fi
        
        sleep 2
        
        # 再次检查
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
            echo -e "${RED}❌ 端口 $port 仍被占用，请手动关闭占用该端口的程序${NC}"
            echo "可以使用命令: lsof -i :$port"
            return 1
        fi
    fi
    echo -e "${GREEN}✅ 端口 $port 可用${NC}"
    return 0
}

# 安装依赖
install_dependencies() {
    echo -e "\n${BLUE}📦 检查并安装依赖...${NC}"
    
    # 安装根目录依赖（前端）
    echo "安装前端依赖..."
    if npm install; then
        echo -e "${GREEN}✅ 前端依赖安装成功${NC}"
    else
        echo -e "${RED}❌ 前端依赖安装失败${NC}"
        exit 1
    fi
    
    # 安装服务器依赖
    echo "安装后端依赖..."
    cd server
    if npm install; then
        echo -e "${GREEN}✅ 后端依赖安装成功${NC}"
    else
        echo -e "${RED}❌ 后端依赖安装失败${NC}"
        exit 1
    fi
    cd ..
}

# 启动后端服务器
start_backend() {
    echo -e "\n${BLUE}🌐 启动后端服务器...${NC}"
    cd server
    
    # 创建必要的目录
    mkdir -p documents uploads logs
    
    # 设置环境变量
    export NODE_ENV=development
    export PORT=3002
    
    # 在后台启动服务器
    nohup node server.js > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    cd ..
    
    # 等待服务器启动
    echo "等待后端服务器启动..."
    sleep 3
    
    # 检查后端是否启动成功
    if curl -s http://localhost:3002/api/health > /dev/null; then
        echo -e "${GREEN}✅ 后端服务器启动成功 (PID: $BACKEND_PID)${NC}"
        echo "   - 访问地址: http://localhost:3002/api"
        echo "   - 日志文件: backend.log"
        return 0
    else
        echo -e "${RED}❌ 后端服务器启动失败${NC}"
        return 1
    fi
}

# 启动前端服务器
start_frontend() {
    echo -e "\n${BLUE}🎨 启动前端服务器...${NC}"
    
    # 设置环境变量
    export BROWSER=none  # 不自动打开浏览器
    export REACT_APP_API_URL=http://localhost:3002/api
    
    # 启动前端服务器
    echo "正在启动前端开发服务器..."
    npm start &
    FRONTEND_PID=$!
    
    # 等待前端服务器启动
    echo "等待前端服务器启动..."
    sleep 10
    
    # 检查前端是否启动成功
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo -e "${GREEN}✅ 前端服务器启动成功 (PID: $FRONTEND_PID)${NC}"
            echo "   - 访问地址: http://localhost:3000"
            return 0
        fi
        
        attempts=$((attempts + 1))
        echo "尝试连接前端服务器... ($attempts/$max_attempts)"
        sleep 2
    done
    
    echo -e "${RED}❌ 前端服务器启动失败或启动时间过长${NC}"
    return 1
}

# 打开浏览器
open_browser() {
    echo -e "\n${BLUE}🌐 打开浏览器...${NC}"
    sleep 2
    
    # 根据操作系统打开浏览器
    case "$(uname -s)" in
        Darwin*)    open http://localhost:3000 ;;
        Linux*)     xdg-open http://localhost:3000 ;;
        CYGWIN*|MINGW*) start http://localhost:3000 ;;
        *)          echo "请手动访问: http://localhost:3000" ;;
    esac
}

# 显示运行信息
show_info() {
    echo -e "\n${GREEN}🎉 项目启动成功！${NC}"
    echo "================================"
    echo -e "${BLUE}📱 前端应用:${NC} http://localhost:3000"
    echo -e "${BLUE}🔌 后端API:${NC} http://localhost:3002/api"
    echo -e "${BLUE}📊 健康检查:${NC} http://localhost:3002/api/health"
    echo ""
    echo -e "${YELLOW}💡 使用说明:${NC}"
    echo "   - 编辑器支持实时预览Markdown"
    echo "   - 支持数学公式 (LaTeX)"
    echo "   - 支持本地存储和云端同步"
    echo "   - 支持拖拽排序和文件夹管理"
    echo ""
    echo -e "${YELLOW}🛑 停止服务:${NC}"
    echo "   按 Ctrl+C 停止此脚本"
    echo "   或运行: ./stop.sh"
}

# 等待用户中断
wait_for_interrupt() {
    echo -e "\n${YELLOW}⏰ 服务正在运行中...${NC}"
    echo "按 Ctrl+C 停止所有服务"
    
    # 捕获中断信号
    trap 'echo -e "\n${YELLOW}🛑 正在停止服务...${NC}"; cleanup; exit 0' INT
    
    # 持续运行
    while true; do
        sleep 10
        
        # 检查服务状态
        if ! curl -s http://localhost:3002/api/health > /dev/null; then
            echo -e "${RED}⚠️  后端服务器异常${NC}"
        fi
        
        if ! curl -s http://localhost:3000 > /dev/null; then
            echo -e "${RED}⚠️  前端服务器异常${NC}"
        fi
    done
}

# 清理函数
cleanup() {
    echo -e "\n${BLUE}🧹 清理进程...${NC}"
    
    # 停止前端服务器
    pkill -f "react-scripts start" 2>/dev/null || true
    pkill -f "webpack-dev-server" 2>/dev/null || true
    
    # 停止后端服务器
    pkill -f "node.*server.js" 2>/dev/null || true
    
    echo -e "${GREEN}✅ 清理完成${NC}"
}

# 主函数
main() {
    echo -e "${BLUE}🔍 环境检查...${NC}"
    check_node
    check_npm
    
    echo -e "\n${BLUE}🚧 端口检查...${NC}"
    check_port 3002 "后端服务器" || exit 1
    check_port 3000 "前端服务器" || exit 1
    
    install_dependencies
    
    start_backend || exit 1
    start_frontend || exit 1
    
    open_browser
    show_info
    wait_for_interrupt
}

# 运行主函数
main "$@"