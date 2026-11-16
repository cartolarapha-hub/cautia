import { AnimatePresence, motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { IconCheck } from '../components/ui/Icons'
import { ease } from '../lib/motion'

const ERR = '#b3261e'
export function FieldShell({ label, error, hint, valid, children }: { label: string; error?: string; hint?: string; valid?: boolean; children: (p: { id: string; describedBy?: string; invalid: boolean }) => ReactNode }) {
  const fid = useId()
  const dby = error ? `${fid}-e` : hint ? `${fid}-h` : undefined
  return (
    <div>
      <label htmlFor={fid} className="mb-2 block text-[14px] font-semibold text-ink">{label}</label>
      <div className="relative">
        {children({ id: fid, describedBy: dby, invalid: !!error })}
        <AnimatePresence>{valid && !error && <motion.span aria-hidden initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="pointer-events-none absolute right-3.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-blue text-cream"><IconCheck size={11} /></motion.span>}</AnimatePresence>
      </div>
      {hint && !error && <p id={`${fid}-h`} className="mt-2 text-[13px] text-ink/65">{hint}</p>}
      <AnimatePresence>{error && <motion.p id={`${fid}-e`} role="alert" initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease }} style={{ color: ERR }} className="mt-2 flex items-start gap-2 text-[13.5px] font-medium leading-snug"><svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="mt-px shrink-0"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 4.5v4M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>{error}</motion.p>}</AnimatePresence>
    </div>
  )
}
const base = 'h-[52px] w-full rounded-[var(--radius-ctl)] border bg-white px-4 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink/40 hover:border-blue/60 focus:border-blue focus:shadow-[0_0_0_3px_rgba(30,79,154,.2)]'
const cls = (invalid: boolean) => `${base} ${invalid ? 'border-[#b3261e] focus:shadow-[0_0_0_3px_rgba(179,38,30,.18)]' : 'border-blue/25'}`

export function TextField({ label, value, onChange, error, hint, type = 'text', autoComplete, inputMode, placeholder, onBlur, valid }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; type?: string; autoComplete?: string; inputMode?: 'text' | 'tel' | 'email'; placeholder?: string; onBlur?: () => void; valid?: boolean
}) {
  return (
    <FieldShell label={label} error={error} hint={hint} valid={valid}>
      {p => <input id={p.id} type={type} value={value} autoComplete={autoComplete} inputMode={inputMode} placeholder={placeholder} aria-invalid={p.invalid} aria-describedby={p.describedBy}
        onChange={e => onChange(e.target.value)} onBlur={onBlur} className={`${cls(p.invalid)} ${valid ? 'pr-11' : ''}`} />}
    </FieldShell>
  )
}
export function SelectField({ label, value, onChange, options, error, placeholder = 'Selecione' }: { label: string; value: string; onChange: (v: string) => void; options: string[]; error?: string; placeholder?: string }) {
  return (
    <FieldShell label={label} error={error}>
      {p => <select id={p.id} value={value} aria-invalid={p.invalid} aria-describedby={p.describedBy} onChange={e => onChange(e.target.value)} className={`${cls(p.invalid)} appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'><path d='M3 5l4 4 4-4' fill='none' stroke='%231e4f9a' stroke-width='1.8' stroke-linecap='round'/></svg>")] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10`}>
        <option value="">{placeholder}</option>{options.map(o => <option key={o}>{o}</option>)}</select>}
    </FieldShell>
  )
}
export function ChoiceGroup({ legend, options, value, onChange, multi, error }: { legend: string; options: string[]; value: string | string[]; onChange: (v: any) => void; multi?: boolean; error?: string }) {
  const id = useId()
  const isOn = (o: string) => multi ? (value as string[]).includes(o) : value === o
  const click = (o: string) => multi ? onChange(isOn(o) ? (value as string[]).filter(x => x !== o) : [...(value as string[]), o]) : onChange(o)
  return (
    <fieldset aria-describedby={error ? `${id}-e` : undefined}>
      <legend className="mb-2.5 text-[14px] font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2" role={multi ? 'group' : 'radiogroup'}>
        {options.map(o => (
          <motion.button key={o} type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={isOn(o)} onClick={() => click(o)} whileTap={{ scale: 0.97 }}
            className={`flex min-h-12 items-center gap-2 rounded-[var(--radius-ctl)] border px-4 py-2.5 text-[15px] transition-colors duration-200 ${isOn(o) ? 'border-blue bg-blue text-cream' : 'border-blue/25 bg-white hover:border-blue'}`}>
            {isOn(o) && <IconCheck size={14} />}{o}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{error && <motion.p id={`${id}-e`} role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: ERR }} className="mt-2 text-[13.5px] font-medium">{error}</motion.p>}</AnimatePresence>
    </fieldset>
  )
}
