import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { PERSONAS } from '../data/content'
import { useStore } from '../lib/store'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { IconEmpresa, IconSeguradora } from '../components/ui/Icons'
import { ease } from '../lib/motion'

type K = keyof typeof PERSONAS
const THEME: Record<K, { box: string; muted: string; hair: string }> = {
  empresas: { box: 'bg-sand text-ink', muted: 'text-ink/70', hair: 'border-blue/25' },
  seguradoras: { box: 'on-dark bg-blue text-cream', muted: 'text-cream/85', hair: 'border-cream/25' },
}

export function Solutions() {
  const { set, setDrawer } = useStore()
  const [k, setK] = useState<K>('empresas')
  return (
    <section id="solucoes" className="bg-paper py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <Reveal><Eyebrow n="03" className="text-blue">Soluções</Eyebrow></Reveal>
        <Reveal delay={0.05}><h2 className="mt-6 max-w-4xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-ink">Dois lados do mesmo risco. <span className="text-blue">Uma ponte entre eles.</span></h2></Reveal>

        <div className="mt-14 flex flex-col gap-4 lg:h-[640px] lg:flex-row">
          {(Object.keys(PERSONAS) as K[]).map(id => {
            const p = PERSONAS[id], on = k === id, th = THEME[id], Icon = id === 'empresas' ? IconEmpresa : IconSeguradora
            return (
              <motion.article key={id} layout transition={{ duration: 0.7, ease }} style={{ flexGrow: on ? 2.2 : 1 }}
                className={`relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-panel)] ${th.box}`}>
                <button type="button" aria-expanded={on} aria-controls={`sol-${id}`} onClick={() => setK(id)} className="flex w-full items-start justify-between gap-4 p-7 text-left sm:p-9">
                  <span>
                    <span className="eyebrow block opacity-90">Jornada {id === 'empresas' ? '01' : '02'}</span>
                    <span className="mt-3 block font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08]">{p.title}</span>
                  </span>
                  <span className={`mt-1 shrink-0 transition-opacity ${on ? 'opacity-100' : 'opacity-70'}`}><Icon size={44} /></span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`sol-${id}`} key="body" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5, ease }} className="flex flex-1 flex-col overflow-hidden">
                      <div className={`mx-7 flex items-center gap-4 border-t pt-6 sm:mx-9 ${th.hair}`}>
                        <span aria-hidden className={`grid size-12 place-items-center rounded-[22%] font-display text-xl ${id === 'empresas' ? 'bg-blue text-cream' : 'bg-cream text-blue'}`}>{p.persona === 'A Seguradora' ? 'S' : p.persona[0]}</span>
                        <p><span className="block font-semibold">{p.persona}</span><span className={`block text-sm ${th.muted}`}>{p.role}</span></p>
                      </div>
                      <div className="flex-1 px-7 pb-2 pt-6 sm:px-9">
                        <p className="eyebrow opacity-90">Dores</p>
                        <ol className="mt-4 space-y-4">
                          {p.pains.map((d, n) => (
                            <motion.li key={d} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + n * 0.08, duration: 0.5, ease }} className="flex gap-4 text-[17px] leading-snug">
                              <span className="tabular font-display text-2xl opacity-60">0{n + 1}</span><span className="pt-0.5">{d}</span>
                            </motion.li>
                          ))}
                        </ol>
                      </div>
                      <div className="p-7 pt-5 sm:p-9 sm:pt-5">
                        <p className={`mb-5 max-w-lg text-[15px] leading-relaxed ${th.muted}`}>{p.promise}</p>
                        <Button variant={id === 'empresas' ? 'primary' : 'accent'} arrow onClick={() => { set({ profile: p.profile }); setDrawer(true) }}>Começar como {id === 'empresas' ? 'empresa' : 'seguradora'}</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!on && (
                  <div aria-hidden className="mt-auto p-7 pt-0 sm:p-9 sm:pt-0">
                    <p className={`border-t pt-5 text-[15px] leading-snug ${th.hair} ${th.muted}`}><strong className="block text-[15px]">{p.persona}</strong>{p.role}</p>
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
