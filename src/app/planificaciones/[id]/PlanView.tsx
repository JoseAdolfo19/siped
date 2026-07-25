"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

interface Plan {
  id: string; level: string; institution: string; teacher: string; grade: string
  section: string; classroom: string; subject: string; title: string; duration: string
  purpose: string; competencies: string; capacities: string; performance: string
  evidence: string; transversalApproaches: string; sequence: string
  evaluationTechniques: string; evaluationInstruments: string; resources: string
  reflections: string; status: string; createdAt: string; updatedAt: string
}

const levelLabel: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" }

export default function PlanView({ plan }: { plan: Plan }) {
  const router = useRouter()
  let seq: any = {}
  try { seq = JSON.parse(plan.sequence) } catch {}

  async function toggleStatus() {
    const s = plan.status === "draft" ? "published" : "draft"
    await fetch(`/api/planificaciones/${plan.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) })
    router.refresh()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{plan.subject} · {levelLabel[plan.level] || plan.level} · {plan.grade}{plan.section ? ` "${plan.section}"` : ""} · {plan.duration}</p>
          {plan.institution && <p className="text-gray-400 text-xs mt-1">{plan.institution}{plan.teacher ? ` · Docente: ${plan.teacher}` : ""}</p>}
        </div>
        <div className="flex gap-2 shrink-0 no-print">
          <button onClick={toggleStatus} className={`px-4 py-2 rounded-xl text-sm font-medium ${plan.status === "draft" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}>{plan.status === "draft" ? "Publicar" : "Borrador"}</button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50">🖨 Imprimir</button>
          <a href={`/api/planificaciones/${plan.id}/exportar`} download className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50">📥 Exportar</a>
          <Link href={`/planificaciones/${plan.id}/editar`} className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700">Editar</Link>
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Datos informativos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="font-medium text-gray-600">Nivel:</span> {levelLabel[plan.level] || plan.level}</div>
            <div><span className="font-medium text-gray-600">Grado:</span> {plan.grade}{plan.section ? ` - ${plan.section}` : ""}</div>
            <div><span className="font-medium text-gray-600">Duración:</span> {plan.duration || "—"}</div>
            {plan.classroom && <div><span className="font-medium text-gray-600">Aula:</span> {plan.classroom}</div>}
            {plan.institution && <div><span className="font-medium text-gray-600">I.E.:</span> {plan.institution}</div>}
            {plan.teacher && <div><span className="font-medium text-gray-600">Docente:</span> {plan.teacher}</div>}
          </div>
        </Section>

        <Section title="Propósito de aprendizaje">
          <p className="text-gray-700 whitespace-pre-wrap">{plan.purpose || "—"}</p>
        </Section>

        <Section title="Competencias, capacidades y desempeños">
          <div className="grid md:grid-cols-3 gap-4">
            <div><h3 className="font-medium text-gray-800 text-sm mb-1">Competencias</h3><p className="text-gray-700 whitespace-pre-wrap text-sm">{plan.competencies || "—"}</p></div>
            <div><h3 className="font-medium text-gray-800 text-sm mb-1">Capacidades</h3><p className="text-gray-700 whitespace-pre-wrap text-sm">{plan.capacities || "—"}</p></div>
            <div><h3 className="font-medium text-gray-800 text-sm mb-1">Desempeños</h3><p className="text-gray-700 whitespace-pre-wrap text-sm">{plan.performance || "—"}</p></div>
          </div>
        </Section>

        <Section title="Evidencia de aprendizaje">
          <p className="text-gray-700 whitespace-pre-wrap">{plan.evidence || "—"}</p>
        </Section>

        <Section title="Enfoques transversales">
          <p className="text-gray-700 whitespace-pre-wrap">{plan.transversalApproaches || "—"}</p>
        </Section>

        <Section title="Secuencia didáctica">
          {seq.inicio && <SubSec title="Inicio" desc="Motivación, saberes previos, conflicto cognitivo" content={seq.inicio} />}
          {seq.desarrollo && <SubSec title="Desarrollo" desc="Procesamiento, aplicación, práctica" content={seq.desarrollo} />}
          {seq.cierre && <SubSec title="Cierre" desc="Metacognición, evaluación" content={seq.cierre} />}
          {!seq.inicio && !seq.desarrollo && !seq.cierre && <p className="text-gray-400">—</p>}
        </Section>

        <Section title="Evaluación">
          <div className="grid md:grid-cols-2 gap-4">
            <div><h3 className="font-medium text-gray-800 text-sm mb-1">Técnicas</h3><p className="text-gray-700 whitespace-pre-wrap text-sm">{plan.evaluationTechniques || "—"}</p></div>
            <div><h3 className="font-medium text-gray-800 text-sm mb-1">Instrumentos</h3><p className="text-gray-700 whitespace-pre-wrap text-sm">{plan.evaluationInstruments || "—"}</p></div>
          </div>
        </Section>

        <Section title="Recursos y materiales">
          <p className="text-gray-700 whitespace-pre-wrap">{plan.resources || "—"}</p>
        </Section>

        {plan.reflections && (
          <Section title="Reflexiones del docente">
            <p className="text-gray-700 whitespace-pre-wrap">{plan.reflections}</p>
          </Section>
        )}
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border p-6"><h2 className="text-lg font-semibold mb-3 text-primary-700">{title}</h2>{children}</div>
}

function SubSec({ title, desc, content }: { title: string; desc: string; content: string }) {
  return <div className="mb-4"><h3 className="font-medium text-gray-800">{title}</h3><p className="text-xs text-gray-400 mb-1">{desc}</p><p className="text-gray-700 whitespace-pre-wrap">{content}</p></div>
}
