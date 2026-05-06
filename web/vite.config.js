import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// GitHub Project Pages URL: https://<user>.github.io/<repo>/
// Change `repoBase` if the repo name is not "Wife". Use '/' for a user/org site (user.github.io).
const repoBase = '/Wife/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Dev: '/' so http://localhost:5173/ works. Build: repo path so assets and routes work on Pages.
  base: command === 'serve' ? '/' : repoBase,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}))
