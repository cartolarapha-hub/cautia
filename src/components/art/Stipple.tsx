import { useEffect, useRef } from 'react'

export interface Blob { x: number; y: number; r: number; color: string; w?: number }
/** Textura pontilhada (inspirada em grão de impressão): densidade segue manchas gaussianas. Desenhada uma vez, sem animação. */
export function Stipple({ blobs, seed = 7, dots = 9000, size = [0.45, 1.5], className = '' }: { blobs: Blob[]; seed?: number; dots?: number; size?: [number, number]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const draw = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), w = cv.clientWidth, h = cv.clientHeight
      if (!w || !h) return
      cv.width = w * dpr; cv.height = h * dpr
      const ctx = cv.getContext('2d')!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h)
      let s = seed >>> 0; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
      const ref = Math.max(w, h)
      for (let i = 0, placed = 0; i < dots * 6 && placed < dots; i++) {
        const x = rnd() * w, y = rnd() * h
        let tot = 0, best = blobs[0], bv = -1
        for (const b of blobs) { const dx = (x / w - b.x) * (w / ref), dy = (y / h - b.y) * (h / ref), v = Math.exp(-(dx * dx + dy * dy) / (2 * b.r * b.r)) * (b.w ?? 1); tot += v; if (v > bv) { bv = v; best = b } }
        if (rnd() < tot * 0.9) { ctx.globalAlpha = Math.min(0.95, 0.25 + tot * 0.55); ctx.fillStyle = best.color; const r = size[0] + rnd() * rnd() * (size[1] - size[0]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); placed++ }
      }
    }
    draw(); const ro = new ResizeObserver(draw); ro.observe(cv); return () => ro.disconnect()
  }, [blobs, seed, dots, size])
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 -z-10 size-full ${className}`} />
}

export const WARM: Blob[] = [
  { x: 0.2, y: 0.9, r: 0.3, color: '#f08a5d' }, { x: 0.72, y: 0.95, r: 0.28, color: '#e48db6' },
  { x: 0.95, y: 0.6, r: 0.2, color: '#b8a0e4' }, { x: 0.5, y: 1.05, r: 0.24, color: '#fff35c', w: 0.9 },
]
