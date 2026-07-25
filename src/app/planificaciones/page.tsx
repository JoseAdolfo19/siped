import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Navbar from "@/components/layout/Navbar"
import PlanificacionesList from "./PlanificacionesList"

export default async function PlanificacionesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const planificaciones = await prisma.planificacion.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PlanificacionesList planificaciones={JSON.parse(JSON.stringify(planificaciones))} />
    </div>
  )
}
