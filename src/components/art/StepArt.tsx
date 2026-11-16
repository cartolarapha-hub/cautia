import { motion } from 'motion/react'
import { Logo } from '../ui/Logo'
import { ease } from '../../lib/motion'

/** Ilustrações de interface em miniatura, uma por etapa. Só usam termos do modelo da apresentação. */
const card = 'rounded-[14px] border border-blue/20 bg-white p-4 shadow-[0_18px_40px_-24px_rgba(15,34,68,.45)]'
const line = (w: string, c = 'bg-ink/12') => <span className={`block h-2 rounded-full ${c}`} style={{ width: w }} />
const chip = 'rounded-full px-3 py-1 text-[11px] font-semibold'

function Entrada() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className={`${card} w-[min(300px,100%)]`}>
        <p className="eyebrow text-[10px] text-blue">Entrada · perfil</p>
        <div className="mt-4 flex gap-2">
          <motion.span initial={{ backgroundColor: '#fff', color: '#1e4f9a' }} animate={{ backgroundColor: '#1e4f9a', color: '#f4f1ea' }} transition={{ delay: 0.5, duration: 0.4 }} className={`${chip} border border-blue/30`}>Usa IA</motion.span>
          <span className={`${chip} border border-blue/30 text-blue`}>Vende IA</span>
        </div>
        <div className="mt-5 space-y-2">{line('78%')}{line('56%')}</div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.8, ease }} className="mt-5 h-9 origin-left rounded-[10px] bg-blue" />
      </div>
    </div>
  )
}
function Diagnostico() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className={`${card} relative w-[min(320px,100%)] overflow-hidden`}>
        <p className="eyebrow text-[10px] text-blue">Raio-X das apólices</p>
        <div className="mt-4 space-y-3">
          {line('90%')}{line('70%')}
          <div className="relative -mx-2 rounded-md px-2 py-1.5">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute inset-0 rounded-md bg-sun" />
            <span className="relative block text-[11.5px] font-semibold text-blue">Exclusão: sistemas de IA</span>
          </div>
          {line('84%')}{line('52%')}
        </div>
        <motion.span aria-hidden initial={{ top: '12%' }} animate={{ top: '92%' }} transition={{ duration: 1.5, ease: 'easeInOut' }} className="absolute inset-x-0 h-px bg-blue shadow-[0_0_18px_4px_rgba(30,79,154,.45)]" />
        <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className={`${chip} mt-4 inline-block bg-ink text-cream`}>Risco de IA identificado</motion.span>
      </div>
    </div>
  )
}
function Estruturacao() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className={`${card} w-[min(320px,100%)]`}>
        <p className="eyebrow text-[10px] text-blue">Estruturação</p>
        <div className="mt-4 space-y-3">
          {line('86%')}
          <div className="relative text-[11.5px] font-semibold text-ink/80">Exclusão: sistemas de IA
            <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.5, ease }} className="absolute left-0 top-1/2 h-[2px] w-[170px] origin-left bg-ink" />
          </div>
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.5, ease }} className="rounded-md bg-sun px-2 py-1.5 text-[11.5px] font-semibold text-blue">+ Endosso de IA</motion.div>
          {line('70%')}
        </div>
      </div>
    </div>
  )
}
function Colocacao() {
  return (
    <div className="relative grid h-full place-items-center p-6">
      <svg viewBox="0 0 320 200" className="w-[min(360px,100%)]" fill="none" aria-hidden>
        <path d="M70 100 H140 M180 100 H250" stroke="#1e4f9a" strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="4 5" />
        <motion.circle r="4.5" fill="#1e4f9a" initial={{ cx: 70, cy: 100 }} animate={{ cx: [70, 250], cy: 100 }} transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }} />
        <rect x="14" y="70" width="64" height="60" rx="12" fill="#fff" stroke="#1e4f9a" strokeOpacity=".35" />
        <text x="46" y="96" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e4f9a">PROPOSTA</text><text x="46" y="110" textAnchor="middle" fontSize="8" fill="#0f2244" opacity=".7">com endosso</text>
        <rect x="244" y="62" width="64" height="76" rx="12" fill="#1e4f9a" />
        <text x="276" y="96" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f4f1ea">SEGURADORA</text><text x="276" y="110" textAnchor="middle" fontSize="8" fill="#ffff71">local</text>
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[22%] bg-white p-2 shadow-[0_12px_30px_-12px_rgba(15,34,68,.5)]"><Logo variant="mark" height={44} /></div>
    </div>
  )
}
function Emissao() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className={`${card} relative w-[min(320px,100%)]`}>
        <p className="eyebrow text-[10px] text-blue">Apólice</p>
        <div className="mt-4 space-y-3">{line('88%')}{line('64%')}{line('76%')}</div>
        <motion.div initial={{ opacity: 0, scale: 1.6, rotate: -18 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 18 }} className="absolute bottom-4 right-4 rounded-md border-2 border-blue px-3 py-1 text-[12px] font-bold uppercase tracking-widest text-blue">Emitida</motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-6 flex items-center gap-2 text-[11px] font-semibold text-ink/80"><span aria-hidden className="inline-block size-3 rounded-full border-2 border-blue border-t-transparent animate-spin" />Renovação e monitoramento anual</motion.p>
      </div>
    </div>
  )
}
export const STEP_ART = [Entrada, Diagnostico, Estruturacao, Colocacao, Emissao]
