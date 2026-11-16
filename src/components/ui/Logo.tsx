/** Logotipo oficial, extraído do brand board (recurso original). `light` é a variante com cores trocadas para fundos azuis. */
type Props = { variant?: 'full' | 'mark'; tone?: 'color' | 'light'; height?: number; className?: string }
export function Logo({ variant = 'full', tone = 'color', height = 40, className = '' }: Props) {
  const src = `${import.meta.env.BASE_URL}brand/logo-${variant}${tone === 'light' ? '-light' : ''}.png`
  const w = variant === 'full' ? (597 / 218) * height : (217 / 218) * height
  return <img src={src} alt="CAUTIA" width={Math.round(w)} height={height} className={className} style={{ height, width: 'auto' }} draggable={false} />
}
