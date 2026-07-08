import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/hicode-site/' : '/',
  plugins: [vue()],
  server: { host: true, port: 5173 }
}))
