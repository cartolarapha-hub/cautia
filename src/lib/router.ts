import { useEffect, useState } from 'react'

export type Route = 'home' | 'produto'
const parse = (): Route => (location.hash.startsWith('#/produto') ? 'produto' : 'home')

/** Roteador mínimo por hash (funciona no GitHub Pages sem configuração de servidor). */
export function useRoute(): Route {
  const [r, setR] = useState<Route>(parse)
  useEffect(() => { const f = () => setR(parse()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  return r
}

/** Vai para uma página e, opcionalmente, rola até uma seção dela. */
export function go(to: Route, section?: string) {
  const target = to === 'produto' ? '#/produto' : '#/'
  const scroll = () => requestAnimationFrame(() => setTimeout(() => {
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
    else scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, 80))
  if (location.hash === target || (to === 'home' && (location.hash === '' || location.hash === '#'))) { scroll(); return }
  location.hash = target
  scroll()
}
