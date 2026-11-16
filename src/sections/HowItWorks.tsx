import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { STEPS } from '../data/content'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { ease, spring } from '../lib/motion'

// Quem participa de cada etapa (leitura ilustrativa do modelo de negócio da apresentação)
const WHO: Record<number, ('Empresa' | 'CAUTIA' | 'Seguradora')[]> = { 0: ['Empresa', 'CAUTIA'], 1: ['Empresa', 'CAUTIA'], 2: ['CAUTIA'], 3: ['CAUTIA', 'Seguradora'], 4: ['CAUTIA', 'Seguradora'] }

export function HowItWorks() {
  const [i, setI] = useState(0)
  const st = STEPS[i]
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setI(v => Math.min(4, v + 1)) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setI(v => Math.max(0, v - 1)) }
  }
  return (
    <section id="como-funciona" className="bg-cream py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div><Reveal><Eyebrow n="02" className="text-blue">Como funciona</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="mt-6 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-ink">Cinco etapas, da entrada <span className="text-blue">à apólice emitida.</span></h2></Reveal></div>
          <Reveal delay={0.1}><p className="max-w-md text-[17px] leading-relaxed text-ink/75 lg:justify-self-end">Uma corretora especializada: a receita vem da comissão, e a renovação e o monitoramento anuais mantêm a relação. Clique nas etapas ou use as setas do teclado.</p></Reveal>
        </div>

        <div role="tablist" aria-label="Etapas do modelo CAUTIA" onKeyDown={onKey} className="hair relative mt-16 grid grid-cols-5 border-t">
          <motion.span aria-hidden className="absolute -top-px left-0 h-[3px] bg-blue" animate={{ width: `${((i + 1) / 5) * 100}%` }} transition={{ duration: 0.6, ease }} />
          {STEPS.map((s, k) => {
            const on = k === i
            return (
              <button key={s.id} role="tab" id={`step-${s.id}`} aria-selected={on} aria-controls="step-panel" tabIndex={on ? 0 : -1} onClick={() => setI(k)} className="group relative px-1 pb-6 pt-5 text-left sm:px-4">
                <span className={`font-display text-[clamp(2rem,5vw,4.5rem)] leading-none transition-colors duration-300 ${on ? 'text-blue' : k < i ? 'text-ink/70' : 'text-ink/30 group-hover:text-ink/70'}`}>{s.n}</span>
                <span className={`eyebrow mt-3 block text-[10px] transition-colors sm:text-[12px] ${on ? 'text-blue' : 'text-ink/70'}`}>{s.title}</span>
              </button>
            )
          })}
        </div>

        <div id="step-panel" role="tabpanel" aria-labelledby={`step-${st.id}`} className="hair grid gap-10 border-b py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div key={st.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
              <p className="eyebrow text-blue">Etapa {st.n} de 5 · {st.line}</p>
              <h3 className="mt-4 text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.05]">{st.title}</h3>
              <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-ink/80">{st.what}</p>
              <dl className="hair mt-8 grid max-w-xl gap-6 border-t pt-6 sm:grid-cols-2">
                <div><dt className="eyebrow text-ink/70">Você</dt><dd className="mt-2 text-[15px] leading-snug">{st.you}</dd></div>
                <div><dt className="eyebrow text-ink/70">CAUTIA</dt><dd className="mt-2 text-[15px] leading-snug">{st.us}</dd></div>
              </dl>
            </motion.div>
          </AnimatePresence>

          <div aria-label="Quem participa desta etapa (ilustrativo)" role="group">
            <p className="eyebrow text-ink/70">Quem participa · ilustrativo</p>
            <div className="mt-6 grid grid-cols-3 items-center">
              {(['Empresa', 'CAUTIA', 'Seguradora'] as const).map((who, k) => {
                const on = WHO[i].includes(who)
                return (
                  <div key={who} className="relative flex flex-col items-center">
                    {k > 0 && <span aria-hidden className="absolute right-1/2 top-7 h-px w-full bg-blue/25"><motion.span className="block h-full origin-left bg-blue" animate={{ scaleX: WHO[i].includes(who) && WHO[i].includes((['Empresa', 'CAUTIA', 'Seguradora'] as const)[k - 1]) ? 1 : 0 }} transition={{ duration: 0.5, ease }} /></span>}
                    <motion.div layout transition={spring} className={`relative grid size-14 place-items-center rounded-[22%] border-2 transition-colors duration-300 ${on ? 'border-blue bg-blue' : 'border-blue/25 bg-transparent'}`}>
                      {who === 'CAUTIA' ? <Logo variant="mark" tone={on ? 'light' : 'color'} height={on ? 30 : 30} className={on ? 'hidden' : 'opacity-40'} /> : null}
                      {who === 'CAUTIA' && on && <span className="font-display text-2xl text-cream">C</span>}
                      {who !== 'CAUTIA' && <span className={`font-display text-2xl ${on ? 'text-cream' : 'text-blue/40'}`}>{who[0]}</span>}
                    </motion.div>
                    <span className={`eyebrow mt-3 text-[11px] transition-colors ${on ? 'text-blue' : 'text-ink/65'}`}>{who}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-10 flex items-center gap-3">
              <Button variant="outline" className="text-blue" disabled={i === 0} onClick={() => setI(i - 1)}>Anterior</Button>
              <Button disabled={i === 4} arrow onClick={() => setI(i + 1)}>Próxima etapa</Button>
            </div>
            <p className="mt-6 text-[13px] text-ink/65">Renovação e monitoramento anual · receita recorrente. Descrições conforme o modelo de negócio da apresentação; o detalhamento operacional é ilustrativo.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
