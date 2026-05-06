/**
 * GitHub Pages serves 404 for unknown paths. Copying the SPA entry as 404.html
 * lets /about and /contact load the app so React Router can take over.
 */
import { copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const indexHtml = join(dist, 'index.html')
const notFoundHtml = join(dist, '404.html')

if (!existsSync(indexHtml)) {
  console.error('dist/index.html not found — run vite build first.')
  process.exit(1)
}

copyFileSync(indexHtml, notFoundHtml)
console.log('gh-pages: wrote dist/404.html (copy of index.html)')
