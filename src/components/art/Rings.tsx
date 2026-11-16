/** Anéis concêntricos de quadrado de cantos suaves (o "quadro" do símbolo): sinal que se propaga. */
export function Rings({ n = 5, className = '', stroke = 'currentColor', animated = true }: { n?: number; className?: string; stroke?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className} fill="none">
      {Array.from({ length: n }, (_, i) => {
        const s = 30 + i * (160 / n), x = 100 - s / 2
        return <rect key={i} x={x} y={x} width={s} height={s} rx={s * 0.22} stroke={stroke} strokeWidth={1.1} className={animated ? 'ring' : ''} style={animated ? { animationDelay: `${-i * (7 / n)}s` } : { opacity: 0.25 + (i / n) * 0.5 }} />
      })}
    </svg>
  )
}
