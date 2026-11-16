import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { ease } from '../../lib/motion'
export function Reveal({ children, delay = 0, className = '', y = 20 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 0.8, delay, ease }}>
      {children}
    </motion.div>
  )
}
