import { motion } from 'motion/react'
import { Button } from '../components/ui/Button'
import { CountUp } from '../components/ui/CountUp'
import { Eyebrow } from '../components/ui/Eyebrow'
import { ProductCard } from '../components/ProductCard'
import { go } from '../lib/router'
import { ease } from '../lib/motion'

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-[68px]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)] gap-12 px-5 pb-14 pt-10 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="lg:col-span-7 lg:pr-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}><Eyebrow className="text-blue">Corretora de seguros para risco de IA</Eyebrow></motion.div>
          <h1 className="mt-7 text-[clamp(2.9rem,6.4vw,5.9rem)] leading-[.95] text-ink">
            <Line d={0.15}>Sua empresa</Line>
            <Line d={0.25}>usa IA.</Line>
            <Line d={0.4} className="mt-[.22em]"><span className="text-[.72em] leading-none text-ink/80">Quem cobre</span></Line>
            <Line d={0.5}><span className="hl whitespace-nowrap text-[.72em]"><em>o erro dela?</em></span></Line>
          </h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7, ease }} className="mt-8 max-w-[34rem] text-[19px] leading-[1.55] text-ink/85">
            A CAUTIA encontra e estrutura o seguro para empresas que <strong className="font-semibold text-ink">usam ou vendem inteligência artificial</strong>. Não assumimos o risco: nós o colocamos junto a uma seguradora.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.7, ease }} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button size="lg" arrow onClick={() => go('produto')}>Ver o projeto e o preço</Button>
            <button type="button" onClick={() => go('home', 'diagnostico')} className="link-u min-h-11 text-[16px] font-semibold text-blue">Fazer o diagnóstico grátis →</button>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease }} className="lg:col-span-5"><ProductCard /></motion.div>
      </div>

      <div className="border-t border-blue/20">
        <dl className="mx-auto grid max-w-[1320px] divide-y divide-blue/20 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-10">
          <div className="py-8 sm:pr-8">
            <dt className="eyebrow text-blue">Seguros que cobrem o erro da IA no Brasil</dt>
            <dd className="mt-3"><span className="block font-display text-[4.2rem] leading-none text-ink tabular"><CountUp to={0} /></span><span className="mt-2 block text-[13px] text-ink/75">Fonte citada na apresentação: TIC Empresas 2025 (Cetic.br/NIC.br).</span></dd>
          </div>
          <div className="py-8 sm:px-8">
            <dt className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-blue">Grandes empresas que já usam IA <span className="whitespace-nowrap rounded-full bg-sun px-2.5 py-0.5 text-[10px] tracking-wider text-blue">a confirmar</span></dt>
            <dd className="mt-3"><span className="block font-display text-[4.2rem] leading-none text-ink tabular"><CountUp to={50} suffix="%" /></span><span className="mt-2 block text-[13px] text-ink/75">Dado da apresentação. Outro slide cita 37%: valor em validação.</span></dd>
          </div>
          <div className="py-8 sm:pl-8">
            <dt className="eyebrow text-blue">Crescimento do seguro Cyber em 2026</dt>
            <dd className="mt-3"><span className="block font-display text-[4.2rem] leading-none text-ink tabular"><CountUp to={71} prefix="+" suffix="%" /></span><span className="mt-2 block text-[13px] text-ink/75">Fonte: apresentação CAUTIA.</span></dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function Line({ children, d, className = '' }: { children: React.ReactNode; d: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[.1em] ${className}`}>
      <motion.span className="block" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: d, ease }}>{children}</motion.span>
    </span>
  )
}
