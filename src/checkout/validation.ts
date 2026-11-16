import type { Form } from '../lib/store'
export type Errors = Partial<Record<keyof Form, string>>

export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function validate(step: number, f: Form): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (f.nome.trim().split(/\s+/).filter(Boolean).length < 2) e.nome = 'Informe nome e sobrenome.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Informe um e-mail válido, como nome@empresa.com.br.'
    const d = f.telefone.replace(/\D/g, '')
    if (d.length < 10) e.telefone = 'Informe o telefone com DDD.'
    if (f.empresa.trim().length < 2) e.empresa = 'Informe o nome da empresa.'
    if (f.cargo.trim().length < 2) e.cargo = 'Informe seu cargo.'
  }
  if (step === 1) {
    if (!f.setor) e.setor = 'Selecione o setor.'
    if (!f.usoIA) e.usoIA = 'Selecione uma opção.'
    if (!f.aplicacoes.length) e.aplicacoes = 'Escolha ao menos uma aplicação.'
    if (!f.decisoes) e.decisoes = 'Escolha uma opção.'
    if (!f.seguros) e.seguros = 'Escolha uma opção.'
  }
  if (step === 2 && !f.consent) e.consent = 'Confirme para enviar a solicitação demonstrativa.'
  return e
}
