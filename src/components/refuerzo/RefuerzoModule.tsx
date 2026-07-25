"use client"

import { useState } from "react"
import { CREDIT_COSTS } from "@/lib/credits"
import { getNivelesRefuerzo, getAreasRefuerzo, generarRefuerzo, RefuerzoData } from "@/lib/refuerzo"

const nivelLabel: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" }

export default function RefuerzoModule() {
  const [nivel, setNivel] = useState("primaria")
  const [area, setArea] = useState("")
  const [estudiante, setEstudiante] = useState("")
  const [resultado, setResultado] = useState<RefuerzoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const niveles = getNivelesRefuerzo()
  const areas = getAreasRefuerzo(nivel)

  const handleGenerar = async () => {
    if (!area.trim() || !estudiante.trim()) {
      setError("Selecciona un área y escribe el nombre del estudiante")
      return
    }
    setError(""); setLoading(true)

    const res = await fetch("/api/credits/deduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "GENERATE_REFUERZO" }),
    })
    const creditData = await res.json()
    if (!res.ok) {
      setError(creditData.error === "Créditos insuficientes"
        ? `Créditos insuficientes. Tienes ${creditData.credits}, necesitas ${CREDIT_COSTS.GENERATE_REFUERZO}.`
        : creditData.error)
      setLoading(false); return
    }

    setResultado(generarRefuerzo(nivel, area, estudiante))
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-purple-100 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-4">🧠 Refuerzo y Recuperación</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Nivel</label>
            <select value={nivel} onChange={e => { setNivel(e.target.value); setArea("") }} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1">
              {niveles.map(n => <option key={n} value={n}>{nivelLabel[n] || n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Área</label>
            <select value={area} onChange={e => setArea(e.target.value)} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1">
              <option value="">Seleccionar</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Estudiante</label>
            <input value={estudiante} onChange={e => setEstudiante(e.target.value)} placeholder="Nombre del estudiante" className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1" />
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerar} disabled={loading}
              className="w-full text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Generando..." : `Generar (${CREDIT_COSTS.GENERATE_REFUERZO} cr)`}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {resultado && (
        <div className="bg-white rounded-xl border border-amber-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-amber-700 mb-3">Plan de Refuerzo — {resultado.estudiante}</h3>
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div className="bg-amber-50 rounded-lg px-3 py-2"><span className="font-semibold">Nivel:</span> {nivelLabel[resultado.nivel] || resultado.nivel}</div>
            <div className="bg-amber-50 rounded-lg px-3 py-2"><span className="font-semibold">Área:</span> {resultado.area}</div>
            <div className="bg-amber-50 rounded-lg px-3 py-2"><span className="font-semibold">Fecha inicio:</span> {resultado.fechaInicio}</div>
            <div className="bg-amber-50 rounded-lg px-3 py-2"><span className="font-semibold">Duración:</span> {resultado.duracion}</div>
          </div>

          <h4 className="text-xs font-bold text-gray-600 mt-4 mb-2">Competencias a reforzar</h4>
          <ul className="text-xs space-y-1 mb-4">
            {resultado.competencias.map((c, i) => <li key={i} className="bg-gray-50 rounded px-3 py-1.5">• {c}</li>)}
          </ul>

          <h4 className="text-xs font-bold text-gray-600 mt-4 mb-2">Estrategias metodológicas</h4>
          <ul className="text-xs space-y-1 mb-4">
            {resultado.estrategias.map((e, i) => <li key={i} className="bg-blue-50 rounded px-3 py-1.5">• {e}</li>)}
          </ul>

          <h4 className="text-xs font-bold text-gray-600 mt-4 mb-2">Actividades propuestas</h4>
          <ul className="text-xs space-y-1 mb-4">
            {resultado.actividades.map((a, i) => <li key={i} className="bg-green-50 rounded px-3 py-1.5">• {a}</li>)}
          </ul>

          <div className="text-xs text-gray-400 border-t border-gray-100 pt-3">
            <span className="font-semibold">Responsables:</span> {resultado.responsables}
          </div>
        </div>
      )}
    </div>
  )
}
