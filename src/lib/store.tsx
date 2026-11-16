import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Need, Profile } from '../data/content'

export interface Form {
  nome: string; email: string; telefone: string; empresa: string; cargo: string
  setor: string; usoIA: string; aplicacoes: string[]; decisoes: string; seguros: string
  notas: string; consent: boolean
}
export type Answers = Record<string, string | string[]>
export interface Persisted {
  profile: Profile | null
  needs: Need[]
  diag: { answers: Answers; step: number; done: boolean }
  form: Form
  step: number // 0..3 (3 = confirmação)
  ref: string | null
  checkoutStarted: boolean
  paySim: boolean
  nSeguros: string | null
  contato: string | null
}
export type PopupKind = 'discovery' | 'profile' | 'continue' | 'confirm'
export interface PopupState { kind: PopupKind; title?: string; message?: string }

export const emptyForm: Form = {
  nome: '', email: '', telefone: '', empresa: '', cargo: '', setor: '', usoIA: '', aplicacoes: [], decisoes: '', seguros: '', notas: '', consent: false,
}
const initial: Persisted = {
  profile: null, needs: [], diag: { answers: {}, step: 0, done: false }, form: emptyForm, step: 0, ref: null, checkoutStarted: false, paySim: false, nSeguros: null, contato: null,
}
const KEY = 'cautia.state.v1'

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial, ...JSON.parse(raw), form: { ...emptyForm, ...JSON.parse(raw).form } }
  } catch { /* storage indisponível */ }
  return initial
}

interface Ctx {
  s: Persisted
  set: (p: Partial<Persisted>) => void
  setForm: (p: Partial<Form>) => void
  reset: () => void
  // UI
  drawer: boolean; setDrawer: (v: boolean) => void
  checkout: boolean; setCheckout: (v: boolean) => void
  popup: PopupState | null; showPopup: (p: PopupState) => void; closePopup: () => void
  caseId: string; setCaseId: (id: string) => void
  inProgress: boolean
}
const C = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(load)
  const [drawer, setDrawer] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [popup, setPopup] = useState<PopupState | null>(null)
  const [caseId, setCaseId] = useState('tst')

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ } }, [s])

  const set = useCallback((p: Partial<Persisted>) => setS(v => ({ ...v, ...p })), [])
  const setForm = useCallback((p: Partial<Form>) => setS(v => ({ ...v, form: { ...v.form, ...p } })), [])
  const reset = useCallback(() => { setS(initial); try { localStorage.removeItem(KEY) } catch { /* ignore */ } }, [])
  const showPopup = useCallback((p: PopupState) => setPopup(p), [])
  const closePopup = useCallback(() => setPopup(null), [])

  const inProgress = (s.checkoutStarted && s.step < 3) || (Object.keys(s.diag.answers).length > 0 && !s.diag.done)

  const value = useMemo(() => ({ s, set, setForm, reset, drawer, setDrawer, checkout, setCheckout, popup, showPopup, closePopup, caseId, setCaseId, inProgress }),
    [s, set, setForm, reset, drawer, checkout, popup, showPopup, closePopup, caseId, inProgress])
  return <C.Provider value={value}>{children}</C.Provider>
}

export function useStore() {
  const v = useContext(C)
  if (!v) throw new Error('StoreProvider ausente')
  return v
}

/** Frequência controlada: cada pop-up automático aparece no máximo 1x por janela. */
export function canShow(key: string, hours = 24): boolean {
  try { const t = Number(localStorage.getItem('cautia.popup.' + key)); return !t || Date.now() - t > hours * 3600e3 } catch { return true }
}
export function markShown(key: string) { try { localStorage.setItem('cautia.popup.' + key, String(Date.now())) } catch { /* ignore */ } }
export function resetPopups() { try { Object.keys(localStorage).filter(k => k.startsWith('cautia.popup.')).forEach(k => localStorage.removeItem(k)) } catch { /* ignore */ } }
