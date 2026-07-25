import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, isAdmin } from "@/lib/permissions"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  if (isAdmin(user.planType)) {
    const subs = await prisma.subscription.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } })
    return NextResponse.json(subs)
  }
  const subs = await prisma.subscription.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(subs)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  const { planType } = await req.json()
  if (!["weekly", "monthly"].includes(planType)) return NextResponse.json({ error: "Plan no válido" }, { status: 400 })
  const days = planType === "weekly" ? 7 : 30
  const endDate = new Date(); endDate.setDate(endDate.getDate() + days)
  const sub = await prisma.subscription.create({ data: { userId: user.id, planType, status: "active", startDate: new Date(), endDate } })
  await prisma.user.update({ where: { id: user.id }, data: { planType } })
  return NextResponse.json(sub, { status: 201 })
}
