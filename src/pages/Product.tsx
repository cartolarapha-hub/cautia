import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { brl, CUPOM, DESCONTO, HONORARIO, MODALIDADES, PERSONAS, PREMIO_REF, precoFinal, STEPS } from '../data/content'
import { useStore } from '../lib/store'
import { go } from '../lib/router'
import { beginCheckout } from '../checkout/begin'
import { Dossier, StartPanel } from '../components/StartPanel'
import { STEP_ART } from '../components/art/StepArt'
import { Stipple, WARM } from '../components/art/Stipple'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { IconCheck } from '../components/ui/Icons'
import { Faq } from '../sections/Faq'
import { Button } from '../components/ui/Button'
import { ease } from '../lib/motion'

const VIEWS = [
  { id: 'dossie', label: 'Seu dossiê' }, { id: 'raiox', label: 'Raio-X', art: 1 }, { id: 'endosso', label: 'Endosso de IA', art: 2 }, { id: 'apolice', label: 'Apólice', art: 4 },
] as const

function Gallery() {
  const [v, setV] = useState<(typeof VIEWS)[number]['id']>('dossie')
  const cur = VIEWS.find(x => x.id === v)!
  const Art = 'art' in cur ? STEP_ART[cur.art] : null
  return (
    <div>
      <div className="relative isolate aspect-[4/4.6] overflow-hidden rounded-[var(--radius-panel)] bg-sand" aria-live="polite">
        <AnimatePresence mode="wait">
          {Art ? (
            <motion.div key={v} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="absolute inset-0">
              <Stipple blobs={WARM.map(b => ({ ...b, y: b.y - 0.1 }))} dots={9000} seed={6} className="opacity-60" /><Art />
              <p className="eyebrow absolute left-5 top-5 rounded-full bg-ink px-3 py-1 text-[10px] text-cream">{cur.label} · ilustrativo</p>
            </motion.div>
          ) : (
            <motion.div key="dossie" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0"><div className="size-full [&>div]:aspect-auto [&>div]:size-full [&>div]:rounded-none"><Dossier /></div></motion.div>
          )}
        </AnimatePresence>
      </div>
      <div role="group" aria-label="Visualizações do produto" className="mt-3 grid grid-cols-4 gap-2">
        {VIEWS.map(x => (
          <button key={x.id} type="button" aria-pressed={v === x.id} onClick={() => setV(x.id)} className={`min-h-12 rounded-[var(--radius-ctl)] border-2 px-2 py-2 text-[12.5px] font-semibold leading-tight transition-colors ${v === x.id ? 'border-ink bg-sun text-blue' : 'border-blue/20 bg-paper text-ink hover:border-blue'}`}>{x.label}</button>
        ))}
      </div>
    </div>
  )
}

export function Product() {
  const store = useStore()
  const mod = MODALIDADES.find(m => m.id === store.s.modalidade)!
  return (
    <>
      <section id="comprar" className="pt-[68px]">
        <div className="mx-auto max-w-[1320px] px-5 pb-20 pt-6 lg:px-10 lg:pb-28">
          <nav aria-label="Você está em" className="text-[13.5px] text-ink/80"><button type="button" onClick={() => go('home')} className="link-u">Início</button><span aria-hidden className="mx-2">›</span><span aria-current="page" className="font-semibold text-ink">Projeto CAUTIA</span></nav>
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5"><div className="lg:sticky lg:top-24"><Gallery /><p className="mt-4 text-[13px] leading-snug text-ink/75">Ilustrações conceituais. O dossiê se monta conforme você escolhe.</p></div></div>
            <div className="lg:col-span-7">
              <Eyebrow className="text-blue">Projeto CAUTIA</Eyebrow>
              <h1 className="mt-4 text-[clamp(2.3rem,4.6vw,4rem)] leading-[1]">Seguro para o erro da <em>sua IA</em></h1>
              <p className="mt-4 max-w-xl text-[17.5px] leading-relaxed text-ink/85">Diagnosticamos o risco de IA da sua empresa, estruturamos o endosso e colocamos a apólice junto a uma seguradora local.</p>
              <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2 border-y border-blue/25 py-5">
                <AnimatePresence mode="wait"><motion.p key={mod.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>{store.s.desconto && mod.price > 0 && <span className="mr-3 text-[1.4rem] text-ink/70 line-through tabular">{brl(mod.price)}</span>}<span className="font-display text-[3.4rem] leading-none tracking-[-.03em] tabular">{mod.price ? brl(precoFinal(mod.id, store.s.desconto)) : 'R$ 0'}</span> <span className="text-[15px] text-ink/80">{mod.unit}</span>{store.s.desconto && mod.price > 0 && <span className="ml-3 rounded-full bg-sun px-3 py-1 align-middle text-[13px] font-bold text-blue">{DESCONTO * 100}% OFF · plano anual</span>}</motion.p></AnimatePresence>
                <p className="max-w-sm text-[13.5px] leading-snug text-ink/80">A intermediação da apólice não tem custo direto: a seguradora paga a comissão da CAUTIA.</p>
              </div>
              {store.s.desconto && <p className="mt-4 flex flex-wrap items-center gap-3 rounded-[var(--radius-ctl)] bg-sun/50 px-4 py-3 text-[14px] text-blue"><IconCheck size={14} /> Desconto da fase de teste aplicado ({CUPOM}). <button type="button" onClick={() => store.set({ desconto: false })} className="underline underline-offset-4">Remover</button></p>}
              <ul className="mt-5 space-y-2.5">
                {['Diagnóstico técnico do risco de IA e raio-X das apólices', 'Remoção de exclusões e criação do endosso de IA', 'Colocação em seguradora local e emissão da apólice', 'Renovação e monitoramento anual'].map(t => <li key={t} className="flex items-start gap-3 text-[16px] leading-snug"><span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-blue text-cream"><IconCheck size={11} /></span>{t}</li>)}
              </ul>
              <div className="mt-9"><StartPanel selectorsOnly onContinue={() => beginCheckout(store)} /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="incluso" className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
          <Reveal><Eyebrow n="01" className="text-blue">O que inclui</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="mt-6 max-w-3xl text-[clamp(2.3rem,4.6vw,4rem)] leading-[1]">Cinco etapas, e você escolhe <em>quantas contratar.</em></h2></Reveal>
          <div className="mt-12 overflow-x-auto"><table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Etapas e modalidades em que cada etapa está incluída</caption>
            <thead><tr className="border-b-2 border-ink text-[12px] uppercase tracking-[.12em] text-ink/80"><th scope="col" className="py-3 pr-4 font-semibold">Etapa</th><th scope="col" className="py-3 pr-4 font-semibold">O que acontece</th><th scope="col" className="w-28 py-3 text-center font-semibold">Projeto completo</th><th scope="col" className="w-28 py-3 text-center font-semibold">Só intermediação</th></tr></thead>
            <tbody>{STEPS.map((s, i) => (
              <tr key={s.id} className="border-b border-blue/25 align-top">
                <th scope="row" className="py-5 pr-4 font-normal"><span className="tabular font-display text-2xl text-blue">{s.n}</span> <span className="ml-2 font-display text-[1.5rem]">{s.title}</span></th>
                <td className="max-w-md py-5 pr-4 text-[15px] leading-snug text-ink/85"><span className="font-semibold text-ink">{s.line}.</span> {s.what}</td>
                <td className="py-5 text-center"><span role="img" aria-label="Incluída" className="inline-grid size-6 place-items-center rounded-full bg-blue text-cream"><IconCheck size={13} /></span></td>
                <td className="py-5 text-center">{i >= 3 ? <span role="img" aria-label="Incluída" className="inline-grid size-6 place-items-center rounded-full bg-blue text-cream"><IconCheck size={13} /></span> : <span role="img" aria-label="Não incluída" className="text-ink/60">—</span>}</td>
              </tr>))}</tbody>
          </table></div>
          <p className="mt-4 text-[13px] text-ink/75">Descrições conforme o modelo de negócio da CAUTIA. Renovação e monitoramento anual seguem em ambas as modalidades.</p>
        </div>
      </section>

      <section id="para-quem" className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
          <Reveal><Eyebrow n="02" className="text-blue">Para quem é</Eyebrow></Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {(['empresas', 'seguradoras'] as const).map(k => { const p = PERSONAS[k]; return (
              <article key={k} className={`rounded-[var(--radius-panel)] p-7 sm:p-9 ${k === 'empresas' ? 'bg-sand text-ink' : 'on-dark bg-blue text-cream'}`}>
                <h3 className="text-[1.9rem] leading-tight">{p.title}</h3><p className="mt-1 text-sm opacity-90">{p.persona} · {p.role}</p>
                <p className="eyebrow mt-6 opacity-90">Dores que resolvemos</p>
                <ul className="mt-3 space-y-3">{p.pains.map(d => <li key={d} className="flex gap-3 text-[15.5px] leading-snug"><span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />{d}</li>)}</ul>
              </article>) })}
          </div>
        </div>
      </section>

      <section id="preco-detalhe" className="bg-cream py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)] gap-10 px-5 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5"><Reveal><Eyebrow n="03" className="text-blue">Preço e pagamento</Eyebrow></Reveal><Reveal delay={0.05}><h2 className="mt-6 text-[clamp(2.3rem,4.4vw,3.8rem)] leading-[1]">Como a CAUTIA é <em>remunerada.</em></h2></Reveal></div>
          <dl className="border-t border-blue/25 lg:col-span-7">
            {[['Honorário do projeto', brl(HONORARIO), 'Cobrado por você somente se contratar o projeto completo.'], ['Comissão da CAUTIA', 'Paga pela seguradora', 'Sem custo direto para você; já embutida no prêmio.'], ['Prêmio do seguro', 'Definido pela seguradora', `Referência de planejamento: ${brl(PREMIO_REF)} por ano (premissa do plano, não cotação).`]].map(([t, v, d]) => (
              <div key={t} className="grid gap-1 border-b border-blue/25 py-5 sm:grid-cols-[200px_1fr] sm:gap-6"><dt className="eyebrow pt-1.5 text-ink/80">{t}</dt><dd><span className="block font-display text-[1.7rem] leading-tight">{v}</span><span className="mt-1 block text-[14.5px] leading-snug text-ink/80">{d}</span></dd></div>
            ))}
          </dl>
        </div>
      </section>

      <Faq n="04" />

      <section className="bg-paper px-5 pb-24 lg:px-10"><div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6 rounded-[var(--radius-panel)] border border-blue/25 p-7 sm:p-10">
        <div><p className="font-display text-[1.9rem] leading-tight">Pronto para contratar?</p><p className="mt-1 text-[15px] text-ink/80">Nesta demonstração, nada é cobrado.</p></div>
        <Button size="lg" arrow onClick={() => go('produto', 'comprar')}>Voltar às opções</Button>
      </div></section>
    </>
  )
}
