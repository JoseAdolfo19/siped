import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { CREDIT_COSTS, CreditAction } from "@/lib/credits"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { action } = (await req.json()) as { action: CreditAction }
  const cost = CREDIT_COSTS[action]
  if (!cost) return NextResponse.json({ error: "Acción inválida" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

  if (user.credits < cost) {
    return NextResponse.json({ error: "Créditos insuficientes", credits: user.credits, cost }, { status: 402 })
  }

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: { credits: { decrement: cost } },
  })

  return NextResponse.json({ success: true, credits: updated.credits, cost, action })
}
