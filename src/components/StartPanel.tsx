import { AnimatePresence, motion } from 'motion/react'
import { NEEDS, PROFILES, type Need, type Profile } from '../data/content'
import { useStore } from '../lib/store'
import { Button } from './ui/Button'
import { Summary } from './Summary'
import { IconAnalise, IconAvaliar, IconCheck, IconConhecer, IconEmpresa, IconSeguradora } from './ui/Icons'
import { ease, spring } from '../lib/motion'

const NEED_ICON = { avaliar: IconAvaliar, analise: IconAnalise, conhecer: IconConhecer }
const PROFILE_ICON = { usa: IconEmpresa, desenvolve: IconAvaliar, seguradora: IconSeguradora }
const TRAIL = ['Escolha', 'Contato', 'Empresa', 'Revisão', 'Fim']

/** Início da contratação: seleção visual de perfil e necessidade, com resumo vivo e trilha de progresso da jornada. */
export function StartPanel({ onContinue, compact = false }: { onContinue: () => void; compact?: boolean }) {
  const { s, set } = useStore()
  const toggle = (id: Need) => set({ needs: s.needs.includes(id) ? s.needs.filter(n => n !== id) : [...s.needs, id] })
  const ready = !!s.profile && s.needs.length > 0
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)] gap-10 ${compact ? '' : 'lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14'}`}>
      <div className="min-w-0 space-y-10">
        <fieldset className="min-w-0">
          <legend className="eyebrow mb-4 text-blue">Passo 1 · Seu perfil</legend>
          <div role="radiogroup" className={`grid gap-3 ${compact ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
            {PROFILES.map(p => {
              const on = s.profile === p.id, Icon = PROFILE_ICON[p.id]
              return (
                <motion.button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => set({ profile: p.id as Profile })} whileTap={{ scale: 0.98 }} transition={spring}
                  className={`relative flex items-start gap-4 rounded-[var(--radius-ctl)] border p-4 text-left transition-colors duration-300 ${compact ? '' : 'sm:flex-col sm:gap-5'} ${on ? 'border-blue bg-blue text-cream' : 'hair bg-paper hover:border-blue'}`}>
                  <span className={`transition-colors ${on ? 'text-sun' : 'text-blue'}`}><Icon size={34} /></span>
                  <span><span className="block text-[16px] font-semibold leading-tight">{p.short}</span><span className={`mt-1 block text-[13px] leading-snug ${on ? 'text-cream/80' : 'text-ink/65'}`}>{p.desc}</span></span>
                  <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring} className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-sun text-blue"><IconCheck size={13} /></motion.span>}</AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="eyebrow mb-4 text-blue">Passo 2 · O que você precisa <span className="font-medium normal-case tracking-normal text-ink/65">(uma ou mais)</span></legend>
          <div className="space-y-3">
            {NEEDS.map((n, i) => {
              const on = s.needs.includes(n.id), Icon = NEED_ICON[n.id]
              return (
                <motion.button key={n.id} type="button" role="checkbox" aria-checked={on} onClick={() => toggle(n.id)} whileTap={{ scale: 0.99 }} transition={spring}
                  className={`group relative flex w-full items-center gap-5 overflow-hidden rounded-[var(--radius-panel)] border p-5 text-left transition-colors duration-300 sm:p-6 ${on ? 'border-blue bg-blue text-cream' : 'hair bg-paper hover:border-blue'}`}>
                  <span className={`grid size-[68px] shrink-0 place-items-center rounded-[22%] transition-colors duration-300 ${on ? 'bg-cream text-blue' : 'bg-sand text-blue group-hover:bg-blue group-hover:text-cream'}`}><Icon size={38} /></span>
                  <span className="min-w-0 flex-1">
                    <span className={`eyebrow block tabular ${on ? 'text-sun' : 'text-blue'}`}>0{i + 1}</span>
                    <span className="mt-1 block font-display text-[1.55rem] leading-tight">{n.title}</span>
                    <span className={`mt-1 block text-[14.5px] leading-snug ${on ? 'text-cream/80' : 'text-ink/70'}`}>{n.desc}</span>
                  </span>
                  <span aria-hidden className={`grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300 ${on ? 'border-sun bg-sun text-blue' : 'border-blue/30'}`}>
                    <motion.span initial={false} animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={spring}><IconCheck size={16} /></motion.span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </fieldset>
      </div>

      <aside aria-label="Resumo da solicitação" className={`h-fit rounded-[var(--radius-panel)] bg-sand p-6 sm:p-7 ${compact ? '' : 'lg:sticky lg:top-24'}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[1.7rem] leading-none">Sua solicitação</h3>
          <motion.span key={s.needs.length} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring} className="tabular grid size-8 place-items-center rounded-full bg-blue text-sm font-semibold text-cream" aria-label={`${s.needs.length} necessidades`}>{s.needs.length}</motion.span>
        </div>
        <ol aria-label="Etapas da jornada" className="mt-5 flex gap-1.5">
          {TRAIL.map((t, i) => <li key={t} aria-current={i === 0 ? 'step' : undefined} className="min-w-0 flex-1"><span className={`block h-1 rounded-full ${i === 0 ? 'bg-blue' : 'bg-blue/20'}`} /><span className={`mt-1.5 block truncate text-[10px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-blue' : 'text-ink/65'}`}>{t}</span></li>)}
        </ol>
        <div className="mt-6"><Summary /></div>
        <Button className="mt-7 w-full" size="lg" arrow disabled={!ready} onClick={onContinue}>Continuar para o checkout</Button>
        <p className="mt-3 text-center text-[13px] text-ink/70" role="status">{ready ? 'Próximo: identificação. Nada é contratado.' : 'Escolha um perfil e ao menos uma necessidade.'}</p>
      </aside>
    </div>
  )
}
