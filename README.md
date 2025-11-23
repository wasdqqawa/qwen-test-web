# Qwen Test Vue 博客

这是一个使用 Vite 创建的现代化、全中文的 Vue.js 博客项目，可部署到 GitHub Pages。项目特点：

- 现代化的 Vue 3 和 Composition API
- 响应式设计和美观的 UI
- 博客功能：文章、分类和评论
- 搜索功能
- 专为 GitHub Pages 部署优化

## 功能特性

- 🎨 美观、响应式的 UI，包含动画和渐变效果
- 📱 完全响应式设计
- 🔍 搜索功能
- 📝 文章管理功能
- 💬 评论系统
- 📊 分类组织

## 部署到 GitHub Pages

此项目已配置为部署到 GitHub Pages：https://wasdqqawa.github.io/qwen-test-vue/

### 部署步骤：

1. 确保你的 GitHub 仓库名为 `qwen-test-vue`
2. 在仓库设置中启用 GitHub Pages (Settings > Pages > Source: GitHub Actions 或 gh-pages 分支)
3. 运行以下命令：

```bash
npm run build
```

4. `dist` 文件夹包含为 GitHub Pages 准备的构建应用
5. 你可以使用 `deploy.sh` 脚本进行部署：

```bash
./deploy.sh
```

### 配置说明：

- `vite.config.js` 文件配置了 `base: '/qwen-test-vue/'` 用于 GitHub Pages
- 路由器使用 `createWebHistory('./')` 用于相对路径
- 所有资源使用相对路径，确保在 GitHub Pages 子目录中正常工作

---

# Qwen Test Vue Blog

This is a modern, Chinese-only Vue.js blog project created with Vite that can be deployed to GitHub Pages. The project features:

- Modern Vue 3 with Composition API
- Responsive design with beautiful UI
- Blog functionality with posts, categories, and comments
- Search functionality
- GitHub Pages deployment ready

## Features

- 🎨 Beautiful, responsive UI with animations and gradients
- 📱 Fully responsive design
- 🔍 Search functionality
- 📝 Blog post management
- 💬 Comment system
- 📊 Category organization

## Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages at: https://wasdqqawa.github.io/qwen-test-vue/

### Steps to deploy:

1. Make sure your GitHub repository is named `qwen-test-vue`
2. Enable GitHub Pages in your repository settings (Settings > Pages > Source: GitHub Actions or gh-pages branch)
3. Run the following commands:

```bash
npm run build
```

4. The `dist` folder contains the built application ready for GitHub Pages
5. You can deploy using the `deploy.sh` script:

```bash
./deploy.sh
```

### Configuration Notes:

- The `vite.config.js` file is configured with `base: '/qwen-test-vue/'` for GitHub Pages
- The router uses `createWebHistory('./')` for relative paths
- All assets are referenced with relative paths to work correctly on GitHub Pages subdirectories