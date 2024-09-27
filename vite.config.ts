import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import viteCompression from 'vite-plugin-compression'
import vitePluginZipDist from 'vite-plugin-dist-zip'
// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteCompression({
      threshold: 1024 * 500, // 对大于500kb的文件进行压缩
      algorithm: 'gzip', // 采用的压缩算法，默认是 gzip
      ext: '.gz' // 生成的压缩包后缀
    }),
    vitePluginZipDist({ zipName: 'dist' })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    proxy: {
      '/proxy-ai': {
        target: 'https://xrtest.cnki.net',
        ws: true,
        headers: {
          origin: 'https://x.cnki.net',
          referer: 'https://x.cnki.net'
        },
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-ai/, '')
      }
    }
  }
})

// http://localhost:9303/ai/log/getLogPageList?pageIndex=1&pageSize=10
// http://localhost:9303/ai/log/selectById
// ws://localhost:9303/ai/websocket/log
