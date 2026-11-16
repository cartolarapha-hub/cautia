import { brl, DESCONTO, HONORARIO, MODALIDADES, PREMIO_REF, precoFinal, type Modalidade } from '../data/content'
import { useStore } from '../lib/store'
import { go } from '../lib/router'
import { Reveal } from '../components/ui/Reveal'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { IconCheck } from '../components/ui/Icons'

/** Preço claro: quanto custa, quem paga o quê e o que está incluso em cada modalidade. */
export function Offer() {
  const { s, set } = useStore()
  const pick = (m: Modalidade) => { set({ modalidade: m }); go('produto', 'comprar') }
  const rows = [
    { t: 'Honorário do projeto', v: brl(HONORARIO), d: 'Cobrado por você, apenas se contratar a consultoria (opcional).' },
    { t: 'Comissão da CAUTIA', v: 'Paga pela seguradora', d: 'Sem custo direto para você. É como a corretora se sustenta.' },
    { t: 'Prêmio do seguro', v: 'Definido pela seguradora', d: `Para planejar, usamos ${brl(PREMIO_REF)} por ano como referência. É uma premissa, não uma cotação.` },
  ]
  return (
    <section id="preco" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7"><Reveal><Eyebrow n="04" className="text-blue">Preço</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="mt-6 text-[clamp(2.5rem,5.2vw,4.8rem)] leading-[1] text-ink">Quanto custa? <em>Pouca coisa é cobrada de você.</em></h2></Reveal></div>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end"><p className="text-[17px] leading-relaxed text-ink/80">Três valores entram na conta. Só o primeiro é pago diretamente à CAUTIA, e é opcional.</p></Reveal>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:gap-14">
          <dl className="border-t border-blue/25 lg:col-span-5">
            {rows.map((r, i) => (
              <div key={r.t} className="border-b border-blue/25 py-6">
                <dt className="flex items-baseline gap-4"><span className="tabular font-display text-2xl text-blue">0{i + 1}</span><span className="eyebrow text-ink/80">{r.t}</span></dt>
                <dd className="mt-2 pl-10"><span className="block font-display text-[1.9rem] leading-tight text-ink">{r.v}</span><span className="mt-1 block text-[14.5px] leading-snug text-ink/80">{r.d}</span></dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {MODALIDADES.map((m, i) => {
              const dark = i === 0
              return (
                <article key={m.id} className={`flex flex-col rounded-[var(--radius-panel)] p-6 sm:p-7 ${dark ? 'on-dark bg-blue text-cream' : 'border border-blue/25 bg-cream text-ink'}`}>
                  <p className="eyebrow">{i === 0 ? 'Mais completo' : 'Mais simples'}</p>
                  <h3 className="mt-3 text-[1.9rem] leading-tight">{m.title}</h3>
                  <p className="mt-4">{s.desconto && m.price > 0 && <span className="mr-2 text-[1.2rem] line-through opacity-80 tabular">{brl(m.price)}</span>}<span className="font-display text-[2.8rem] leading-none tabular">{m.price ? brl(precoFinal(m.id, s.desconto)) : 'R$ 0'}</span>{s.desconto && m.price > 0 && <span className="ml-2 rounded-full bg-sun px-2.5 py-0.5 align-middle text-[11px] font-bold text-blue">{DESCONTO * 100}% OFF</span>} <span className={`text-[14px] ${dark ? 'text-cream/90' : 'text-ink/75'}`}>{m.unit}</span></p>
                  <p className={`mt-3 text-[14.5px] leading-snug ${dark ? 'text-cream/90' : 'text-ink/80'}`}>{m.desc}</p>
                  <ul className={`mt-5 flex-1 space-y-2.5 border-t pt-5 ${dark ? 'border-cream/25' : 'border-blue/20'}`}>
                    {m.includes.map(t => <li key={t} className="flex items-start gap-2.5 text-[14.5px] leading-snug"><span aria-hidden className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full ${dark ? 'bg-sun text-blue' : 'bg-blue text-cream'}`}><IconCheck size={10} /></span>{t}</li>)}
                  </ul>
                  <Button className="mt-6 w-full" variant={dark ? 'accent' : 'primary'} arrow onClick={() => pick(m.id)}>Escolher {m.title.toLowerCase()}</Button>
                </article>
              )
            })}
          </div>
        </div>
        <p className="mt-6 text-[12.5px] leading-snug text-ink/70">Valores do plano financeiro da CAUTIA (premissas de simulação, não resultados de campo). Demonstração: nenhuma contratação é real.</p>
      </div>
    </section>
  )
}
