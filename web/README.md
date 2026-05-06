# Wife (Vite) — tutorial map

Follow the Codegrid / Next.js video using **the same paths under `src/`** (`app/layout`, `app/page`, route folders, `components`, `providers`). When the video differs from Vite, use this map:

| Video (Next.js App Router) | This project |
|----------------------------|----------------|
| `src/app/layout.js` | `src/app/layout.jsx` |
| `{children}` (page slot) | `<Outlet />` (same role: nested route UI) |
| `import "./globals.css"` in layout | `import '@/app/globals.css'` in `src/main.jsx` |
| `metadata` / `<title>` | `web/index.html` `<head>` |
| `next/font` | Google Fonts + `--font-*` in `src/app/globals.css` |
| `src/app/page.js` | `src/app/page.jsx` |
| `src/app/about/page.js` | `src/app/about/page.jsx` |
| `src/providers/TransitionProvider.jsx` | same path — stub until GSAP + RR wiring |
| *(no equivalent)* | `src/App.jsx` — React Router `Routes` only |
| *(no equivalent)* | `src/main.jsx` — Vite mount into `#root` |

**Later (“adapt to my needs”):** tighten copy, swap `TransitionProvider` implementation, adjust `vite.config.js` `base` + GH Pages `404` flow, branding in `index.html`.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
