# Lyfe's Doc Editor 🚀

<p align="center">
  <img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-0.0.5-brightgreen.svg" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg" alt="Node">
  <img src="https://img.shields.io/badge/react-16.10.2-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/express-4.18.2-green.svg" alt="Express">
</p>

<p align="center">
  <strong>专为中文开发者设计的智能 Markdown 编辑器，支持云端同步与多平台发布</strong>
</p>

## ✨ 核心功能

### 🎨 编辑体验
- **智能Markdown编辑器** - 基于 CodeMirror，支持实时预览和语法高亮
- **智能格式切换** - 重复应用格式时自动切换或移除，避免格式嵌套
- **丰富的快捷键** - 完整的键盘快捷键体系，提升编辑效率
- **数学公式支持** - 基于 KaTeX，完美渲染 LaTeX 数学公式
- **代码高亮** - 支持多种编程语言的语法高亮

### 📱 多平台发布
- **微信公众号样式** - 一键适配微信公众号发布格式
- **知乎专栏样式** - 优化的知乎文章排版
- **掘金技术社区** - 适配掘金平台的技术文章样式
- **GitHub Markdown** - 标准的 GitHub 风格样式
- **自定义主题** - 支持 CSS 自定义样式

### ☁️ 云端同步
- **多设备同步** - 实时同步文档，支持多设备无缝切换
- **智能自动保存** - 检测文档变更，自动保存到云端
- **文档版本管理** - 保留文档历史记录，支持版本对比
- **离线编辑支持** - 离线时可继续编辑，联网后自动同步

### 📁 文档管理
- **文件夹组织** - 支持文件夹分层管理，拖拽排序
- **批量操作** - 批量保存、导出、删除操作
- **回收站功能** - 误删文档可恢复，支持永久删除
- **全文搜索** - 快速检索文档标题和内容
- **多格式导入导出** - 支持 Markdown、HTML、JSON、TXT 格式

### 🎯 特色功能

#### 🎨 可视化样式选择器
专为不懂CSS的用户设计的样式选择组件：
- **点击选择元素** - 在预览区域点击任意元素即可选择
- **可视化样式库** - 提供多种预设样式，实时预览效果
- **一键应用样式** - 无需编写CSS，点击即可应用
- **智能样式合并** - 自动处理样式冲突，智能合并CSS规则

## 🚀 快速开始

### 📋 环境要求
- **Node.js** 14.0 或更高版本
- **npm** 6.0 或更高版本
- **操作系统** Windows、macOS、Linux

### ⚡ 安装和启动

#### 1. 克隆项目
```bash
git clone https://github.com/laifu2025/lyfes-doc-editor.git
cd lyfes-doc-editor
```

#### 2. 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

#### 3. 启动应用

**方式一：使用启动脚本（推荐）**
```bash
# 启动后端服务
cd server
chmod +x start-server.sh
./start-server.sh

# 启动前端应用（新终端窗口）
npm start
```

**方式二：手动启动**
```bash
# 启动后端服务
cd server
npm start

# 启动前端应用（新终端窗口）
npm start
```

### 🌐 访问地址
启动成功后，可以通过以下地址访问：

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3002/api
- **健康检查**: http://localhost:3002/api/health

### ✅ 验证安装
1. 访问前端应用，确保界面正常加载
2. 检查左侧同步面板显示🟢"已同步"状态
3. 创建测试文档，验证保存和同步功能

## 🎛️ 使用指南

### 💾 基础操作

#### 文档管理
- **新建文档** - 点击"新建文档"按钮，支持选择文件夹和主题
- **保存文档** - 手动保存或自动保存（每30秒检查一次）
- **切换样式** - 在右侧面板选择微信、知乎、掘金等不同主题

#### 导入导出
- **支持格式** - Markdown(.md)、文本(.txt)、JSON(.json)、HTML(.html/.htm)
- **批量操作** - 支持批量导入和导出文档
- **格式转换** - HTML文件自动转换为Markdown格式

### ⌨️ 快捷键列表

#### 文档格式
| 功能 | Windows/Linux | macOS | 说明 |
|------|---------------|-------|------|
| 一级标题 | `Ctrl+Alt+1` | `⌥⌘1` | # 标题 |
| 二级标题 | `Ctrl+Alt+2` | `⌥⌘2` | ## 标题 |
| 加粗 | `Ctrl+B` | `⌘B` | **粗体** |
| 斜体 | `Ctrl+I` | `⌘I` | *斜体* |
| 删除线 | `Ctrl+U` | `⌘U` | ~~删除线~~ |
| 行内代码 | `Ctrl+Alt+V` | `⌥⌘V` | `code` |
| 代码块 | `Ctrl+Alt+C` | `⌥⌘C` | ```代码块``` |

#### 列表和引用
| 功能 | Windows/Linux | macOS | 说明 |
|------|---------------|-------|------|
| 引用 | `Ctrl+Shift+Q` | `⇧⌘Q` | > 引用块 |
| 有序列表 | `Ctrl+Shift+O` | `⇧⌘O` | 1. 列表 |
| 无序列表 | `Ctrl+Shift+L` | `⇧⌘L` | - 列表 |
| 表格 | `Ctrl+Shift+T` | `⇧⌘T` | 插入表格 |
| 分割线 | `Ctrl+Shift+H` | `⇧⌘H` | --- |

#### 高级功能
| 功能 | Windows/Linux | macOS | 说明 |
|------|---------------|-------|------|
| 元素选择器 | `Ctrl+E` | `⌘E` | 选择样式 |
| 保存文档 | `Ctrl+S` | `⌘S` | 保存当前文档 |
| 搜索 | `Ctrl+F` | `⌘F` | 搜索文档 |
| 全屏 | `F11` | `⌃⌘F` | 全屏编辑 |

### 🔄 同步状态说明

| 状态 | 图标 | 说明 | 操作建议 |
|------|------|------|----------|
| 已同步 | 🟢 | 所有数据已保存到服务器 | 继续使用 |
| 待同步 | 🟡 | 有文档等待保存 | 点击保存按钮 |
| 同步中 | 🔵 | 正在传输数据 | 等待完成 |
| 离线 | 🔴 | 服务器连接断开 | 检查服务器状态 |

## 🏗️ 技术架构

### 🔧 技术栈
- **前端框架**: React 16.10.2 + MobX 5.9.0
- **编辑器**: CodeMirror + Markdown-it 8.4.2
- **UI组件**: Ant Design 3.15.1
- **后端服务**: Node.js + Express 4.18.2
- **文件存储**: 文件系统 + JSON元数据
- **构建工具**: Webpack 4.28.3 + Babel

### 📦 核心依赖
```json
{
  "前端核心": {
    "react": "16.10.2",
    "mobx": "^5.9.0",
    "@uiw/react-codemirror": "^1.0.28",
    "markdown-it": "^8.4.2",
    "markdown-it-katex": "^2.0.3",
    "highlight.js": "^9.15.6"
  },
  "多平台支持": {
    "@sitdown/wechat": "^1.1.4",
    "@sitdown/zhihu": "^1.1.2",
    "@sitdown/juejin": "^1.1.1",
    "sitdown": "^1.1.3"
  }
}
```

## 📁 项目结构

```
lyfes-doc-editor/
├── 📄 README.md                    # 项目文档
├── 📄 CONTRIBUTING.md              # 贡献指南
├── 📄 SECURITY.md                  # 安全策略
├── 📄 package.json                 # 前端依赖配置
├── 📄 .gitignore                   # Git忽略配置
├── 🛠️ build/                       # 构建输出目录
├── ⚙️ config/                      # Webpack配置
├── 🧪 scripts/                     # 构建脚本
├── 🌐 public/                      # 静态资源
├── 📁 src/                         # 前端源码
│   ├── 🧩 component/               # React组件
│   ├── 💾 store/                   # MobX状态管理
│   ├── 🛠️ utils/                   # 工具函数
│   ├── 🎨 styles/                  # 样式文件
│   ├── 🎭 template/                # 主题模板
│   └── 🖼️ icon/                    # 图标组件
├── 🖥️ server/                      # 后端服务
│   ├── 📄 package.json             # 后端依赖配置
│   ├── 🚀 server.js                # Express服务器主文件
│   ├── 🚀 start-server.sh          # 启动脚本
│   ├── 📁 documents/               # 文档存储目录
│   ├── 📁 uploads/                 # 文件上传目录
│   └── 🗑️ trash/                   # 回收站目录
```

## 📋 API 接口

### 基础信息
- **API Base URL**: `http://localhost:3002/api`
- **数据格式**: JSON
- **认证方式**: 基于用户ID的简单认证

### 主要接口

#### 文档管理
```http
GET    /api/documents/{userId}           # 获取所有文档
POST   /api/documents/{userId}           # 创建新文档
PUT    /api/documents/{userId}/{docId}   # 更新文档
DELETE /api/documents/{userId}/{docId}   # 删除文档
POST   /api/documents/{userId}/batch     # 批量保存文档
```

#### 文件夹管理
```http
GET    /api/folders/{userId}             # 获取所有文件夹
POST   /api/folders/{userId}             # 创建文件夹
PUT    /api/folders/{userId}/{folderId}  # 更新文件夹
```

#### 文件上传
```http
POST   /api/upload/{userId}              # 上传文档文件
POST   /api/upload-image/{userId}        # 上传图片
```

## 🔧 部署指南

### 环境变量配置

**前端配置 (`.env`)**
```env
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_AUTO_SAVE_INTERVAL=30000
REACT_APP_DEBUG=false
```

**后端配置 (`server/.env`)**
```env
PORT=3002
NODE_ENV=production
MAX_FILE_SIZE=10
ALLOWED_ORIGINS=http://localhost:3000
```

### 生产环境部署

#### 构建项目
```bash
# 构建前端
npm run build

# 启动后端服务
cd server
npm start
```

#### 使用 PM2 部署
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server/server.js --name "lyfes-doc-editor"

# 配置开机自启
pm2 startup
pm2 save
```

#### Nginx 配置
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/build;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🛠️ 故障排除

### 常见问题

#### 服务器连接失败
**现象**: 前端显示🔴"离线"状态

**解决方法**:
```bash
# 1. 检查后端服务状态
curl http://localhost:3002/api/health

# 2. 查看后端服务日志
cd server && npm start

# 3. 检查端口占用
lsof -i :3002

# 4. 重启服务
pkill -f "node server.js"
cd server && npm start
```

#### 依赖安装失败
**解决方法**:
```bash
# 清理所有缓存和依赖
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 使用淘宝镜像加速
npm config set registry https://registry.npmmirror.com
```

#### 权限问题
```bash
# 检查目录权限
ls -la server/documents/

# 手动创建目录
mkdir -p server/documents server/uploads server/trash
chmod 755 server/documents server/uploads server/trash
```

## 🛠️ 开发指南

### 开发环境搭建
```bash
# 克隆项目
git clone https://github.com/laifu2025/lyfes-doc-editor.git
cd lyfes-doc-editor

# 安装依赖
npm install
cd server && npm install && cd ..

# 启动开发环境
cd server && npm run dev  # 后端开发服务
npm start                 # 前端开发服务
```

### 代码规范
- 使用 ESLint + Prettier 格式化代码
- 遵循 Airbnb JavaScript 规范
- 组件使用 React Hooks + MobX
- API 使用 RESTful 设计

### 提交规范
```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建或工具相关
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

### 贡献流程
1. Fork 项目
2. 创建功能分支: `git checkout -b feature/your-feature`
3. 提交更改: `git commit -m 'Add some feature'`
4. 推送分支: `git push origin feature/your-feature`
5. 创建 Pull Request

详细贡献指南请参考 [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 许可证

本项目使用 [GPL-3.0](LICENSE) 许可证。

### 许可证说明
- ✅ **商业使用** - 允许在商业项目中使用
- ✅ **修改代码** - 允许修改源代码
- ✅ **分发代码** - 允许分发原始或修改后的代码
- ❗ **公开源码** - 分发时必须公开源码
- ❗ **相同许可** - 衍生作品必须使用相同许可证

## 🔗 相关项目

- 🛠️ **[Lyfe's Cursor Rules](https://github.com/laifu2025/lyfes-cursor-rules)** - 专为中文开发者设计的 Cursor AI 编程规则集合
- 📝 **Lyfe's Doc Editor** - 智能 Markdown 编辑器（本项目）

## 📞 联系方式

- 项目主页: https://github.com/laifu2025/lyfes-doc-editor
- 问题反馈: https://github.com/laifu2025/lyfes-doc-editor/issues
- 功能建议: https://github.com/laifu2025/lyfes-doc-editor/discussions

---

<p align="center">
  <strong>Made with ❤️ by Lyfe</strong><br>
  <sub>专为中文开发者打造的智能开发工具生态</sub>
</p>