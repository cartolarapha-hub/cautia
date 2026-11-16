import type { useStore } from '../lib/store'
export function beginCheckout(st: ReturnType<typeof useStore>) {
  const done = st.s.step === 3
  st.set({ checkoutStarted: true, step: done ? 0 : st.s.step, ref: done ? null : st.s.ref, paySim: done ? false : st.s.paySim })
  st.setDrawer(false)
  st.setCheckout(true)
}
