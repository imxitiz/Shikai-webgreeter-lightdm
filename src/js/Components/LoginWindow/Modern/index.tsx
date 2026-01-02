import { useState, useCallback, useEffect } from 'react'
import Draggable from 'react-draggable'

import ModernSidebar from './ModernSidebar'
import ModernUserPanel from './ModernUserPanel'
import { cn } from '@/js/lib/utils'

const ASPECT_RATIO = 1944 / 1296

const getWindowSize = () => {
  const screenWidth = screen?.availWidth || 1024
  const screenHeight = screen?.availHeight || 768

  let width = Math.min(1944, Math.floor(screenWidth * 0.6))
  let height = Math.floor(width / ASPECT_RATIO)

  if (height > screenHeight * 0.9) {
    height = Math.floor(screenHeight * 0.9)
    width = Math.floor(height * ASPECT_RATIO)
  }

  return { width, height }
}

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = getWindowSize()

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v))
}

export default function ModernLoginWindow() {
  const availWidth =
    typeof screen !== 'undefined' && screen.availWidth
      ? screen.availWidth
      : window.innerWidth || 800
  const availHeight =
    typeof screen !== 'undefined' && screen.availHeight
      ? screen.availHeight
      : window.innerHeight || 600

  const bounds = {
    left: -(availWidth / 2 - WINDOW_WIDTH / 2),
    right: availWidth / 2 - WINDOW_WIDTH / 2,
    top: -(availHeight / 2 - WINDOW_HEIGHT / 2),
    bottom: availHeight / 2 - WINDOW_HEIGHT / 2
  }

  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('LoginDrag')
      if (saved) {
        const parsed = JSON.parse(saved)
        const x = Number(parsed.x) || 0
        const y = Number(parsed.y) || 0
        return {
          x: clamp(x, bounds.left, bounds.right),
          y: clamp(y, bounds.top, bounds.bottom)
        }
      }
    } catch {
      console.warn('Failed to read LoginDrag from storage, using default position')
    }
    return { x: 0, y: 0 }
  })

  const [isAnimating, setIsAnimating] = useState(false)

  const handleDrag = useCallback(
    (_: unknown, data: { x: number; y: number }) => {
      setPosition({
        x: clamp(data.x, bounds.left, bounds.right),
        y: clamp(data.y, bounds.top, bounds.bottom)
      })
    },
    [bounds.left, bounds.right, bounds.top, bounds.bottom]
  )

  const handleDragStop = useCallback(
    (_: unknown, data: { x: number; y: number }) => {
      const x = clamp(data.x, bounds.left, bounds.right)
      const y = clamp(data.y, bounds.top, bounds.bottom)
      localStorage.setItem('LoginDrag', JSON.stringify({ x, y }))
      setPosition({ x, y })
    },
    [bounds.left, bounds.right, bounds.top, bounds.bottom]
  )

  const handleRecenter = useCallback(() => {
    setIsAnimating(true)
    setPosition({ x: 0, y: 0 })
    localStorage.setItem('LoginDrag', JSON.stringify({ x: 0, y: 0 }))
    setTimeout(() => setIsAnimating(false), 400)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const availW =
        typeof screen !== 'undefined' && screen.availWidth
          ? screen.availWidth
          : window.innerWidth || 800
      const availH =
        typeof screen !== 'undefined' && screen.availHeight
          ? screen.availHeight
          : window.innerHeight || 600
      const left = -(availW / 2 - WINDOW_WIDTH / 2)
      const right = availW / 2 - WINDOW_WIDTH / 2
      const top = -(availH / 2 - WINDOW_HEIGHT / 2)
      const bottom = availH / 2 - WINDOW_HEIGHT / 2
      const x = clamp(position.x, left, right)
      const y = clamp(position.y, top, bottom)
      if (x !== position.x || y !== position.y) {
        setPosition({ x, y })
        localStorage.setItem('LoginDrag', JSON.stringify({ x, y }))
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [position])

  const getCornerRadius = () => {
    const atLeft = position.x === bounds.left
    const atRight = position.x === bounds.right
    const atTop = position.y === bounds.top
    const atBottom = position.y === bounds.bottom

    return {
      borderTopLeftRadius: atLeft || atTop ? '0px' : undefined,
      borderTopRightRadius: atRight || atTop ? '0px' : undefined,
      borderBottomLeftRadius: atLeft || atBottom ? '0px' : undefined,
      borderBottomRightRadius: atRight || atBottom ? '0px' : undefined
    }
  }

  return (
    <Draggable
      axis="both"
      handle=".login-handle"
      bounds={bounds}
      position={position}
      onDrag={handleDrag}
      onStop={handleDragStop}
      id="login-drag"
    >
      <div
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 no-wall-change',
          isAnimating && 'transition-transform duration-400 ease-out'
        )}
        style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}
      >
        <div
          className={cn(
            'relative w-full h-full flex overflow-hidden text-base',
            'rounded-3xl shadow-2xl',
            'border border-border/50',
            'bg-card/70',
            'animate-scale-in'
          )}
          style={getCornerRadius()}
        >
          <div className="absolute -top-32 -left-32 w-64 h-64 -z-10 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 -z-10 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

          <ModernSidebar />

          <ModernUserPanel onRecenter={handleRecenter} />
        </div>
      </div>
    </Draggable>
  )
}
