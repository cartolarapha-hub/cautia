/** Tokens de movimento: uma curva, três durações, uma mola. Tudo no site usa estes valores. */
export const ease = [0.22, 1, 0.36, 1] as const
export const dur = { fast: 0.2, base: 0.4, slow: 0.8 }
export const spring = { type: 'spring', stiffness: 380, damping: 34 } as const
export const springSoft = { type: 'spring', stiffness: 220, damping: 30 } as const
