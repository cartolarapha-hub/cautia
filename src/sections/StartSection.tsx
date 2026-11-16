import { StartPanel } from '../components/StartPanel'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { useStore } from '../lib/store'
import { beginCheckout } from '../checkout/begin'

export function StartSection() {
  const store = useStore()
  return (
    <section id="solicitar" className="bg-paper py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <Reveal><Eyebrow n="05" className="text-blue">Solicitação demonstrativa</Eyebrow></Reveal>
        <Reveal delay={0.05}><h2 className="mt-6 max-w-4xl text-[clamp(2.5rem,5.2vw,4.8rem)] leading-[1] text-ink">Comece pela sua necessidade. <em>O resto nós conduzimos.</em></h2></Reveal>
        <div className="mt-14"><StartPanel onContinue={() => beginCheckout(store)} /></div>
      </div>
    </section>
  )
}
