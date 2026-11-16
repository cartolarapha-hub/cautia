import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { NEEDS, PROFILES, type Need, type Profile } from '../data/content'
import { useStore } from '../lib/store'
import { Button } from './ui/Button'
import { Summary } from './Summary'
import { Stipple, WARM } from './art/Stipple'
import { IconAnalise, IconAvaliar, IconCheck, IconConhecer, IconEmpresa, IconSeguradora } from './ui/Icons'
import { ease, spring } from '../lib/motion'

const NEED_ICON = { avaliar: IconAvaliar, analise: IconAnalise, conhecer: IconConhecer }
const PROFILE_ICON = { usa: IconEmpresa, desenvolve: IconAvaliar, seguradora: IconSeguradora }
export const SEGUROS = [{ v: '0', l: 'Nenhum' }, { v: '1', l: '1' }, { v: '2', l: '2' }, { v: '3', l: '3 ou mais' }, { v: 'nsei', l: 'Não sei' }]
export const CONTATOS = [{ v: 'email', l: 'E-mail', d: 'Resposta por escrito' }, { v: 'telefone', l: 'Telefone', d: 'Uma ligação rápida' }, { v: 'video', l: 'Videochamada', d: 'Conversa com especialista' }]

/** Passo rotulado: o título ecoa a escolha atual (padrão de seleção guiada). */
function Step({ n, label, value, hint, children }: { n: number; label: string; value?: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-blue/25 pt-5">
      <legend className="float-left w-full">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="tabular font-display text-2xl text-blue">0{n}</span>
          <span className="text-[17px] font-semibold text-ink">{label}</span>
          <AnimatePresence mode="wait"><motion.span key={value ?? 'none'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="font-display text-[1.35rem] italic leading-none text-blue">{value}</motion.span></AnimatePresence>
          {hint && <span className="rounded-md border border-dashed border-blue/50 px-2 py-0.5 text-[12px] font-medium text-blue">{hint}</span>}
        </span>
      </legend>
      <div className="clear-both pt-4">{children}</div>
    </fieldset>
  )
}

/** Dossiê vivo: o objeto que se monta conforme o usuário escolhe. */
function Dossier() {
  const { s } = useStore()
  const profile = PROFILES.find(p => p.id === s.profile)
  const needs = NEEDS.filter(n => s.needs.includes(n.id))
  const nPol = s.nSeguros === '1' ? 1 : s.nSeguros === '2' ? 2 : s.nSeguros === '3' ? 3 : 0
  const contato = CONTATOS.find(c => c.v === s.contato)
  return (
    <div className="on-dark relative isolate aspect-[4/4.6] overflow-hidden rounded-[var(--radius-panel)] bg-blue text-cream">
      <Stipple blobs={WARM} dots={14000} seed={21} />
      <p className="eyebrow absolute left-6 top-6 text-cream">Dossiê CAUTIA · demonstrativo</p>
      <LayoutGroup>
        <motion.div layout transition={spring} className="absolute inset-x-6 top-[16%] rounded-[16px] bg-paper p-5 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] sm:inset-x-9 sm:p-6">
          <p className="eyebrow text-[10px] text-blue">Perfil</p>
          <AnimatePresence mode="wait"><motion.p key={profile?.id ?? 'x'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }} className="mt-1 font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.05]">{profile ? <em className="text-ink">{profile.label}</em> : <span className="text-ink/60">Escolha seu perfil</span>}</motion.p></AnimatePresence>
          <div className="mt-4 space-y-2 border-t border-ink/15 pt-4">
            <AnimatePresence initial={false}>
              {needs.map((n, i) => { const I = NEED_ICON[n.id]; return (
                <motion.div key={n.id} layout initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, height: 0 }} transition={{ duration: 0.4, ease }} className="flex items-center gap-3 rounded-[10px] bg-sand px-3 py-2.5">
                  <span className="text-blue"><I size={26} /></span><span className="min-w-0 flex-1 text-[13.5px] font-semibold leading-tight">{n.title}</span><span className="tabular text-[11px] font-bold text-blue">0{i + 1}</span>
                </motion.div>) })}
            </AnimatePresence>
            {!needs.length && <p className="rounded-[10px] border border-dashed border-ink/25 px-3 py-3 text-[13px] text-ink/65">Nenhuma necessidade escolhida</p>}
          </div>
        </motion.div>
      </LayoutGroup>
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-3 sm:inset-x-9">
        <div>
          <p className="eyebrow mb-2 text-[10px] text-cream">Seguros hoje</p>
          <div role="img" className="flex h-12 items-end gap-1.5" aria-label={`Seguros: ${s.nSeguros === 'nsei' ? 'não sei' : nPol}`}>
            <AnimatePresence initial={false}>
              {Array.from({ length: nPol }, (_, k) => <motion.span key={k} initial={{ opacity: 0, y: 14, scaleY: 0.6 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ ...spring, delay: k * 0.05 }} className="block h-12 w-8 origin-bottom rounded-[6px] bg-cream"><span className="m-1.5 block h-1 rounded-full bg-blue/30" /><span className="m-1.5 block h-1 rounded-full bg-blue/30" /></motion.span>)}
            </AnimatePresence>
            {nPol === 0 && <span className="grid h-12 w-8 place-items-center rounded-[6px] border-2 border-dashed border-cream/70 text-sm">{s.nSeguros === 'nsei' ? '?' : ''}</span>}
          </div>
        </div>
        <AnimatePresence>{contato && <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="rounded-full bg-sun px-3.5 py-1.5 text-[12px] font-bold text-blue">Contato: {contato.l}</motion.span>}</AnimatePresence>
      </div>
    </div>
  )
}

export function StartPanel({ onContinue, compact = false }: { onContinue: () => void; compact?: boolean }) {
  const { s, set } = useStore()
  const toggle = (id: Need) => set({ needs: s.needs.includes(id) ? s.needs.filter(n => n !== id) : [...s.needs, id] })
  const ready = !!s.profile && s.needs.length > 0
  const profile = PROFILES.find(p => p.id === s.profile)
  const needsLabel = s.needs.length ? `${s.needs.length} escolhida${s.needs.length > 1 ? 's' : ''}` : undefined
  const segLabel = SEGUROS.find(x => x.v === s.nSeguros)?.l

  const selectors = (
    <div className="space-y-8">
      <Step n={1} label="Seu perfil:" value={profile?.short}>
        <div role="radiogroup" aria-label="Seu perfil" className={`grid gap-3 ${compact ? 'grid-cols-3' : 'grid-cols-3'}`}>
          {PROFILES.map(p => {
            const on = s.profile === p.id, Icon = PROFILE_ICON[p.id]
            return (
              <motion.button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => set({ profile: p.id as Profile })} whileTap={{ scale: 0.97 }} transition={spring}
                className={`group overflow-hidden rounded-[var(--radius-ctl)] border-2 bg-paper text-left transition-colors duration-300 ${on ? 'border-ink' : 'border-blue/20 hover:border-blue'}`}>
                <span className={`relative grid aspect-[1.25] place-items-center transition-colors duration-300 ${on ? 'bg-blue text-sun' : 'bg-sand text-blue group-hover:bg-blue/10'}`}>
                  <Icon size={compact ? 34 : 44} />
                  <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring} className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-sun text-blue"><IconCheck size={13} /></motion.span>}</AnimatePresence>
                </span>
                <span className={`block px-2 py-2.5 text-center text-[14px] font-semibold leading-tight transition-colors duration-300 ${on ? 'bg-sun text-blue' : 'text-ink'}`}>{p.short}</span>
              </motion.button>
            )
          })}
        </div>
        <AnimatePresence mode="wait"><motion.p key={profile?.id ?? 'n'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3 min-h-[1.4rem] text-[14px] italic text-ink/75">{profile?.desc ?? 'Escolha o que melhor descreve você.'}</motion.p></AnimatePresence>
      </Step>

      <Step n={2} label="O que você precisa:" value={needsLabel} hint="uma ou mais">
        <div className="space-y-3">
          {NEEDS.map((n, i) => {
            const on = s.needs.includes(n.id), Icon = NEED_ICON[n.id]
            return (
              <motion.button key={n.id} type="button" role="checkbox" aria-checked={on} onClick={() => toggle(n.id)} whileTap={{ scale: 0.99 }} transition={spring}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-[var(--radius-ctl)] border-2 p-3.5 text-left sm:gap-4 sm:p-4 transition-colors duration-300 ${on ? 'border-ink bg-sun/45' : 'border-blue/20 bg-paper hover:border-blue'}`}>
                <span className={`grid size-12 shrink-0 place-items-center rounded-[22%] transition-colors duration-300 sm:size-[60px] ${on ? 'bg-blue text-sun' : 'bg-sand text-blue group-hover:bg-blue group-hover:text-cream'}`}><Icon size={34} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.45rem] leading-tight">{n.title}</span>
                  <span className="mt-0.5 block text-[14px] leading-snug text-ink/75">{n.desc}</span>
                  <AnimatePresence>{on && <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="block overflow-hidden"><span className="eyebrow mt-2 block text-[10px] text-blue">Entrega · {n.deliverable}</span></motion.span>}</AnimatePresence>
                </span>
                <span aria-hidden className="tabular hidden self-start font-display text-xl text-blue/85 sm:block">0{i + 1}</span>
                <span aria-hidden className={`grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300 ${on ? 'border-ink bg-ink text-sun' : 'border-blue/30'}`}><motion.span initial={false} animate={{ scale: on ? 1 : 0 }} transition={spring}><IconCheck size={14} /></motion.span></span>
              </motion.button>
            )
          })}
        </div>
      </Step>

      <Step n={3} label="Quantos seguros sua empresa tem hoje?" value={segLabel}>
        <div role="radiogroup" aria-label="Quantidade de seguros" className="relative flex overflow-hidden rounded-full border-2 border-ink/80 bg-paper p-1">
          {SEGUROS.map(x => {
            const on = s.nSeguros === x.v
            return (
              <button key={x.v} type="button" role="radio" aria-checked={on} onClick={() => set({ nSeguros: x.v })} className="relative min-h-11 flex-1 rounded-full px-2 text-[14px] font-semibold">
                {on && <motion.span layoutId={`seg-pill-${compact ? 'c' : 'f'}`} transition={spring} className="absolute inset-0 rounded-full bg-sun" />}
                <span className={`relative transition-colors ${on ? 'text-blue' : 'text-ink'}`}>{x.l}</span>
              </button>
            )
          })}
        </div>
      </Step>

      <Step n={4} label="Como prefere ser contatado?" value={CONTATOS.find(c => c.v === s.contato)?.l}>
        <div role="radiogroup" aria-label="Preferência de contato" className="grid gap-3 sm:grid-cols-3">
          {CONTATOS.map(c => {
            const on = s.contato === c.v
            return (
              <button key={c.v} type="button" role="radio" aria-checked={on} onClick={() => set({ contato: c.v })} className={`rounded-[var(--radius-ctl)] border-2 p-3.5 text-left transition-colors duration-300 ${on ? 'border-ink bg-ink text-cream' : 'border-blue/20 bg-paper hover:border-blue'}`}>
                <span className="flex items-center justify-between text-[15px] font-semibold">{c.l}<span aria-hidden className={`grid size-5 place-items-center rounded-full border-2 ${on ? 'border-sun bg-sun text-blue' : 'border-blue/30'}`}>{on && <IconCheck size={11} />}</span></span>
                <span className={`mt-0.5 block text-[13px] ${on ? 'text-cream/85' : 'text-ink/70'}`}>{c.d}</span>
              </button>
            )
          })}
        </div>
      </Step>
    </div>
  )

  const bar = (
    <div className={`sticky bottom-3 z-10 mt-8 rounded-[var(--radius-ctl)] bg-ink p-3.5 text-cream sm:rounded-[var(--radius-panel)] shadow-[0_20px_50px_-20px_rgba(15,34,68,.7)] sm:p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="min-w-0" role="status">
          <p className="truncate text-[15px] font-semibold">{ready ? `${profile?.short} · ${s.needs.length} necessidade${s.needs.length > 1 ? 's' : ''}` : 'Escolha um perfil e ao menos uma necessidade'}</p>
          <p className="mt-0.5 hidden text-[13px] text-cream/80 sm:block">{ready ? 'Valor: a definir. Nada é contratado nesta demonstração.' : 'Os passos 3 e 4 são opcionais.'}</p>
        </div>
        <Button variant="accent" size="lg" arrow disabled={!ready} onClick={onContinue} className="max-sm:h-12 max-sm:w-full">Continuar para o checkout</Button>
      </div>
      <ol aria-label="Etapas da jornada" className="mt-4 hidden gap-1.5 sm:flex">
        {['Escolha', 'Contato', 'Empresa', 'Revisão', 'Fim'].map((t, i) => <li key={t} aria-current={i === 0 ? 'step' : undefined} className="min-w-0 flex-1"><span className={`block h-[3px] rounded-full ${i === 0 ? 'bg-sun' : 'bg-cream/25'}`} /><span className={`mt-1.5 block truncate text-[10px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-sun' : 'text-cream/70'}`}>{t}</span></li>)}
      </ol>
    </div>
  )

  if (compact) return (<div>{selectors}<div className="mt-8"><h3 className="mb-4 font-display text-2xl">Sua solicitação</h3><Summary /></div>{bar}</div>)
  return (
    <div className="grid gap-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5"><div className="lg:sticky lg:top-24"><Dossier /><p className="mt-4 text-[13px] leading-snug text-ink/70">O dossiê se monta conforme você escolhe. Ilustração demonstrativa: nenhum preço, apólice ou cobertura foi definido.</p></div></div>
      <div className="lg:col-span-7">{selectors}{bar}</div>
    </div>
  )
}
