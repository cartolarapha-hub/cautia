import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { Problem } from './sections/Problem'
import { HowItWorks } from './sections/HowItWorks'
import { Solutions } from './sections/Solutions'
import { Diagnostic } from './sections/Diagnostic'
import { StartSection } from './sections/StartSection'
import { Popups } from './popups/Popups'
import { Checkout } from './checkout/Checkout'
import { Overlay, CloseButton } from './components/ui/Overlay'
import { StartPanel } from './components/StartPanel'
import { useStore } from './lib/store'
import { beginCheckout } from './checkout/begin'

export default function App() {
  const store = useStore()
  const { drawer, setDrawer } = store
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero /><Problem /><HowItWorks /><Solutions /><Diagnostic /><StartSection />
      </main>
      <Footer />
      <Overlay open={drawer} onClose={() => setDrawer(false)} label="Iniciar solicitação" variant="side" className="h-full w-full max-w-[560px] overflow-y-auto bg-cream">
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div><p className="eyebrow text-blue">Solicitação demonstrativa</p><h2 className="mt-3 text-[2.2rem] leading-[1.05]">O que você precisa?</h2></div>
            <CloseButton onClick={() => setDrawer(false)} className="-mr-2" />
          </div>
          <StartPanel compact onContinue={() => beginCheckout(store)} />
        </div>
      </Overlay>
      <Checkout />
      <Popups />
    </>
  )
}
