/** Rótulo de seção no padrão do brand board: índice entre parênteses + texto em caixa alta. */
export function Eyebrow({ n, children, className = '' }: { n?: string; children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow flex items-center gap-3 ${className}`}>{n && <span className="tabular opacity-85">({n})</span>}<span>{children}</span></p>
}
