import { createPaintTransition, normalizeRoutePath } from './transition.js'

function readSiteBase() {
  const raw = document.querySelector('meta[name="site-base"]')?.content?.trim()
  if (!raw || raw === '/') return ''
  const s = raw.replace(/\/$/, '')
  return s.startsWith('/') ? s : `/${s}`
}

const SITE_BASE = readSiteBase()

function pathnameToRoute(pathname) {
  let p = pathname
  const base = SITE_BASE
  if (base && p.startsWith(base)) {
    const rest = p.slice(base.length)
    p =
      rest === '' || rest === '/'
        ? '/'
        : rest.startsWith('/')
          ? rest
          : `/${rest}`
  }
  if (!p.startsWith('/')) p = `/${p}`
  const known = ['/about', '/contact']
  if (p === '/') return '/'
  if (known.includes(p)) return p
  return '/'
}

function urlForRoute(route) {
  const r = normalizeRoutePath(route)
  if (!SITE_BASE) return r === '/' ? '/' : r
  if (r === '/') return `${SITE_BASE}/`
  return `${SITE_BASE}${r}`
}

/** @type {string} */
let currentRoute = '/'

/** @type {HTMLElement | null} */
const stage = document.getElementById('page-stage')

const templates = {
  '/': document.getElementById('tpl-home'),
  '/about': document.getElementById('tpl-about'),
  '/contact': document.getElementById('tpl-contact'),
}

function mountRoute(route) {
  const tpl = templates[normalizeRoutePath(route)]
  if (!tpl || !stage) return
  stage.replaceChildren(tpl.content.cloneNode(true))
  currentRoute = normalizeRoutePath(route)
}

function onMidNavigate(route) {
  mountRoute(route)
  history.pushState({ route }, '', urlForRoute(route))
}

const svg = document.querySelector('.transition-svg svg')
const brushPanel = document.getElementById('brushPanel')
const brushImg = /** @type {HTMLImageElement | null} */ (
  brushPanel?.querySelector('img')
)

if (!svg || !brushPanel || !brushImg) {
  console.error('paint transition markup missing')
} else {
  const { initIntro, requestNavigate } = createPaintTransition({
    svg,
    brushPanel,
    brushImg,
    getRoute: () => currentRoute,
    onMidNavigate,
  })

  mountRoute(pathnameToRoute(window.location.pathname))
  requestAnimationFrame(() => initIntro())

  document.documentElement.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const path = /** @type {HTMLElement} */ (el).dataset.nav
      if (!path) return
      if (e.defaultPrevented) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return
      e.preventDefault()
      requestNavigate(normalizeRoutePath(path))
    })
    const nr = normalizeRoutePath(/** @type {HTMLElement} */ (el).dataset.nav ?? '/')
      ; /** @type {HTMLAnchorElement} */ (el).href = urlForRoute(nr)
  })

  window.addEventListener('popstate', () => {
    const r = pathnameToRoute(window.location.pathname)
    mountRoute(r)
  })
}
