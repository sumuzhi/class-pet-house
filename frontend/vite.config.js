import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:3001'

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      host: true,
      proxy: {
        '/api': proxyTarget,
        '/pet-images': proxyTarget,
        '/动物图片': proxyTarget
      }
    }
  }
})
