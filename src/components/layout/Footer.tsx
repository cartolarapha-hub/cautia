import { Logo } from '../ui/Logo'
import { resetPopups, useStore } from '../../lib/store'
import { NAV } from './Header'

export function Footer() {
  const { showPopup, reset } = useStore()
  return (
    <footer className="on-dark bg-blue text-cream">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo tone="light" height={52} />
            <p className="mt-10 max-w-md font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.08]">O futuro da gestão de risco.</p>
            <p className="mt-4 max-w-sm text-cream/80">Corretora especializada em risco de IA. Não assumimos o risco, nós o colocamos.</p>
          </div>
          <nav aria-label="Rodapé"><p className="eyebrow mb-5 text-sun">Navegar</p><ul className="text-[17px] [&_a]:inline-block [&_a]:py-2 [&_button]:py-2">{NAV.map(n => <li key={n.id}><a className="link-u" href={`#${n.id}`}>{n.label}</a></li>)}<li><a className="link-u" href="#solicitar">Solicitação</a></li></ul></nav>
          <div><p className="eyebrow mb-5 text-sun">Demonstração</p><ul className="text-[17px] [&_a]:inline-block [&_a]:py-2 [&_button]:py-2">
            <li><button type="button" className="link-u text-left" onClick={() => { resetPopups(); showPopup({ kind: 'discovery' }) }}>Rever pop-ups</button></li>
            <li><button type="button" className="link-u text-left" onClick={() => { if (confirm('Apagar todas as respostas salvas neste navegador?')) reset() }}>Limpar dados salvos</button></li></ul></div>
        </div>
        <p className="hair mt-16 border-t pt-6 text-[13px] leading-relaxed text-cream/85">Site demonstrativo para fins de apresentação. Nenhuma contratação real é realizada, nenhum pagamento é processado e nenhum preço, apólice ou cobertura é oferecido. Dados de mercado e casos conforme a apresentação CAUTIA (fontes: Cetic.br/NIC.br, FT, StartSe, O Fator, TST, entre outras).</p>
      </div>
    </footer>
  )
}
