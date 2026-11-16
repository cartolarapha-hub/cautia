import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { PERSONAS } from '../data/content'
import { useStore } from '../lib/store'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { Stipple } from '../components/art/Stipple'
import { EmpresaArt, SeguradoraArt } from '../components/art/SolutionArt'
import { ease } from '../lib/motion'

type K = keyof typeof PERSONAS
const LILAC = [{ x: 0.9, y: 0.1, r: 0.35, color: '#b8a0e4' }, { x: 0.1, y: 0.95, r: 0.3, color: '#e48db6' }]
const WARM2 = [{ x: 0.85, y: 0.08, r: 0.3, color: '#f08a5d' }, { x: 0.15, y: 1, r: 0.3, color: '#fff35c' }]

export function Solutions() {
  const { set, setDrawer } = useStore()
  const [k, setK] = useState<K>('empresas')
  return (
    <section id="solucoes" className="bg-paper py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="grid gap-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-12">
          <div className="lg:col-span-7"><Reveal><Eyebrow n="03" className="text-blue">Soluções</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="mt-6 text-[clamp(2.5rem,5.2vw,4.8rem)] leading-[1] text-ink">Dois lados do mesmo risco. <em>Uma ponte entre eles.</em></h2></Reveal></div>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end"><p className="text-[17px] leading-relaxed text-ink/80">A CAUTIA conecta quem usa IA às seguradoras que cobrem o risco. Escolha o lado que é o seu.</p></Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-4 lg:h-[660px] lg:flex-row">
          {(Object.keys(PERSONAS) as K[]).map(id => {
            const p = PERSONAS[id], on = k === id, emp = id === 'empresas'
            return (
              <motion.article key={id} layout transition={{ duration: 0.7, ease }} style={{ flexGrow: on ? 2.1 : 1 }}
                className={`relative isolate flex min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-panel)] ${emp ? 'bg-sand text-ink' : 'on-dark bg-blue text-cream'}`}>
                <Stipple blobs={emp ? LILAC : WARM2} dots={on ? 7000 : 3500} seed={emp ? 3 : 9} className="opacity-70" />
                <button type="button" aria-expanded={on} aria-controls={`sol-${id}`} onClick={() => setK(id)} className="relative flex w-full items-start justify-between gap-4 p-7 text-left sm:p-9">
                  <span>
                    <span className="eyebrow block">Jornada {emp ? '01' : '02'}</span>
                    <span className="mt-3 block font-display text-[clamp(2rem,3.2vw,3rem)] leading-[1.02]">{emp ? <>Empresas que <em>utilizam ou desenvolvem</em> IA</> : <em className="not-italic"><span className="italic">Seguradoras</span></em>}</span>
                  </span>
                  <span aria-hidden className={`mt-2 grid size-10 shrink-0 place-items-center rounded-full border text-xl transition-transform duration-500 ${on ? 'rotate-45 border-current' : 'border-current/50'}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`sol-${id}`} key="body" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.55, ease }} className="relative flex flex-1 flex-col overflow-hidden">
                      <div className="grid flex-1 gap-8 px-7 pb-4 sm:px-9 xl:grid-cols-[1fr_auto] xl:items-end">
                        <div>
                          <div className="flex items-center gap-4 border-t border-current/25 pt-5">
                            <span aria-hidden className={`grid size-12 place-items-center rounded-[22%] font-display text-xl ${emp ? 'bg-blue text-cream' : 'bg-cream text-blue'}`}>{p.persona === 'A Seguradora' ? 'S' : p.persona[0]}</span>
                            <p><span className="block font-semibold">{p.persona}</span><span className="block text-sm opacity-85">{p.role}</span></p>
                          </div>
                          <p className="eyebrow mt-6 opacity-85">Dores</p>
                          <ol className="mt-3 space-y-3.5">
                            {p.pains.map((d, n) => (
                              <motion.li key={d} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + n * 0.08, duration: 0.5, ease }} className="flex gap-4 text-[16.5px] leading-snug">
                                <span className="tabular font-display text-2xl leading-none opacity-80">0{n + 1}</span><span>{d}</span>
                              </motion.li>
                            ))}
                          </ol>
                        </div>
                        <div className="hidden xl:block">{emp ? <EmpresaArt /> : <SeguradoraArt />}</div>
                      </div>
                      <div className="relative p-7 pt-3 sm:p-9 sm:pt-3">
                        <p className="mb-5 max-w-lg text-[15.5px] leading-relaxed opacity-90">{p.promise}</p>
                        <Button variant={emp ? 'primary' : 'accent'} arrow onClick={() => { set({ profile: p.profile }); setDrawer(true) }}>Começar como {emp ? 'empresa' : 'seguradora'}</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!on && (
                  <div aria-hidden className="relative mt-auto p-7 pt-0 sm:p-9 sm:pt-0">
                    <p className="border-t border-current/25 pt-5 text-[15px] leading-snug opacity-90"><strong className="block">{p.persona}</strong>{p.role}</p>
                    <button type="button" tabIndex={-1} onClick={() => setK(id)} className="mt-4 text-sm font-semibold underline underline-offset-4">Ver dores e jornada +</button>
                  </div>
                )}
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
