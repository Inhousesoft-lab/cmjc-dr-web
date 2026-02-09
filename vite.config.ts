import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  /**
   * UI base path
   * - dev : '/'
   * - prod: '/' 또는 '/pp/' (인프라 확정값에 맞춤)
   */
  const base = (env.VITE_APP_BASE || '/').replace(/\/+$/, '/')

  /**
   * Dev-only proxy settings
   * (vite dev server에서만 사용됨)
   */
  const proxyTarget = env.PROXY_TARGET || 'http://localhost:8080'
  const proxyPrefix = env.PROXY_PREFIX || '/pp/api'

  return {
    base,
    plugins: [react()],
    server: {
      proxy: {
        /**
         * Frontend always calls: /api/*
         * ex) axios.get('/users')
         *
         * dev :
         *   /api/users
         *   -> http://localhost:8080/pp/api/users
         *
         * prod :
         *   vite proxy 미사용
         *   -> infra/nginx handles /api/*
         */
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, proxyPrefix),
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './shared')
      }
    }
  }
})
