"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/useSession"
import { generarTemplate } from "@/lib/templates"
import { CREDIT_COSTS } from "@/lib/credits"
import RichTextEditor from "./RichTextEditor"

const nivelLabel: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" }

const templateHTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>{{titulo_doc}}</title>
<style>
@page { size: A4; margin: 30mm 20mm 25mm 20mm; }
body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; font-size: 11pt; line-height: 1.3; }
*,*::before,*::after { box-sizing: border-box; }
h1,h2,h3,h4,h5,h6 { margin-top: 10px; margin-bottom: 10px; }
p { margin-top: 5px; margin-bottom: 5px; }
ul,ol { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
li { margin-bottom: 3px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
th,td { border: 1px solid #000; padding: 5px; text-align: left; vertical-align: top; font-size: 10pt; }
.header-title { text-align: center; font-weight: bold; }
.section-title { font-weight: bold; margin-top: 15px; font-size: 12pt; page-break-after: avoid; }
.table-no-border,.table-no-border td { border: none !important; }
.header-logos { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px; }
.header-logos img { max-height: 60px; width: auto; }
.header-logos .header-text { flex: 1; text-align: center; }
.firma { text-align: center; margin-top: 30px; }
.firma-line { display: inline-block; width: 200px; border-top: 1px solid #000; padding-top: 5px; margin-top: 50px; }
.reminder-box { background:#fff3cd; border:1px solid #ffc107; border-left:4px solid #ffc107; padding:8px; margin:5px 0; border-radius:4px; font-size:10pt; }
/* Page header – repeats on every printed page */
.page-header { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 9pt; color: #555; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
.page-header img { max-height: 22px; width: auto; }
.page-footer { text-align: center; font-size: 9pt; color: #555; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 6px; }
@media print {
  .page-header { position: fixed; top: 0; left: 0; right: 0; background: #fff; z-index: 1000; margin-bottom: 0; padding: 6px 20px; }
  .page-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; z-index: 1000; margin-top: 0; padding: 6px 20px; }
  body { padding-top: 45px; padding-bottom: 30px; }
  main { padding-top: 10px; }
  table { page-break-inside: avoid; }
}
</style>
</head>
<body>

<div class="page-header">{{img_izquierda_html}} <span>{{encabezado}}</span> {{img_derecha_html}}</div>

<header>
  <div class="header-logos">
    {{img_izquierda_html}}
    <div class="header-text"><h1 style="margin:0;">{{titulo_principal}}</h1></div>
    {{img_derecha_html}}
  </div>
  <table class="table-no-border">
    <tr>
      <td style="width:50%">
        <p><strong>I.E.:</strong> {{nombre_ie}}</p>
        <p><strong>Área curricular:</strong> {{area}}</p>
        <p><strong>Sesión de aprendizaje N°:</strong> {{sesion_nro}}</p>
        <p><strong>Docente de aula:</strong> {{docentes}}</p>
      </td>
      <td style="width:50%">
        <p><strong>Docente practicante:</strong> {{practicante}}</p>
        <p><strong>Grado y sección:</strong> {{grado}} "{{seccion}}"</p>
        <p><strong>Duración:</strong> {{duracion}}</p>
        <p><strong>Lugar y fecha:</strong> {{fecha}}</p>
      </td>
    </tr>
  </table>
</header>

<main>
  <h2 class="section-title" style="{{estilo_th}}">I. PROPÓSITOS DE APRENDIZAJE</h2>

  <table>
    <thead>
      <tr>
        <th style="width:18%;{{estilo_th}}">COMPETENCIAS</th>
        <th style="width:18%;{{estilo_th}}">CAPACIDADES</th>
        <th style="width:22%;{{estilo_th}}">DESEMPEÑOS 1°</th>
        <th style="width:22%;{{estilo_th}}">DESEMPEÑOS 2°</th>
        <th style="width:20%;{{estilo_th}}">CRITERIOS DE EVALUACIÓN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="{{estilo_celda}}">{{competencias}}</td>
        <td style="{{estilo_celda}}">{{capacidades}}</td>
        <td style="{{estilo_celda}}">{{desempenios_1}}</td>
        <td style="{{estilo_celda}}">{{desempenios_2}}</td>
        <td style="{{estilo_celda}}">{{criterios_evaluacion}}</td>
      </tr>
      <tr>
        <td style="{{estilo_celda}}"><strong>Gestiona su aprendizaje de manera autónoma</strong><br/><br/>Define metas de aprendizaje.<br/>Organiza acciones estratégicas.<br/>Monitorea y ajusta su desempeño.</td>
        <td style="{{estilo_celda}}" colspan="4">{{gestion_aprendizaje}}</td>
      </tr>
      <tr>
        <td colspan="5" style="background:#f0fdf4;border:1px solid #000;padding:5px;">
          <strong>EVIDENCIA DE APRENDIZAJE:</strong> {{evidencia}}
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="section-title" style="{{estilo_th}}">ENFOQUES TRANSVERSALES</h2>
  <table>
    <thead><tr><th style="{{estilo_th}}">ENFOQUE</th><th style="{{estilo_th}}">ACTITUD OBSERVABLE</th></tr></thead>
    <tbody><tr><td style="{{estilo_celda}}">{{enfoque_nombre}}</td><td style="{{estilo_celda}}">{{enfoques}}</td></tr></tbody>
  </table>

  <h2 class="section-title" style="{{estilo_th}}">II. ANTES DE LA SESIÓN (preparación)</h2>
  <table>
    <thead><tr><th style="{{estilo_th}}">¿QUÉ NECESITAMOS HACER ANTES DE LA SESIÓN?</th><th style="{{estilo_th}}">MATERIALES / RECURSOS</th><th style="{{estilo_th}}">TIEMPO</th></tr></thead>
    <tbody><tr><td style="{{estilo_celda}}">{{preparacion}}</td><td style="{{estilo_celda}}">{{recursos}}</td><td style="{{estilo_celda}}">{{duracion}}</td></tr></tbody>
  </table>

  <h2 class="section-title" style="{{estilo_th}}">III. MOMENTOS DE LA SESIÓN</h2>
  <table>
    <thead><tr><th style="width:15%;{{estilo_th}}">MOMENTOS</th><th style="{{estilo_th}}">ACTIVIDADES / ESTRATEGIAS</th></tr></thead>
    <tbody>
    <tr>
      <td style="font-weight:bold;text-align:center;vertical-align:middle;{{estilo_th}}">INICIO</td>
      <td style="{{estilo_celda}}">{{seq_inicio}}</td>
    </tr>
    <tr>
      <td style="font-weight:bold;text-align:center;vertical-align:middle;background:#e0e7ff;">ANTES DE LA LECTURA</td>
      <td style="{{estilo_celda}}">{{antes_lectura}}</td>
    </tr>
    <tr>
      <td style="font-weight:bold;text-align:center;vertical-align:middle;background:#e0e7ff;">DURANTE LA LECTURA</td>
      <td style="{{estilo_celda}}">{{durante_lectura}}</td>
    </tr>
    <tr>
      <td style="font-weight:bold;text-align:center;vertical-align:middle;background:#e0e7ff;">DESPUÉS DE LA LECTURA</td>
      <td style="{{estilo_celda}}">{{despues_lectura}}</td>
    </tr>
    <tr>
      <td style="font-weight:bold;text-align:center;vertical-align:middle;{{estilo_th}}">CIERRE</td>
      <td style="{{estilo_celda}}">{{seq_cierre}}</td>
    </tr>
    </tbody>
  </table>

  <h2 class="section-title" style="{{estilo_th}}">IV. EVALUACIÓN</h2>
  <table><thead><tr><th style="{{estilo_th}}">TÉCNICAS</th><th style="{{estilo_th}}">INSTRUMENTOS</th></tr></thead><tbody><tr><td style="{{estilo_celda}}">{{eval_tecnicas}}</td><td style="{{estilo_celda}}">{{eval_instrumentos}}</td></tr></tbody></table>

  <h2 class="section-title" style="{{estilo_th}}">V. REFLEXIONES</h2>
  <table><tr><td style="{{estilo_celda}}">{{reflexiones}}</td></tr></table>

  <!-- Firmas -->
  <table class="table-no-border" style="margin-top:50px;">
    <tr>
      <td style="text-align:center;width:33%;">
        <div style="border-top:1px solid #000;width:200px;margin:0 auto;padding-top:5px;">{{practicante}}</div>
        <p style="font-size:9pt;margin-top:3px;">Docente practicante</p>
      </td>
      <td style="text-align:center;width:33%;">
        <div style="border-top:1px solid #000;width:200px;margin:0 auto;padding-top:5px;">{{docentes}}</div>
        <p style="font-size:9pt;margin-top:3px;">Docente de aula</p>
      </td>
      <td style="text-align:center;width:33%;">
        <div style="border-top:1px solid #000;width:200px;margin:0 auto;padding-top:5px;">{{practicante}}</div>
        <p style="font-size:9pt;margin-top:3px;">Docente FID</p>
      </td>
    </tr>
  </table>
</main>

<div class="page-footer">{{pie_pagina}}</div>

</body>
</html>`

function renderHTML(tpl: string, vals: Record<string, string>): string {
  let h = tpl
  for (const [k, v] of Object.entries(vals)) {
    if (k === "img_izquierda") {
      h = h.replaceAll("{{img_izquierda_html}}", v ? `<img src="${v}" alt="Logo izquierdo" />` : "")
    } else if (k === "img_derecha") {
      h = h.replaceAll("{{img_derecha_html}}", v ? `<img src="${v}" alt="Logo derecho" />` : "")
    } else {
      h = h.replaceAll(`{{${k}}}`, v || `<span style="color:#bbb">[${k}]</span>`)
    }
  }
  return h
}

interface PlanData {
  id?: string; level?: string; institution?: string; teacher?: string; grade?: string
  section?: string; subject?: string; title?: string; duration?: string
  purpose?: string; competencies?: string; capacities?: string; performance?: string
  evidence?: string; transversalApproaches?: string; sequence?: string
  evaluationTechniques?: string; evaluationInstruments?: string; resources?: string; reflections?: string
}

export default function PlanEditorHTML({ plan }: { plan?: PlanData }) {
  const router = useRouter()
  const isEdit = !!plan?.id

  const [level, setLevel] = useState(plan?.level || "primaria")
  const [institution, setInstitution] = useState(plan?.institution || "")
  const [teacher, setTeacher] = useState(plan?.teacher || "")
  const [grade, setGrade] = useState(plan?.grade || "")
  const [section, setSection] = useState(plan?.section || "")
  const [subject, setSubject] = useState(plan?.subject || "")
  const [title, setTitle] = useState(plan?.title || "")
  const [duration, setDuration] = useState(plan?.duration || "")
  const [sesionNro, setSesionNro] = useState("")
  const [fecha, setFecha] = useState(new Date().toLocaleDateString("es-PE"))
  const [purpose, setPurpose] = useState(plan?.purpose || "")
  const [competencies, setCompetencies] = useState(plan?.competencies || "")
  const [capacities, setCapacities] = useState(plan?.capacities || "")
  const [performance, setPerformance] = useState(plan?.performance || "")
  const [evidence, setEvidence] = useState(plan?.evidence || "")
  const [transversalApproaches, setTransversalApproaches] = useState(plan?.transversalApproaches || "")
  const parsed = (() => { try { return JSON.parse(plan?.sequence || "{}") } catch { return {} } })()
  const [seqInicio, setSeqInicio] = useState(parsed.inicio || "")
  const [seqDesarrollo, setSeqDesarrollo] = useState(parsed.desarrollo || "")
  const [seqDurante, setSeqDurante] = useState("")
  const [seqDespues, setSeqDespues] = useState("")
  const [seqCierre, setSeqCierre] = useState(parsed.cierre || "")
  const [gestionAprendizaje, setGestionAprendizaje] = useState("")
  const [evaluationTechniques, setEvaluationTechniques] = useState(plan?.evaluationTechniques || "")
  const [evaluationInstruments, setEvaluationInstruments] = useState(plan?.evaluationInstruments || "")
  const [resources, setResources] = useState(plan?.resources || "")
  const [reflections, setReflections] = useState(plan?.reflections || "")
  const [practicante, setPracticante] = useState("")
  const [showPracticante, setShowPracticante] = useState(true)
  const [encabezado, setEncabezado] = useState("")
  const [piePagina, setPiePagina] = useState("")
  const [imgIzquierda, setImgIzquierda] = useState("")
  const [imgDerecha, setImgDerecha] = useState("")
  // Table styling
  const [colorTh, setColorTh] = useState("#e0e7ff")
  const [colorTextTh, setColorTextTh] = useState("#000000")
  const [colorCelda, setColorCelda] = useState("#ffffff")
  const [loading, setLoading] = useState(false)
  const [autofilling, setAutofilling] = useState(false)
  const [aiFilling, setAiFilling] = useState(false)
  const [error, setError] = useState("")
  const { data: session } = useSession()
  const [showConfirm, setShowConfirm] = useState<"pdf" | "word" | "pptx" | null>(null)
  const [exporting, setExporting] = useState(false)

  const handleImage = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setter(reader.result as string)
    reader.readAsDataURL(file)
  }

  const estiloTh = `background-color:${colorTh};color:${colorTextTh};`
  const estiloCelda = `background-color:${colorCelda};`

  const templateVals = {
    img_izquierda: imgIzquierda,
    img_derecha: imgDerecha,
    encabezado: encabezado || `I.E. ${institution || "..."} - ${nivelLabel[level]}`,
    titulo_doc: title || "Sesión de Aprendizaje",
    titulo_principal: title || "Sesión de Aprendizaje",
    nombre_ie: institution || "",
    nivel_modalidad: nivelLabel[level],
    docentes: teacher || "",
    practicante: showPracticante ? practicante || "&nbsp;" : "&nbsp;",
    sesion_nro: sesionNro || "&nbsp;",
    grado: grade || "",
    seccion: section || "",
    area: subject || "",
    duracion: duration || "",
    fecha: fecha || new Date().toLocaleDateString("es-PE"),
    competencias: competencies || "",
    capacidades: capacities || "",
    desempenios_1: performance || "",
    desempenios_2: performance || "",
    criterios_evaluacion: purpose || "",
    evidencia: evidence || "",
    gestion_aprendizaje: gestionAprendizaje || "",
    enfoque_nombre: "Orientación al bien común",
    enfoques: transversalApproaches || "",
    preparacion: resources || "",
    recursos: resources || "",
    seq_inicio: seqInicio || "",
    antes_lectura: seqDesarrollo || "",
    durante_lectura: seqDurante || "",
    despues_lectura: seqDespues || "",
    seq_cierre: seqCierre || "",
    eval_tecnicas: evaluationTechniques || "",
    eval_instrumentos: evaluationInstruments || "",
    reflexiones: reflections || "",
    pie_pagina: piePagina || `Docente: ${teacher || "_______________"}`,
    estilo_th: estiloTh,
    estilo_celda: estiloCelda,
  }

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
    if (tpl.seqDurante) setSeqDurante(tpl.seqDurante)
    if (tpl.seqDespues) setSeqDespues(tpl.seqDespues)
    if (tpl.seqCierre) setSeqCierre(tpl.seqCierre)
    if (tpl.gestionAprendizaje) setGestionAprendizaje(tpl.gestionAprendizaje)
    if (tpl.evaluationTechniques) setEvaluationTechniques(tpl.evaluationTechniques)
    if (tpl.evaluationInstruments) setEvaluationInstruments(tpl.evaluationInstruments)
    if (tpl.resources) setResources(tpl.resources)
    if (tpl.reflections) setReflections(tpl.reflections)
    setAutofilling(false)
  }, [level, subject, title])

  const autoFillAI = useCallback(async () => {
    if (!title.trim() || !subject.trim()) {
      setError("Completa título y asignatura primero para autorellenar con IA")
      return
    }
    setAiFilling(true)
    setError("")
    try {
      const res = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "AUTO_FILL" }),
      })
      const creditData = await res.json()
      if (!res.ok) {
        setError(creditData.error === "Créditos insuficientes"
          ? `Créditos insuficientes. Tienes ${creditData.credits}, necesitas ${CREDIT_COSTS.AUTO_FILL}.`
          : creditData.error)
        setAiFilling(false); return
      }

      const aiRes = await fetch("/api/ai/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nivel: level, area: subject, titulo: title, grado: grade }),
      })
      const aiData = await aiRes.json()
      if (!aiRes.ok) { setError(aiData.error); setAiFilling(false); return }

      const d = aiData.data
      if (d.competencies) setCompetencies(d.competencies)
      if (d.capacities) setCapacities(d.capacities)
      if (d.performance) setPerformance(d.performance)
      if (d.purpose) setPurpose(d.purpose)
      if (d.evidence) setEvidence(d.evidence)
      if (d.transversalApproaches) setTransversalApproaches(d.transversalApproaches)
      if (d.seqInicio) setSeqInicio(d.seqInicio)
      if (d.seqDesarrollo) setSeqDesarrollo(d.seqDesarrollo)
      if (d.seqDurante) setSeqDurante(d.seqDurante)
      if (d.seqDespues) setSeqDespues(d.seqDespues)
      if (d.seqCierre) setSeqCierre(d.seqCierre)
      if (d.gestionAprendizaje) setGestionAprendizaje(d.gestionAprendizaje)
      if (d.evaluationTechniques) setEvaluationTechniques(d.evaluationTechniques)
      if (d.evaluationInstruments) setEvaluationInstruments(d.evaluationInstruments)
      if (d.resources) setResources(d.resources)
      if (d.reflections) setReflections(d.reflections)
    } catch {
      setError("Error de conexión con la IA")
    }
    setAiFilling(false)
  }, [level, subject, title, grade])

  const getActionName = (f: string) => f === "pdf" ? "EXPORT_PDF" : f === "word" ? "EXPORT_WORD" : "GENERATE_PPTX"

  const handleExport = useCallback(async (format: "pdf" | "word" | "pptx") => {
    setExporting(true)
    try {
      const res = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: getActionName(format) }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 402) {
          setError(`Creditos insuficientes. Tienes ${data.credits}, necesitas ${data.cost}.`)
        } else {
          setError(data.error || "Error al procesar exportacion")
        }
        setExporting(false); setShowConfirm(null)
        return
      }

      const html = renderHTML(templateHTML, { ...templateVals, pie_pagina: (templateVals.pie_pagina || "") + " | Generado por SIPED" })

      const exportRes = await fetch(`/api/exportar/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, title: title || "Sesion de Aprendizaje" }),
      })
      if (!exportRes.ok) {
        const err = await exportRes.json()
        setError(err.error || "Error al exportar")
        setExporting(false); setShowConfirm(null)
        return
      }

      const blob = await exportRes.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title || "sesion"}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      const remaining = exportRes.headers.get("X-Credits-Remaining") || data.credits
      setError(`Exportado correctamente. Creditos restantes: ${remaining}`)
    } catch {
      setError("Error de conexion al exportar")
    }
    setExporting(false); setShowConfirm(null)
  }, [templateHTML, templateVals, title])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    if (!title.trim() || !subject.trim() || !grade.trim()) {
      setError("Título, asignatura y grado son requeridos"); setLoading(false); return
    }
    const sequence = JSON.stringify({ inicio: seqInicio, desarrollo: seqDesarrollo, cierre: seqCierre })
    const body = { level, institution, teacher, grade, section, subject, title, duration, purpose, competencies, capacities, performance, evidence, transversalApproaches, sequence, evaluationTechniques, evaluationInstruments, resources, reflections }
    const url = isEdit ? `/api/planificaciones/${plan.id}` : "/api/planificaciones"
    const method = isEdit ? "PATCH" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (res.ok) { router.push("/planificaciones"); router.refresh() }
    else { const d = await res.json(); setError(d.error || "Error al guardar") }
    setLoading(false)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* LEFT: Form (4/12) */}
      <form onSubmit={handleSubmit} className="w-4/12 overflow-y-auto bg-white/90 backdrop-blur-sm border-r border-gray-200 p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-700">
            <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">{isEdit ? "Editar" : "Nueva"} planificación</span>
          </h2>
        </div>

        {error && <div className="text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2">{error}</div>}

        {/* Encabezado */}
        <div className="bg-gradient-to-r from-purple-50 to-cyan-50 -mx-5 px-5 py-3 border-b border-purple-100 space-y-2">
          <label className="text-xs font-semibold text-purple-700 mb-1 block">📌 Encabezado</label>
          <input value={encabezado} onChange={e => setEncabezado(e.target.value)} placeholder="Ej: I.E. San José - 2025" className="w-full text-xs border border-purple-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-medium text-purple-500 block mb-0.5">Logo izquierdo</label>
              <input type="file" accept="image/*" onChange={handleImage(setImgIzquierda)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
              {imgIzquierda && <button type="button" onClick={() => setImgIzquierda("")} className="text-[10px] text-red-400 hover:text-red-600 mt-0.5">Eliminar</button>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-purple-500 block mb-0.5">Logo derecho</label>
              <input type="file" accept="image/*" onChange={handleImage(setImgDerecha)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
              {imgDerecha && <button type="button" onClick={() => setImgDerecha("")} className="text-[10px] text-red-400 hover:text-red-600 mt-0.5">Eliminar</button>}
            </div>
          </div>
        </div>

        {/* Datos generales */}
        <FieldSection title="Datos generales" color="purple">
          <Select value={level} onChange={(e: any) => setLevel(e.target.value)} options={[["inicial","Inicial"],["primaria","Primaria"],["secundaria","Secundaria"]]} />
          <Field label="Institución" value={institution} onChange={(e: any) => setInstitution(e.target.value)} />
          <Field label="Docente" value={teacher} onChange={(e: any) => setTeacher(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Grado" value={grade} onChange={(e: any) => setGrade(e.target.value)} />
            <Field label="Sección" value={section} onChange={(e: any) => setSection(e.target.value)} />
          </div>
          <Field label="Asignatura" value={subject} onChange={(e: any) => setSubject(e.target.value)} />
          <Field label="Título de la sesión" value={title} onChange={(e: any) => setTitle(e.target.value)} />
          <Field label="Duración" value={duration} onChange={(e: any) => setDuration(e.target.value)} placeholder="Ej: 90 min" />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Field label="Practicante" value={practicante} onChange={(e: any) => setPracticante(e.target.value)} placeholder="Nombre del practicante" />
            </div>
            <label className="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap mt-5">
              <input type="checkbox" checked={showPracticante} onChange={e => setShowPracticante(e.target.checked)} className="accent-purple-600" />
              Mostrar en plantilla
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Sesión N°" value={sesionNro} onChange={(e: any) => setSesionNro(e.target.value)} placeholder="Ej: 1" />
            <Field label="Lugar y fecha" value={fecha} onChange={(e: any) => setFecha(e.target.value)} placeholder="Ej: 24/7/2026" />
          </div>
        </FieldSection>

        {/* Auto-llenar */}
        <div className="flex justify-center -mx-5 px-5 gap-2">
          <button type="button" onClick={autoFill} disabled={autofilling}
            className="flex-1 text-sm bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition shadow-md shadow-purple-200 flex items-center justify-center gap-2">
            {autofilling ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generando...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Auto-llenar (plantillas)</>
            )}
          </button>
          <button type="button" onClick={autoFillAI} disabled={aiFilling}
            className="flex-1 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2">
            {aiFilling ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> IA pensando...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Auto-llenar (IA) {CREDIT_COSTS.AUTO_FILL}cr</>
            )}
          </button>
        </div>

        {/* Propósito y currículo */}
        <FieldSection title="Propósito y currículo" color="cyan">
          <RichField label="Propósito" value={purpose} onChange={setPurpose} />
          <RichField label="Competencias" value={competencies} onChange={setCompetencies} />
          <RichField label="Capacidades" value={capacities} onChange={setCapacities} />
          <RichField label="Desempeños" value={performance} onChange={setPerformance} />
          <RichField label="Evidencia" value={evidence} onChange={setEvidence} />
          <RichField label="Enfoques transversales" value={transversalApproaches} onChange={setTransversalApproaches} />
        </FieldSection>

        {/* Secuencia didáctica */}
        <FieldSection title="Secuencia didáctica" color="emerald">
          <RichField label="Inicio" value={seqInicio} onChange={setSeqInicio} />
          <RichField label="Desarrollo" value={seqDesarrollo} onChange={setSeqDesarrollo} />
          <RichField label="Cierre" value={seqCierre} onChange={setSeqCierre} />
        </FieldSection>

        {/* Evaluación y recursos */}
        <FieldSection title="Evaluación y recursos" color="amber">
          <RichField label="Técnicas de evaluación" value={evaluationTechniques} onChange={setEvaluationTechniques} />
          <RichField label="Instrumentos" value={evaluationInstruments} onChange={setEvaluationInstruments} />
          <RichField label="Recursos" value={resources} onChange={setResources} />
          <RichField label="Reflexiones" value={reflections} onChange={setReflections} />
        </FieldSection>

        {/* Estilos de tabla */}
        <FieldSection title="Estilos de tabla" color="purple">
          <ColorField label="Fondo de encabezados" value={colorTh} onChange={setColorTh} />
          <ColorField label="Texto de encabezados" value={colorTextTh} onChange={setColorTextTh} />
          <ColorField label="Fondo de celdas" value={colorCelda} onChange={setColorCelda} />
          {/* Preview de los colores */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 mt-1">
            <div className="flex-1 text-center text-[10px] py-1 font-medium" style={{ background: colorTh, color: colorTextTh }}>Encabezado</div>
            <div className="flex-1 text-center text-[10px] py-1" style={{ background: colorCelda }}>Celda</div>
          </div>
        </FieldSection>

        {/* Pie de página */}
        <div className="bg-gradient-to-r from-amber-50 to-gray-50 -mx-5 px-5 py-3 border-t border-amber-200">
          <label className="text-xs font-semibold text-amber-700 mb-1 block">📄 Pie de página</label>
          <input value={piePagina} onChange={e => setPiePagina(e.target.value)} placeholder="Ej: Docente: ..." className="w-full text-xs border border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-purple-200">
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</span> : (isEdit ? "Actualizar planificación" : "Crear planificación")}
        </button>
      </form>

      {/* RIGHT: Preview (8/12) */}
      <div className="w-8/12 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-purple-50/20">
        <div className="sticky top-0 z-10 px-6 py-3 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600">📄 Vista previa</h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{session?.user?.credits ?? "?"} creditos</span>
            <button type="button" onClick={() => setShowConfirm("pdf")} disabled={exporting}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50">
              {exporting && showConfirm === "pdf" ? "..." : "PDF"}
            </button>
            <button type="button" onClick={() => setShowConfirm("word")} disabled={exporting}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50">
              {exporting && showConfirm === "word" ? "..." : "Word"}
            </button>
            <button type="button" onClick={() => setShowConfirm("pptx")} disabled={exporting}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50">
              {exporting && showConfirm === "pptx" ? "..." : "PPTX"}
            </button>
          </div>
        </div>
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowConfirm(null)}>
            <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Confirmar exportacion</h3>
              <p className="text-xs text-gray-500 mb-1">
                Se utilizara <strong>{showConfirm === "pdf" ? CREDIT_COSTS.EXPORT_PDF : showConfirm === "word" ? CREDIT_COSTS.EXPORT_WORD : CREDIT_COSTS.GENERATE_PPTX} creditos</strong> para exportar en formato <strong>{showConfirm.toUpperCase()}</strong>.
              </p>
              <p className="text-[10px] text-amber-600 mb-4">Esta accion es irreversible y descontara creditos de tu plan.</p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowConfirm(null)} className="text-xs px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button onClick={() => handleExport(showConfirm)} disabled={exporting}
                  className="text-xs px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
                  {exporting ? "Exportando..." : "Confirmar y exportar"}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6 flex justify-center">
          <div
            className="w-[210mm] min-h-[297mm] bg-white shadow-2xl border p-8 rounded-sm"
            dangerouslySetInnerHTML={{ __html: renderHTML(templateHTML, templateVals) }}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------- Helpers ---------- */

function FieldSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    purple: "from-purple-50 to-white border-purple-200 text-purple-700",
    cyan: "from-cyan-50 to-white border-cyan-200 text-cyan-700",
    emerald: "from-emerald-50 to-white border-emerald-200 text-emerald-700",
    amber: "from-amber-50 to-white border-amber-200 text-amber-700",
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color] || colors.purple} border rounded-xl p-3 space-y-2`}>
      <h3 className={`text-xs font-bold bg-gradient-to-r ${color === "purple" ? "from-purple-600 to-purple-400" : color === "cyan" ? "from-cyan-600 to-cyan-400" : color === "emerald" ? "from-emerald-600 to-emerald-400" : "from-amber-600 to-amber-400"} bg-clip-text text-transparent`}>{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-0.5 block">{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400" />
    </div>
  )
}

function RichField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-0.5 block">{label}</label>
      <RichTextEditor value={value} onChange={onChange} minHeight={70} />
    </div>
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: [string, string][] }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-0.5 block">Nivel</label>
      <select value={value} onChange={onChange} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-gray-500 flex-1">{label}</label>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 p-0.5 border border-gray-300 rounded cursor-pointer" />
      <input value={value} onChange={e => onChange(e.target.value)} className="w-20 text-[10px] border border-gray-200 rounded px-1.5 py-1 font-mono" />
    </div>
  )
}
