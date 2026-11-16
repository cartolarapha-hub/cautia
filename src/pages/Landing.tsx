import { Hero } from '../sections/Hero'
import { Problem } from '../sections/Problem'
import { HowItWorks } from '../sections/HowItWorks'
import { Solutions } from '../sections/Solutions'
import { Offer } from '../sections/Offer'
import { Diagnostic } from '../sections/Diagnostic'
import { Faq } from '../sections/Faq'
import { FinalCta } from '../sections/FinalCta'

/** Página de entrada: entender o problema, ver como funciona, quanto custa e seguir para o produto. */
export function Landing() {
  return (<><Hero /><Problem /><HowItWorks /><Solutions /><Offer /><Diagnostic /><Faq /><FinalCta /></>)
}
