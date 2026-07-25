"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { generarTemplate } from "@/lib/templates"

interface PlanData {
  id?: string; level?: string; institution?: string; teacher?: string; grade?: string
  section?: string; classroom?: string; subject?: string; title?: string; duration?: string
  purpose?: string; competencies?: string; capacities?: string; performance?: string
  evidence?: string; transversalApproaches?: string; sequence?: string
  evaluationTechniques?: string; evaluationInstruments?: string; resources?: string; reflections?: string
}

export default function PlanForm({ plan, onChange }: { plan?: PlanData; onChange?: (data: any) => void }) {
  const router = useRouter()
  const isEdit = !!plan?.id

  const [level, setLevel] = useState(plan?.level || "primaria")
  const [institution, setInstitution] = useState(plan?.institution || "")
  const [teacher, setTeacher] = useState(plan?.teacher || "")
  const [grade, setGrade] = useState(plan?.grade || "")
  const [section, setSection] = useState(plan?.section || "")
  const [classroom, setClassroom] = useState(plan?.classroom || "")
  const [subject, setSubject] = useState(plan?.subject || "")
  const [title, setTitle] = useState(plan?.title || "")
  const [duration, setDuration] = useState(plan?.duration || "")
  const [purpose, setPurpose] = useState(plan?.purpose || "")
  const [competencies, setCompetencies] = useState(plan?.competencies || "")
  const [capacities, setCapacities] = useState(plan?.capacities || "")
  const [performance, setPerformance] = useState(plan?.performance || "")
  const [evidence, setEvidence] = useState(plan?.evidence || "")
  const [transversalApproaches, setTransversalApproaches] = useState(plan?.transversalApproaches || "")

  const parsed = (() => { try { return JSON.parse(plan?.sequence || "{}") } catch { return {} } })()
  const [seqInicio, setSeqInicio] = useState(parsed.inicio || "")
  const [seqDesarrollo, setSeqDesarrollo] = useState(parsed.desarrollo || "")
  const [seqCierre, setSeqCierre] = useState(parsed.cierre || "")

  const [evaluationTechniques, setEvaluationTechniques] = useState(plan?.evaluationTechniques || "")
  const [evaluationInstruments, setEvaluationInstruments] = useState(plan?.evaluationInstruments || "")
  const [resources, setResources] = useState(plan?.resources || "")
  const [reflections, setReflections] = useState(plan?.reflections || "")
  const [loading, setLoading] = useState(false)
  const [autofilling, setAutofilling] = useState(false)
  const [error, setError] = useState("")

  const prevRef = useRef("")
  useEffect(() => {
    const current = JSON.stringify({
      level, institution, teacher, grade, section, classroom, subject, title, duration,
      purpose, competencies, capacities, performance, evidence, transversalApproaches,
      seqInicio, seqDesarrollo, seqCierre,
      evaluationTechniques, evaluationInstruments, resources, reflections,
    })
    if (current !== prevRef.current) {
      prevRef.current = current
      onChange?.(JSON.parse(current))
    }
  })

  const autoFill = useCallback(() => {
    if (!title.trim() || !subject.trim()) {
      setError("Completa título y asignatura primero para autorellenar")
      return
    }
    setAutofilling(true)
    setError("")

    const tpl = generarTemplate(level, subject, title)

    if (tpl.competencies) setCompetencies(tpl.competencies)
    if (tpl.capacities) setCapacities(tpl.capacities)
    if (tpl.performance) setPerformance(tpl.performance)
    if (tpl.purpose) setPurpose(tpl.purpose)
    if (tpl.evidence) setEvidence(tpl.evidence)
    if (tpl.transversalApproaches) setTransversalApproaches(tpl.transversalApproaches)
    if (tpl.seqInicio) setSeqInicio(tpl.seqInicio)
    if (tpl.seqDesarrollo) setSeqDesarrollo(tpl.seqDesarrollo)
    if (tpl.seqCierre) setSeqCierre(tpl.seqCierre)
    if (tpl.evaluationTechniques) setEvaluationTechniques(tpl.evaluationTechniques)
    if (tpl.evaluationInstruments) setEvaluationInstruments(tpl.evaluationInstruments)
    if (tpl.resources) setResources(tpl.resources)
    if (tpl.reflections) setReflections(tpl.reflections)

    setAutofilling(false)
  }, [level, subject, title])

  const levelLabel = level === "inicial" ? "Inicial" : level === "primaria" ? "Primaria" : "Secundaria"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    if (!title.trim() || !subject.trim() || !grade.trim()) {
      setError("Título, asignatura y grado son requeridos"); setLoading(false); return
    }
    const sequence = JSON.stringify({ inicio: seqInicio, desarrollo: seqDesarrollo, cierre: seqCierre })
    const body = { level, institution, teacher, grade, section, classroom, subject, title, duration, purpose, competencies, capacities, performance, evidence, transversalApproaches, sequence, evaluationTechniques, evaluationInstruments, resources, reflections }
    const url = isEdit ? `/api/planificaciones/${plan.id}` : "/api/planificaciones"
    const method = isEdit ? "PATCH" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (res.ok) { router.push("/planificaciones"); router.refresh() }
    else { const d = await res.json(); setError(d.error || "Error al guardar") }
    setLoading(false)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Editar planificación" : `Nueva planificación - ${levelLabel}`}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <Block title="Datos informativos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={level} onChange={e => { setLevel(e.target.value); setGrade("") }} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="inicial">Inicial</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </select>
            <Input label="" value={institution} onChange={setInstitution} placeholder="I.E. Institución Educativa" />
            <Input label="" value={teacher} onChange={setTeacher} placeholder="Docente" />
            <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="">Grado *</option>
              {level === "inicial" && ["3 años", "4 años", "5 años"].map(g => <option key={g} value={g}>{g}</option>)}
              {level === "primaria" && ["1°", "2°", "3°", "4°", "5°", "6°"].map(g => <option key={g} value={g}>{g} grado</option>)}
              {level === "secundaria" && ["1°", "2°", "3°", "4°", "5°"].map(g => <option key={g} value={g}>{g} grado</option>)}
            </select>
            <Input label="" value={section} onChange={setSection} placeholder="Sección" />
            <Input label="" value={classroom} onChange={setClassroom} placeholder="Aula" />
            <Input label="" value={subject} onChange={setSubject} placeholder="Asignatura *" />
            <Input label="" value={title} onChange={setTitle} placeholder="Título de la sesión *" />
            <Input label="" value={duration} onChange={setDuration} placeholder="Duración (ej: 2 horas)" />
          </div>
        </Block>

        <div className="flex items-center justify-between no-print">
          <p className="text-sm text-gray-500">Los campos con * son requeridos</p>
          <button type="button" onClick={autoFill} disabled={autofilling} className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-amber-600 disabled:opacity-50 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {autofilling ? "Generando..." : "Autorellenar con plantilla"}
          </button>
        </div>

        <Block title="Propósito y competencias">
          <Text label="Propósito de aprendizaje" value={purpose} onChange={setPurpose} rows={3} placeholder="¿Qué aprenderán los estudiantes?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Text label="Competencias" value={competencies} onChange={setCompetencies} rows={3} placeholder="Competencias del CNEB" />
            <Text label="Capacidades" value={capacities} onChange={setCapacities} rows={3} placeholder="Capacidades específicas" />
            <Text label="Desempeños" value={performance} onChange={setPerformance} rows={3} placeholder="Desempeños esperados" />
          </div>
        </Block>

        <Block title="Evidencia y enfoques transversales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Evidencia de aprendizaje" value={evidence} onChange={setEvidence} rows={3} placeholder="¿Qué producto o evidencia demostrará el logro?" />
            <Text label="Enfoques transversales" value={transversalApproaches} onChange={setTransversalApproaches} rows={3} placeholder="Ej: Enfoque de derechos, inclusivo, intercultural..." />
          </div>
        </Block>

        <Block title="Secuencia didáctica">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inicio <span className="text-gray-400 font-normal">(motivación, saberes previos, conflicto cognitivo)</span></label>
              <Textarea value={seqInicio} onChange={setSeqInicio} rows={3} placeholder="Actividades de inicio..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desarrollo <span className="text-gray-400 font-normal">(procesamiento, aplicación, práctica)</span></label>
              <Textarea value={seqDesarrollo} onChange={setSeqDesarrollo} rows={5} placeholder="Actividades de desarrollo..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cierre <span className="text-gray-400 font-normal">(metacognición, evaluación)</span></label>
              <Textarea value={seqCierre} onChange={setSeqCierre} rows={3} placeholder="Actividades de cierre..." />
            </div>
          </div>
        </Block>

        <Block title="Evaluación">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text label="Técnicas de evaluación" value={evaluationTechniques} onChange={setEvaluationTechniques} rows={3} placeholder="Ej: Observación, análisis de producciones..." />
            <Text label="Instrumentos de evaluación" value={evaluationInstruments} onChange={setEvaluationInstruments} rows={3} placeholder="Ej: Lista de cotejo, rúbrica, ficha de observación..." />
          </div>
        </Block>

        <Block title="Recursos y materiales">
          <Textarea value={resources} onChange={setResources} rows={3} placeholder="Pizarra, fichas, videos, libros, materiales concretos..." />
        </Block>

        <Block title="Reflexiones del docente">
          <Textarea value={reflections} onChange={setReflections} rows={3} placeholder="¿Qué funcionó? ¿Qué mejorar?..." />
        </Block>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear planificación"}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-6 py-3 rounded-xl font-medium hover:bg-gray-50">Cancelar</button>
        </div>
      </form>
    </main>
  )
}

function Input({ label, value, onChange, placeholder }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
}

function Textarea({ value, onChange, placeholder, rows }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 4} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-y" />
}

function Text({ label, value, onChange, placeholder, rows }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><Textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} /></div>
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border p-6 space-y-4"><h2 className="text-lg font-semibold text-primary-700">{title}</h2>{children}</div>
}
