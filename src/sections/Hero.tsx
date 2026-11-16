import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Button } from '../components/ui/Button'
import { CountUp } from '../components/ui/CountUp'
import { Eyebrow } from '../components/ui/Eyebrow'
import { CASES, MARKET } from '../data/content'
import { useStore } from '../lib/store'
import { ease } from '../lib/motion'

const lines = ['Sua empresa', 'usa IA.', 'Quem cobre', 'o erro dela?']

export function Hero() {
  const { setDrawer, setCaseId } = useStore()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const panelY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70])
  const glow = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40])
  const jump = (id: string) => { setCaseId(id); document.getElementById('problema')?.scrollIntoView({ behavior: 'smooth' }) }
  const heads = ['deloitte', 'tst', 'ford'].map(id => CASES.find(c => c.id === id)!)

  return (
    <section ref={ref} id="topo" className="relative overflow-hidden pt-[68px]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 pb-16 pt-10 lg:grid-cols-[1.15fr_.85fr] lg:items-stretch lg:gap-16 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="flex flex-col justify-between">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}><Eyebrow className="text-blue">Corretora especializada em risco de IA</Eyebrow></motion.div>
            <h1 className="mt-7 text-[clamp(3rem,6.6vw,5.9rem)] leading-[.98] text-ink">
              {lines.map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[.08em]">
                  <motion.span className={`block ${i > 1 ? 'text-blue' : ''}`} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.15 + i * 0.1, ease }}>
                    {i === 3 ? <span className="mark">{l}</span> : l}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>
          <div>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7, ease }} className="mt-9 max-w-[34rem] text-[19px] leading-[1.55] text-ink/80">
              A CAUTIA conecta quem usa IA às seguradoras que cobrem o risco, com diagnóstico técnico, endosso de IA e colocação. <span className="font-semibold text-ink">Não assumimos o risco, nós o colocamos.</span>
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.7, ease }} className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" arrow onClick={() => document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' })}>Fazer o diagnóstico</Button>
              <Button size="lg" variant="outline" className="text-blue" onClick={() => setDrawer(true)}>Solicitar análise de cobertura</Button>
            </motion.div>
          </div>
        </div>

        <motion.div style={{ y: panelY }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease }}
          className="on-dark grain relative flex min-h-[560px] flex-col overflow-hidden rounded-[var(--radius-panel)] bg-blue text-cream">
          <motion.div aria-hidden style={{ y: glow }} className="glow-warm absolute inset-0 -z-10 opacity-70" />
          <div className="flex items-start justify-between p-6 sm:p-8">
            <p className="eyebrow text-cream/80">Seguros que cobrem o erro<br />dessa IA, no Brasil inteiro</p>
            <p className="eyebrow tabular text-cream/80">(00)</p>
          </div>
          <div className="relative mx-auto grid flex-1 place-items-center">
            <motion.div initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.1, delay: 0.5, ease }}
              className="grid size-[min(62vw,250px)] place-items-center rounded-[22%] border-[7px] border-sun">
              <span aria-label="zero" className="font-display text-[min(40vw,12.5rem)] leading-none text-cream">0</span>
            </motion.div>
          </div>
          <div className="px-6 pb-2 text-[11px] text-cream/80 sm:px-8">Fonte citada na apresentação: TIC Empresas 2025 (Cetic.br/NIC.br).</div>
          <ul className="hair mt-3 border-t">
            {heads.map((c, i) => (
              <li key={c.id} className="hair border-b last:border-b-0">
                <button type="button" onClick={() => jump(c.id)} aria-label={`Explorar caso: ${c.short}`}
                  className="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-cream/[.08] sm:px-8 [li:last-child_&]:pb-6">
                  <span className="eyebrow tabular w-6 shrink-0 text-cream/80">0{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block text-[10.5px] text-sun">{c.tag} · {c.source}</span>
                    <span className="mt-1 line-clamp-2 block text-[14.5px] leading-snug">{c.headline}</span>
                  </span>
                  <svg aria-hidden width="18" height="18" viewBox="0 0 16 16" className="shrink-0 text-sun transition-transform duration-300 group-hover:translate-x-1"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="hair border-y">
        <dl className="mx-auto grid max-w-[1320px] divide-y divide-blue/20 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
          <div className="py-7 sm:pr-8">
            <dt className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-blue">Grandes empresas que já usam IA <span className="whitespace-nowrap rounded-full bg-sun px-2.5 py-0.5 text-[10px] tracking-wider text-blue">a confirmar</span></dt>
            <dd className="mt-3"><span className="block font-display text-6xl text-ink tabular"><CountUp to={50} suffix="%" /></span><span className="mt-1 block text-[13px] text-ink/70">Dado da apresentação (slides 1 e 3). Outro slide cita 37%: valor em validação.</span></dd>
          </div>
          {MARKET.filter(m => m.value !== 1.5).map((m, i) => (
            <div key={m.label} className={`py-7 ${i === 0 ? 'sm:px-8' : 'sm:pl-8'}`}>
              <dt className="eyebrow text-blue">{m.label}</dt>
              <dd className="mt-3"><span className="block font-display text-6xl text-ink tabular"><CountUp to={m.value} dec={m.dec} prefix={m.prefix} suffix={m.suffix} /></span><span className="mt-1 block text-[13px] text-ink/70">Fonte: apresentação CAUTIA.</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
