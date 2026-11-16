import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { STEPS } from '../data/content'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { Stipple, WARM } from '../components/art/Stipple'
import { STEP_ART } from '../components/art/StepArt'
import { ease } from '../lib/motion'

function usePinned() {
  const reduce = useReducedMotion()
  const [wide, setWide] = useState(false)
  useEffect(() => { const mq = matchMedia('(min-width: 1024px) and (min-height: 640px)'); const f = () => setWide(mq.matches); f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f) }, [])
  return wide && !reduce
}

export function HowItWorks() {
  const pinned = usePinned()
  const [i, setI] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', v => { if (pinned) setI(Math.min(4, Math.max(0, Math.floor(v * 5 - 0.001)))) })
  const go = (k: number) => {
    setI(k)
    if (pinned && track.current) { const r = track.current.getBoundingClientRect(), top = scrollY + r.top, span = r.height - innerHeight; scrollTo({ top: top + span * ((k + 0.5) / 5), behavior: 'smooth' }) }
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(4, i + 1)) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(0, i - 1)) }
  }
  const st = STEPS[i], Art = STEP_ART[i]

  const list = (
    <div role="group" aria-label="Etapas do modelo CAUTIA" onKeyDown={onKey} className="border-t border-blue/25">
      {STEPS.map((s, k) => {
        const on = k === i
        return (
          <div key={s.id} className="border-b border-blue/25">
            <button id={`step-${s.id}`} aria-expanded={on} aria-current={on ? 'step' : undefined} aria-controls="step-panel" onClick={() => go(k)} className="group flex w-full items-baseline gap-5 py-3 text-left">
              <span className={`tabular w-10 font-display text-[2.2rem] leading-none transition-colors duration-300 ${on ? 'text-blue' : 'text-ink/35 group-hover:text-ink/60'}`}>{s.n}</span>
              <span className={`flex-1 font-display text-[1.7rem] leading-none transition-colors duration-300 ${on ? 'text-ink' : 'text-ink/60 group-hover:text-ink'}`}>{s.title}<span className="eyebrow ml-3 hidden text-[10.5px] text-blue lg:inline">{on ? s.line : ''}</span></span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div key="d" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                  <div className="grid gap-5 pb-5 pl-[3.75rem] pr-2 sm:grid-cols-[1.3fr_1fr]">
                    <p className="text-[16.5px] leading-relaxed text-ink/85">{s.what}</p>
                    <dl className="space-y-3 text-[14.5px] leading-snug"><div><dt className="eyebrow text-[10.5px] text-blue">Você</dt><dd className="mt-1">{s.you}</dd></div><div><dt className="eyebrow text-[10.5px] text-blue">CAUTIA</dt><dd className="mt-1">{s.us}</dd></div></dl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
  const stage = (
    <div id="step-panel" role="region" aria-label={`Ilustração da etapa ${st.n}: ${st.title}`} className="relative isolate aspect-[5/4] w-full overflow-hidden rounded-[var(--radius-panel)] bg-sand">
      <Stipple blobs={WARM.map(b => ({ ...b, y: b.y - 0.1 }))} dots={9000} seed={5} className="opacity-60" />
      <AnimatePresence mode="wait"><motion.div key={st.id} initial={{ opacity: 0, y: 22, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4, ease }} className="absolute inset-0"><Art /></motion.div></AnimatePresence>
      <p className="eyebrow absolute left-5 top-5 rounded-full bg-ink px-3 py-1 text-[10px] text-cream">Etapa {st.n} de 5 · ilustrativo</p>
    </div>
  )

  const head = (
    <div>
      <Reveal><Eyebrow n="02" className="text-blue">Como funciona</Eyebrow></Reveal>
      <Reveal delay={0.05}><h2 className="mt-5 max-w-xl text-[clamp(2.2rem,3.9vw,3.5rem)] leading-[1] text-ink">Cinco etapas, da entrada <em>à apólice emitida.</em></h2></Reveal>
    </div>
  )
  return (
    <section id="como-funciona" className="bg-cream" style={{ ['--scallop' as string]: 'var(--color-blue)' }}>
      <div aria-hidden className="scallop-up" style={{ ['--scallop' as string]: 'var(--color-blue)', marginTop: -1 }} />
      <div ref={track} style={pinned ? { height: '420vh' } : undefined} className="relative">
        <div className={pinned ? 'sticky top-0 flex h-screen items-center overflow-hidden' : ''}>
          <div className={`mx-auto grid w-full max-w-[1320px] gap-10 px-5 grid-cols-[minmax(0,1fr)] lg:grid-cols-12 lg:gap-14 lg:px-10 ${pinned ? 'pt-16' : 'py-24'}`}>
            <div className="lg:col-span-6">
              {head}
              <div className="mt-6">{list}</div>
              <div className="mt-5 flex items-center gap-3">
                <Button variant="outline" className="text-blue" disabled={i === 0} onClick={() => go(i - 1)}>Anterior</Button>
                <Button disabled={i === 4} arrow onClick={() => go(i + 1)}>Próxima etapa</Button>
                <p className="ml-2 hidden text-[12.5px] leading-snug text-ink/70 xl:block">{pinned ? 'Role a página ou use os botões.' : ''}</p>
              </div>
            </div>
            <div className="lg:col-span-6 lg:self-center">{stage}<p className="mt-4 text-[13px] leading-snug text-ink/70">Renovação e monitoramento anual · receita recorrente. Descrições conforme o modelo de negócio da apresentação; o detalhamento operacional é ilustrativo.</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
