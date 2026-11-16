import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { CloseButton, Overlay } from '../ui/Overlay'
import { useStore } from '../../lib/store'
import { ease } from '../../lib/motion'

export const NAV = [
  { id: 'problema', label: 'O problema' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'solucoes', label: 'Soluções' },
  { id: 'diagnostico', label: 'Diagnóstico' },
]

export function Header() {
  const { setDrawer } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('')
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', y => {
    setHidden(y > scrollY.getPrevious()! && y > 600 && !menu)
    setScrolled(y > 12)
  })
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach(n => { const el = document.getElementById(n.id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  const go = (id: string) => { setMenu(false); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150) }

  return (
    <>
      <a href="#conteudo" className="sr-only-focus fixed left-3 top-3 z-[100] rounded-lg bg-sun px-4 py-2 font-semibold text-blue">Ir para o conteúdo</a>
      <motion.header animate={{ y: hidden ? '-100%' : 0 }} transition={{ duration: 0.35, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${scrolled ? 'bg-cream/92 shadow-[0_1px_0_rgba(30,79,154,.18)] backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-5 lg:px-10">
          <a href="#topo" aria-label="CAUTIA, início" className="-ml-1 rounded-lg p-1"><Logo height={34} /></a>
          <nav aria-label="Principal" className="hidden items-center gap-9 md:flex">
            {NAV.map(n => (
              <a key={n.id} href={`#${n.id}`} aria-current={active === n.id} className="link-u inline-flex min-h-11 items-center text-[15px] font-medium text-ink/80 transition-colors hover:text-blue aria-[current=true]:text-blue">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button className="hidden !h-11 sm:inline-flex" onClick={() => setDrawer(true)}>Solicitar análise</Button>
            <button type="button" aria-label="Abrir menu" aria-expanded={menu} onClick={() => setMenu(true)} className="grid size-12 place-items-center rounded-xl md:hidden">
              <span className="space-y-[7px]" aria-hidden><span className="block h-[1.5px] w-6 bg-ink" /><span className="block h-[1.5px] w-6 bg-ink" /></span>
            </button>
          </div>
        </div>
        <motion.div aria-hidden className="h-px origin-left bg-blue" style={{ scaleX: scrollYProgress }} />
      </motion.header>

      <Overlay open={menu} onClose={() => setMenu(false)} label="Menu" variant="side" className="on-dark h-full w-[88vw] max-w-sm bg-blue text-cream">
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between"><Logo tone="light" height={32} /><CloseButton onClick={() => setMenu(false)} label="Fechar menu" /></div>
          <nav aria-label="Menu móvel" className="mt-14 flex flex-col">
            <AnimatePresence>
              {NAV.map((n, i) => (
                <motion.button key={n.id} type="button" onClick={() => go(n.id)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease }}
                  className="hair flex items-baseline gap-4 border-b py-5 text-left font-display text-[2rem] transition-colors hover:text-sun">
                  <span className="eyebrow tabular text-cream/80">0{i + 1}</span>{n.label}
                </motion.button>
              ))}
            </AnimatePresence>
          </nav>
          <Button variant="accent" size="lg" className="mt-auto w-full" arrow onClick={() => { setMenu(false); setDrawer(true) }}>Solicitar análise</Button>
        </div>
      </Overlay>
    </>
  )
}
