import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function renameAppHtml(): Plugin {
  return {
    name: 'rename-app-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const html = bundle['app.html']
      if (!html) return
      delete bundle['app.html']
      html.fileName = 'index.html'
      bundle['index.html'] = html
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), renameAppHtml()],
  base: './',
  build: {
    emptyOutDir: true,
    rollupOptions: { input: 'app.html' },
  },
})
