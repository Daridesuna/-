import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 相対パスにして GitHub Pages などサブパス配下でも動くようにする
  base: './',
})
