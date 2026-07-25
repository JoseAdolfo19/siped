import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { checkAccess, isAdmin } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import Navbar from "@/components/layout/Navbar"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const access = await checkAccess()
  if (!access.allowed) redirect("/login")

  const [userCount, vipCount, subCount, planCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { planType: "vip" } }),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.planificacion.count({ where: { userId: session.user.id } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardClient
        user={session.user as any}
        isAdmin={isAdmin(session.user.planType)}
        limits={access.limits!}
        stats={{ userCount, vipCount, subCount, planCount }}
      />
    </div>
  )
}
