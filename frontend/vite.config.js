import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:3001'
  const apiBasePath = (env.VITE_API_BASE_PATH || '/class-pet-house/api').replace(/\/+$/, '')
  const staticBasePathRaw = (env.VITE_STATIC_BASE_PATH || '/class-pet-house/').trim()
  const staticBasePath = `${staticBasePathRaw.replace(/^\/?/, '/').replace(/\/+$/, '')}/`
  const appBasePath = mode === 'production' ? staticBasePath : '/'

  return {
    base: staticBasePath,
    plugins: [vue(), tailwindcss()],
    server: {
      host: true,
      proxy: {
        [apiBasePath]: proxyTarget,
        '/pet-images': proxyTarget,
        '/动物图片': proxyTarget,
      }
    }
  }
})
