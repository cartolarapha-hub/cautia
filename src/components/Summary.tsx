import { AnimatePresence, motion } from 'motion/react'
import { NEEDS, PROFILES } from '../data/content'
import { useStore } from '../lib/store'
import { ease } from '../lib/motion'

export function Summary({ onEditProfile, onEditNeeds, dark = false }: { onEditProfile?: () => void; onEditNeeds?: () => void; dark?: boolean }) {
  const { s } = useStore()
  const profile = PROFILES.find(p => p.id === s.profile)
  const needs = NEEDS.filter(n => s.needs.includes(n.id))
  const muted = dark ? 'text-cream/85' : 'text-ink/65'
  const edit = 'rounded px-1 text-[13px] font-medium normal-case tracking-normal underline underline-offset-4 hover:text-blue'
  return (
    <dl className="text-[15px]">
      <div className="hair border-b pb-5">
        <dt className={`eyebrow flex items-center justify-between ${muted}`}>Perfil {onEditProfile && <button type="button" onClick={onEditProfile} className={edit}>Alterar</button>}</dt>
        <dd className="mt-2 font-display text-[1.35rem] leading-tight">{profile?.label ?? <span className={`font-sans text-[15px] ${muted}`}>Ainda não escolhido</span>}</dd>
      </div>
      <div className="hair border-b py-5">
        <dt className={`eyebrow flex items-center justify-between ${muted}`}>Necessidade {onEditNeeds && <button type="button" onClick={onEditNeeds} className={edit}>Alterar</button>}</dt>
        <dd className="mt-3">
          <ul className="space-y-4" aria-live="polite">
            <AnimatePresence initial={false}>
              {needs.map((n, i) => (
                <motion.li key={n.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                  <div className="flex gap-3"><span className="tabular font-display text-lg text-blue">0{i + 1}</span><div><p className="font-semibold leading-snug">{n.title}</p><p className={`mt-0.5 text-[13.5px] leading-snug ${muted}`}>{n.deliverable}</p></div></div>
                </motion.li>
              ))}
            </AnimatePresence>
            {!needs.length && <li className={muted}>Nenhuma selecionada</li>}
          </ul>
        </dd>
      </div>
      <div className="pt-5">
        <dt className={`eyebrow ${muted}`}>Valor</dt>
        <dd className="mt-1"><span className="block font-display text-xl">A definir</span><span className={`mt-2 block text-[13px] leading-snug ${muted}`}>Demonstração: nenhum preço, apólice ou cobertura foi definido.</span></dd>
      </div>
    </dl>
  )
}
