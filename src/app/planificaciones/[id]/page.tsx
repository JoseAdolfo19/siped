import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Navbar from "@/components/layout/Navbar"
import PlanView from "./PlanView"

export default async function PlanPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect("/login")

  const plan = await prisma.planificacion.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!plan) redirect("/planificaciones")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PlanView plan={JSON.parse(JSON.stringify(plan))} />
    </div>
  )
}
