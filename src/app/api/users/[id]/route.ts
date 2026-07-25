import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/permissions"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  const target = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, email: true, planType: true, status: true, createdAt: true, subscriptions: { orderBy: { createdAt: "desc" } } },
  })
  if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  return NextResponse.json(target)
}
