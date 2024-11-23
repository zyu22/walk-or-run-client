import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd(), '')
 
 return {
   plugins: [
     vue(),
     vueDevTools(),
   ],
   resolve: {
     alias: {
       '@': fileURLToPath(new URL('./src', import.meta.url))
     },
   },
   server: {
     proxy: {
       '/api': {
         target: env.VITE_API_URL,
         changeOrigin: true,
         secure: false,
         ws: true,
       }
     }
   }
 }
})