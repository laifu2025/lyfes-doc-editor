# 🚀 Lyfe's Doc Editor 快速启动指南

> 专为中文开发者设计的智能 Markdown 编辑器快速上手指南

## 📋 前置要求

确保您的系统已安装：
- Node.js (14.0 或更高版本)
- npm (6.0 或更高版本)

## ⚡ 快速开始

### 1️⃣ 启动后端服务

```bash
# 进入服务器目录
cd server

# 一键启动脚本（推荐）
./start-server.sh
```

或者手动启动：
```bash
cd server
npm install
npm start
```

**预期输出**：
```
🚀 正在启动Markdown编辑器后端服务器...
📦 正在安装依赖包...
✅ 依赖包安装成功
📁 文档存储目录: /path/to/server/documents
📁 上传文件目录: /path/to/server/uploads
🌐 服务器端口: 3002
🎯 正在启动服务器...
✅ 服务器运行在端口 3002
🌐 健康检查: http://localhost:3002/api/health
```

### 2️⃣ 启动前端应用

打开新的终端窗口：

```bash
# 在项目根目录
npm install
npm start
```

**预期输出**：
```
Compiled successfully!

You can now view lyfes-doc-editor in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.xxx:3000
```

### 3️⃣ 验证功能

1. **访问应用**: 打开 http://localhost:3000
2. **检查同步面板**: 在左侧文档管理面板底部看到"服务器同步面板"
3. **测试连接**: 同步状态应显示为🟢"已同步"或🔵"连接中"

## 🎛️ 功能使用

### 💾 保存文档到服务器
1. 编辑任意文档
2. 点击同步面板中的**"保存当前文档"**按钮
3. 看到✅成功提示

### 🔄 自动同步
- 系统每30秒自动检查未同步文档
- 🟡待同步状态表示有未保存的更改
- 自动保存标签显示自动保存已启用

### 📁 文件操作
- **导入文件**: 点击"导入文件"上传.md/.txt/.json文件
- **导出所有**: 点击"导出所有"下载所有文档
- **批量保存**: 点击"保存全部"同步所有未保存文档

## 🛠️ 故障排除

### ❌ 服务器连接失败
**现象**: 显示🔴"离线"状态

**解决方法**:
```bash
# 1. 检查后端服务是否运行
curl http://localhost:3002/api/health

# 2. 重启后端服务
cd server
npm start

# 3. 检查端口占用
lsof -i :3002
```

### ❌ 依赖安装失败
**解决方法**:
```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install

# 后端依赖
cd server
rm -rf node_modules package-lock.json  
npm install
```

### ❌ 权限错误
**MacOS/Linux**:
```bash
chmod +x server/start-server.sh
```

## 📊 状态说明

| 状态图标 | 含义 | 说明 |
|---------|------|------|
| 🟢 已同步 | 所有文档已保存 | 正常状态 |
| 🟡 待同步 | 有文档需要保存 | 点击保存按钮 |
| 🔵 同步中 | 正在上传/下载 | 请等待完成 |
| 🔴 离线 | 服务器连接断开 | 检查服务器状态 |

## 🔧 高级配置

### 自定义API地址
创建 `.env` 文件：
```env
REACT_APP_API_URL=http://your-server:3002/api
```

### 修改自动保存间隔
```env
REACT_APP_AUTO_SAVE_INTERVAL=60000  # 60秒
```

## 📚 更多信息

- 完整功能说明: [README.md](README.md)
- API文档: README.md 中的"📋 API 文档"部分
- 故障排除: README.md 中的"🛠️ 故障排除"部分

---

🎉 **恭喜！您现在可以使用 Lyfe's Doc Editor 的完整功能了！**

---

## 🔗 相关项目

- 🛠️ **[Lyfe's Cursor Rules](https://github.com/laifu2025/lyfes-cursor-rules)** - 专为中文开发者设计的 Cursor AI 编程规则

---

Made with ❤️ by Lyfe 