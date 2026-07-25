import { auth } from "./auth"

export type PlanType = "free" | "weekly" | "monthly" | "vip" | "admin"

const PLAN_LIMITS: Record<PlanType, { sessions: number; evaluations: number; exportWatermark: boolean }> = {
  free: { sessions: 3, evaluations: 3, exportWatermark: true },
  weekly: { sessions: 999, evaluations: 999, exportWatermark: false },
  monthly: { sessions: 999, evaluations: 999, exportWatermark: false },
  vip: { sessions: Infinity, evaluations: Infinity, exportWatermark: false },
  admin: { sessions: Infinity, evaluations: Infinity, exportWatermark: false },
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function checkAccess() {
  const user = await getCurrentUser()
  if (!user) return { allowed: false, reason: "No autenticado" }
  if (user.status !== "active") return { allowed: false, reason: "Cuenta inactiva" }
  const plan = (user.planType as PlanType) || "free"
  const limits = PLAN_LIMITS[plan]
  if (!limits) return { allowed: false, reason: "Plan no válido" }
  return { allowed: true, plan, limits }
}

export function isAdmin(planType?: string) { return planType === "admin" }
export function isVip(planType?: string) { return planType === "vip" || planType === "admin" }
export async function requireAdmin() {
  const user = await getCurrentUser()
  return !!user && isAdmin(user.planType)
}
