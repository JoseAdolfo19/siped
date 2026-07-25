export const CREDIT_CONFIG = {
  free: {
    initial: 100,
    label: "Free",
  },
  weekly: {
    initial: 500,
    label: "Semanal",
  },
  monthly: {
    initial: 2000,
    label: "Mensual",
  },
  admin: {
    initial: 999999,
    label: "Admin",
  },
  vip: {
    initial: 999999,
    label: "VIP",
  },
} as const

export const CREDIT_COSTS = {
  EXPORT_PDF: 5,
  EXPORT_WORD: 5,
  AUTO_FILL: 3,
  GENERATE_EVALUACION: 3,
  GENERATE_MATERIAL: 3,
  GENERATE_PPTX: 10,
  GENERATE_REFUERZO: 3,
  GENERATE_UNIDAD: 5,
} as const

export type CreditAction = keyof typeof CREDIT_COSTS

export function getCreditsByPlan(planType: string): number {
  const cfg = CREDIT_CONFIG[planType as keyof typeof CREDIT_CONFIG]
  return cfg?.initial ?? 100
}
