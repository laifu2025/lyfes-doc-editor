# 贡献指南

感谢您对 Lyfe's Doc Editor 的关注！我们欢迎所有形式的贡献。

## 🚀 快速开始

### 开发环境要求
- Node.js 14.0+
- npm 6.0+
- Git

### 本地开发设置
```bash
# 1. Fork 并克隆项目
git clone https://github.com/YOUR_USERNAME/lyfes-doc-editor.git
cd lyfes-doc-editor

# 2. 安装依赖
npm install
cd server && npm install && cd ..

# 3. 启动开发环境
cd server && npm run dev  # 后端服务
npm start                 # 前端服务（新终端）
```

## 📝 代码规范

### 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type):**
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建或工具相关

**示例:**
```bash
feat(editor): 添加自动保存功能

- 实现5分钟自动保存机制
- 添加保存状态指示器
- 优化保存性能

Closes #123
```

### 代码风格
- 使用 ESLint + Prettier
- 遵循 Airbnb JavaScript 规范
- 组件名使用 PascalCase
- 文件名使用 camelCase

## 🔄 贡献流程

### 1. 问题反馈
- 使用 [Issues](https://github.com/laifu2025/lyfes-doc-editor/issues) 报告 bug
- 详细描述问题和复现步骤
- 提供环境信息和错误截图

### 2. 功能建议
- 在 [Discussions](https://github.com/laifu2025/lyfes-doc-editor/discussions) 中讨论新功能
- 说明使用场景和预期效果
- 等待社区反馈后再开始开发

### 3. 提交代码
```bash
# 1. 创建功能分支
git checkout -b feature/your-feature-name

# 2. 编写代码并测试
npm run lint    # 代码检查
npm run test    # 运行测试

# 3. 提交更改
git add .
git commit -m "feat: your feature description"

# 4. 推送到 GitHub
git push origin feature/your-feature-name

# 5. 创建 Pull Request
```

### 4. Pull Request 要求
- 详细描述更改内容
- 包含相关的 Issue 链接
- 确保所有测试通过
- 添加或更新相关文档

## 🧪 测试

### 运行测试
```bash
# 前端测试
npm test

# 后端测试
cd server && npm test

# 代码覆盖率
npm run test:coverage
```

### 编写测试
- 为新功能编写单元测试
- 确保测试覆盖率不下降
- 使用有意义的测试描述

## 📚 文档

### 更新文档
- README.md: 主要功能和使用说明
- CHANGELOG.md: 版本更新记录
- API文档: 接口变更说明

### 文档风格
- 使用中文编写
- 包含代码示例
- 添加必要的截图

## 🐛 调试技巧

### 开启调试模式
```bash
# 前端调试
export REACT_APP_DEBUG=true

# 后端调试
export NODE_ENV=development
export DEBUG=*
```

### 常用调试工具
- Chrome DevTools
- React Developer Tools
- Network 面板检查 API 调用

## 🎯 优先级任务

当前欢迎贡献的方向：

### 高优先级
- [ ] 性能优化
- [ ] 单元测试完善
- [ ] 错误处理改进
- [ ] 文档完善

### 中优先级
- [ ] 新主题开发
- [ ] 快捷键扩展
- [ ] 插件系统
- [ ] 多语言支持

### 低优先级
- [ ] 移动端适配
- [ ] 离线功能增强
- [ ] 协作编辑

## 💬 沟通

### 获取帮助
- GitHub Issues: 问题反馈
- GitHub Discussions: 功能讨论
- 邮件: lyfe@example.com

### 社区准则
- 友善和尊重
- 建设性反馈
- 耐心解答问题
- 分享知识和经验

## 🏆 贡献者

感谢所有为项目做出贡献的开发者！

### 如何成为核心贡献者
1. 持续提交高质量代码
2. 积极参与 Issues 和 PR 审查
3. 帮助改进项目文档
4. 协助社区建设

---

再次感谢您的贡献！🙏