# Qwen Test Vue Blog

This is a beautiful, internationalized Vue.js blog project created with Vite that can be deployed to GitHub Pages. The project features:

- Modern Vue 3 with Composition API
- Internationalization (i18n) support for English and Chinese
- Responsive design with beautiful UI
- Blog functionality with posts, categories, and comments
- Search functionality
- GitHub Pages deployment ready

## Features

- 🎨 Beautiful, responsive UI with animations and gradients
- 🌐 Internationalization support (English/Chinese)
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