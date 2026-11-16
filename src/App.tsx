import { motion } from 'motion/react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Landing } from './pages/Landing'
import { Product } from './pages/Product'
import { Popups } from './popups/Popups'
import { Checkout } from './checkout/Checkout'
import { Overlay, CloseButton } from './components/ui/Overlay'
import { StartPanel } from './components/StartPanel'
import { useStore } from './lib/store'
import { useRoute } from './lib/router'
import { beginCheckout } from './checkout/begin'

export default function App() {
  const store = useStore()
  const route = useRoute()
  const { drawer, setDrawer } = store
  return (
    <>
      <Header />
      <motion.main key={route} id="conteudo" tabIndex={-1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="outline-none">
        {route === 'home' ? <Landing /> : <Product />}
      </motion.main>
      <Footer />
      <Overlay open={drawer} onClose={() => setDrawer(false)} label="Iniciar solicitação" variant="side" className="h-full w-full max-w-[560px] overflow-y-auto bg-cream">
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div><p className="eyebrow text-blue">Solicitação demonstrativa</p><h2 className="mt-3 text-[2.2rem] leading-[1.05]">Monte sua solicitação</h2></div>
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
