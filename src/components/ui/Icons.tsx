/** Ícones próprios, desenhados sobre a geometria do símbolo (quadrado de cantos suaves) e do C. */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
export const IconAvaliar = (p: { size?: number }) => (
  <svg width={p.size ?? 40} height={p.size ?? 40} viewBox="0 0 40 40" aria-hidden><rect x="4" y="4" width="32" height="32" rx="8" {...P} /><circle cx="20" cy="20" r="9" {...P} /><circle cx="20" cy="20" r="4" {...P} /><path d="M20 4v5M20 31v5M4 20h5M31 20h5" {...P} /></svg>)
export const IconAnalise = (p: { size?: number }) => (
  <svg width={p.size ?? 40} height={p.size ?? 40} viewBox="0 0 40 40" aria-hidden><rect x="8" y="4" width="24" height="32" rx="6" {...P} /><path d="M14 13h12M14 19h12M14 25h6" {...P} /><path d="M24 27l3 3 5-6" {...P} /></svg>)
export const IconConhecer = (p: { size?: number }) => (
  <svg width={p.size ?? 40} height={p.size ?? 40} viewBox="0 0 40 40" aria-hidden><rect x="3" y="12" width="12" height="16" rx="4" {...P} /><rect x="25" y="12" width="12" height="16" rx="4" {...P} /><path d="M15 20h10" {...P} /><circle cx="20" cy="20" r="2.4" fill="currentColor" /></svg>)
export const IconEmpresa = (p: { size?: number }) => (
  <svg width={p.size ?? 40} height={p.size ?? 40} viewBox="0 0 40 40" aria-hidden><rect x="6" y="8" width="28" height="26" rx="6" {...P} /><path d="M13 16h4M13 22h4M23 16h4M23 22h4M17 34v-6h6v6" {...P} /></svg>)
export const IconSeguradora = (p: { size?: number }) => (
  <svg width={p.size ?? 40} height={p.size ?? 40} viewBox="0 0 40 40" aria-hidden><path d="M20 5l13 4v10c0 8-5.5 13-13 16C12.500 32 7 27 7 19V9z" {...P} /><path d="M14 20l4 4 8-8" {...P} /></svg>)
export const IconCheck = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden><path d="M3 8.5l3.2 3.2L13 4.5" {...P} strokeWidth={2} /></svg>)
export const IconPlus = ({ open }: { open: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="transition-transform duration-300 [transition-timing-function:var(--ease-out)]" style={{ transform: open ? 'rotate(45deg)' : 'none' }}><path d="M10 3v14M3 10h14" {...P} strokeWidth={1.8} /></svg>)
