import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/permissions"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, planType: true, status: true, credits: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(users)
}
