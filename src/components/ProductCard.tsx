import { brl, DESCONTO, HONORARIO, MODALIDADES, precoFinal } from '../data/content'
import { useStore } from '../lib/store'
import { Button } from './ui/Button'
import { Logo } from './ui/Logo'
import { Stipple, WARM } from './art/Stipple'
import { IconCheck } from './ui/Icons'
import { go } from '../lib/router'

/** Cartão do produto (usado no hero da LP e na oferta): o que é, o que inclui e quanto custa, de uma vez. */
export function ProductCard({ className = '' }: { className?: string }) {
  const incl = MODALIDADES[0].includes
  const { s } = useStore()
  return (
    <article className={`overflow-hidden rounded-[var(--radius-panel)] border border-blue/20 bg-paper shadow-[0_40px_80px_-40px_rgba(15,34,68,.45)] ${className}`} aria-label="Projeto CAUTIA">
      <div className="on-dark relative isolate overflow-hidden bg-blue p-6 text-cream sm:p-7">
        <Stipple blobs={WARM.map(b => ({ ...b, w: 0.8 }))} dots={7000} seed={13} className="[mask-image:linear-gradient(to_left,#000,transparent_70%)]" />
        <div className="flex items-start justify-between gap-4">
          <p className="eyebrow text-cream">Projeto CAUTIA</p>
          <Logo variant="mark" tone="light" height={34} />
        </div>
        <h2 className="mt-4 text-[1.9rem] leading-[1.05]">Seguro para o erro da <em>sua IA</em></h2>
        <p className="mt-5 flex items-baseline gap-2">{s.desconto && <span className="text-[1.2rem] text-cream/80 line-through tabular">{brl(HONORARIO)}</span>}<span className="font-display text-[3rem] leading-none tracking-[-.03em] tabular">{brl(precoFinal('projeto', s.desconto))}</span><span className="text-[14px] text-cream/90">por projeto</span>{s.desconto && <span className="rounded-full bg-sun px-2.5 py-0.5 text-[11px] font-bold text-blue">{DESCONTO * 100}% OFF</span>}</p>
      </div>
      <div className="p-6 sm:p-7">
        <p className="eyebrow text-blue">O que está incluso</p>
        <ul className="mt-4 space-y-3">
          {incl.map(t => <li key={t} className="flex items-start gap-3 text-[15px] leading-snug"><span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-blue text-cream"><IconCheck size={11} /></span>{t}</li>)}
        </ul>
        <p className="mt-5 rounded-[var(--radius-ctl)] bg-sand px-4 py-3 text-[13.5px] leading-snug text-ink/85">A intermediação da apólice não tem custo direto: a seguradora paga a comissão da CAUTIA.</p>
        <Button className="mt-5 w-full" size="lg" arrow onClick={() => go('produto')}>Ver detalhes e contratar</Button>
      </div>
    </article>
  )
}
