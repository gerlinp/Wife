/**
 * GSAP stroke transition on React Router navigations (Vite-friendly).
 * `next-transition-router` targets Next.js; deferred `navigate` + GSAP matches covered swap behavior.
 */
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useEffect,
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

const TransitionNavContext = createContext(null)

/** @typedef {import('react-router-dom').NavigateOptions} NavigateOptions */

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
  /** Unique unordered pairs (A,B) where A index < B index */
  const pairs = []
  for (let i = 0; i < colors.length; i += 1) {
    for (let j = i + 1; j < colors.length; j += 1) {
      pairs.push([colors[i], colors[j]])
    }
  }
  return pairs
}

export default function TransitionProvider({ children }) {
  const svgRef = useRef(null)
  const pathsRef = useRef([])
  const location = useLocation()
  const remainingPairsRef = useRef(shuffled(buildAllPairs(RAINBOW)))
  const lastPairColorsRef = useRef(null) // Set([c1,c2]) from previous transition
  const introCompleteRef = useRef(false)
  const introTlRef = useRef(null)
  const routeTlRef = useRef(null)
  const lastPathnameRef = useRef(null)

  function setNextStrokeColors() {
    if (!remainingPairsRef.current.length) {
      remainingPairsRef.current = shuffled(buildAllPairs(RAINBOW))
    }

    const last = lastPairColorsRef.current
    const pool = remainingPairsRef.current

    // Prefer a pair that doesn't reuse either previous color.
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

    // Randomize which color goes to which stroke, but the unordered pair still won't repeat.
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
      onComplete: () => {
        introCompleteRef.current = true
        lastPathnameRef.current = location.pathname
      },
    })

    paths.forEach((path, idx) => {
      tl.to(
        path,
        {
          strokeDashoffset: lengths[idx],
          strokeWidth: 200,
          duration: 1,
          ease: 'power1.inOut',
        },
        0,
      )
    })

    introTlRef.current = tl
  }

  useLayoutEffect(() => {
    if (!svgRef.current) return
    pathsRef.current = Array.from(svgRef.current.querySelectorAll('path'))
    const lengths = pathsRef.current.map((p) => p.getTotalLength())

    pathsRef.current.forEach((path, idx) => {
      // Initial load: start in the "covered" state (midway point).
      path.style.strokeDasharray = String(lengths[idx])
      path.style.strokeDashoffset = '0'
      path.style.strokeWidth = '700'
    })

    // Run intro from layout so React 18 StrictMode's effect double-invoke cleanup
    // doesn't kill the reveal timeline mid-flight (dev-only issue).
    if (!introCompleteRef.current) {
      playIntroReveal(pathsRef.current, lengths)
    }
  }, [])

  useEffect(() => {
    const paths = pathsRef.current
    if (!paths.length) return

    if (!introCompleteRef.current) {
      return
    }

    // Only run transitions when the *pathname changes*.
    if (lastPathnameRef.current === location.pathname) {
      return
    }

    lastPathnameRef.current = location.pathname

    const lengths = paths.map((p) => p.getTotalLength())
    paths.forEach((path, idx) => {
      path.style.strokeDasharray = String(lengths[idx])
      path.style.strokeDashoffset = String(lengths[idx])
      path.style.strokeWidth = '200'
    })

    setNextStrokeColors()

    routeTlRef.current?.pause()
    const tl = gsap.timeline()
    routeTlRef.current = tl
    paths.forEach((path) => {
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          strokeWidth: 700,
          duration: 1,
          ease: 'power1.inOut',
        },
        0,
      )
    })
    paths.forEach((path, idx) => {
      tl.to(
        path,
        {
          strokeDashoffset: lengths[idx],
          strokeWidth: 200,
          duration: 0.85,
          ease: 'power1.inOut',
        },
        1,
      )
    })

    return () => {
      tl.pause()
    }
  }, [location.pathname])

  useEffect(
    () => () => {
      introTlRef.current?.pause()
      routeTlRef.current?.pause()
    },
    [],
  )

  const overlay = (
    <div className="transition-svg" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 2453 2535"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262"
          stroke="var(--transition-stroke-1)"
          // Render covered state immediately (before effects compute real dash lengths).
          strokeDasharray="99999"
          strokeDashoffset="0"
          strokeWidth="700"
          strokeLinecap="round"
        />
        <path
          d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012"
          stroke="var(--transition-stroke-2)"
          // Render covered state immediately (before effects compute real dash lengths).
          strokeDasharray="99999"
          strokeDashoffset="0"
          strokeWidth="700"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )

  return (
    <>
      {createPortal(overlay, document.body)}
      <div className="transition-page">{children}</div>
    </>
  )
}
