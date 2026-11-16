import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { APLICACOES, NEEDS, PROFILES, SETORES, STEPS } from '../data/content'
import { useStore, type Form } from '../lib/store'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { Overlay } from '../components/ui/Overlay'
import { IconAnalise, IconAvaliar, IconCheck, IconConhecer } from '../components/ui/Icons'
import { ChoiceGroup, SelectField, TextField } from './fields'
import { maskPhone, validate, type Errors } from './validation'
import { ease, spring } from '../lib/motion'

const LABELS = ['Identificação', 'Empresa', 'Revisão', 'Confirmação']
const NEED_ICON = { avaliar: IconAvaliar, analise: IconAnalise, conhecer: IconConhecer }

export function Checkout() {
  const { checkout, setCheckout, s, set, setForm, reset } = useStore()
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [dir, setDir] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sumOpen, setSumOpen] = useState(false)
  const head = useRef<HTMLHeadingElement>(null)
  const f = s.form, step = s.step
  const seg = s.profile === 'seguradora'

  useEffect(() => { if (checkout) setTimeout(() => head.current?.focus(), 400) }, [step, checkout])

  const go = (n: number) => { setDir(n > step ? 1 : -1); setErrors({}); setTouched(new Set()); set({ step: n }); document.getElementById('co-scroll')?.scrollTo({ top: 0, behavior: 'smooth' }) }
  const next = () => {
    const e = validate(step, f)
    setErrors(e); setTouched(new Set(Object.keys(e)))
    if (Object.keys(e).length) { setTimeout(() => (document.querySelector('#co-scroll [aria-invalid="true"]') as HTMLElement | null)?.focus(), 60); return }
    if (step === 2) return submit()
    setLoading(true); setTimeout(() => { setLoading(false); go(step + 1) }, 450)
  }
  const submit = () => {
    setLoading(true)
    setTimeout(() => { const ref = 'CAU-DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase(); setLoading(false); set({ ref, checkoutStarted: false }); go(3) }, 1600)
  }
  const field = (k: keyof Form) => ({ error: touched.has(k) ? errors[k] : undefined })
  const upd = (k: keyof Form) => (v: any) => { setForm({ [k]: v } as Partial<Form>); if (errors[k]) { const e = { ...errors }; delete e[k]; setErrors(e) } }
  const blur = (k: keyof Form) => () => { const e = validate(step, { ...f }); setTouched(t => new Set(t).add(k)); setErrors(p => ({ ...p, [k]: e[k] })) }
  const okField = (k: keyof Form) => touched.has(k) && !validate(step, f)[k] && !!f[k]

  const download = () => {
    const txt = `CAUTIA — resumo da solicitação demonstrativa\nReferência: ${s.ref}\n\nNENHUMA CONTRATAÇÃO REAL FOI REALIZADA.\n\nPerfil: ${PROFILES.find(p => p.id === s.profile)?.label}\nNecessidades: ${NEEDS.filter(n => s.needs.includes(n.id)).map(n => n.title).join('; ')}\n\nContato: ${f.nome} · ${f.email} · ${f.telefone}\nEmpresa: ${f.empresa} (${f.cargo})\nSetor: ${f.setor}\nUso de IA: ${f.usoIA}\nAplicações: ${f.aplicacoes.join(', ')}\nDecisões: ${f.decisoes}\nSeguros: ${f.seguros}\nObservações: ${f.notas || '—'}\n`
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); a.download = `cautia-${s.ref}.txt`; a.click(); URL.revokeObjectURL(a.href)
  }
  const close = () => setCheckout(false)
  const editChoices = () => { setCheckout(false); setTimeout(() => document.getElementById('solicitar')?.scrollIntoView({ behavior: 'smooth' }), 250) }
  const needs = NEEDS.filter(n => s.needs.includes(n.id))
  const profile = PROFILES.find(p => p.id === s.profile)

  const SummaryBody = (
    <div>
      <ul className="space-y-4" aria-label="Itens da solicitação">
        {needs.map(n => { const I = NEED_ICON[n.id]; return (
          <li key={n.id} className="flex items-center gap-4">
            <span className="relative grid size-16 shrink-0 place-items-center rounded-[22%] border border-blue/20 bg-paper text-blue"><I size={32} /><span className="tabular absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-blue text-[11px] font-semibold text-cream">1</span></span>
            <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold leading-snug">{n.title}</span><span className="block text-[13px] leading-snug text-ink/65">{n.deliverable}</span></span>
            <span className="text-[13px] font-medium text-ink/70">A definir</span>
          </li>) })}
      </ul>
      <dl className="hair mt-6 space-y-3 border-t pt-5 text-[15px]">
        <div className="flex justify-between"><dt className="text-ink/70">Perfil</dt><dd className="text-right font-medium">{profile?.short}</dd></div>
        {f.nome && step > 0 && <div className="flex justify-between gap-4"><dt className="text-ink/70">Contato</dt><dd className="text-right font-medium">{f.nome.split(' ')[0]}{f.empresa && `, ${f.empresa}`}</dd></div>}
        <div className="flex justify-between"><dt className="text-ink/70">Subtotal</dt><dd className="font-medium">A definir</dd></div>
        <div className="hair flex items-baseline justify-between border-t pt-4"><dt className="font-semibold">Total</dt><dd className="font-display text-[1.6rem] leading-none">A definir</dd></div>
      </dl>
      <p className="mt-4 text-[12.5px] leading-snug text-ink/65">Demonstração: nenhum preço, apólice ou cobertura foi definido, e nada será cobrado.</p>
      {step < 3 && <button type="button" onClick={editChoices} className="mt-4 rounded text-[14px] font-medium text-blue underline underline-offset-4">Alterar perfil ou necessidades</button>}
    </div>
  )

  return (
    <Overlay open={checkout} onClose={close} label="Checkout demonstrativo" variant="full" dismissOnBackdrop={false}>
      <div id="co-scroll" className="h-full overflow-y-auto bg-paper">
        {/* mobile: barra de resumo recolhível, como em lojas profissionais */}
        {step < 3 && (
          <div className="hair border-b bg-sand lg:hidden">
            <button type="button" aria-expanded={sumOpen} onClick={() => setSumOpen(v => !v)} className="mx-auto flex h-14 w-full max-w-xl items-center justify-between px-5 text-[15px]">
              <span className="flex items-center gap-2 font-medium text-blue">Resumo<motion.svg animate={{ rotate: sumOpen ? 180 : 0 }} width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></motion.svg></span>
              <span className="text-ink/70">{s.needs.length} item(ns) · <span className="font-semibold text-ink">A definir</span></span>
            </button>
            <AnimatePresence initial={false}>{sumOpen && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden"><div className="mx-auto max-w-xl px-5 pb-6">{SummaryBody}</div></motion.div>}</AnimatePresence>
          </div>
        )}

        <div className={`grid min-h-full ${step < 3 ? 'lg:grid-cols-[1fr_minmax(400px,.72fr)]' : ''}`}>
          <div className="px-5 pb-16 pt-6 lg:px-12 lg:pt-10">
            <div className={`mx-auto ${step === 3 ? 'max-w-3xl' : 'max-w-[600px] lg:ml-auto lg:mr-0'}`}>
              <header className="flex items-center justify-between">
                <Logo height={34} />
                <button type="button" onClick={close} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-[14px] font-semibold text-blue hover:bg-sand"><span aria-hidden>←</span>{step === 3 ? 'Voltar ao site' : 'Salvar e voltar'}</button>
              </header>
              <p className="mt-3 text-[13px] text-ink/70">Ambiente demonstrativo · nenhuma contratação real</p>

              <nav aria-label="Progresso" className="mt-7">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
                  {LABELS.map((l, i) => {
                    const on = i === step, done = i < step
                    return (
                      <li key={l} aria-current={on ? 'step' : undefined} className="flex items-center gap-2">
                        <button type="button" disabled={!done || step === 3} onClick={() => go(i)} className={`flex min-h-9 items-center gap-1.5 rounded-lg px-1 transition-colors disabled:cursor-default ${on ? 'font-semibold text-ink' : done ? 'text-blue hover:underline' : 'text-ink/70'}`}>
                          <span className={`tabular grid size-5 place-items-center rounded-full text-[11px] font-semibold ${on ? 'bg-blue text-cream' : done ? 'bg-blue/15 text-blue' : 'border border-ink/30'}`}>{done ? <IconCheck size={11} /> : i + 1}</span>{l}
                        </button>
                        {i < 3 && <span aria-hidden className="text-ink/30">›</span>}
                      </li>
                    )
                  })}
                </ol>
                <div aria-hidden className="mt-3 h-[3px] overflow-hidden rounded-full bg-blue/15"><motion.div className="h-full bg-blue" animate={{ width: `${((step + 1) / 4) * 100}%` }} transition={{ duration: 0.6, ease }} /></div>
              </nav>

              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -28 }} transition={{ duration: 0.35, ease }} className="mt-10">
                  {step === 0 && (
                    <Section title="Identificação" sub="Para quem devemos direcionar o retorno?" headRef={head}>
                      <TextField label="Nome completo" value={f.nome} onChange={upd('nome')} onBlur={blur('nome')} autoComplete="name" valid={okField('nome')} {...field('nome')} />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField label="E-mail" type="email" inputMode="email" value={f.email} onChange={upd('email')} onBlur={blur('email')} autoComplete="email" placeholder="nome@empresa.com.br" valid={okField('email')} {...field('email')} />
                        <TextField label="Telefone" type="tel" inputMode="tel" value={f.telefone} onChange={v => upd('telefone')(maskPhone(v))} onBlur={blur('telefone')} autoComplete="tel" placeholder="(11) 91234-5678" valid={okField('telefone')} {...field('telefone')} />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField label="Empresa" value={f.empresa} onChange={upd('empresa')} onBlur={blur('empresa')} autoComplete="organization" valid={okField('empresa')} {...field('empresa')} />
                        <TextField label="Cargo" value={f.cargo} onChange={upd('cargo')} onBlur={blur('cargo')} autoComplete="organization-title" valid={okField('cargo')} {...field('cargo')} />
                      </div>
                    </Section>
                  )}
                  {step === 1 && (
                    <Section title="Informações empresariais" sub={seg ? 'Como o risco de IA aparece na sua operação?' : 'Como a sua empresa utiliza ou desenvolve IA?'} headRef={head}>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <SelectField label="Setor" value={f.setor} onChange={upd('setor')} options={SETORES} {...field('setor')} />
                        <SelectField label={seg ? 'Relação com o risco de IA' : 'Relação com a IA'} value={f.usoIA} onChange={upd('usoIA')} {...field('usoIA')}
                          options={seg ? ['Exposição já existente na carteira', 'Avaliando subscrever risco de IA', 'Distribuição de um novo perfil de cliente'] : ['Uso ferramentas prontas de terceiros', 'Desenvolvo ou integro modelos', 'Vendo produtos com IA a clientes', 'Estou avaliando adotar']} />
                      </div>
                      <ChoiceGroup legend="Onde a IA é aplicada? (uma ou mais)" multi options={APLICACOES} value={f.aplicacoes} onChange={upd('aplicacoes')} error={touched.has('aplicacoes') ? errors.aplicacoes : undefined} />
                      <ChoiceGroup legend="A IA participa de decisões relevantes?" options={['Não', 'Sim, com revisão humana', 'Sim, decide sozinha em alguns casos', 'Não sei']} value={f.decisoes} onChange={upd('decisoes')} error={touched.has('decisoes') ? errors.decisoes : undefined} />
                      <ChoiceGroup legend={seg ? 'Sua carteira tem exclusões de IA?' : 'Seguros que a empresa já possui'} options={seg ? ['Sim', 'Não', 'Estamos revisando', 'Não sei'] : ['Nenhum', 'Cyber', 'RC Profissional', 'Cyber e RC Profissional', 'Não sei']} value={f.seguros} onChange={upd('seguros')} error={touched.has('seguros') ? errors.seguros : undefined} />
                      <div>
                        <label htmlFor="notas" className="mb-2 block text-[14px] font-semibold">Alguma preocupação específica? <span className="font-normal text-ink/65">(opcional)</span></label>
                        <textarea id="notas" rows={3} value={f.notas} onChange={e => setForm({ notas: e.target.value })} className="w-full rounded-[var(--radius-ctl)] border border-blue/25 bg-white px-4 py-3.5 text-[16px] outline-none transition-[border-color,box-shadow] hover:border-blue/60 focus:border-blue focus:shadow-[0_0_0_3px_rgba(30,79,154,.2)]" />
                      </div>
                    </Section>
                  )}
                  {step === 2 && (
                    <Section title="Revisão" sub="Confira os dados. Você pode editar qualquer bloco." headRef={head}>
                      <Review title="Contato" onEdit={() => go(0)} rows={[['Nome', f.nome], ['E-mail', f.email], ['Telefone', f.telefone], ['Empresa', `${f.empresa}, ${f.cargo}`]]} />
                      <Review title="Informações empresariais" onEdit={() => go(1)} rows={[['Setor', f.setor], ['Relação com IA', f.usoIA], ['Aplicações', f.aplicacoes.join(', ')], ['Decisões relevantes', f.decisoes], ['Seguros', f.seguros], ['Observações', f.notas || '—']]} />
                      <PaySim />
                      <div>
                        <label className="flex cursor-pointer items-start gap-3.5 rounded-[var(--radius-ctl)] border border-blue/25 bg-white p-4 transition-colors hover:border-blue">
                          <input type="checkbox" checked={f.consent} onChange={e => upd('consent')(e.target.checked)} aria-invalid={!!errors.consent} aria-describedby="consent-e" className="mt-0.5 size-5 shrink-0 accent-[#1e4f9a]" />
                          <span className="text-[14.5px] leading-relaxed">Entendo que esta é uma <strong>demonstração</strong>: nenhum dado é enviado a terceiros, nenhuma contratação é realizada e nenhuma cobertura é oferecida.</span>
                        </label>
                        <AnimatePresence>{errors.consent && <motion.p id="consent-e" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#b3261e' }} className="mt-2 text-[13.5px] font-medium">{errors.consent}</motion.p>}</AnimatePresence>
                      </div>
                    </Section>
                  )}
                  {step === 3 && <Done head={head} refNum={s.ref} name={f.nome} onDownload={download} onNew={() => { reset(); setCheckout(false); scrollTo({ top: 0 }) }} onClose={close} />}
                  {step < 3 && (
                    <div className="mt-12 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {step > 0 ? <Button variant="quiet" className="text-blue" onClick={() => go(step - 1)}>← Voltar</Button> : <Button variant="quiet" className="text-blue" onClick={editChoices}>← Editar escolhas</Button>}
                      <Button size="lg" arrow loading={loading} onClick={next}>{step === 2 ? (loading ? 'Enviando' : 'Enviar solicitação') : loading ? 'Validando' : 'Continuar'}</Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {step < 3 && (
            <aside aria-label="Resumo da solicitação" className="hair hidden border-l bg-sand px-10 pt-24 lg:block">
              <div className="sticky top-24 max-w-[440px]"><h2 className="mb-6 text-[1.7rem] leading-none">Resumo</h2>{SummaryBody}</div>
            </aside>
          )}
        </div>
      </div>
    </Overlay>
  )
}

function Section({ title, sub, children, headRef }: { title: string; sub: string; children: React.ReactNode; headRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className="space-y-7">
      <div><h2 ref={headRef} tabIndex={-1} className="text-[2.4rem] leading-none outline-none">{title}</h2><p className="mt-3 text-[16px] text-ink/70">{sub}</p></div>
      {children}
    </div>
  )
}
function Review({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <section className="rounded-[var(--radius-ctl)] border border-blue/25 bg-white">
      <div className="hair flex items-center justify-between border-b px-5 py-3.5"><h3 className="text-[1.3rem]">{title}</h3><button type="button" onClick={onEdit} className="min-h-9 rounded-lg px-3 text-[14px] font-semibold text-blue underline underline-offset-4 hover:bg-sand">Editar</button></div>
      <dl className="divide-y divide-blue/15 px-5 text-[15px]">{rows.map(([k, v]) => <div key={k} className="grid gap-0.5 py-3 sm:grid-cols-[160px_1fr] sm:gap-4"><dt className="text-ink/65">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
    </section>
  )
}
function PaySim() {
  const { s, set } = useStore()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const run = () => { setBusy(true); setTimeout(() => { setBusy(false); set({ paySim: true }) }, 1400) }
  return (
    <section className="rounded-[var(--radius-ctl)] border border-dashed border-blue/50 bg-paper">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-3 text-left">
        <span><span className="block text-[1.3rem] leading-tight">Pagamento simulado <span className="font-sans text-[13px] text-ink/65">(opcional)</span></span><span className="text-[14px] text-ink/70">Veja como seria a etapa, sem dados reais.</span></span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} aria-hidden className="text-blue">▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
            <div className="px-5 pb-5">
              <div className="on-dark grain relative h-40 max-w-xs overflow-hidden rounded-[var(--radius-ctl)] bg-blue p-5 text-cream" aria-hidden>
                <div className="glow-warm absolute inset-0 -z-10 opacity-60" />
                <Logo variant="mark" tone="light" height={30} />
                <p className="mt-7 font-mono text-lg tracking-[.2em]">•••• •••• •••• ••••</p>
                <p className="eyebrow mt-3 text-[10px] text-cream/80">Cartão de demonstração · ••/••</p>
              </div>
              <p className="mt-4 text-[14px] text-ink/75">Não solicitamos dados de cartão e nenhum pagamento é processado. Valor: a definir.</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button variant={s.paySim ? 'outline' : 'primary'} className={s.paySim ? 'text-blue' : ''} loading={busy} disabled={s.paySim} onClick={run}>{s.paySim ? 'Autorização simulada' : 'Simular autorização'}</Button>
                {s.paySim && <span className="flex items-center gap-1.5 text-[14px] font-semibold text-blue" role="status"><IconCheck size={14} /> Simulação concluída. Nada foi cobrado.</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Done({ head, refNum, name, onDownload, onNew, onClose }: { head: React.RefObject<HTMLHeadingElement | null>; refNum: string | null; name: string; onDownload: () => void; onNew: () => void; onClose: () => void }) {
  const { s } = useStore()
  const needs = NEEDS.filter(n => s.needs.includes(n.id))
  return (
    <div className="pb-6">
      <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={spring} className="grid size-[72px] place-items-center rounded-[22%] bg-blue">
        <svg width="38" height="38" viewBox="0 0 32 32" aria-hidden><motion.path d="M7 16.5l6 6L25 9.5" stroke="#ffff71" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.5, ease }} /></svg>
      </motion.div>
      <p className="eyebrow mt-8 text-blue">Fim da demonstração</p>
      <h2 ref={head} tabIndex={-1} className="mt-3 text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.02] outline-none">Solicitação demonstrativa <span className="text-blue">registrada.</span></h2>
      <p className="mt-4 max-w-xl text-[18px] leading-relaxed text-ink/75">{name.split(' ')[0]}, você percorreu o fluxo completo de solicitação da CAUTIA.</p>

      <div className="relative mt-9 flex max-w-lg overflow-hidden rounded-[var(--radius-panel)] bg-blue text-cream">
        <div className="flex-1 p-6"><p className="eyebrow text-cream/85">Número de referência (demonstrativo)</p><p className="mt-2 font-mono text-[1.7rem] font-semibold tracking-wider text-sun" aria-live="polite">{refNum}</p></div>
        <span aria-hidden className="relative my-3 w-px border-l-2 border-dashed border-cream/40"><i className="absolute -left-[9px] -top-6 size-4 rounded-full bg-paper" /><i className="absolute -bottom-6 -left-[9px] size-4 rounded-full bg-paper" /></span>
        <div className="grid w-24 place-items-center p-3"><Logo variant="mark" tone="light" height={48} /></div>
      </div>

      <div className="hair mt-8 max-w-lg rounded-[var(--radius-ctl)] border bg-white p-6">
        <p className="eyebrow text-blue">Resumo</p>
        <ul className="mt-3 divide-y divide-blue/15">{needs.map(n => <li key={n.id} className="py-3"><p className="font-semibold">{n.title}</p><p className="text-[14px] text-ink/65">{n.deliverable}</p></li>)}</ul>
      </div>

      <div className="mt-9 max-w-lg">
        <p className="eyebrow text-ink/65">Em uma contratação real, o modelo seguiria · ilustrativo</p>
        <ol className="mt-4 space-y-3">{STEPS.slice(1).map((st, i) => <motion.li key={st.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease }} className="flex items-baseline gap-4"><span className="tabular font-display text-2xl text-blue">{st.n}</span><span><span className="font-semibold">{st.title}</span> <span className="text-ink/70">· {st.line}</span></span></motion.li>)}</ol>
      </div>

      <p role="note" className="mt-9 max-w-lg rounded-[var(--radius-ctl)] bg-sun p-4 text-[14.5px] font-medium leading-snug text-blue">Nenhuma contratação real foi realizada. Nenhum dado foi enviado e nenhum pagamento foi processado.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={onDownload}>Baixar resumo (.txt)</Button>
        <Button size="lg" variant="outline" className="text-blue" onClick={onNew}>Nova solicitação</Button>
        <Button size="lg" variant="quiet" className="text-blue" onClick={onClose}>Voltar ao site</Button>
      </div>
    </div>
  )
}
