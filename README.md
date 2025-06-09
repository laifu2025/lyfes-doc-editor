<div align="center">

# 🚀 Lyfe's Doc Editor

**专为中文开发者设计的智能 Markdown 编辑器**

<p>
  <img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-brightgreen.svg" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg" alt="Node">
  <img src="https://img.shields.io/badge/react-16.10.2-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/express-4.18.2-green.svg" alt="Express">
</p>

**支持云端同步、多平台发布、智能样式选择的现代化 Markdown 编辑器**

[🚀 快速开始](#-快速开始) • [✨ 核心功能](#-核心功能) • [📋 使用指南](#-使用指南) • [🔧 部署指南](#-部署指南)

---

</div>

## 🆚 与原项目区别

### 📌 原项目：markdown2html
**原项目功能**：
- 基础的 Markdown 到 HTML 转换
- 简单的实时预览功能
- 有限的样式主题支持
- 单机版本，无云端同步

### 🚀 Lyfe's Doc Editor（本项目）
**增强功能**：

| 功能领域 | 原项目 | Lyfe's Doc Editor |
|---------|-------|------------------|
| **智能编辑** | 基础 Markdown 编辑 | ✅ 智能格式切换、避免嵌套、丰富快捷键 |
| **可视化操作** | 纯代码编辑 | ✅ 可视化样式选择器、点击选择元素 |
| **云端同步** | ❌ 无 | ✅ 多设备同步、自动保存、版本管理 |
| **多平台发布** | 有限主题 | ✅ 微信、知乎、掘金、GitHub 等专业样式 |
| **文档管理** | 单文档 | ✅ 文件夹管理、批量操作、回收站、搜索 |
| **数学公式** | 基础支持 | ✅ 完整 KaTeX 支持、复杂公式渲染 |
| **用户体验** | 基础界面 | ✅ 现代化 UI、状态提示、离线支持 |
| **API 接口** | ❌ 无 | ✅ 完整 RESTful API、文件上传 |
| **部署支持** | 简单部署 | ✅ Docker、PM2、Nginx 生产级部署 |

**核心创新**：
- 🎯 **专为中文开发者设计** - 针对中文技术写作优化
- 🎨 **零代码样式定制** - 可视化样式选择，无需CSS知识
- ☁️ **智能云端同步** - 多设备无缝切换，永不丢失
- 📱 **一键多平台发布** - 适配各大中文技术平台

---

## ✨ 核心功能

<div align="center">

### 🎨 智能编辑体验

</div>

- **🧠 智能格式切换** - 重复应用格式时自动切换或移除，避免格式嵌套
- **⌨️ 丰富快捷键** - 完整的键盘快捷键体系，提升编辑效率
- **🔍 实时预览** - 基于 CodeMirror，支持语法高亮和实时预览
- **📐 数学公式** - 基于 KaTeX，完美渲染 LaTeX 数学公式
- **💻 代码高亮** - 支持多种编程语言的语法高亮

<div align="center">

### 🎯 可视化样式选择器

</div>

**专为不懂CSS的用户设计的革命性功能**：
- **👆 点击选择元素** - 在预览区域点击任意元素即可选择
- **🎨 可视化样式库** - 提供多种预设样式，实时预览效果
- **⚡ 一键应用样式** - 无需编写CSS，点击即可应用
- **🔄 智能样式合并** - 自动处理样式冲突，智能合并CSS规则

<div align="center">

### 📱 多平台发布

</div>

- **📲 微信公众号样式** - 一键适配微信公众号发布格式
- **🤔 知乎专栏样式** - 优化的知乎文章排版
- **⛏️ 掘金技术社区** - 适配掘金平台的技术文章样式
- **📄 GitHub Markdown** - 标准的 GitHub 风格样式
- **🎨 自定义主题** - 支持 CSS 自定义样式

<div align="center">

### ☁️ 智能云端同步

</div>

- **🔄 多设备同步** - 实时同步文档，支持多设备无缝切换
- **💾 智能自动保存** - 检测文档变更，自动保存到云端
- **📚 文档版本管理** - 保留文档历史记录，支持版本对比
- **📶 离线编辑支持** - 离线时可继续编辑，联网后自动同步

<div align="center">

### 📁 完整文档管理

</div>

- **📂 文件夹组织** - 支持文件夹分层管理，拖拽排序
- **⚡ 批量操作** - 批量保存、导出、删除操作
- **🗑️ 回收站功能** - 误删文档可恢复，支持永久删除
- **🔍 全文搜索** - 快速检索文档标题和内容
- **📋 多格式支持** - 支持 Markdown、HTML、JSON、TXT 格式导入导出

---

## 🚀 快速开始

<div align="center">

### 📋 环境要求

</div>

- **Node.js** 14.0 或更高版本
- **npm** 6.0 或更高版本  
- **操作系统** Windows、macOS、Linux

<div align="center">

### ⚡ 一键启动

</div>

```bash
# 1. 克隆项目
git clone https://github.com/laifu2025/lyfes-doc-editor.git
cd lyfes-doc-editor

# 2. 安装依赖
npm install && cd server && npm install && cd ..

# 3. 启动服务
cd server && npm start &    # 后端服务
npm start                   # 前端应用
```

<div align="center">

### 🌐 访问地址

</div>

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端应用** | http://localhost:3000 | 主要编辑界面 |
| **后端API** | http://localhost:3002/api | API 接口 |
| **健康检查** | http://localhost:3002/api/health | 服务状态检查 |

<div align="center">

### ✅ 验证安装

</div>

1. ✅ 访问前端应用，确保界面正常加载
2. ✅ 检查左侧同步面板显示🟢"已同步"状态  
3. ✅ 创建测试文档，验证保存和同步功能

---

## 📋 使用指南

<div align="center">

### 💾 基础操作

</div>

#### 📝 文档管理
- **📄 新建文档** - 点击"新建文档"按钮，支持选择文件夹和主题
- **💾 保存文档** - 手动保存或自动保存（每30秒检查一次）
- **🎨 切换样式** - 在右侧面板选择微信、知乎、掘金等不同主题

#### 📤📥 导入导出
- **📋 支持格式** - Markdown(.md)、文本(.txt)、JSON(.json)、HTML(.html/.htm)
- **⚡ 批量操作** - 支持批量导入和导出文档
- **🔄 格式转换** - HTML文件自动转换为Markdown格式

<div align="center">

### ⌨️ 快捷键大全

</div>

#### 📝 文档格式
| 功能 | Windows/Linux | macOS | 效果 |
|------|---------------|-------|------|
| 一级标题 | `Ctrl+Alt+1` | `⌥⌘1` | # 标题 |
| 二级标题 | `Ctrl+Alt+2` | `⌥⌘2` | ## 标题 |
| 加粗 | `Ctrl+B` | `⌘B` | **粗体** |
| 斜体 | `Ctrl+I` | `⌘I` | *斜体* |
| 删除线 | `Ctrl+U` | `⌘U` | ~~删除线~~ |
| 行内代码 | `Ctrl+Alt+V` | `⌥⌘V` | `code` |
| 代码块 | `Ctrl+Alt+C` | `⌥⌘C` | ```代码块``` |

#### 📋 列表和引用
| 功能 | Windows/Linux | macOS | 效果 |
|------|---------------|-------|------|
| 引用 | `Ctrl+Shift+Q` | `⇧⌘Q` | > 引用块 |
| 有序列表 | `Ctrl+Shift+O` | `⇧⌘O` | 1. 列表 |
| 无序列表 | `Ctrl+Shift+L` | `⇧⌘L` | - 列表 |
| 表格 | `Ctrl+Shift+T` | `⇧⌘T` | 插入表格 |
| 分割线 | `Ctrl+Shift+H` | `⇧⌘H` | --- |

#### 🚀 高级功能
| 功能 | Windows/Linux | macOS | 说明 |
|------|---------------|-------|------|
| 样式选择器 | `Ctrl+E` | `⌘E` | 可视化选择样式 |
| 保存文档 | `Ctrl+S` | `⌘S` | 保存当前文档 |
| 搜索替换 | `Ctrl+F` | `⌘F` | 搜索文档内容 |
| 全屏模式 | `F11` | `⌃⌘F` | 全屏编辑模式 |

<div align="center">

### 🔄 同步状态说明

</div>

| 状态 | 图标 | 说明 | 操作建议 |
|------|------|------|----------|
| 已同步 | 🟢 | 所有数据已保存到服务器 | 继续使用 |
| 待同步 | 🟡 | 有文档等待保存 | 点击保存按钮 |
| 同步中 | 🔵 | 正在传输数据 | 等待完成 |
| 离线 | 🔴 | 服务器连接断开 | 检查服务器状态 |

---

## 🏗️ 技术架构

<div align="center">

### 🔧 核心技术栈

</div>

| 技术领域 | 技��选型 | 版本 | 说明 |
|---------|---------|------|------|
| **前端框架** | React + MobX | 16.10.2 + 5.9.0 | 组件化 + 状态管理 |
| **编辑器核心** | CodeMirror | 5.x | 专业代码编辑器 |
| **Markdown渲染** | Markdown-it | 8.4.2 | 高性能解析器 |
| **数学公式** | KaTeX | 0.11.x | 快速数学渲染 |
| **UI组件库** | Ant Design | 3.15.1 | 企业级UI |
| **后端服务** | Node.js + Express | 4.18.2 | 轻量级API服务 |
| **构建工具** | Webpack + Babel | 4.28.3 | 现代化构建 |

<div align="center">

### 📦 多平台发布依赖

</div>

```json
{
  "多平台支持": {
    "@sitdown/wechat": "^1.1.4",
    "@sitdown/zhihu": "^1.1.2", 
    "@sitdown/juejin": "^1.1.1",
    "sitdown": "^1.1.3"
  }
}
```

<div align="center">

### 📁 项目结构

</div>

```
lyfes-doc-editor/
├── 📄 README.md                    # 项目文档（本文件）
├── 📄 CONTRIBUTING.md              # 贡献指南
├── 📄 SECURITY.md                  # 安全策略
├── 📄 package.json                 # 前端依赖配置
├── 🛠️ build/                       # 构建输出目录
├── ⚙️ config/                      # Webpack配置
├── 🧪 scripts/                     # 构建脚本
├── 🌐 public/                      # 静态资源
├── 📁 src/                         # 前端源码
│   ├── 🧩 component/               # React组件
│   │   ├── BusinessComponent/      # 业务组件
│   │   ├── StyleSelector/          # 样式选择器
│   │   └── ElementSelector/        # 元素选择器
│   ├── 💾 store/                   # MobX状态管理
│   ├── 🛠️ utils/                   # 工具函数
│   ├── 🎨 styles/                  # 样式文件
│   ├── 🎭 template/                # 主题模板
│   └── 🖼️ icon/                    # 图标组件
├── 🖥️ server/                      # 后端服务
│   ├── 📄 package.json             # 后端依赖配置
│   ├── 🚀 server.js                # Express服务器
│   ├── 🚀 start-server.sh          # 启动脚本
│   ├── 📁 documents/               # 文档存储目录
│   ├── 📁 uploads/                 # 文件上传目录
│   └── 🗑️ trash/                   # 回收站目录
└── 🛠️ .github/                     # GitHub配置
    └── workflows/                  # CI/CD流程
```

---

## 📋 API 接口

<div align="center">

### 🌐 基础信息

</div>

- **Base URL**: `http://localhost:3002/api`
- **数据格式**: JSON
- **认证方式**: 基于用户ID的简单认证

<div align="center">

### 📚 主要接口

</div>

#### 📄 文档管理
```http
GET    /api/documents/{userId}           # 获取所有文档
POST   /api/documents/{userId}           # 创建新文档  
PUT    /api/documents/{userId}/{docId}   # 更新文档
DELETE /api/documents/{userId}/{docId}   # 删除文档
POST   /api/documents/{userId}/batch     # 批量保存文档
```

#### 📁 文件夹管理
```http
GET    /api/folders/{userId}             # 获取所有文件夹
POST   /api/folders/{userId}             # 创建文件夹
PUT    /api/folders/{userId}/{folderId}  # 更新文件夹
```

#### 📤 文件上传
```http
POST   /api/upload/{userId}              # 上传文档文件
POST   /api/upload-image/{userId}        # 上传图片
```

---

## 🔧 部署指南

<div align="center">

### ⚙️ 环境变量配置

</div>

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

<div align="center">

### 🚀 生产环境部署

</div>

#### 📦 构建项目
```bash
# 构建前端
npm run build

# 启动后端服务
cd server && npm start
```

#### ⚡ 使用 PM2 部署
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server/server.js --name "lyfes-doc-editor"

# 配置开机自启
pm2 startup && pm2 save
```

#### 🌐 Nginx 反向代理
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # 前端静态文件
    location / {
        root /path/to/build;
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🛠️ 故障排除

<div align="center">

### 🔧 常见问题解决

</div>

#### 🔴 服务器连接失败
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
pkill -f "node server.js" && cd server && npm start
```

#### 📦 依赖安装失败
**解决方法**:
```bash
# 清理所有缓存和依赖
rm -rf node_modules package-lock.json
npm cache clean --force

# 使用淘宝镜像加速
npm config set registry https://registry.npmmirror.com
npm install
```

#### 🔒 权限问题
```bash
# 检查目录权限
ls -la server/documents/

# 手动创建目录并设置权限
mkdir -p server/{documents,uploads,trash}
chmod 755 server/{documents,uploads,trash}
```

---

## 🛠️ 开发指南

<div align="center">

### 🏗️ 开发环境搭建

</div>

```bash
# 1. 克隆项目
git clone https://github.com/laifu2025/lyfes-doc-editor.git
cd lyfes-doc-editor

# 2. 安装依赖
npm install
cd server && npm install && cd ..

# 3. 启动开发环境
cd server && npm run dev  # 后端开发服务（支持热重载）
npm start                 # 前端开发服务
```

<div align="center">

### 📝 代码规范

</div>

- **✅ ESLint + Prettier** - 自动代码格式化
- **✅ Airbnb JavaScript** - 业界标准规范
- **✅ React Hooks + MobX** - 现代化状态管理
- **✅ RESTful API** - 标准API设计

<div align="center">

### 📤 提交规范

</div>

```bash
feat: 新功能          # ✨ 添加新功能
fix: 修复bug          # 🐛 修复问题
docs: 文档更新        # 📚 文档变更
style: 代码格式       # 💄 格式调整
refactor: 代码重构    # ♻️ 重构代码
test: 测试相关        # ✅ 测试更新
chore: 构建工具       # 🔧 工具变更
```

---

## 🤝 贡献指南

<div align="center">

### 🌟 参与贡献

</div>

欢迎提交 Issue 和 Pull Request 来改进项目！

**贡献流程**:
1. **🍴 Fork** 项目到您的账户
2. **🌿 创建分支**: `git checkout -b feature/amazing-feature`
3. **💡 提交更改**: `git commit -m 'feat: add amazing feature'`
4. **🚀 推送分支**: `git push origin feature/amazing-feature`
5. **📋 创建 PR**: 提交 Pull Request

详细贡献指南请参考 [CONTRIBUTING.md](CONTRIBUTING.md)

<div align="center">

### 🐛 Bug 报告

</div>

在提交 Bug 报告时，请包含：
- 📝 详细的问题描述
- 🔄 完整的复现步骤
- 🎯 预期行为和实际行为
- 💻 环境信息（浏览器、Node.js版本等）
- 📸 错误截图（如果有）

---

## 🔗 项目生态

<div align="center">

### 🛠️ Lyfe's 开发工具生态

</div>

| 项目 | 描述 | 状态 |
|------|------|------|
| **[Lyfe's Cursor Rules](https://github.com/laifu2025/lyfes-cursor-rules)** | 专为中文开发者设计的 Cursor AI 编程规则集合 | ✅ 已发布 |
| **Lyfe's Doc Editor** | 智能 Markdown 编辑器（本项目） | ✅ 已发布 |
| **Lyfe's Code Assistant** | AI ��码助手工具 | 🚧 开发中 |
| **Lyfe's API Tester** | API 接口测试工具 | 📋 计划中 |

<div align="center">

### 🤝 友情链接

</div>

- 📝 **[markdown2html](https://github.com/doocs/md)** - 原项目，微信 Markdown 编辑器
- 🎨 **[markdown-nice](https://github.com/mdnice/markdown-nice)** - 另一个优秀的 Markdown 编辑器

---

## 📄 许可证

<div align="center">

### 📜 开源许可

</div>

本项目使用 **[GPL-3.0](LICENSE)** 许可证。

| 权限 | 限制 | 条件 |
|------|------|------|
| ✅ 商业使用 | ❌ 责任免除 | ⚠️ 公开源码 |
| ✅ 修改代码 | ❌ 担保免除 | ⚠️ 相同许可 |
| ✅ 分发代码 |  | ⚠️ 包含许可证 |
| ✅ 专利使用 |  | ⚠️ 声明变更 |

---

## 📞 联系我们

<div align="center">

### 🌐 项目链接

</div>

- 🏠 **项目主页**: https://github.com/laifu2025/lyfes-doc-editor
- 🐛 **问题反馈**: https://github.com/laifu2025/lyfes-doc-editor/issues  
- 💬 **功能建议**: https://github.com/laifu2025/lyfes-doc-editor/discussions
- 📧 **邮件联系**: laifu2025@gmail.com

---

<div align="center">

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=laifu2025/lyfes-doc-editor&type=Date)](https://star-history.com/#laifu2025/lyfes-doc-editor&Date)

---

<h3>❤️ 感谢使用 Lyfe's Doc Editor</h3>

**让中文开发者享受更高效、更智能的写作体验！**

<sub>专为中文开发者打造的智能开发工具生态</sub>

**Made with ❤️ by [Lyfe](https://github.com/laifu2025)**

---

*如果这个项目对您有帮助，请给我们一个 ⭐ Star，这是对我们最大的鼓励！*

</div>