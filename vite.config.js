import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/qwen-test-vue/', // GitHub Pages base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: false, // 合并CSS文件以减少HTTP请求
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
        // 优化文件名，便于缓存
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 启用压缩
    brotliSize: true,
    // 预加载策略
    modulePreload: {
      polyfill: true
    }
  },
  server: {
    host: true,
    port: 3000
  },
  // 优化开发服务器
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
})