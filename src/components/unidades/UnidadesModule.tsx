"use client"

import { useState } from "react"
import { CREDIT_COSTS } from "@/lib/credits"
import { getNivelesUnidades, getAreasUnidades, getTitulosUnidades, generarUnidad, UnidadData } from "@/lib/unidades"

const nivelLabel: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" }

export default function UnidadesModule() {
  const [nivel, setNivel] = useState("primaria")
  const [area, setArea] = useState("")
  const [unidadIdx, setUnidadIdx] = useState(0)
  const [resultado, setResultado] = useState<UnidadData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const niveles = getNivelesUnidades()
  const areas = getAreasUnidades(nivel)
  const titulos = getTitulosUnidades(nivel, area)

  const handleGenerar = async () => {
    if (!area.trim()) { setError("Selecciona un área"); return }
    setError(""); setLoading(true)

    const res = await fetch("/api/credits/deduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "GENERATE_UNIDAD" }),
    })
    const creditData = await res.json()
    if (!res.ok) {
      setError(creditData.error === "Créditos insuficientes"
        ? `Créditos insuficientes. Tienes ${creditData.credits}, necesitas ${CREDIT_COSTS.GENERATE_UNIDAD}.`
        : creditData.error)
      setLoading(false); return
    }

    setResultado(generarUnidad(nivel, area, unidadIdx))
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-cyan-100 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-4">📚 Unidades Didácticas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Nivel</label>
            <select value={nivel} onChange={e => { setNivel(e.target.value); setArea(""); setUnidadIdx(0) }} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1">
              {niveles.map(n => <option key={n} value={n}>{nivelLabel[n] || n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-semibold text-gray-400">Área</label>
            <select value={area} onChange={e => { setArea(e.target.value); setUnidadIdx(0) }} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1">
              <option value="">Seleccionar</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase font-semibold text-gray-400">Unidad</label>
            <select value={unidadIdx} onChange={e => setUnidadIdx(Number(e.target.value))} className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-1">
              {titulos.map((t, i) => <option key={i} value={i}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerar} disabled={loading}
              className="w-full text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Generando..." : `Generar (${CREDIT_COSTS.GENERATE_UNIDAD} cr)`}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {resultado && (
        <div className="bg-white rounded-xl border border-cyan-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-cyan-700 mb-3">{resultado.titulo}</h3>

          <div className="grid grid-cols-3 gap-3 text-xs mb-4">
            <div className="bg-cyan-50 rounded-lg px-3 py-2"><span className="font-semibold">Nivel:</span> {nivelLabel[resultado.nivel] || resultado.nivel}</div>
            <div className="bg-cyan-50 rounded-lg px-3 py-2"><span className="font-semibold">Área:</span> {resultado.area}</div>
            <div className="bg-cyan-50 rounded-lg px-3 py-2"><span className="font-semibold">Duración:</span> {resultado.duracion}</div>
          </div>

          <h4 className="text-xs font-bold text-gray-600 mt-4 mb-2">Propósitos</h4>
          <ul className="text-xs space-y-1 mb-4">
            {resultado.propositos.map((p, i) => <li key={i} className="bg-gray-50 rounded px-3 py-1.5">• {p}</li>)}
          </ul>

          <h4 className="text-xs font-bold text-gray-600 mt-4 mb-2">Competencias</h4>
          <ul className="text-xs space-y-1 mb-4">
            {resultado.competencias.map((c, i) => <li key={i} className="bg-purple-50 rounded px-3 py-1.5">• {c}</li>)}
          </ul>

          <h4 className="text-xs font-bold text-gray-600 mt-4 mb-2">Contenidos</h4>
          <ul className="text-xs space-y-1 mb-4">
            {resultado.contenidos.map((c, i) => <li key={i} className="bg-blue-50 rounded px-3 py-1.5">• {c}</li>)}
          </ul>

          <h4 className="text-xs font-bold text-gray-600 mt-4 mb-2">Sesiones</h4>
          <ul className="text-xs space-y-1 mb-4">
            {resultado.actividades.map((a, i) => <li key={i} className="bg-green-50 rounded px-3 py-1.5">• {a}</li>)}
          </ul>

          <div className="text-xs bg-amber-50 rounded-lg px-3 py-2">
            <span className="font-semibold">Evaluación:</span> {resultado.evaluacion}
          </div>
        </div>
      )}
    </div>
  )
}
