import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PROFILES, type Profile } from '../data/content'
import { canShow, markShown, useStore } from '../lib/store'
import { Button } from '../components/ui/Button'
import { CloseButton, Overlay } from '../components/ui/Overlay'
import { IconAvaliar, IconCheck, IconEmpresa, IconSeguradora } from '../components/ui/Icons'
import { ease, spring } from '../lib/motion'

const PIC = { usa: IconEmpresa, desenvolve: IconAvaliar, seguradora: IconSeguradora }
const panel = 'w-full max-w-[460px] overflow-hidden rounded-t-[28px] bg-cream text-ink sm:rounded-[28px]'
const stagger = (i: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.18 + i * 0.07, duration: 0.5, ease } })

/** Orquestra os pop-ups: um por vez, frequência controlada (24h; continuidade 1h), nunca durante checkout ou painel aberto. */
export function Popups() {
  const { popup, showPopup, closePopup, drawer, checkout, inProgress, s, set, reset, setDrawer, setCheckout } = useStore()
  const busy = !!popup || drawer || checkout

  useEffect(() => {
    if (!inProgress || busy || !canShow('continue', 1)) return
    const t = setTimeout(() => { markShown('continue'); showPopup({ kind: 'continue' }) }, 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!canShow('discovery')) return
    let fired = false
    const go = () => { if (fired) return; fired = true; markShown('discovery'); showPopup({ kind: 'discovery' }) }
    const wait = () => { const id = setInterval(() => { if (!document.querySelector('[role="dialog"]')) { clearInterval(id); go() } }, 1500) }
    const t = setTimeout(wait, 3000)
    const onScroll = () => { if (scrollY / (document.body.scrollHeight - innerHeight) > 0.35) { removeEventListener('scroll', onScroll); wait() } }
    addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); removeEventListener('scroll', onScroll) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const kind = popup?.kind
  const steps = s.checkoutStarted && s.step < 3 ? { n: s.step, of: 4, where: `checkout, etapa ${s.step + 1} de 4` } : { n: s.diag.step, of: 5, where: `diagnóstico, pergunta ${s.diag.step + 1}` }
  return (
    <>
      <Overlay open={kind === 'discovery'} onClose={closePopup} label="Conheça os riscos de IA" className={panel}><Discovery onClose={closePopup} /></Overlay>
      <Overlay open={kind === 'profile'} onClose={closePopup} label="Escolha seu perfil" className={panel}>
        <ProfilePick onClose={closePopup} onPick={p => { set({ profile: p }); showPopup({ kind: 'confirm', title: 'Perfil definido', message: `Vamos considerar: ${PROFILES.find(x => x.id === p)!.label}.` }) }} />
      </Overlay>
      <Overlay open={kind === 'continue'} onClose={closePopup} label="Retomar jornada" className={panel}>
        <div className="p-7 sm:p-8">
          <div className="flex items-start justify-between"><p className="eyebrow text-blue">Continuar de onde parou</p><CloseButton onClick={closePopup} className="-mr-3 -mt-3" /></div>
          <div className="mt-5 flex items-center gap-5">
            <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden className="shrink-0 -rotate-90">
              <circle cx="38" cy="38" r="32" fill="none" stroke="rgba(30,79,154,.15)" strokeWidth="6" />
              <motion.circle cx="38" cy="38" r="32" fill="none" stroke="#1e4f9a" strokeWidth="6" strokeLinecap="round" strokeDasharray={201} initial={{ strokeDashoffset: 201 }} animate={{ strokeDashoffset: 201 * (1 - Math.max(0.08, (steps.n + 1) / (steps.of + 1))) }} transition={{ duration: 1, delay: 0.25, ease }} />
            </svg>
            <h2 className="text-[1.75rem] leading-[1.1]">Você deixou uma jornada pela metade.</h2>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/75">Seu {steps.where}, com as respostas salvas neste navegador.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button data-autofocus arrow onClick={() => { closePopup(); if (s.checkoutStarted && s.step < 3) setCheckout(true); else document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' }) }}>Retomar</Button>
            <Button variant="outline" className="text-blue" onClick={() => { reset(); closePopup() }}>Começar de novo</Button>
          </div>
        </div>
      </Overlay>
      <Overlay open={kind === 'confirm'} onClose={closePopup} label={popup?.title ?? 'Confirmação'} className={`${panel} max-w-sm`}>
        <Confirm title={popup?.title} message={popup?.message} onClose={closePopup} onNext={() => { closePopup(); setDrawer(true) }} />
      </Overlay>
    </>
  )
}

function Discovery({ onClose }: { onClose: () => void }) {
  const [ans, setAns] = useState<'sim' | 'nao' | null>(null)
  return (
    <div>
      <div className="on-dark grain relative flex h-44 items-center justify-between overflow-hidden bg-blue px-7 text-cream">
        <div aria-hidden className="glow-warm absolute inset-0 -z-10 opacity-60" />
        <p className="eyebrow max-w-[9rem] leading-relaxed text-cream/85">Seguros que cobrem o erro da IA</p>
        <motion.div initial={{ scale: 0.8, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ ...spring, delay: 0.15 }} className="grid size-28 place-items-center rounded-[22%] border-[5px] border-sun">
          <span className="font-display text-[5.5rem] leading-none">0</span>
        </motion.div>
        <CloseButton onClick={onClose} className="absolute right-2 top-2 text-cream" />
      </div>
      <div className="p-7 sm:p-8">
        <motion.h2 {...stagger(0)} className="text-[2rem] leading-[1.08]">Seu seguro cobre o erro da sua IA?</motion.h2>
        <motion.p {...stagger(1)} className="mt-3 text-[15px] leading-relaxed text-ink/75">Segundo a apresentação da CAUTIA, nenhum seguro no Brasil cobre expressamente esse erro. Sua empresa usa IA?</motion.p>
        <motion.div {...stagger(2)} role="group" aria-label="Sua empresa usa IA?" className="mt-5 grid grid-cols-2 gap-2.5">
          {(['sim', 'nao'] as const).map(v => (
            <motion.button key={v} data-autofocus={v === 'sim' || undefined} type="button" aria-pressed={ans === v} onClick={() => setAns(v)} whileTap={{ scale: 0.97 }}
              className={`relative h-14 rounded-[var(--radius-ctl)] border text-[15px] font-semibold transition-colors ${ans === v ? 'border-blue bg-blue text-cream' : 'hair bg-paper hover:border-blue'}`}>
              {v === 'sim' ? 'Sim' : 'Ainda não'}
              <AnimatePresence>{ans === v && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-sun text-blue"><IconCheck size={11} /></motion.span>}</AnimatePresence>
            </motion.button>
          ))}
        </motion.div>
        <AnimatePresence mode="wait">
          {ans ? (
            <motion.div key="a" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
              <p className="pt-5 text-[14.5px] text-ink/80" role="status">{ans === 'sim' ? 'Então vale conhecer os riscos e as lacunas de cobertura.' : 'Ótimo momento para entender o risco antes de adotar.'}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button arrow onClick={() => { onClose(); document.getElementById('problema')?.scrollIntoView({ behavior: 'smooth' }) }}>Conhecer os riscos</Button>
                <Button variant="quiet" className="text-blue" onClick={onClose}>Agora não</Button>
              </div>
            </motion.div>
          ) : <button key="b" type="button" onClick={onClose} className="mt-5 text-sm text-ink/65 underline underline-offset-4 hover:text-blue">Agora não</button>}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProfilePick({ onPick, onClose }: { onPick: (p: Profile) => void; onClose: () => void }) {
  const { s } = useStore()
  const [chosen, setChosen] = useState<Profile | null>(null)
  const choose = (p: Profile) => { setChosen(p); setTimeout(() => onPick(p), 520) }
  return (
    <div className="p-7 sm:p-8">
      <div className="flex items-start justify-between"><p className="eyebrow text-blue">Escolha de perfil</p><CloseButton onClick={onClose} className="-mr-3 -mt-3" /></div>
      <motion.h2 {...stagger(0)} className="mt-3 text-[2rem] leading-[1.08]">Como você se relaciona com a IA?</motion.h2>
      <div className="mt-6 space-y-3">
        {PROFILES.map((p, i) => {
          const on = (chosen ?? s.profile) === p.id, Icon = PIC[p.id]
          return (
            <motion.button key={p.id} {...stagger(i + 1)} data-autofocus={i === 0 || undefined} type="button" onClick={() => choose(p.id)} whileHover={{ x: 3 }} whileTap={{ scale: 0.985 }}
              className={`flex w-full items-center gap-4 rounded-[var(--radius-ctl)] border p-4 text-left transition-colors duration-300 ${on ? 'border-blue bg-blue text-cream' : 'hair bg-paper hover:border-blue'}`}>
              <span className={`grid size-12 shrink-0 place-items-center rounded-[22%] transition-colors ${on ? 'bg-cream text-blue' : 'bg-sand text-blue'}`}><Icon size={28} /></span>
              <span className="min-w-0 flex-1"><span className="block font-semibold leading-tight">{p.label}</span><span className={`mt-0.5 block text-[13px] leading-snug ${on ? 'text-cream/80' : 'text-ink/65'}`}>{p.desc}</span></span>
              <span aria-hidden className={`grid size-6 shrink-0 place-items-center rounded-full ${on ? 'bg-sun text-blue' : 'text-blue'}`}>{on ? <IconCheck size={13} /> : '→'}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function Confirm({ title, message, onClose, onNext }: { title?: string; message?: string; onClose: () => void; onNext: () => void }) {
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (paused) return; const t = setTimeout(onClose, 5000); return () => clearTimeout(t) }, [paused, onClose])
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} className="p-8 text-center" role="status">
      <motion.div initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={spring} className="mx-auto grid size-16 place-items-center rounded-[22%] bg-blue">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden><motion.path d="M7 16.5l6 6L25 9.5" stroke="#ffff71" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.45, ease }} /></svg>
      </motion.div>
      <motion.h2 {...stagger(0)} className="mt-5 text-[1.8rem] leading-tight">{title}</motion.h2>
      <motion.p {...stagger(1)} className="mt-2 text-[15px] leading-relaxed text-ink/75">{message}</motion.p>
      <motion.div {...stagger(2)} className="mt-6 flex flex-wrap justify-center gap-3">
        <Button data-autofocus arrow onClick={onNext}>Iniciar solicitação</Button>
        <Button variant="quiet" className="text-blue" onClick={onClose}>Fechar</Button>
      </motion.div>
      <div aria-hidden className="mt-6 h-0.5 overflow-hidden rounded-full bg-blue/15"><motion.div className="h-full bg-blue" initial={{ width: '100%' }} animate={{ width: paused ? '100%' : 0 }} transition={{ duration: paused ? 0.2 : 5, ease: 'linear' }} /></div>
    </div>
  )
}
