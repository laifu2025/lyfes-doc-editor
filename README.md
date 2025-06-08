<h1 align="center">Lyfe's Doc Editor 🚀</h1>
<p align="center">
  <strong>专为中文开发者设计的智能 Markdown 编辑器，支持云端同步与多平台发布</strong>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-GPL--3.0-blue.svg">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-brightgreen.svg">
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg">
  <img alt="React" src="https://img.shields.io/badge/react-16.10.2-blue.svg">
</p>

## 📖 简介

**Lyfe's Doc Editor** 是一个专为中文开发者设计的智能 Markdown 编辑器，基于 [markdown2html](https://github.com/TaleAi/markdown2html) 深度优化，新增了完整的**云端同步和多平台发布功能**。

🌟 **项目亮点**：
- 🇨🇳 **中文优化** - 专为中文内容创作和技术文档编写优化
- ☁️ **云端同步** - 支持多设备间文档无缝同步
- 📱 **多平台发布** - 一键适配微信公众号、知乎、掘金等平台
- 🚀 **开箱即用** - 简单的安装配置，快速投入使用

### ✨ 核心功能
- 🎨 支持自定义样式的 Markdown 编辑器
- 📱 支持微信公众号、知乎和稀土掘金样式
- 🧮 支持数学公式渲染（LaTeX）
- 🔄 支持 HTML ↔ Markdown 互转
- 📄 支持导出 PDF 和 Markdown 文件
- 🎯 支持多种主题样式

### 🚀 新增服务器功能
- **📁 文档云端保存** - 文档保存到服务器，永不丢失
- **🔄 多设备同步** - 在不同设备间同步文档
- **⚡ 自动保存** - 实时同步，自动备份
- **📤 批量操作** - 批量上传、下载、导出
- **🔍 服务器搜索** - 全文搜索所有文档
- **📲 文件导入** - 支持 Markdown、JSON、TXT 文件导入
- **🌐 离线支持** - 离线编辑，联网后自动同步

### 📊 功能对比

| 功能特性 | 原版项目 | 本项目 (v1.0.0) |
|---------|---------|----------------|
| 🎨 Markdown编辑 | ✅ | ✅ |
| 📱 多平台样式 | ✅ | ✅ |
| 🧮 数学公式支持 | ✅ | ✅ |
| 📄 导出功能 | ✅ | ✅ |
| 📁 **云端保存** | ❌ | ✅ |
| 🔄 **多设备同步** | ❌ | ✅ |
| ⚡ **自动保存** | ❌ | ✅ |
| 📤 **批量操作** | ❌ | ✅ |
| 🔍 **服务器搜索** | ❌ | ✅ |
| 📲 **文件导入** | ❌ | ✅ |
| 🌐 **离线支持** | ❌ | ✅ |
| 🛡️ **数据备份** | ❌ | ✅ |

## 🏗️ 系统架构

```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   React前端     │ ←──────────→  │   Node.js后端   │
│                 │               │                 │
│ • MobX状态管理  │               │ • Express框架   │
│ • 自动保存      │               │ • 文件存储      │
│ • 离线支持      │               │ • 多用户支持    │
│ • 实时同步      │               │ • RESTful API   │
└─────────────────┘               └─────────────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   文件系统      │
                                  │                 │
                                  │ /documents/     │
                                  │   ├─ user1/     │
                                  │   ├─ user2/     │
                                  │   └─ ...        │
                                  │                 │
                                  │ /uploads/       │
                                  └─────────────────┘
```

## 🎯 使用场景

### 👥 适用人群
- **📝 内容创作者** - 博客作者、技术写手、自媒体人
- **🎓 学生和教师** - 论文写作、课程笔记、学术文档
- **💼 企业团队** - 技术文档、项目说明、团队协作
- **👨‍💻 开发者** - API文档、README文件、技术分享

### 🏢 应用场景
- **📱 微信公众号** - 文章编写与排版
- **🌐 技术博客** - 知乎、掘金、CSDN文章发布
- **📚 文档管理** - 团队知识库、项目文档
- **🔄 多设备办公** - 电脑、平板、手机无缝切换
- **📤 内容分发** - 批量导出到不同平台

### 🌟 在线体验
- **演示地址**: [在线预览](http://md.weiyan.cc/) （原版功能）
- **本地运行**: 支持完整服务器功能，参见下方快速启动指南
- **项目源码**: [GitHub - Lyfe's doc editor](https://github.com/laifu2025/lyfes-doc-editor)

### 🔗 相关项目
- 🛠️ **[Lyfe's Cursor Rules](https://github.com/laifu2025/lyfes-cursor-rules)** - 专为中文开发者设计的 Cursor AI 编程规则集合，让 AI 更好地理解中文开发需求

## 🚀 快速启动

### 📋 前置要求

确保您的系统已安装：
- Node.js (14.0 或更高版本)
- npm (6.0 或更高版本)

### 方式一：一键启动（推荐）
```bash
# 1. 启动后端服务
cd server
chmod +x start-server.sh
./start-server.sh

# 2. 启动前端（新窗口）
npm install
npm start
```

### 方式二：分步启动
```bash
# 后端
cd server
npm install
npm start

# 前端（新窗口）
npm install  
npm start
```

### 🌐 访问地址

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3002/api
- **健康检查**: http://localhost:3002/api/health

启动成功后，浏览器会自动打开应用界面。

## 🎛️ 功能使用指南

### 📝 基础编辑功能

1. **Markdown 编辑**: 左侧编辑器支持实时预览
2. **样式切换**: 支持微信公众号、知乎、掘金等样式
3. **数学公式**: 使用 LaTeX 语法，如 `$E=mc^2$`
4. **代码高亮**: 支持多种编程语言语法高亮
5. **图片插入**: 支持本地图片和网络图片

### 💾 服务器同步功能

#### 🔄 同步状态指示器
- 🟢 **已同步** - 所有文档已保存到服务器
- 🟡 **待同步** - 有文档等待保存
- 🔵 **同步中** - 正在同步数据
- 🔴 **离线** - 服务器连接断开

#### 💾 保存操作
- **保存当前文档** - 将正在编辑的文档保存到服务器
- **保存全部 (N)** - 批量保存所有未同步的文档

#### 🔄 同步操作
- **从服务器加载** - 下载服务器上的所有文档
- **完整同步** - 上传本地文档并重新加载服务器数据

#### 📁 文件操作
- **导入文件** - 上传Markdown、JSON、TXT文件
- **导出所有** - 下载所有文档为JSON文件

### ⚡ 自动保存功能

系统默认启用**自动保存**功能，每30秒检查一次未同步的文档并自动上传到服务器。

## 📋 API 文档

### 基础信息
- **基础URL**: `http://localhost:3002/api`
- **数据格式**: JSON
- **用户识别**: 自动生成用户ID

### 文档操作API

#### 获取所有文档
```http
GET /documents/{userId}
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "doc_123",
      "title": "我的文档",
      "content": "# 标题\n内容...",
      "folderId": null,
      "theme": "normal",
      "userId": "user_456",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "wordCount": 1250
    }
  ],
  "total": 1
}
```

#### 创建新文档
```http
POST /documents/{userId}
Content-Type: application/json

{
  "title": "新文档标题",
  "content": "文档内容",
  "folderId": null,
  "theme": "normal"
}
```

#### 更新文档
```http
PUT /documents/{userId}/{documentId}
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

#### 删除文档
```http
DELETE /documents/{userId}/{documentId}
```

#### 批量保存文档
```http
POST /documents/{userId}/batch
Content-Type: application/json

{
  "documents": [
    {
      "title": "文档1",
      "content": "内容1"
    },
    {
      "title": "文档2", 
      "content": "内容2"
    }
  ]
}
```

### 文件上传API

#### 上传文件
```http
POST /upload/{userId}
Content-Type: multipart/form-data

file: [Markdown/JSON/TXT文件]
```

**支持的文件格式**:
- `.md` - Markdown文件
- `.txt` - 纯文本文件  
- `.json` - JSON格式的文档数据

### 搜索API

#### 搜索文档
```http
GET /search/{userId}?q=关键词&limit=20
```

### 导出API

#### 导出所有文档
```http
GET /export/{userId}?format=json
```

## 🔧 配置选项

### 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# 前端API配置
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_AUTO_SAVE_INTERVAL=30000

# 后端服务器配置（在server目录下）
PORT=3002
NODE_ENV=production
```

### 服务器配置

在 `server/server.js` 中可以修改：

```javascript
// 文件大小限制
app.use(express.json({ limit: '10mb' }));

// 允许的域名
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

// 文件上传限制
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB限制
    }
});
```

## 📁 项目结构

```
Markdown2Html-main/
├── README.md                   # 项目说明文档
├── QUICK_START.md             # 快速启动指南
├── LICENSE                    # 开源许可证
├── package.json               # 前端依赖配置
├── .gitignore                 # Git忽略文件
├── env.example                # 环境变量示例
├── quick-start.sh             # 快速启动脚本
├── start.sh                   # 完整启动脚本
├── stop.sh                    # 停止脚本
├── src/                       # 前端源码
│   ├── component/             # React组件
│   │   ├── ServerSync/        # 🆕 服务器同步组件
│   │   └── DocumentManager/   # 🆕 文档管理组件
│   ├── store/                 # MobX状态管理
│   ├── utils/                 # 工具函数
│   ├── styles/                # 样式文件
│   └── ...
├── server/                    # 🆕 后端服务器
│   ├── server.js              # Express服务器
│   ├── package.json           # 后端依赖
│   ├── start-server.sh        # 启动脚本
│   ├── documents/             # 文档存储目录
│   └── uploads/               # 文件上传目录
├── public/                    # 静态资源
├── config/                    # 构建配置
├── scripts/                   # 构建脚本
└── build/                     # 构建输出目录
```

## 🛠️ 故障排除

### 常见问题

#### 1. 服务器连接失败
**现象**: 显示"服务器连接断开"  
**解决方法**:
```bash
# 检查后端服务是否启动
curl http://localhost:3002/api/health

# 重启后端服务
cd server
npm start

# 检查端口占用
lsof -i :3002
```

#### 2. 依赖安装失败
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

#### 3. 文档保存失败
**现象**: 点击保存按钮后显示错误  
**可能原因**:
- 网络连接问题
- 服务器磁盘空间不足
- 文档内容过大

#### 4. 文件上传失败
**现象**: 上传文件时提示错误  
**可能原因**:
- 文件格式不支持
- 文件大小超过限制(10MB)
- 文件内容格式错误

### 日志查看

#### 前端日志
在浏览器开发者工具的Console中查看：
- API请求/响应日志
- 同步状态变化
- 错误信息

#### 后端日志
服务器控制台输出：
```bash
✅ 服务器运行在端口 3002
📁 文档存储目录: /path/to/documents
📁 上传文件目录: /path/to/uploads
🌐 健康检查: http://localhost:3002/api/health
```

## 🎨 主题配置

本项目支持多种主题样式：

> 主题配置参考: <https://github.com/macrozheng/mall-learning/blob/master/document/json/localThemeList.json>

- **微信公众号样式** - 适合公众号文章发布
- **知乎样式** - 适合知乎文章编写
- **稀土掘金样式** - 适合技术博客写作
- **GitHub样式** - 标准Markdown样式
- **自定义样式** - 支持CSS自定义

> 欢迎提交新主题，提供更多文章示例！

## 🔒 安全考虑

### 当前版本
- 使用自动生成的用户ID
- 简单的文件存储，按用户隔离
- 基础的文件类型验证

### 生产环境建议
1. **用户认证**: 添加登录系统
2. **权限控制**: 实现RBAC权限管理
3. **数据加密**: 敏感数据加密存储
4. **速率限制**: 添加API调用频率限制
5. **HTTPS**: 使用SSL证书
6. **数据备份**: 定期备份用户数据

## 📈 性能优化

### 前端优化
- 使用React.memo减少无必要的重渲染
- MobX计算属性优化状态访问
- 文件上传进度条提升用户体验

### 后端优化
- 使用gzip压缩减少传输大小
- 文件流式处理大文件上传
- 缓存策略优化响应速度

## 🚀 扩展功能建议

### 短期扩展
1. **文档历史版本** - 保存文档修改历史
2. **文档分享** - 生成分享链接
3. **协作编辑** - 多人实时协作
4. **文档模板** - 预设文档模板

### 长期扩展  
1. **文档数据库** - 使用MongoDB/PostgreSQL
2. **CDN集成** - 图片等资源CDN加速
3. **插件系统** - 支持第三方插件
4. **移动端APP** - React Native移动应用

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 🔧 开发环境设置
```bash
# 1. Fork 并克隆项目
git clone https://github.com/laifu2025/lyfes-doc-editor.git
cd lyfes-doc-editor

# 2. 安装前端依赖
npm install --legacy-peer-deps

# 3. 安装后端依赖
cd server
npm install
cd ..

# 4. 启动开发环境
# 后端 (新终端窗口)
cd server && npm run dev

# 前端 (新终端窗口)
npm start
```

### 📝 贡献流程
1. **Fork** 这个仓库
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

### 🐛 Bug 报告
在提交 Bug 报告时，请包含：
- 详细的问题描述
- 复现步骤
- 预期行为和实际行为
- 环境信息（浏览器、Node.js版本等）
- 错误截图（如果有）

### 💡 功能建议
我们欢迎新功能建议！请：
- 检查是否已有相关 Issue
- 详细描述功能需求和使用场景
- 如果可能，提供设计方案或原型

### 代码规范
- 前端使用 ESLint + Prettier
- 后端遵循 Node.js 最佳实践
- 提交前请运行 `npm run lint` 检查代码
- 变量和方法使用 camelCase 命名
- 类名使用 PascalCase 命名

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建或工具相关

## 🤝 友情链接

- [markdown2html](https://github.com/TaleAi/markdown2html)：原项目
- [markdown nice](https://mdnice.com/)：另一个优秀的Markdown编辑器

## 📄 许可证

本项目使用 GPL-3.0 许可证。详见 [LICENSE](LICENSE) 文件。

---

**版本**: 0.0.5  
**更新时间**: 2025年1月

## 📚 文档导航

### 🚀 快速开始
- 📖 **[快速启动指南](QUICK_START.md)** - 零基础安装和使用指南
- 🎯 **[功能使用](#🎛️-功能使用指南)** - 核心功能详细说明
- 📋 **[API 文档](#📋-api-文档)** - 完整的接口文档

### 🌐 部署运维  
- 🚀 **[部署指南](QUICK_START.md#🚀-部署到生产环境)** - 生产环境快速部署
- 🐳 **[Docker 支持](QUICK_START.md)** - 容器化部署支持
- 🔧 **[环境配置](QUICK_START.md#⚙️-环境配置)** - 环境变量配置说明

### 🛠️ 开发相关
- 🤝 **[贡献指南](#🤝-贡献指南)** - 如何参与项目开发
- 🔧 **[配置选项](#🔧-配置选项)** - 环境变量和服务器配置
- 🛠️ **[故障排除](#🛠️-故障排除)** - 常见问题解决方案

### 📋 项目信息
- 📋 **[更新日志](CHANGELOG.md)** - 版本更新历史
- ❓ **[常见问题](#❓-常见问题-faq)** - 用户常见疑问解答
- 📄 **[许可证](LICENSE)** - 开源许可信息

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=laifu2025/lyfes-doc-editor&type=Date)](https://star-history.com/#laifu2025/lyfes-doc-editor&Date)

---

💡 如有问题或建议，欢迎提交 [Issue](../../issues) 或联系开发者。

## 👨‍💻 关于Lyfe

Lyfe致力于为中文开发者创造更好的开发工具和体验：

- 🛠️ **[Lyfe's Cursor Rules](https://github.com/laifu2025/lyfes-cursor-rules)** - 专为中文开发者设计的 Cursor AI 编程规则
- 📝 **Lyfe's Doc Editor** - 智能 Markdown 编辑器（本项目）
- 🚀 **更多项目正在开发中...** 

**愿景**: 让中文开发者享受更高效、更智能的编程体验！

---

Made with ❤️ by Lyfe

**🔗 项目链接**:
- [GitHub 仓库](https://github.com/laifu2025/lyfes-doc-editor)
- [在线演示](http://md.weiyan.cc/) （原版功能）
- [问题反馈](../../issues)
- [功能建议](../../discussions)
- [Lyfe的其他项目](https://github.com/laifu2025)

## ❓ 常见问题 FAQ

<details>
<summary><strong>🤔 如何在不同设备间同步文档？</strong></summary>

1. 在第一台设备上创建和编辑文档
2. 点击"保存当前文档"或等待自动保存
3. 在第二台设备上打开应用
4. 点击"从服务器加载"即可获取所有文档

</details>

<details>
<summary><strong>📱 支持哪些平台的样式？</strong></summary>

- **微信公众号** - 适合微信文章发布
- **知乎** - 知乎专栏样式  
- **稀土掘金** - 技术社区样式
- **GitHub** - 标准Markdown样式
- **自定义** - 支持CSS自定义样式

</details>

<details>
<summary><strong>💾 数据存储在哪里，安全吗？</strong></summary>

- 本地版本：数据存储在您的服务器 `/server/documents/` 目录
- 按用户ID隔离，每个用户只能访问自己的文档
- 支持定期备份，建议部署时配置数据备份策略
- 生产环境建议添加用户认证和HTTPS

</details>

<details>
<summary><strong>🔧 如何修改服务器端口？</strong></summary>

1. 修改 `server/.env` 文件中的 `PORT=3002`
2. 修改前端 `.env` 文件中的 `REACT_APP_API_URL`
3. 重启前后端服务

</details>

<details>
<summary><strong>📤 如何批量导出文档？</strong></summary>

1. 在服务器同步面板中点击"导出所有"
2. 系统会下载包含所有文档的JSON文件
3. 支持重新导入到其他实例

</details>

<details>
<summary><strong>🚀 是否支持部署到生产环境？</strong></summary>

支持！建议配置：
- 使用 PM2 管理 Node.js 进程
- 配置 Nginx 反向代理
- 启用 HTTPS
- 添加用户认证系统
- 配置数据库（可选）

</details>
