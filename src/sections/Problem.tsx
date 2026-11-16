import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import { CASES } from '../data/content'
import { useStore } from '../lib/store'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { IconPlus } from '../components/ui/Icons'
import { ease } from '../lib/motion'

export function Problem() {
  const { caseId, setCaseId, setDrawer } = useStore()
  const heads = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const to = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? CASES.length - 1 : null
    if (to === null) return
    e.preventDefault(); heads.current[(to + CASES.length) % CASES.length]?.focus()
  }
  return (
    <section id="problema" className="on-dark bg-blue py-24 text-cream lg:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 lg:grid-cols-[.8fr_1.4fr] lg:gap-20 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal><Eyebrow n="01" className="text-sun">O problema</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="mt-6 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02]">A IA já está nas empresas. A cobertura para o erro dela, <span className="text-sun">ainda não.</span></h2></Reveal>
          <Reveal delay={0.1}><p className="mt-7 max-w-md text-[17px] leading-relaxed text-cream/80">Seguradoras tradicionais pedem documentação técnica que a empresa não tem, e algumas já pedem exclusões de IA nas apólices. Abra cada caso, todos citados na apresentação, e veja que perguntas o diagnóstico faria.</p></Reveal>
          <Reveal delay={0.15}><Button variant="accent" className="mt-8" arrow onClick={() => setDrawer(true)}>Quero entender minha exposição</Button></Reveal>
        </div>

        <ul className="hair border-t" aria-label="Situações de risco">
          {CASES.map((c, i) => {
            const open = c.id === caseId
            return (
              <li key={c.id} className="hair border-b">
                <h3>
                  <button ref={el => { heads.current[i] = el }} type="button" id={`case-h-${c.id}`} aria-expanded={open} aria-controls={`case-p-${c.id}`} onKeyDown={e => onKey(e, i)}
                    onClick={() => setCaseId(open ? '' : c.id)} className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 sm:py-7">
                    <span className="eyebrow tabular w-8 shrink-0 text-cream/80">0{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`eyebrow block transition-colors ${open ? 'text-sun' : 'text-cream/80'}`}>{c.tag}</span>
                      <span className={`mt-1.5 block font-display text-[1.6rem] leading-tight transition-transform duration-300 [transition-timing-function:var(--ease-out)] sm:text-[2rem] ${open ? '' : 'group-hover:translate-x-1.5'}`}>{c.short}</span>
                    </span>
                    <span className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors ${open ? 'border-sun bg-sun text-blue' : 'border-cream/30 group-hover:border-cream'}`}><IconPlus open={open} /></span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div key="p" id={`case-p-${c.id}`} role="region" aria-labelledby={`case-h-${c.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease }} className="overflow-hidden">
                      <div className="grid gap-8 pb-10 pl-0 sm:pl-[4.25rem] md:grid-cols-[1.2fr_1fr]">
                        <div>
                          <p className="eyebrow text-cream/80">{c.source}</p>
                          <blockquote className="mt-4 font-display text-[1.7rem] leading-[1.2] sm:text-[2.1rem]">“{c.headline}”</blockquote>
                          <p className="mt-5 text-[16px] leading-relaxed text-cream/80">{c.body}</p>
                        </div>
                        <div className="rounded-[var(--radius-ctl)] bg-cream p-6 text-ink">
                          <p className="eyebrow text-blue">O diagnóstico perguntaria</p>
                          <ul className="mt-4 space-y-4">{c.questions.map((q, k) => <li key={q} className="flex gap-3 text-[15px] leading-snug"><span className="tabular font-display text-lg text-blue">0{k + 1}</span>{q}</li>)}</ul>
                          <Button className="mt-6 w-full" arrow onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}>Responder no diagnóstico</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
