import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/permissions"

const levelLabel: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" }

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const plan = await prisma.planificacion.findFirst({ where: { id: params.id, userId: user.id } })
  if (!plan) return NextResponse.json({ error: "No encontrada" }, { status: 404 })

  let seq: any = {}
  try { seq = JSON.parse(plan.sequence) } catch {}

  const h = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${h(plan.title)} - SIPED</title>
  <style>
    @page { margin: 2cm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: auto; padding: 20px; }
    h1 { color: #7C3AED; border-bottom: 3px solid #7C3AED; padding-bottom: 8px; font-size: 20px; }
    h2 { color: #6D28D9; margin-top: 24px; border-bottom: 1px solid #DDD6FE; padding-bottom: 4px; font-size: 16px; }
    h3 { color: #4C1D95; margin-top: 16px; font-size: 14px; }
    .meta { color: #555; font-size: 13px; margin-bottom: 24px; background: #F5F3FF; padding: 12px; border-radius: 8px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
    .s { margin-bottom: 18px; }
    .c { white-space: pre-wrap; font-size: 13px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>${h(plan.title)}</h1>
  <div class="meta"><div class="meta-grid">
    <div><strong>Nivel:</strong> ${levelLabel[plan.level] || plan.level}</div>
    <div><strong>Asignatura:</strong> ${h(plan.subject)}</div>
    <div><strong>Grado:</strong> ${h(plan.grade)}${plan.section ? " - " + h(plan.section) : ""}</div>
    <div><strong>Duración:</strong> ${h(plan.duration || "—")}</div>
    ${plan.institution ? `<div><strong>I.E.:</strong> ${h(plan.institution)}</div>` : ""}
    ${plan.teacher ? `<div><strong>Docente:</strong> ${h(plan.teacher)}</div>` : ""}
    ${plan.classroom ? `<div><strong>Aula:</strong> ${h(plan.classroom)}</div>` : ""}
  </div></div>

  <div class="s"><h2>Propósito de aprendizaje</h2><div class="c">${h(plan.purpose || "—")}</div></div>

  <div class="s"><h2>Competencias, capacidades y desempeños</h2>
    <div class="grid-2">
      <div><h3>Competencias</h3><div class="c">${h(plan.competencies || "—")}</div></div>
      <div><h3>Capacidades</h3><div class="c">${h(plan.capacities || "—")}</div></div>
    </div>
    <div style="margin-top:8px"><h3>Desempeños</h3><div class="c">${h(plan.performance || "—")}</div></div>
  </div>

  <div class="s"><h2>Evidencia de aprendizaje</h2><div class="c">${h(plan.evidence || "—")}</div></div>
  <div class="s"><h2>Enfoques transversales</h2><div class="c">${h(plan.transversalApproaches || "—")}</div></div>

  <div class="s"><h2>Secuencia didáctica</h2>
    ${seq.inicio ? `<div style="margin-bottom:12px"><h3>Inicio</h3><div class="c">${h(seq.inicio)}</div></div>` : ""}
    ${seq.desarrollo ? `<div style="margin-bottom:12px"><h3>Desarrollo</h3><div class="c">${h(seq.desarrollo)}</div></div>` : ""}
    ${seq.cierre ? `<div style="margin-bottom:12px"><h3>Cierre</h3><div class="c">${h(seq.cierre)}</div></div>` : ""}
  </div>

  <div class="s"><h2>Evaluación</h2>
    <div class="grid-2">
      <div><h3>Técnicas</h3><div class="c">${h(plan.evaluationTechniques || "—")}</div></div>
      <div><h3>Instrumentos</h3><div class="c">${h(plan.evaluationInstruments || "—")}</div></div>
    </div>
  </div>

  <div class="s"><h2>Recursos y materiales</h2><div class="c">${h(plan.resources || "—")}</div></div>

  ${plan.reflections ? `<div class="s"><h2>Reflexiones del docente</h2><div class="c">${h(plan.reflections)}</div></div>` : ""}

  <div class="footer">Generado por SIPED - ${new Date().toLocaleDateString("es-PE")}</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Content-Disposition": `attachment; filename="sesion-${plan.id}.html"` },
  })
}
