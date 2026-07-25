import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const items = await prisma.material.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  const body = await req.json()
  const item = await prisma.material.create({ data: { ...body, userId: session.user.id } })
  return NextResponse.json(item)
}
