import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/Button'
import { CountUp } from '../components/ui/CountUp'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Stipple, WARM } from '../components/art/Stipple'
import { Rings } from '../components/art/Rings'
import { CASES, MARKET } from '../data/content'
import { useStore } from '../lib/store'
import { ease } from '../lib/motion'

const TICKER = ['deloitte', 'tst', 'ford', 'advogados', 'exclusoes']

export function Hero() {
  const { setDrawer, setCaseId } = useStore()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const winY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80])
  const dotsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50])
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const c = CASES.find(x => x.id === TICKER[i])!
  useEffect(() => { if (paused || reduce) return; const t = setInterval(() => setI(v => (v + 1) % TICKER.length), 6000); return () => clearInterval(t) }, [paused, reduce])
  const jump = () => { setCaseId(c.id); document.getElementById('problema')?.scrollIntoView({ behavior: 'smooth' }) }

  return (
    <section ref={ref} id="topo" className="relative overflow-hidden pt-[68px]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-10 pt-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-14 lg:pt-14">
        <div className="lg:col-span-7 lg:pr-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}><Eyebrow className="text-blue">Corretora especializada em risco de IA</Eyebrow></motion.div>
          <h1 className="mt-7 text-[clamp(2.9rem,6.4vw,5.9rem)] leading-[.95] text-ink">
            <Line d={0.15}>Sua empresa</Line>
            <Line d={0.25}>usa IA.</Line>
            <Line d={0.4} className="mt-[.22em] lg:ml-[.9em]"><span className="text-[.72em] leading-none text-ink/80">Quem cobre</span></Line>
            <Line d={0.5} className="lg:ml-[.9em]"><span className="hl whitespace-nowrap text-[.72em]"><em>o erro dela?</em></span></Line>
          </h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7, ease }} className="mt-8 max-w-[33rem] text-[19px] leading-[1.55] text-ink/80">
            A CAUTIA conecta quem usa IA às seguradoras que cobrem o risco, com diagnóstico técnico, endosso de IA e colocação. <span className="font-semibold text-ink">Não assumimos o risco, nós o colocamos.</span>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.7, ease }} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button size="lg" arrow onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}>Fazer o diagnóstico</Button>
            <button type="button" onClick={() => setDrawer(true)} className="link-u min-h-11 text-[16px] font-semibold text-blue">Solicitar análise de cobertura →</button>
          </motion.div>
        </div>

        <motion.div style={{ y: winY }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.25, ease }} className="on-dark relative lg:col-span-5">
          <div className="relative isolate aspect-[4/4.7] overflow-hidden rounded-[var(--radius-panel)] bg-blue text-cream lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <motion.div style={{ y: dotsY }} className="absolute inset-[-8%]"><Stipple blobs={WARM} dots={26000} seed={11} /></motion.div>
            <Rings className="absolute left-1/2 top-[46%] w-[135%] -translate-x-1/2 -translate-y-1/2 text-cream/70" />
            <p className="eyebrow absolute left-6 top-6 max-w-[15rem] leading-relaxed text-cream sm:left-8 sm:top-8">Seguros que cobrem o erro dessa IA, no Brasil inteiro</p>
            <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 text-center"><span aria-label="zero" className="font-display text-[clamp(11rem,28vw,17rem)] leading-[.8] tracking-[-.05em] text-cream">0</span></div>
            <p className="absolute bottom-5 left-6 right-6 w-fit max-w-full rounded-md bg-ink/70 px-2.5 py-1.5 text-[11.5px] leading-snug text-cream sm:left-8">Fonte citada na apresentação: TIC Empresas 2025 (Cetic.br/NIC.br).</p>
          </div>
        </motion.div>
      </div>

      {/* faixa de manchetes: um caso por vez, avança sozinha, pausa ao interagir */}
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div className="flex flex-col gap-3 rounded-[var(--radius-ctl)] bg-ink py-3 pl-5 pr-3 text-cream sm:flex-row sm:items-center sm:gap-6 sm:rounded-full sm:py-2 sm:pl-7">
          <p className="eyebrow shrink-0 text-sun">Manchetes <span className="hidden sm:inline">citadas na apresentação</span></p>
          <div className="relative min-h-[3.1rem] flex-1 overflow-hidden sm:min-h-[1.6rem]" aria-live="off">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={c.id} initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-60%', opacity: 0 }} transition={{ duration: 0.45, ease }} className="text-[14.5px] leading-snug sm:truncate sm:leading-[1.6rem]"><span className="text-cream/70">{c.source} · </span>{c.headline}</motion.p>
            </AnimatePresence>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {TICKER.map((id, k) => <button key={id} type="button" aria-label={`Manchete ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} className="grid size-7 place-items-center"><span className={`block h-1.5 rounded-full transition-all duration-300 ${k === i ? 'w-5 bg-sun' : 'w-1.5 bg-cream/40'}`} /></button>)}
            <button type="button" onClick={jump} aria-label={`Explorar caso: ${c.short}`} className="ml-2 inline-flex h-10 items-center gap-2 rounded-full bg-sun px-4 text-[14px] font-semibold text-blue transition-colors hover:bg-cream">Explorar <span aria-hidden>→</span></button>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-blue/20">
        <dl className="mx-auto grid max-w-[1320px] divide-y divide-blue/20 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
          <div className="py-8 sm:pr-8">
            <dt className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-blue">Grandes empresas que já usam IA <span className="whitespace-nowrap rounded-full bg-sun px-2.5 py-0.5 text-[10px] tracking-wider text-blue">a confirmar</span></dt>
            <dd className="mt-3"><span className="block font-display text-[4.2rem] leading-none text-ink tabular"><CountUp to={50} suffix="%" /></span><span className="mt-2 block text-[13px] text-ink/70">Dado da apresentação (slides 1 e 3). Outro slide cita 37%: valor em validação.</span></dd>
          </div>
          {MARKET.filter(m => m.value !== 1.5).map((m, k) => (
            <div key={m.label} className={`py-8 ${k === 0 ? 'sm:px-8' : 'sm:pl-8'}`}>
              <dt className="eyebrow text-blue">{m.label}</dt>
              <dd className="mt-3"><span className="block font-display text-[4.2rem] leading-none text-ink tabular"><CountUp to={m.value} dec={m.dec} prefix={m.prefix} suffix={m.suffix} /></span><span className="mt-2 block text-[13px] text-ink/70">Fonte: apresentação CAUTIA.</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Line({ children, d, className = '' }: { children: React.ReactNode; d: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[.1em] ${className}`}>
      <motion.span className="block" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: d, ease }}>{children}</motion.span>
    </span>
  )
}
