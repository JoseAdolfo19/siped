import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CREDIT_CONFIG, CREDIT_COSTS } from "@/lib/credits"
import DashboardClient from "./DashboardClient"

export const metadata: Metadata = { title: "Dashboard - SIPED" }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.email) return <div className="p-8 text-center text-gray-500">Inicia sesión para ver tu dashboard</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { planificaciones: { select: { id: true, createdAt: true } } },
  })
  if (!user) return <div className="p-8 text-center text-gray-500">Usuario no encontrado</div>

  const planInfo = CREDIT_CONFIG[user.planType as keyof typeof CREDIT_CONFIG] || CREDIT_CONFIG.free
  const totalPlanes = user.planificaciones.length
  const planesEsteMes = user.planificaciones.filter(p => {
    const d = new Date(p.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <DashboardClient
      credits={user.credits}
      planType={user.planType}
      planLabel={planInfo.label}
      totalPlanes={totalPlanes}
      planesEsteMes={planesEsteMes}
      costos={CREDIT_COSTS}
    />
  )
}
