"use client"

import { useState, useEffect } from "react"
import { generarFicha, generarLectura } from "@/lib/materiales"

interface SavedItem {
  id: string
  tipo: string
  titulo: string
  contenido: string
  createdAt: string
}

export default function MaterialesModule() {
  const [nivel, setNivel] = useState<string>("primaria")
  const [asignatura, setAsignatura] = useState<string>("")
  const [titulo, setTitulo] = useState<string>("")
  const [tab, setTab] = useState<"ficha" | "lectura">("ficha")
  const [generado, setGenerado] = useState(false)
  const [saved, setSaved] = useState<SavedItem[]>([])
  const [saving, setSaving] = useState(false)

  const ficha = generarFicha(nivel as any, asignatura, titulo)
  const lectura = generarLectura(nivel as any, asignatura, titulo)

  useEffect(() => {
    fetch("/api/materiales").then(r => r.json()).then(d => setSaved(d)).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      nivel,
      area: asignatura,
      tipo: tab,
      titulo: titulo || `${tab === "ficha" ? "Ficha" : "Lectura"} de ${asignatura}`,
      contenido: JSON.stringify({ ficha, lectura }),
    }
    const res = await fetch("/api/materiales", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    })
    if (res.ok) {
      const item = await res.json()
      setSaved(prev => [item, ...prev])
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-cyan-100 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-4">📚 Materiales educativos</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Nivel</label>
            <select value={nivel} onChange={e => setNivel(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1">
              {[["inicial","Inicial"],["primaria","Primaria"],["secundaria","Secundaria"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Asignatura</label>
            <input value={asignatura} onChange={e => setAsignatura(e.target.value)} placeholder="Ej: Comunicación"
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Título</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título de la sesión"
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1" />
          </div>
        </div>

        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
          {([["ficha","Ficha de trabajo"],["lectura","Lectura"]] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${tab === k ? "bg-white text-cyan-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {lbl}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setGenerado(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-md">
            Generar
          </button>
          {generado && (
            <button onClick={handleSave} disabled={saving}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar en BD"}
            </button>
          )}
        </div>
      </div>

      {generado && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          {tab === "ficha" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">{ficha.titulo}</h3>
              <p className="text-[10px] text-gray-400 mb-3">Nivel: {ficha.nivel} | Asignatura: {ficha.asignatura}</p>
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Indicaciones:</h4>
              <ul className="list-disc pl-5 text-xs space-y-1 mb-4">
                {ficha.indicaciones.map((ind, i) => <li key={i}>{ind}</li>)}
              </ul>
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Actividades:</h4>
              <ol className="list-decimal pl-5 text-xs space-y-3">
                {ficha.actividades.map((act, i) => (
                  <li key={i}>{act}<div className="border-b border-dotted border-gray-300 h-8 mt-1" /></li>
                ))}
              </ol>
            </div>
          )}
          {tab === "lectura" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">{lectura.titulo}</h3>
              <p className="text-[10px] text-gray-400 mb-3">Nivel: {nivel} | Asignatura: {asignatura}</p>
              <div className="bg-gray-50 border rounded-lg p-4 mb-4 text-xs leading-relaxed whitespace-pre-line">{lectura.texto}</div>
              <h4 className="text-xs font-semibold text-gray-600 mb-2">Preguntas de comprensión:</h4>
              <ol className="list-decimal pl-5 text-xs space-y-3">
                {lectura.preguntas.map((p, i) => (
                  <li key={i}>{p}<div className="border-b border-dotted border-gray-300 h-8 mt-1" /></li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {saved.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-600 mb-3">📂 Materiales guardados</h3>
          <div className="space-y-2">
            {saved.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
                <span className="font-medium text-gray-700">{item.titulo}</span>
                <span className="text-gray-400">{item.tipo} | {new Date(item.createdAt).toLocaleDateString("es-PE")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
