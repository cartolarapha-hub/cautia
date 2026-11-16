import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import { CASES } from '../data/content'
import { useStore } from '../lib/store'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { ease } from '../lib/motion'

type Case = (typeof CASES)[number]

/** Recorte de jornal + bilhete amarelo com as perguntas do diagnóstico (colagem, como no slide 2 da apresentação). */
function Clipping({ c, idx }: { c: Case; idx: number }) {
  const tilt = [-1.6, 1.2, -0.8, 1.6, -1.2][idx % 5]
  return (
    <motion.div key={c.id} initial={{ opacity: 0, y: 40, rotate: tilt * 3 }} animate={{ opacity: 1, y: 0, rotate: tilt }} exit={{ opacity: 0, y: -30, rotate: tilt * -2 }} transition={{ duration: 0.6, ease }} className="relative mx-auto max-w-[620px] pb-24 pt-2 sm:pb-28">
      <article className="relative rounded-[6px] bg-paper p-6 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)] sm:p-9">
        <div className="flex items-center justify-between border-b border-ink/15 pb-3">
          <p className="eyebrow text-blue">{c.tag}</p><p className="eyebrow text-ink/70">{c.source}</p>
        </div>
        <h3 className="mt-6 font-sans text-[clamp(1.45rem,2.6vw,2.05rem)] font-bold leading-[1.12] tracking-[-.02em] text-ink">{c.headline}</h3>
        <p className="mt-5 text-[16.5px] leading-relaxed text-ink/80">{c.body}</p>
        <div aria-hidden className="mt-6 space-y-2"><span className="block h-1.5 w-full rounded-full bg-ink/10" /><span className="block h-1.5 w-[92%] rounded-full bg-ink/10" /><span className="block h-1.5 w-[64%] rounded-full bg-ink/10" /></div>
      </article>
      <motion.aside initial={{ opacity: 0, y: 30, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 2 }} transition={{ delay: 0.25, duration: 0.6, ease }} className="absolute -bottom-2 right-0 w-[88%] rounded-[6px] bg-sun p-5 text-blue shadow-[0_20px_40px_-20px_rgba(0,0,0,.5)] sm:right-[-4%] sm:w-[78%]" aria-label="Perguntas do diagnóstico">
        <p className="eyebrow">O diagnóstico perguntaria</p>
        <ul className="mt-3 space-y-2.5">{c.questions.map((q, k) => <li key={q} className="flex gap-3 text-[14.5px] font-medium leading-snug"><span className="tabular font-display text-xl leading-none">0{k + 1}</span>{q}</li>)}</ul>
      </motion.aside>
    </motion.div>
  )
}

export function Problem() {
  const { caseId, setCaseId, setDrawer } = useStore()
  const heads = useRef<(HTMLButtonElement | null)[]>([])
  const idx = Math.max(0, CASES.findIndex(c => c.id === caseId))
  const cur = CASES[idx]
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const to = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? CASES.length - 1 : null
    if (to === null) return
    e.preventDefault(); heads.current[(to + CASES.length) % CASES.length]?.focus()
  }
  return (
    <section id="problema" className="on-dark relative bg-blue text-cream" style={{ ['--scallop' as string]: 'var(--color-cream)' }}>
      <div aria-hidden className="scallop"/>
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 pb-24 pt-20 grid-cols-[minmax(0,1fr)] lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-36 lg:pt-28">
        <div className="lg:col-span-6">
          <Reveal><Eyebrow n="01" className="text-sun">O problema</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="mt-6 text-[clamp(2.5rem,5.2vw,4.8rem)] leading-[1] ">A IA já está nas empresas. A cobertura para o erro dela, <em>ainda não.</em></h2></Reveal>
          <Reveal delay={0.1}><p className="mt-7 max-w-md text-[17px] leading-relaxed text-cream/85">Seguradoras tradicionais pedem documentação técnica que a empresa não tem, e algumas já pedem exclusões de IA nas apólices. Abra cada caso, todos citados na apresentação.</p></Reveal>

          <ul className="mt-12 border-t border-cream/25" aria-label="Situações de risco">
            {CASES.map((c, i) => {
              const open = c.id === caseId
              return (
                <li key={c.id} className="border-b border-cream/25">
                  <h3 className="font-sans">
                    <button ref={el => { heads.current[i] = el }} type="button" id={`case-h-${c.id}`} aria-expanded={open} aria-controls={`case-p-${c.id}`} onKeyDown={e => onKey(e, i)}
                      onClick={() => setCaseId(open ? '' : c.id)} className="group flex w-full items-baseline gap-5 py-5 text-left">
                      <span className={`tabular w-8 shrink-0 font-display text-2xl transition-colors ${open ? 'text-sun' : 'text-cream/70'}`}>0{i + 1}</span>
                      <span className={`flex-1 font-display text-[1.65rem] leading-tight transition-transform duration-300 [transition-timing-function:var(--ease-out)] ${open ? 'text-sun' : 'group-hover:translate-x-1.5'}`}>{c.short}<span className="eyebrow ml-3 hidden align-middle text-[10.5px] text-cream/75 sm:inline">{c.tag}</span></span>
                      <span aria-hidden className={`font-display text-2xl transition-transform duration-300 ${open ? 'rotate-45 text-sun' : ''}`}>+</span>
                    </button>
                  </h3>
                  {/* mobile: detalhe inline */}
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div id={`case-p-${c.id}`} role="region" aria-labelledby={`case-h-${c.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden lg:hidden">
                        <div className="px-1 pb-10 pt-4"><Clipping c={c} idx={i} /><Button variant="accent" className="mt-2 w-full" arrow onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}>Responder no diagnóstico</Button></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
          <div className="mt-9 flex flex-wrap gap-4"><Button variant="accent" arrow onClick={() => setDrawer(true)}>Quero entender minha exposição</Button></div>
        </div>

        {/* desktop: recorte fixo na coluna da direita */}
        <div className="relative hidden lg:col-span-6 lg:block">
          <div className="sticky top-28 pt-8">
            <AnimatePresence mode="wait">{caseId ? <Clipping key={cur.id} c={cur} idx={idx} /> : <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl text-cream/70">Escolha um caso para ler o recorte.</motion.p>}</AnimatePresence>
            {caseId && <div className="mt-2 text-center"><Button variant="outline" className="text-cream" arrow onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}>Responder no diagnóstico</Button></div>}
          </div>
        </div>
      </div>
    </section>
  )
}
