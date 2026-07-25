"use client"

import { useState, useEffect } from "react"
import { generarRubrica, generarListaCotejo, generarExamen } from "@/lib/evaluacion"

type TabType = "rubrica" | "lista" | "examen"

interface SavedItem {
  id: string
  tipo: string
  titulo: string
  contenido: string
  createdAt: string
}

export default function EvaluacionModule() {
  const [nivel, setNivel] = useState<string>("primaria")
  const [asignatura, setAsignatura] = useState<string>("")
  const [titulo, setTitulo] = useState<string>("")
  const [tab, setTab] = useState<TabType>("rubrica")
  const [generado, setGenerado] = useState<boolean>(false)
  const [saved, setSaved] = useState<SavedItem[]>([])
  const [saving, setSaving] = useState(false)

  const rubrica = generarRubrica(nivel as any, asignatura)
  const lista = generarListaCotejo(nivel as any, asignatura, titulo)
  const examen = generarExamen(nivel as any, asignatura, titulo)

  const niveles = [["inicial","Inicial"],["primaria","Primaria"],["secundaria","Secundaria"]]

  useEffect(() => {
    fetch("/api/evaluaciones").then(r => r.json()).then(d => setSaved(d)).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      nivel,
      area: asignatura,
      tipo: tab,
      titulo: titulo || `Instrumento de ${asignatura}`,
      contenido: JSON.stringify({ rubrica, lista, examen }),
    }
    const res = await fetch("/api/evaluaciones", {
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
      <div className="bg-white rounded-xl border border-purple-100 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-4">📝 Evaluación — Instrumentos</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Nivel</label>
            <select value={nivel} onChange={e => setNivel(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1">
              {niveles.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
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
          {([["rubrica","Rúbrica"],["lista","Lista de cotejo"],["examen","Examen"]] as [TabType, string][]).map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${tab === k ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {lbl}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setGenerado(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-md">
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
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          {tab === "rubrica" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Rúbrica analítica</h3>
              <p className="text-[10px] text-gray-400 mb-3">Nivel: {nivel} | Asignatura: {asignatura}</p>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-purple-200 p-2 text-left">Criterio</th>
                    <th className="border border-purple-200 p-2">Inicio</th>
                    <th className="border border-purple-200 p-2">Proceso</th>
                    <th className="border border-purple-200 p-2">Logrado</th>
                    <th className="border border-purple-200 p-2">Destacado</th>
                  </tr>
                </thead>
                <tbody>
                  {rubrica.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-200 p-2 font-medium">{item.criterio}</td>
                      {item.niveles.map((n, j) => (
                        <td key={j} className="border border-gray-200 p-2">{n}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "lista" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Lista de cotejo</h3>
              <p className="text-[10px] text-gray-400 mb-3">Sesión: {titulo || "(sin título)"}</p>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-green-100">
                    <th className="border border-green-200 p-2 text-left w-3/4">Indicador</th>
                    <th className="border border-green-200 p-2 w-1/12 text-center">Sí</th>
                    <th className="border border-green-200 p-2 w-1/12 text-center">No</th>
                    <th className="border border-green-200 p-2 text-center">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.indicadores.map((ind, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-200 p-2">{i + 1}. {ind}</td>
                      <td className="border border-gray-200 p-2 text-center"><input type="checkbox" className="accent-green-500" /></td>
                      <td className="border border-gray-200 p-2 text-center"><input type="checkbox" className="accent-red-500" /></td>
                      <td className="border border-gray-200 p-2" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "examen" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Práctica calificada</h3>
              <p className="text-[10px] text-gray-400 mb-3">Asignatura: {asignatura} | Tema: {titulo}</p>
              <div className="space-y-4">
                <div className="text-right text-xs text-gray-400 mb-2">
                  Nombre: ______________________ Fecha: ___________ Nota: ____
                </div>
                {examen.map((sec, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-xs bg-gray-100 p-2 rounded mb-2">{sec.tipo}</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      {sec.preguntas.map((p, j) => (
                        <li key={j} className="text-xs">{p}
                          <div className="mt-2 border-b border-dotted border-gray-300 h-6" />
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {saved.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-600 mb-3">📂 Instrumentos guardados</h3>
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
