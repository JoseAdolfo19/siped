import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/permissions"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user.planType)) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const [total, active, paid, totalCredits, planificaciones] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "active" } }),
    prisma.user.count({ where: { planType: { notIn: ["free", "admin"] } } }),
    prisma.user.aggregate({ _sum: { credits: true } }),
    prisma.planificacion.count(),
  ])

  return NextResponse.json({ total, active, paid, totalCredits: totalCredits._sum.credits || 0, planificaciones })
}
