import { motion } from 'motion/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { spring } from '../../lib/motion'

type Variant = 'primary' | 'accent' | 'outline' | 'quiet'
const styles: Record<Variant, string> = {
  primary: 'bg-blue text-cream hover:bg-navy',
  accent: 'bg-sun text-blue hover:bg-cream',
  outline: 'border border-current/35 hover:border-current hover:bg-current/[.06]',
  quiet: 'px-2 hover:bg-current/[.07]',
}
interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: Variant; loading?: boolean; arrow?: boolean; size?: 'md' | 'lg'; children: ReactNode
}
export function Button({ variant = 'primary', loading, arrow, size = 'md', children, className = '', disabled, ...rest }: Props) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} transition={spring} disabled={disabled || loading} aria-busy={loading || undefined}
      className={`group relative inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-ctl)] font-semibold tracking-[-.005em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${size === 'lg' ? 'h-14 px-7 text-[16px]' : 'h-12 px-5 text-[15px]'} ${styles[variant]} ${className}`}
      {...rest}>
      {loading && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      <span>{children}</span>
      {arrow && !loading && (
        <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
    </motion.button>
  )
}
