import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/permissions"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const plan = await prisma.planificacion.findFirst({
    where: { id: params.id, userId: user.id },
  })

  if (!plan) return NextResponse.json({ error: "No encontrada" }, { status: 404 })
  return NextResponse.json(plan)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const existing = await prisma.planificacion.findFirst({
    where: { id: params.id, userId: user.id },
  })
  if (!existing) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  const body = await req.json()
  const allowed = ["level","institution","teacher","grade","section","classroom","subject","title","duration","purpose","competencies","capacities","performance","evidence","transversalApproaches","sequence","evaluationTechniques","evaluationInstruments","resources","reflections","status"]

  const data: any = {}
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key]
  }

  const updated = await prisma.planificacion.update({ where: { id: params.id }, data })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const existing = await prisma.planificacion.findFirst({
    where: { id: params.id, userId: user.id },
  })
  if (!existing) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  await prisma.planificacion.delete({ where: { id: params.id } })
  return NextResponse.json({ message: "Planificación eliminada" })
}
