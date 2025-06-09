# 🚀 Lyfe's Doc Editor - 快速启动指南

> 智能 Markdown 编辑器零基础快速上手指南

## 📋 环境要求

### 必需软件
- **Node.js** 14.0+ ([下载地址](https://nodejs.org/))
- **npm** 6.0+ (随Node.js安装)

### 系统支持
- Windows 10+
- macOS 10.15+
- Ubuntu 18.04+

### 硬件建议
- 内存: 4GB+ 
- 存储: 500MB+ 可用空间
- 网络: 稳定的互联网连接

## ⚡ 一键启动

### 🎯 方式一：脚本启动（推荐）

#### 1️⃣ 启动后端服务
```bash
cd server
chmod +x start-server.sh
./start-server.sh
```

**预期输出**：
```
🚀 正在启动Markdown编辑器后端服务器...
📦 正在安装依赖包...
✅ 依赖包安装成功
📁 文档存储目录: /path/to/server/documents
📁 上传文件目录: /path/to/server/uploads
✅ 服务器运行在端口 3002
🌐 健康检查: http://localhost:3002/api/health
```

#### 2️⃣ 启动前端应用
**新终端窗口**：
```bash
npm install
npm start
```

**预期输出**：
```
Compiled successfully!

You can now view lyfes-doc-editor in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.xxx:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 🔧 方式二：手动启动

#### 后端服务
```bash
cd server
npm install
npm start
```

#### 前端应用（新终端）
```bash
npm install
npm start
```

### 🌐 访问地址

启动成功后可通过以下地址访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端应用** | http://localhost:3000 | 主要操作界面 |
| **后端API** | http://localhost:3002/api | 数据接口服务 |
| **健康检查** | http://localhost:3002/api/health | 服务状态检查 |
| **图片访问** | http://localhost:3002/uploads/ | 上传图片访问 |

## ✅ 验证安装

### 1. 检查前端界面
- ✅ 浏览器自动打开 http://localhost:3000
- ✅ 页面正常加载，显示编辑器界面
- ✅ 左侧有文档管理面板
- ✅ 右侧有样式预览面板

### 2. 检查同步功能
- ✅ 左侧底部显示"服务器同步面板"
- ✅ 同步状态显示🟢"已同步"或🔵"连接中"
- ✅ 不显示🔴"离线"状态

### 3. 功能测试
```markdown
# 测试文档
这是一个**测试文档**，用于验证功能。

## 功能检查清单
- [x] Markdown编辑
- [x] 实时预览  
- [x] 样式切换
- [x] 云端保存
```

点击"保存当前文档"，确认出现✅成功提示。

## 🎛️ 基础使用

### 💾 文档操作

#### 创建文档
1. 点击左侧"新建文档"按钮
2. 输入文档标题
3. 选择主题样式（可选）
4. 开始编写内容

#### 保存文档
- **手动保存**: 点击"保存当前文档"
- **批量保存**: 点击"保存全部"保存所有未同步文档
- **自动保存**: 系统每30秒自动检查并保存变更

#### 切换样式
在右侧面板选择不同主题：
- **微信公众号** - 适合公众号发布
- **知乎专栏** - 知乎文章样式
- **掘金技术** - 技术社区样式
- **GitHub** - 标准Markdown样式

### 📁 文件管理

#### 导入文件
1. 点击同步面板的"导入文件"
2. 选择支持的文件格式：
   - `.md` - Markdown文件
   - `.txt` - 纯文本文件
   - `.json` - 包含元数据的完整文档
   - `.html/.htm` - 网页文件，自动转换

#### 导出数据
- **单个文档**: 右键文档选择"导出"
- **批量导出**: 点击"导出所有"下载JSON格式数据

### 🔍 搜索功能
1. 在搜索框输入关键词
2. 支持搜索文档标题和内容
3. 结果中关键词会高亮显示

### 🔄 同步状态说明

| 状态图标 | 含义 | 说明 | 操作建议 |
|---------|------|------|----------|
| 🟢 已同步 | 所有数据已保存 | 正常状态 | 继续使用 |
| 🟡 待同步 | 有未保存的文档 | 有待保存数据 | 点击保存按钮 |
| 🔵 同步中 | 正在传输数据 | 上传/下载中 | 等待完成 |
| 🔴 离线 | 服务器连接断开 | 连接异常 | 检查服务器状态 |

## 🛠️ 故障排除

### ❌ 常见问题

#### 1. 服务器连接失败
**现象**: 显示🔴"离线"状态

**解决步骤**:
```bash
# 步骤1: 检查后端服务
curl http://localhost:3002/api/health

# 步骤2: 查看端口占用
lsof -i :3002

# 步骤3: 重启后端服务
cd server
npm start

# 步骤4: 检查防火墙设置
# 确保3002端口未被阻止
```

#### 2. 依赖安装失败
**现象**: npm install 报错

**解决方法**:
```bash
# 方法1: 清理重装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 方法2: 使用淘宝镜像
npm config set registry https://registry.npmmirror.com
npm install

# 方法3: 降级Node.js版本
# 如果Node.js版本过高，降级到稳定版本
```

#### 3. 权限错误
**macOS/Linux**:
```bash
# 给启动脚本执行权限
chmod +x server/start-server.sh

# 检查目录权限
ls -la server/
chmod 755 server/documents server/uploads
```

**Windows**:
```cmd
# 以管理员身份运行命令提示符
# 或使用PowerShell
```

#### 4. 端口冲突
**现象**: 端口3000或3002被占用

**解决方法**:
```bash
# 查找占用进程
lsof -i :3000
lsof -i :3002

# 终止占用进程
kill -9 <PID>

# 或修改端口配置
# 编辑 .env 文件修改端口
```

#### 5. 浏览器缓存问题
**现象**: 页面显示异常或功能不正常

**解决方法**:
- 硬刷新：`Ctrl+F5` (Windows) 或 `Cmd+Shift+R` (Mac)
- 清除缓存：浏览器设置 → 清除浏览数据
- 无痕模式：使用浏览器无痕/隐私模式测试

### 🔧 高级配置

#### 自定义端口
创建 `.env` 文件：
```env
# 前端配置
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_AUTO_SAVE_INTERVAL=30000

# 后端配置（server/.env）
PORT=3002
NODE_ENV=development
MAX_FILE_SIZE=10
```

#### 网络配置
如果需要其他设备访问：
```bash
# 启动时绑定所有IP
HOST=0.0.0.0 npm start

# 防火墙开放端口（Linux）
sudo ufw allow 3000
sudo ufw allow 3002
```

#### 调试模式
```bash
# 开启详细日志
export DEBUG=*
cd server && npm start

# 前端调试模式
export REACT_APP_DEBUG=true
npm start
```

## 📚 进阶使用

### 🎨 自定义主题
1. 打开右侧样式面板
2. 选择"自定义"主题
3. 修改CSS样式代码
4. 实时预览效果

### ⌨️ 快捷键列表

#### 文档格式
| 快捷键 | Windows/Linux | macOS | 功能 |
|--------|---------------|-------|------|
| 标题 | `Ctrl+Alt+1~6` | `⌥⌘1~6` | 设置1-6级标题 |
| 加粗 | `Ctrl+B` | `⌘B` | 粗体文本 |
| 斜体 | `Ctrl+I` | `⌘I` | 斜体文本 |
| 删除线 | `Ctrl+U` | `⌘U` | 删除线文本 |
| 行内代码 | `Ctrl+Alt+V` | `⌥⌘V` | 行内代码 |
| 代码块 | `Ctrl+Alt+C` | `⌥⌘C` | 代码块 |

#### 列表和引用
| 快捷键 | Windows/Linux | macOS | 功能 |
|--------|---------------|-------|------|
| 引用 | `Ctrl+Shift+Q` | `⇧⌘Q` | 引用块 |
| 有序列表 | `Ctrl+Shift+O` | `⇧⌘O` | 有序列表 |
| 无序列表 | `Ctrl+Shift+L` | `⇧⌘L` | 无序列表 |
| 分割线 | `Ctrl+Shift+H` | `⇧⌘H` | 水平分割线 |
| 表格 | `Ctrl+Shift+T` | `⇧⌘T` | 插入表格 |

#### 文档操作
| 快捷键 | Windows/Linux | macOS | 功能 |
|--------|---------------|-------|------|
| 保存 | `Ctrl+S` | `⌘S` | 保存当前文档 |
| 搜索 | `Ctrl+F` | `⌘F` | 搜索文档 |
| 全屏 | `F11` | `⌃⌘F` | 全屏编辑 |

### 🖼️ 图片处理
1. **拖拽上传**: 直接拖拽图片到编辑器
2. **粘贴上传**: 复制图片后在编辑器粘贴
3. **选择上传**: 点击工具栏图片按钮选择文件
4. **网络图片**: 直接使用图片URL

### 📊 导出选项
- **Markdown格式**: 保持原始格式
- **PDF文件**: 包含样式的PDF
- **HTML格式**: 带样式的网页文件
- **复制HTML**: 适合粘贴到富文本编辑器

## 🚀 生产部署

### 构建项目
```bash
# 构建前端
npm run build

# 验证构建
ls -la build/

# 启动生产服务
cd server
NODE_ENV=production npm start
```

### 使用PM2管理
```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start server/server.js --name "lyfes-doc-editor"

# 查看状态
pm2 status

# 查看日志
pm2 logs lyfes-doc-editor
```

### Nginx配置
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # 前端静态文件
    location / {
        root /path/to/build;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 文件上传
    location /uploads {
        proxy_pass http://localhost:3002;
    }
}
```

## 📈 性能建议

### 浏览器优化
- 使用现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）
- 开启硬件加速
- 定期清理浏览器缓存

### 系统优化
- 确保充足的内存空间
- 使用SSD硬盘提升读写速度
- 稳定的网络连接

### 文档管理
- 单个文档建议不超过1MB
- 定期清理不需要的文档
- 使用文件夹组织文档结构

## 🤝 获取帮助

### 官方资源
- **完整文档**: [README.md](README.md)
- **更新日志**: [CHANGELOG.md](CHANGELOG.md)
- **项目主页**: https://github.com/laifu2025/lyfes-doc-editor

### 社区支持
- **问题反馈**: [GitHub Issues](../../issues)
- **功能建议**: [GitHub Discussions](../../discussions)
- **代码贡献**: [Pull Requests](../../pulls)

### 联系方式
- **项目作者**: Lyfe
- **技术支持**: 通过GitHub Issues获取帮助
- **商务合作**: 详见项目主页联系方式

---

🎉 **现在您可以开始使用 Lyfe's Doc Editor 了！**

享受智能 Markdown 编辑的全新体验吧！

---

<p align="center">
  <strong>Made with ❤️ by Lyfe</strong><br>
  <sub>专为中文开发者设计的智能编辑工具</sub>
</p>