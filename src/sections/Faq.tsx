import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { FAQ } from '../data/content'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { IconPlus } from '../components/ui/Icons'
import { ease } from '../lib/motion'

export function Faq({ n = '06' }: { n?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)] gap-10 px-5 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <Reveal><Eyebrow n={n} className="text-blue">Perguntas frequentes</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="mt-6 text-[clamp(2.3rem,4.4vw,3.8rem)] leading-[1] text-ink">Dúvidas sobre preço e <em>funcionamento.</em></h2></Reveal>
        </div>
        <ul className="border-t border-blue/25 lg:col-span-8">
          {FAQ.map((f, i) => {
            const on = open === i
            return (
              <li key={f.q} className="border-b border-blue/25">
                <h3 className="font-sans"><button type="button" id={`faq-h-${i}`} aria-expanded={on} aria-controls={`faq-p-${i}`} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left">
                  <span className="font-display text-[1.45rem] leading-snug text-ink">{f.q}</span><span className="text-blue"><IconPlus open={on} /></span>
                </button></h3>
                <AnimatePresence initial={false}>
                  {on && <motion.div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-h-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden"><p className="max-w-2xl pb-6 text-[16.5px] leading-relaxed text-ink/85">{f.a}</p></motion.div>}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
