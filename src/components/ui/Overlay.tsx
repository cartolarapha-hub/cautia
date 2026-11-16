import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ease } from '../../lib/motion'

type Variant = 'center' | 'side' | 'full'
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

interface Props { open: boolean; onClose: () => void; label: string; variant?: Variant; children: ReactNode; className?: string; dismissOnBackdrop?: boolean }

/** Base acessível para modais, painéis laterais e telas cheias: foco preso, Escape, restauração de foco, bloqueio de scroll. */
export function Overlay({ open, onClose, label, variant = 'center', children, className = '', dismissOnBackdrop = true }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const [sheet, setSheet] = useState(false)
  useEffect(() => { const mq = matchMedia('(max-width: 639px)'); const f = () => setSheet(mq.matches); f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f) }, [])
  const last = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    last.current = document.activeElement as HTMLElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      const el = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE)
      ;(el ?? panel.current)?.focus()
    }, 60)
    return () => { clearTimeout(t); document.body.style.overflow = prev; last.current?.focus?.() }
  }, [open])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return }
    if (e.key !== 'Tab' || !panel.current) return
    const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null)
    if (!items.length) return
    const first = items[0], end = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); end.focus() }
    else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first.focus() }
  }

  const pos = variant === 'side' ? 'justify-end' : variant === 'full' ? '' : 'items-end sm:items-center justify-center p-0 sm:p-6'
  const anim = variant === 'side'
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { duration: 0.5, ease } }
    : variant === 'full'
      ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, transition: { duration: 0.4, ease } }
      : sheet
        ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { duration: 0.5, ease } }
        : { initial: { opacity: 0, y: 24, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 }, transition: { duration: 0.45, ease } }

  return (
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-[80] flex ${pos}`}>
          {variant !== 'full' && (
            <motion.div aria-hidden className="absolute inset-0 bg-ink/55 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              onClick={dismissOnBackdrop ? onClose : undefined} />
          )}
          <motion.div ref={panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onKeyDown={onKey}
            {...anim}
            {...(variant === 'center' && sheet ? { drag: 'y' as const, dragConstraints: { top: 0, bottom: 0 }, dragElastic: { top: 0, bottom: 0.6 }, onDragEnd: (_: unknown, i: { offset: { y: number }; velocity: { y: number } }) => { if (i.offset.y > 90 || i.velocity.y > 500) onClose() } } : {})}
            className={`relative outline-none ${variant === 'full' ? 'size-full overflow-y-auto bg-paper' : 'max-h-[100dvh] overflow-y-auto'} ${className}`}>
            {variant === 'center' && sheet && <span aria-hidden className="absolute left-1/2 top-2.5 z-10 block h-1 w-10 -translate-x-1/2 rounded-full bg-ink/30" />}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function CloseButton({ onClick, label = 'Fechar', className = '' }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className={`grid size-11 place-items-center rounded-full transition duration-300 hover:rotate-90 hover:bg-current/10 active:scale-90 ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    </button>
  )
}
