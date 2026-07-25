import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, checkAccess } from "@/lib/permissions"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const planificaciones = await prisma.planificacion.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(planificaciones)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const access = await checkAccess()
  if (!access.allowed) return NextResponse.json({ error: "Acceso denegado: " + access.reason }, { status: 403 })

  const body = await req.json()
  const { level, institution, teacher, grade, section, classroom, subject, title, duration, purpose, competencies, capacities, performance, evidence, transversalApproaches, sequence, evaluationTechniques, evaluationInstruments, resources, reflections } = body

  if (!title || !subject || !grade) {
    return NextResponse.json({ error: "Título, asignatura y grado son requeridos" }, { status: 400 })
  }

  const planificacion = await prisma.planificacion.create({
    data: {
      userId: user.id,
      level: level || "primaria",
      institution: institution || "",
      teacher: teacher || "",
      grade,
      section: section || "",
      classroom: classroom || "",
      subject,
      title,
      duration: duration || "",
      purpose: purpose || "",
      competencies: competencies || "",
      capacities: capacities || "",
      performance: performance || "",
      evidence: evidence || "",
      transversalApproaches: transversalApproaches || "",
      sequence: sequence || "{}",
      evaluationTechniques: evaluationTechniques || "",
      evaluationInstruments: evaluationInstruments || "",
      resources: resources || "",
      reflections: reflections || "",
      status: "draft",
    },
  })

  return NextResponse.json(planificacion, { status: 201 })
}
