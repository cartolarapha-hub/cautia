import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef } from 'react'
import { APLICACOES, type Need, type Profile } from '../data/content'
import { useStore, type Answers } from '../lib/store'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Eyebrow'
import { IconCheck } from '../components/ui/Icons'
import { ease } from '../lib/motion'

interface Q { id: string; title: string; hint?: string; multi?: boolean; max?: number; options: { v: string; label: string }[] }
const o = (...l: [string, string][]) => l.map(([v, label]) => ({ v, label }))

const CONCERNS: Record<string, { label: string; note: string }> = {
  erro: { label: 'Erro da IA causar prejuízo a terceiros', note: 'Erros de IA já geraram condenação (TST) e devolução de valores (Deloitte). Vale checar se o seguro atual alcança esse tipo de erro.' },
  exclusoes: { label: 'Exclusões de IA nas apólices', note: 'Segundo a apresentação, AIG, WR Berkley e Great American pediram exclusões de IA nos EUA. O raio-X das apólices é o primeiro passo.' },
  docs: { label: 'Documentação técnica exigida', note: 'Seguradoras tradicionais pedem documentação técnica do risco de IA. O diagnóstico ajuda a organizá-la, com referências como ISO/IEC 42001 e NIST AI RMF.' },
  lgpd: { label: 'Dados pessoais e LGPD', note: 'A LGPD já responsabiliza empresas por falhas com dados pessoais, o que dá base legal ao risco tecnológico.' },
  capacidade: { label: 'Capacidade e subscrição', note: 'Faltam subscrição técnica e capacidade para riscos de IA. Estruturar a proposta ajuda na colocação.' },
  regulacao: { label: 'Regulação da IA (PL 2338/2023)', note: 'O marco da IA ainda é projeto, segundo a apresentação. O cenário regulatório pode mudar.' },
}

function build(a: Answers): Q[] {
  const uso = a.uso as string | undefined
  const seg = uso === 'seg'
  const q1: Q = { id: 'uso', title: 'Como a IA aparece no seu negócio?', options: o(['terceiros', 'Uso ferramentas de IA prontas, de terceiros'], ['dev', 'Desenvolvo, integro ou vendo IA'], ['seg', 'Sou seguradora e avalio o risco de IA'], ['nao', 'Ainda não uso IA']) }
  const q2: Q = seg
    ? { id: 'aplicacao', title: 'Onde o risco de IA chega até você?', hint: 'Escolha até 3.', multi: true, max: 3, options: o(['subscricao', 'Subscrição de clientes que usam IA'], ['carteira', 'Exposição já existente na carteira'], ['distribuicao', 'Distribuição para esse novo perfil'], ['sinistros', 'Sinistros ligados a IA']) }
    : { id: 'aplicacao', title: 'Para que a IA é usada?', hint: 'Escolha até 3.', multi: true, max: 3, options: APLICACOES.map(x => ({ v: x, label: x })) }
  const q3: Q = { id: 'decisoes', title: seg ? 'A IA já participa de decisões da sua operação?' : 'A IA participa de decisões relevantes?', options: o(['nenhuma', 'Não: ela só gera material de apoio'], ['apoio', 'Sim, mas uma pessoa revisa antes'], ['sozinha', 'Sim, e ela decide sozinha em alguns casos'], ['nsei', 'Não sei dizer']) }
  const q4: Q = { id: 'seguros', title: seg ? 'Sua carteira já tem exclusões de IA?' : 'Quais seguros a empresa já tem?', options: seg ? o(['sim', 'Sim'], ['nao', 'Não'], ['revisando', 'Estamos revisando'], ['nsei', 'Não sei']) : o(['nenhum', 'Nenhum'], ['cyber', 'Cyber'], ['rc', 'RC Profissional'], ['ambos', 'Cyber e RC Profissional'], ['nsei', 'Não sei']) }
  const q5: Q = { id: 'preocupacoes', title: 'Quais são suas principais preocupações?', hint: 'Escolha até 3.', multi: true, max: 3, options: Object.entries(CONCERNS).map(([v, c]) => ({ v, label: c.label })) }
  if (uso === 'nao') return [q1, q4, q5]
  return [q1, q2, q3, q4, q5]
}

export function Diagnostic() {
  const { s, set, setDrawer, showPopup, setForm } = useStore()
  const { answers, step, done } = s.diag
  const qs = useMemo(() => build(answers), [answers])
  const q = qs[Math.min(step, qs.length - 1)]
  const uso = answers.uso as string | undefined
  const sole = answers.decisoes === 'sozinha'
  const seguros = answers.seguros as string | undefined
  const gap = seguros === 'nenhum' || seguros === 'nsei' || seguros === 'nao'
  const sRef = useRef(s)
  sRef.current = s
  const save = (diag: Partial<typeof s.diag>) => set({ diag: { ...sRef.current.diag, ...diag } })

  const next = () => {
    const d = sRef.current.diag
    const len = build(d.answers).length
    if (d.step + 1 >= len) { save({ done: true }); showPopup({ kind: 'confirm', title: 'Diagnóstico salvo', message: 'Seu resumo ficou guardado neste navegador. Você pode levá-lo ao checkout demonstrativo.' }) }
    else save({ step: d.step + 1 })
  }
  const pick = (v: string) => {
    const cur = answers[q.id]
    if (q.multi) {
      const arr = (cur as string[] | undefined) ?? []
      save({ answers: { ...answers, [q.id]: arr.includes(v) ? arr.filter(x => x !== v) : arr.length >= (q.max ?? 9) ? arr : [...arr, v] } })
    } else {
      save({ answers: q.id === 'uso' && cur !== v ? { uso: v } : { ...answers, [q.id]: v } })
      setTimeout(next, 280)
    }
  }
  const has = q.multi ? ((answers[q.id] as string[] | undefined)?.length ?? 0) > 0 : !!answers[q.id]
  const restart = () => set({ diag: { answers: {}, step: 0, done: false } })
  const label = (qq: Q) => { const a = answers[qq.id]; if (!a) return ''; return (Array.isArray(a) ? a : [a]).map(v => qq.options.find(o => o.v === v)?.label ?? v).join(' · ') }
  const onLetter = (e: React.KeyboardEvent) => {
    const i = e.key.toLowerCase().charCodeAt(0) - 97
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && i >= 0 && i < q.options.length) { e.preventDefault(); pick(q.options[i].v) }
  }
  const toCheckout = () => {
    const profile: Profile = uso === 'dev' ? 'desenvolve' : uso === 'seg' ? 'seguradora' : 'usa'
    const needs: Need[] = [...(uso !== 'nao' ? ['avaliar' as Need] : []), ...(gap ? ['conhecer' as Need] : ['analise' as Need])]
    set({ profile, needs })
    const ap = answers.aplicacao as string[] | undefined
    if (ap && uso !== 'seg') setForm({ aplicacoes: ap.filter(x => APLICACOES.includes(x)) })
    setDrawer(true)
  }
  const chips = [sole && 'IA decide sozinha', seguros && gap && 'Sem cobertura mapeada', ...((answers.preocupacoes as string[]) ?? []).map(c => CONCERNS[c]?.label)].filter(Boolean) as string[]
  const progress = done ? qs.length : step

  return (
    <section id="diagnostico" className="bg-cream py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div><Reveal><Eyebrow n="04" className="text-blue">Diagnóstico interativo</Eyebrow></Reveal>
            <Reveal delay={0.05}><h2 className="mt-6 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-ink">Cinco perguntas. <span className="text-blue">Um primeiro retrato do seu risco.</span></h2></Reveal></div>
          <Reveal delay={0.1}><p className="max-w-md text-[17px] leading-relaxed text-ink/75 lg:justify-self-end">Uma demonstração de como a CAUTIA começa a conversa. O caminho muda conforme as suas respostas. Dica: use as teclas A, B, C para responder.</p></Reveal>
        </div>

        <div className="hair mt-14 grid overflow-hidden rounded-[var(--radius-panel)] border bg-paper lg:grid-cols-[.78fr_1.5fr]">
          <aside aria-label="Seu retrato" className={`on-dark hair relative flex flex-col p-7 transition-colors duration-700 sm:p-9 lg:border-r ${sole ? 'bg-navy' : 'bg-blue'} text-cream`}>
            <div className="flex items-center justify-between"><p className="eyebrow text-sun">Seu retrato</p><p className="eyebrow tabular text-cream/85" aria-live="polite">{progress}/{qs.length}</p></div>
            <div className="mt-4 h-px bg-cream/20" role="progressbar" aria-label="Progresso do diagnóstico" aria-valuemin={0} aria-valuemax={qs.length} aria-valuenow={progress}><motion.div className="h-[3px] -translate-y-px bg-sun" animate={{ width: `${(progress / qs.length) * 100}%` }} transition={{ duration: 0.6, ease }} /></div>
            <ol className="mt-7 flex-1 space-y-1">
              {qs.map((qq, i) => {
                const ans = label(qq), cur = !done && i === step, ok = !!ans && (i < step || done)
                return (
                  <li key={qq.id}>
                    <button type="button" disabled={!ok && !cur} onClick={() => save({ step: i, done: false })} aria-current={cur ? 'step' : undefined}
                      className={`flex w-full items-start gap-4 rounded-xl px-3 py-3 text-left transition-colors ${cur ? 'bg-cream/12' : ok ? 'hover:bg-cream/8' : 'opacity-50'}`}>
                      <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg text-[11px] font-semibold ${ok ? 'bg-sun text-blue' : cur ? 'border border-sun text-sun' : 'border border-cream/40'}`}>{ok ? <IconCheck size={13} /> : i + 1}</span>
                      <span className="min-w-0"><span className="block text-[13.5px] leading-snug text-cream">{qq.title}</span>
                        <AnimatePresence>{ans && <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 block overflow-hidden text-[14px] font-semibold leading-snug">{ans}</motion.span>}</AnimatePresence></span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <AnimatePresence>{sole && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-xl bg-sun p-4 text-[13.5px] font-medium leading-snug text-blue">Ponto de atenção: decisões automatizadas relevantes pedem supervisão e documentação.</motion.p>}</AnimatePresence>
            {Object.keys(answers).length > 0 && <button type="button" onClick={restart} className="mt-5 self-start text-sm underline underline-offset-4 hover:text-sun">Limpar respostas</button>}
          </aside>

          <div className="min-h-[540px] p-7 sm:p-10 lg:p-14">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key={q.id + step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }}>
                  <p className="eyebrow text-blue">Pergunta {step + 1} de {qs.length}</p>
                  <h3 id="dq" className="mt-4 max-w-2xl text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-ink">{q.title}</h3>
                  {q.hint && <p className="mt-2 text-sm text-ink/65">{q.hint}</p>}
                  <div role={q.multi ? 'group' : 'radiogroup'} aria-labelledby="dq" onKeyDown={onLetter} className="hair mt-8 border-t">
                    {q.options.map((op, i) => {
                      const cur = answers[q.id]
                      const on = q.multi ? (cur as string[] | undefined)?.includes(op.v) : cur === op.v
                      return (
                        <motion.button key={op.v} type="button" role={q.multi ? 'checkbox' : 'radio'} aria-checked={!!on} onClick={() => pick(op.v)} whileTap={{ scale: 0.99 }}
                          className={`hair group flex w-full items-center gap-5 border-b px-3 py-[18px] text-left text-[17px] transition-colors sm:px-4 ${on ? 'bg-blue text-cream' : 'hover:bg-sand/60'}`}>
                          <span className={`eyebrow grid size-7 shrink-0 place-items-center rounded-lg border text-[11px] ${on ? 'border-sun bg-sun text-blue' : 'border-blue/30 text-blue'}`}>{on ? <IconCheck size={14} /> : String.fromCharCode(65 + i)}</span>
                          <span className="flex-1 font-medium transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1">{op.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <Button variant="quiet" className="text-blue" disabled={step === 0} onClick={() => save({ step: step - 1 })}>← Voltar</Button>
                    {(q.multi || answers[q.id]) && <Button arrow disabled={!has} onClick={next}>{step + 1 >= qs.length ? 'Ver resumo' : 'Continuar'}</Button>}
                  </div>
                  {uso === 'nao' && step === 0 && <p className="mt-4 text-sm text-ink/65">Sem uso de IA, o caminho é mais curto.</p>}
                </motion.div>
              ) : (
                <motion.div key="resumo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
                  <p className="eyebrow text-blue">Seu resumo personalizado</p>
                  <h3 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-ink">{uso === 'nao' ? 'Você ainda não usa IA, mas a pergunta já vale.' : sole ? 'Sua IA decide sozinha. Vale começar por aí.' : 'Pontos de atenção para a sua conversa com a CAUTIA.'}</h3>
                  <ol className="hair mt-7 border-t">
                    {uso === 'terceiros' && <Point n={1}>Segundo a apresentação, 80% das empresas compram software pronto: cada adoção traz um risco novo para segurar.</Point>}
                    {uso === 'dev' && <Point n={1}>Clientes grandes podem travar o negócio por falta de seguro e de documentação técnica, a dor de uma fundadora de startup de IA na apresentação.</Point>}
                    {uso === 'seg' && <Point n={1}>Riscos de IA podem estar sem precificação na carteira, e falta subscrição técnica especializada para avaliá-los.</Point>}
                    {sole && <Point n={2}>IA decidindo sozinha em casos relevantes é o tipo de situação ilustrada pelos casos Ford e Deloitte.</Point>}
                    {gap && <Point n={3}>A apresentação aponta que nenhum seguro no Brasil cobre expressamente o erro da IA. Sem seguros mapeados, o raio-X das apólices é o passo natural.</Point>}
                    {seguros && !gap && <Point n={3}>Você já tem seguros. O raio-X das apólices mostra se há exclusões de IA escondidas nelas.</Point>}
                    {((answers.preocupacoes as string[]) ?? []).map((c, i) => <Point key={c} n={4 + i} title={CONCERNS[c]?.label}>{CONCERNS[c]?.note}</Point>)}
                  </ol>
                  {chips.length > 0 && <p className="sr-only">Contexto: {chips.join(', ')}</p>}
                  <p className="mt-7 rounded-[var(--radius-ctl)] bg-sun p-4 text-sm leading-relaxed text-blue" role="note"><strong>Importante:</strong> este resumo é uma demonstração e não constitui avaliação técnica definitiva, parecer de risco, nem oferta de cobertura.</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button arrow onClick={toCheckout}>Levar ao checkout demonstrativo</Button>
                    <Button variant="outline" className="text-blue" onClick={restart}>Refazer diagnóstico</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
function Point({ children, title, n }: { children: React.ReactNode; title?: string; n: number }) {
  return <li className="hair flex gap-5 border-b py-5"><span className="tabular font-display text-2xl text-blue">0{n}</span><span className="text-[16px] leading-relaxed text-ink/85">{title && <strong className="block text-ink">{title}</strong>}{children}</span></li>
}
