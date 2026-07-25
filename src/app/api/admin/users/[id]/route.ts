import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, isAdmin } from "@/lib/permissions"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user.planType)) return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  const body = await req.json()
  const data: any = {}
  if (body.planType) data.planType = body.planType
  if (body.status) data.status = body.status
  const updated = await prisma.user.update({ where: { id: params.id }, data })
  if (body.planType === "vip") {
    const existing = await prisma.subscription.findFirst({ where: { userId: params.id, planType: "vip", status: "active" } })
    if (!existing) {
      await prisma.subscription.create({ data: { userId: params.id, planType: "vip", status: "active", isVip: true, endDate: new Date("2099-12-31") } })
    }
  }
  return NextResponse.json({ id: updated.id, planType: updated.planType, status: updated.status })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user.planType)) return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  await prisma.subscription.deleteMany({ where: { userId: params.id } })
  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ message: "Usuario eliminado" })
}
