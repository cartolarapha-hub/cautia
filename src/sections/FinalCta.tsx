import { Button } from '../components/ui/Button'
import { Stipple, WARM } from '../components/art/Stipple'
import { go } from '../lib/router'
import { brl, HONORARIO } from '../data/content'

export function FinalCta() {
  return (
    <section className="bg-paper px-5 pb-24 lg:px-10 lg:pb-32">
      <div className="on-dark relative isolate mx-auto max-w-[1320px] overflow-hidden rounded-[var(--radius-panel)] bg-blue px-7 py-14 text-cream sm:px-12 sm:py-20">
        <Stipple blobs={WARM} dots={14000} seed={41} className="[mask-image:linear-gradient(to_left,#000,transparent_65%)]" />
        <h2 className="max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[1]">Pronto para ter seguro para o erro da <em>sua IA?</em></h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-cream/90">Projeto completo por {brl(HONORARIO)}, ou somente a intermediação da apólice, sem honorário. Esta é uma demonstração: nada é cobrado.</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="accent" size="lg" arrow onClick={() => go('produto', 'comprar')}>Contratar projeto</Button>
          <button type="button" onClick={() => go('home', 'diagnostico')} className="link-u min-h-11 text-[16px] font-semibold text-cream">Antes, fazer o diagnóstico grátis →</button>
        </div>
      </div>
    </section>
  )
}
