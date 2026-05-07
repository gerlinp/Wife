/* global gsap */

const RAINBOW = [
  '#ff0000',
  '#0000ff',
  '#00a651',
  '#ff7a00',
  '#ffd400',
  '#6e44ff',
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

const BRUSH_ART_W = 1721.433
const BRUSH_ART_H = 3086.997
const BRUSH_TIP_X = 640
const BRUSH_TIP_Y = 2790
const BRUSH_IMG_CSS_WIDTH = 720
const BRUSH_FIXED_ROTATION_DEG = 0
const TOP_STROKE_INDEX = 1

const COVER_DURATION = 1.25
const REVEAL_DURATION = 1.25

/**
 * @param {object} opts
 * @param {SVGElement} opts.svg
 * @param {HTMLElement} opts.brushPanel
 * @param {HTMLImageElement} opts.brushImg
 * @param {() => string} opts.getRoute
 * @param {(route: string) => void} opts.onMidNavigate — swap page + pushState at cover peak
 */
export function createPaintTransition(opts) {
  const { svg, brushPanel, brushImg, getRoute, onMidNavigate } = opts

  let paths = []
  let brushShown = false
  let remainingPairs = shuffled(buildAllPairs(RAINBOW))
  let lastPairColors = null
  let introComplete = false
  let introTl = null
  let routeTl = null

  function brushDistanceAlongStroke(path, length) {
    const off = Number.parseFloat(path.style.strokeDashoffset)
    if (!Number.isFinite(off)) return Math.min(length * 0.5, length - 1e-4)
    return Math.min(Math.max(length - off, 1e-4), length - 1e-4)
  }

  function applyBrushHudVisibility() {
    if (!brushPanel) return
    brushPanel.style.opacity = brushShown ? '1' : '0'
    brushPanel.style.visibility = brushShown ? 'visible' : 'hidden'
  }

  function setBrushLayerVisible(on) {
    brushShown = on
    applyBrushHudVisibility()
  }

  function syncBrushFollowToTopStroke() {
    if (!brushShown) return
    const path = paths[TOP_STROKE_INDEX]
    if (!brushImg || !path?.ownerSVGElement) return

    const owner = path.ownerSVGElement
    const length = path.getTotalLength()
    const drawn = brushDistanceAlongStroke(path, length)
    const lp = path.getPointAtLength(drawn)

    const ctm = path.getScreenCTM()
    if (!ctm) return

    const ptSvg = owner.createSVGPoint()
    ptSvg.x = lp.x
    ptSvg.y = lp.y
    const sp = ptSvg.matrixTransform(ctm)

    const w = BRUSH_IMG_CSS_WIDTH
    const displayedH = (w * BRUSH_ART_H) / BRUSH_ART_W
    const tipXPx = (BRUSH_TIP_X / BRUSH_ART_W) * w
    const tipYPx = (BRUSH_TIP_Y / BRUSH_ART_H) * displayedH

    brushImg.style.left = `${sp.x - tipXPx}px`
    brushImg.style.top = `${sp.y - tipYPx}px`
    brushImg.style.width = `${w}px`
    brushImg.style.transform =
      BRUSH_FIXED_ROTATION_DEG === 0 ? 'none' : `rotate(${BRUSH_FIXED_ROTATION_DEG}deg)`
    brushImg.style.transformOrigin = `${tipXPx}px ${tipYPx}px`
  }

  function setNextStrokeColors() {
    if (!remainingPairs.length) {
      remainingPairs = shuffled(buildAllPairs(RAINBOW))
    }

    let chosenIdx = -1
    if (lastPairColors) {
      for (let i = remainingPairs.length - 1; i >= 0; i -= 1) {
        const [x, y] = remainingPairs[i]
        if (!lastPairColors.has(x) && !lastPairColors.has(y)) {
          chosenIdx = i
          break
        }
      }
    }

    const [a, b] =
      chosenIdx === -1 ? remainingPairs.pop() : remainingPairs.splice(chosenIdx, 1)[0]

    const swap = Math.random() < 0.5
    const c1 = swap ? b : a
    const c2 = swap ? a : b

    document.documentElement.style.setProperty('--transition-stroke-1', c1)
    document.documentElement.style.setProperty('--transition-stroke-2', c2)
    lastPairColors = new Set([c1, c2])
  }

  function refreshPathsFromSvg() {
    paths = Array.from(svg.querySelectorAll('path.transition-stroke'))
  }

  function playIntroReveal(lengthsOverride) {
    introTl?.pause()
    setNextStrokeColors()

    refreshPathsFromSvg()
    const lengths =
      lengthsOverride ?? paths.map((p) => p.getTotalLength())

    paths.forEach((path, idx) => {
      path.style.strokeDasharray = String(lengths[idx])
      path.style.strokeDashoffset = '0'
      path.style.strokeWidth = '700'
    })

    const sync = () => syncBrushFollowToTopStroke()

    const tl = gsap.timeline({
      onStart: () => {
        setBrushLayerVisible(true)
        sync()
        queueMicrotask(sync)
        requestAnimationFrame(sync)
      },
      onUpdate: sync,
      onComplete: () => {
        introComplete = true
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

    introTl = tl
  }

  function requestNavigate(targetRoute) {
    refreshPathsFromSvg()
    if (!paths.length) {
      onMidNavigate(targetRoute)
      return
    }

    const current = getRoute()
    const resolved = normalizeRoutePath(targetRoute)
    if (!introComplete) {
      introTl?.pause()
      setBrushLayerVisible(false)
      onMidNavigate(resolved)
      return
    }

    if (resolved === normalizeRoutePath(current)) return

    routeTl?.kill()
    setBrushLayerVisible(false)

    const lengths = paths.map((p) => p.getTotalLength())
    paths.forEach((path, idx) => {
      path.style.strokeDasharray = String(lengths[idx])
      path.style.strokeDashoffset = String(lengths[idx])
      path.style.strokeWidth = '200'
    })

    setNextStrokeColors()

    const sync = () => syncBrushFollowToTopStroke()

    const tl = gsap.timeline({
      onStart: () => {
        setBrushLayerVisible(true)
        sync()
        queueMicrotask(sync)
        requestAnimationFrame(sync)
      },
      onUpdate: sync,
      onComplete: () => setBrushLayerVisible(false),
    })
    routeTl = tl

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

    tl.call(() => onMidNavigate(resolved), [], COVER_DURATION)

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
  }

  function initIntro() {
    refreshPathsFromSvg()
    const lengths = paths.map((p) => p.getTotalLength())
    paths.forEach((path, idx) => {
      path.style.strokeDasharray = String(lengths[idx])
      path.style.strokeDashoffset = '0'
      path.style.strokeWidth = '700'
    })
    if (!introComplete) playIntroReveal(lengths)
  }

  return { initIntro, requestNavigate }
}

export function normalizeRoutePath(to) {
  if (!to || to === '/') return '/'
  const s = String(to).startsWith('/') ? String(to) : `/${to}`
  if (s === '/home') return '/'
  return s
}
