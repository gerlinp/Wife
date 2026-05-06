/**
 * GSAP stroke transition on React Router navigations (Vite-friendly).
 * Deferred `navigate` + GSAP so `<Outlet />` swaps while the overlay covers the screen.
 * Brush follows the top-painted stroke (second path) during intro + route transitions.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import {
  Link,
  resolvePath,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import gsap from 'gsap'
import painbrushSvgUrl from '@/assets/painbrush.svg?url'

const TransitionNavContext = createContext(null)

export function useTransitionNavigate() {
  const ctx = useContext(TransitionNavContext)
  if (!ctx)
    throw new Error('useTransitionNavigate must be used within TransitionProvider')
  return ctx.requestNavigate
}

/**
 * Like `<Link>` but runs the stroke cover first, then navigates so `<Outlet />` swaps under the overlay.
 */
export function TransitionLink({ to, replace, children, onClick, target, ...rest }) {
  const requestNavigate = useTransitionNavigate()
  return (
    <Link
      to={to}
      replace={replace}
      target={target}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0)
          return
        const tgt = target ?? e.currentTarget.getAttribute('target')
        if (tgt && tgt !== '_self') return
        e.preventDefault()
        requestNavigate(to, replace ? { replace: true } : undefined)
      }}
    >
      {children}
    </Link>
  )
}

const RAINBOW = [
  '#ff0000', // red
  '#0000ff', // blue
  '#00a651', // green
  '#ff7a00', // orange
  '#ffd400', // yellow
  '#6e44ff', // purple
]

function shuffled(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildAllPairs(colors) {
  const pairs = []
  for (let i = 0; i < colors.length; i += 1) {
    for (let j = i + 1; j < colors.length; j += 1) {
      pairs.push([colors[i], colors[j]])
    }
  }
  return pairs
}

/** painbrush.svg art size + bristle pivot in SVG user units (maps to CSS via `BRUSH_IMG_CSS_WIDTH`). */
const BRUSH_ART_W = 1721.433
const BRUSH_ART_H = 3086.997
const BRUSH_TIP_X = 640
const BRUSH_TIP_Y = 2790
/** Display width (px) for the HTML `<img>` brush; height follows aspect ratio of the SVG art. */
const BRUSH_IMG_CSS_WIDTH = 720
/** Constant screen rotation so the brush stays upright (degrees). Tweak if the asset needs nudging. */
const BRUSH_FIXED_ROTATION_DEG = 0
/** Index of `path.transition-stroke` that paints above the other (DOM order → second wins). */
const TOP_STROKE_INDEX = 1

/** Cover wipe + reveal (~2.5s end-to-end for route transitions). */
const COVER_DURATION = 1.25
const REVEAL_DURATION = 1.25

export default function TransitionProvider({ children }) {
  const svgRef = useRef(null)
  const pathsRef = useRef([])
  const brushPanelRef = useRef(null)
  const brushImgRef = useRef(null)
  /** GSAP reads this on every frame so callbacks never use a stale React state snapshot. */
  const brushShownRef = useRef(false)
  const location = useLocation()
  const navigate = useNavigate()
  const remainingPairsRef = useRef(shuffled(buildAllPairs(RAINBOW)))
  const lastPairColorsRef = useRef(null)
  const introCompleteRef = useRef(false)
  const introTlRef = useRef(null)
  const routeTlRef = useRef(null)
  const lastPathnameRef = useRef(null)

  function brushDistanceAlongStroke(path, length) {
    const off = Number.parseFloat(path.style.strokeDashoffset)
    if (!Number.isFinite(off))
      return Math.min(length * 0.5, length - 1e-4)
    return Math.min(Math.max(length - off, 1e-4), length - 1e-4)
  }

  function applyBrushHudVisibility() {
    const panel = brushPanelRef.current
    if (!panel) return
    const on = brushShownRef.current
    panel.style.opacity = on ? '1' : '0'
    panel.style.visibility = on ? 'visible' : 'hidden'
  }

  function setBrushLayerVisible(on) {
    brushShownRef.current = on
    applyBrushHudVisibility()
  }

  /** HTML `<img>` positioned in viewport space — avoids broken `<image>` inside non-uniformly scaled SVG. */
  function syncBrushFollowToTopStroke() {
    if (!brushShownRef.current) return
    const img = brushImgRef.current
    const paths = pathsRef.current
    const path = paths[TOP_STROKE_INDEX]
    if (!img || !path?.ownerSVGElement) return

    const svg = path.ownerSVGElement
    const length = path.getTotalLength()
    const drawn = brushDistanceAlongStroke(path, length)
    const lp = path.getPointAtLength(drawn)

    const ctm = path.getScreenCTM()
    if (!ctm) return

    const ptSvg = svg.createSVGPoint()
    ptSvg.x = lp.x
    ptSvg.y = lp.y
    const sp = ptSvg.matrixTransform(ctm)

    const w = BRUSH_IMG_CSS_WIDTH
    const displayedH = (w * BRUSH_ART_H) / BRUSH_ART_W
    const tipXPx = (BRUSH_TIP_X / BRUSH_ART_W) * w
    const tipYPx = (BRUSH_TIP_Y / BRUSH_ART_H) * displayedH

    img.style.left = `${sp.x - tipXPx}px`
    img.style.top = `${sp.y - tipYPx}px`
    img.style.width = `${w}px`
    img.style.transform =
      BRUSH_FIXED_ROTATION_DEG === 0 ? 'none' : `rotate(${BRUSH_FIXED_ROTATION_DEG}deg)`
    img.style.transformOrigin = `${tipXPx}px ${tipYPx}px`
  }

  function setNextStrokeColors() {
    if (!remainingPairsRef.current.length) {
      remainingPairsRef.current = shuffled(buildAllPairs(RAINBOW))
    }

    const last = lastPairColorsRef.current
    const pool = remainingPairsRef.current

    let chosenIdx = -1
    if (last) {
      for (let i = pool.length - 1; i >= 0; i -= 1) {
        const [x, y] = pool[i]
        if (!last.has(x) && !last.has(y)) {
          chosenIdx = i
          break
        }
      }
    }

    const [a, b] =
      chosenIdx === -1 ? pool.pop() : pool.splice(chosenIdx, 1)[0]

    const swap = Math.random() < 0.5
    const c1 = swap ? b : a
    const c2 = swap ? a : b

    const root = document.documentElement
    root.style.setProperty('--transition-stroke-1', c1)
    root.style.setProperty('--transition-stroke-2', c2)

    lastPairColorsRef.current = new Set([c1, c2])
  }

  function playIntroReveal(paths, lengths) {
    introTlRef.current?.pause()

    setNextStrokeColors()

    paths.forEach((path, idx) => {
      path.style.strokeDasharray = String(lengths[idx])
      path.style.strokeDashoffset = '0'
      path.style.strokeWidth = '700'
    })

    const tl = gsap.timeline({
      onStart: () => {
        setBrushLayerVisible(true)
        syncBrushFollowToTopStroke()
        queueMicrotask(() => syncBrushFollowToTopStroke())
        requestAnimationFrame(() => syncBrushFollowToTopStroke())
      },
      onUpdate: syncBrushFollowToTopStroke,
      onComplete: () => {
        introCompleteRef.current = true
        lastPathnameRef.current = location.pathname
        setBrushLayerVisible(false)
      },
    })

    paths.forEach((path, idx) => {
      tl.to(
        path,
        {
          strokeDashoffset: lengths[idx],
          strokeWidth: 200,
          duration: COVER_DURATION,
          ease: 'none',
        },
        0,
      )
    })

    introTlRef.current = tl
  }

  useLayoutEffect(() => {
    if (!svgRef.current) return
    pathsRef.current = Array.from(
      svgRef.current.querySelectorAll('path.transition-stroke'),
    )
    const lengths = pathsRef.current.map((p) => p.getTotalLength())

    pathsRef.current.forEach((path, idx) => {
      path.style.strokeDasharray = String(lengths[idx])
      path.style.strokeDashoffset = '0'
      path.style.strokeWidth = '700'
    })

    if (!introCompleteRef.current) {
      playIntroReveal(pathsRef.current, lengths)
    }
  }, [])

  const requestNavigate = useCallback(
    (to, options) => {
      const paths = pathsRef.current
      if (!paths.length) {
        navigate(to, options)
        return
      }

      if (!introCompleteRef.current) {
        introTlRef.current?.pause()
        setBrushLayerVisible(false)
        navigate(to, options)
        return
      }

      const resolved = resolvePath(to, location.pathname)
      if (
        resolved.pathname === location.pathname &&
        resolved.search === location.search &&
        resolved.hash === location.hash
      ) {
        return
      }

      routeTlRef.current?.kill()
      setBrushLayerVisible(false)

      const lengths = paths.map((p) => p.getTotalLength())
      paths.forEach((path, idx) => {
        path.style.strokeDasharray = String(lengths[idx])
        path.style.strokeDashoffset = String(lengths[idx])
        path.style.strokeWidth = '200'
      })

      setNextStrokeColors()

      const tl = gsap.timeline({
        onStart: () => {
          setBrushLayerVisible(true)
          syncBrushFollowToTopStroke()
          queueMicrotask(() => syncBrushFollowToTopStroke())
          requestAnimationFrame(() => syncBrushFollowToTopStroke())
        },
        onUpdate: syncBrushFollowToTopStroke,
        onComplete: () => {
          setBrushLayerVisible(false)
        },
      })
      routeTlRef.current = tl

      paths.forEach((path) => {
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            strokeWidth: 700,
            duration: COVER_DURATION,
            ease: 'none',
          },
          0,
        )
      })

      tl.call(
        () => {
          navigate(to, options)
        },
        [],
        COVER_DURATION,
      )

      paths.forEach((path, idx) => {
        tl.to(
          path,
          {
            strokeDashoffset: lengths[idx],
            strokeWidth: 200,
            duration: REVEAL_DURATION,
            ease: 'none',
          },
          COVER_DURATION,
        )
      })
    },
    [
      navigate,
      location.pathname,
      location.search,
      location.hash,
    ],
  )

  const navContextValue = useMemo(
    () => ({ requestNavigate }),
    [requestNavigate],
  )

  useEffect(
    () => () => {
      introTlRef.current?.pause()
      routeTlRef.current?.kill()
      /** Don’t toggle brush visibility here — React StrictMode runs this cleanup on dev remount and keeps opacity at 0. */
    },
    [],
  )

  const overlay = (
    <>
      <div className="transition-svg" aria-hidden="true">
        <svg
          ref={svgRef}
          viewBox="0 0 2453 2535"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            className="transition-stroke"
            d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262"
            stroke="var(--transition-stroke-1)"
            strokeDasharray="99999"
            strokeDashoffset="0"
            strokeWidth="700"
            strokeLinecap="round"
          />
          <path
            className="transition-stroke"
            d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012"
            stroke="var(--transition-stroke-2)"
            strokeDasharray="99999"
            strokeDashoffset="0"
            strokeWidth="700"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        ref={brushPanelRef}
        className="transition-brush-follow-html"
        aria-hidden="true"
      >
        <img
          ref={brushImgRef}
          src={painbrushSvgUrl}
          alt=""
          draggable={false}
        />
      </div>
    </>
  )

  return (
    <>
      {createPortal(overlay, document.documentElement)}
      <TransitionNavContext.Provider value={navContextValue}>
        {children}
      </TransitionNavContext.Provider>
    </>
  )
}
