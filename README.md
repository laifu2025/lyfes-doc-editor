<div align="center">

# 🚀 Lyfe's Doc Editor

**基于 markdown2html 增强的智能 Markdown 编辑器**

<p>
  <img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-brightgreen.svg" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg" alt="Node">
  <img src="https://img.shields.io/badge/react-16.10.2-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/express-4.18.2-green.svg" alt="Express">
</p>

**专为中文开发者设计，支持云端同步、多平台发布、智能样式选择的现代化 Markdown 编辑器**

[🚀 快速开始](#-快速开始) • [✨ 核心功能](#-核心功能) • [📋 使用指南](#-使用指南) • [🔧 部署指南](#-部署指南)

---

</div>

## 🆚 与原项目功能对比

### 📌 原项目：[shenweiyan/Markdown2Html](https://github.com/shenweiyan/Markdown2Html)
**基础功能**：
- ✅ 支持微信公众号、知乎、掘金样式转换
- ✅ 基础的 Markdown 编辑和实时预览
- ✅ 数学公式支持（KaTeX）
- ✅ 代码高亮
- ✅ HTML 转 Markdown
- ✅ 导出 PDF 和 Markdown

### 🚀 Lyfe's Doc Editor（本项目增强功能）

| 功能模块 | 原项目 | Lyfe's Doc Editor | 说明 |
|---------|-------|------------------|------|
| **智能编辑** | 基础编辑器 | ✅ 智能格式切换、避免嵌套 | 重复应用格式自动切换/移除 |
| **可视化操作** | 纯代码模式 | ✅ 可视化样式选择器 | 点击元素直接编辑样式，零CSS知识 |
| **云端同步** | ❌ 本地存储 | ✅ 多设备云端同步 | 实时保存、版本管理、离线支持 |
| **文档管理** | 单文档模式 | ✅ 完整文档管理系统 | 文件夹、批量操作、回收站、搜索 |
| **多平台发布** | 基础样式 | ✅ 专业样式适配 | 针对中文平台深度优化 |
| **用户体验** | 基础界面 | ✅ 现代化UI设计 | 状态提示、主题切换、响应式 |
| **API 服务** | ❌ 前端单页 | ✅ 完整后端服务 | RESTful API、文件上传、云存储 |
| **部署支持** | 静态托管 | ✅ 生产级部署 | Docker、PM2、Nginx配置 |

**🎯 核心创新点**：
- **🎨 零代码样式定制** - 点击预览区域元素即可直接编辑样式，无需CSS知识
- **☁️ 智能云端同步** - 多设备实时同步，永不丢失，支持版本历史
- **📁 完整文档管理** - 文件夹分层、批量操作、回收站、全文搜索
- **🔄 智能格式处理** - 重复应用格式时自动切换或移除，避免格式嵌套
- **📱 中文平台优化** - 针对微信、知乎、掘金等中文平台深度优化

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

## 🏗️ 技术架构

<div align="center">

### 🔧 核心技术栈

</div>

| 技术领域 | 技术选型 | 版本 | 说明 |
|---------|---------|------|------|
| **前端框架** | React + MobX | 16.10.2 + 5.9.0 | 组件化架构 + 响应式状态管理 |
| **编辑器核心** | @uiw/react-codemirror | 1.0.28 | 基于CodeMirror的React编辑器 |
| **Markdown渲染** | Markdown-it | 8.4.2 | 高性能Markdown解析器 |
| **数学公式** | KaTeX + MathJax | 2.0.3 + 3.0.1 | 双引擎数学公式渲染 |
| **UI组件库** | Ant Design | 3.15.1 | 企业级React UI库 |
| **后端服务** | Node.js + Express | 4.18.2 | 轻量级RESTful API |
| **文件处理** | Multer + fs-extra | 2.0.1 + 11.1.1 | 文件上传和管理 |
| **构建工具** | Webpack + Babel | 4.28.3 | 现代化构建流程 |

<div align="center">

### 📦 核心功能依赖

</div>

```json
{
  "多平台转换": {
    "@sitdown/wechat": "^1.1.4",    // 微信公众号样式
    "@sitdown/zhihu": "^1.1.2",     // 知乎专栏样式
    "@sitdown/juejin": "^1.1.1",    // 掘金社区样式
    "sitdown": "^1.1.3"             // HTML转Markdown
  },
  "编辑器增强": {
    "highlight.js": "^9.15.6",      // 代码语法高亮
    "diff-match-patch": "^1.0.4",   // 文本差异对比
    "lodash.throttle": "^4.1.1",    // 性能优化工具
    "react-sortable-hoc": "^2.0.0"  // 拖拽排序支持
  },
  "云存储支持": {
    "qiniu-js": "^2.5.4",          // 七牛云存储
    "ali-oss": "^6.1.1"            // 阿里云OSS
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