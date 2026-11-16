import { motion } from 'motion/react'
import { ease } from '../../lib/motion'

/** Contrato travado: o que falta para fechar com cliente grande (dores da persona Marina). */
export function EmpresaArt() {
  const rows = ['Seguro que cubra o risco de IA', 'Documentação técnica do risco']
  return (
    <div className="w-full max-w-[330px] rounded-[16px] border border-blue/20 bg-white p-5 text-ink shadow-[0_24px_50px_-28px_rgba(15,34,68,.5)]">
      <div className="flex items-center justify-between"><p className="eyebrow text-[10px] text-blue">Contrato · cliente grande</p><span className="rounded-full bg-sun px-2.5 py-0.5 text-[10px] font-bold text-blue">TRAVADO</span></div>
      <ul className="mt-5 space-y-3">
        {rows.map((r, k) => (
          <li key={r} className="flex items-center gap-3 text-[13px] font-medium">
            <motion.span initial={{ background: '#fff', color: '#b3261e' }} whileInView={{ background: '#1e4f9a', color: '#f4f1ea' }} viewport={{ once: false, amount: 0.8 }} transition={{ delay: 1.2 + k * 0.5, duration: 0.4 }} className="grid size-5 shrink-0 place-items-center rounded-full border border-current text-[11px] font-bold">
              <motion.span initial={{ opacity: 1 }} whileInView={{ opacity: 0 }} viewport={{ amount: 0.8 }} transition={{ delay: 1.2 + k * 0.5 }} className="absolute">×</motion.span>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ amount: 0.8 }} transition={{ delay: 1.3 + k * 0.5 }}>✓</motion.span>
            </motion.span>{r}
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-blue/15 pt-3 text-[11.5px] text-ink/70">Com o diagnóstico da CAUTIA, os itens são resolvidos.</p>
    </div>
  )
}

/** Carteira com exposição não precificada (dor das seguradoras). Barras sem números: só forma. */
export function SeguradoraArt() {
  return (
    <div className="w-full max-w-[330px] rounded-[16px] bg-cream p-5 text-ink shadow-[0_24px_50px_-28px_rgba(0,0,0,.6)]">
      <p className="eyebrow text-[10px] text-blue">Carteira atual</p>
      <div className="mt-5 flex h-11 overflow-hidden rounded-[10px]">
        <motion.span initial={{ flexGrow: 0 }} whileInView={{ flexGrow: 5 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="bg-blue" />
        <motion.span initial={{ flexGrow: 0 }} whileInView={{ flexGrow: 3 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15, ease }} className="bg-blue-mid" />
        <motion.span initial={{ flexGrow: 0 }} whileInView={{ flexGrow: 2 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3, ease }} className="bg-[repeating-linear-gradient(135deg,#ffff71_0_5px,#e8e3d7_5px_10px)]" />
      </div>
      <div className="mt-4 flex items-start gap-2 text-[12.5px] font-medium leading-snug"><span aria-hidden className="mt-1 inline-block size-3 shrink-0 bg-[repeating-linear-gradient(135deg,#ffff71_0_3px,#e8e3d7_3px_6px)]" />Exposição a risco de IA não precificada</div>
      <p className="mt-4 border-t border-ink/15 pt-3 text-[11.5px] text-ink/70">Ilustração conceitual, sem valores.</p>
    </div>
  )
}
