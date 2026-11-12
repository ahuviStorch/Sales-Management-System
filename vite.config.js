import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // האפליקציה הראשית
        main: resolve(__dirname, 'index.html'),
        // תצוגה מקדימה של אפיון גרסה 5 — נגישה בכתובת /preview.html
        preview: resolve(__dirname, 'preview.html'),
      },
    },
  },
})
