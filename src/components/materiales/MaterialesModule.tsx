"use client"

import { useState } from "react"
import { generarFicha, generarLectura } from "@/lib/materiales"

export default function MaterialesModule() {
  const [nivel, setNivel] = useState<string>("primaria")
  const [asignatura, setAsignatura] = useState<string>("")
  const [titulo, setTitulo] = useState<string>("")
  const [tab, setTab] = useState<"ficha" | "lectura">("ficha")
  const [generado, setGenerado] = useState(false)

  const ficha = generarFicha(nivel as any, asignatura, titulo)
  const lectura = generarLectura(nivel as any, asignatura, titulo)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Materiales educativos</h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-0.5">Nivel</label>
          <select value={nivel} onChange={e => setNivel(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400">
            {[["inicial","Inicial"],["primaria","Primaria"],["secundaria","Secundaria"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-0.5">Asignatura</label>
          <input value={asignatura} onChange={e => setAsignatura(e.target.value)} placeholder="Ej: Comunicación"
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-0.5">Título</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título de la sesión"
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
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

      <button onClick={() => setGenerado(true)}
        className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-md mb-4">
        Generar material
      </button>

      {generado && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          {tab === "ficha" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">{ficha.titulo}</h3>
              <p className="text-[10px] text-gray-400 mb-3">Nivel: {ficha.nivel} | Asignatura: {ficha.asignatura}</p>

              <h4 className="text-xs font-semibold text-gray-600 mb-1">Indicaciones:</h4>
              <ul className="list-disc pl-5 text-xs space-y-1 mb-4">
                {ficha.indicaciones.map((ind, i) => (
                  <li key={i}>{ind}</li>
                ))}
              </ul>

              <h4 className="text-xs font-semibold text-gray-600 mb-1">Actividades:</h4>
              <ol className="list-decimal pl-5 text-xs space-y-3">
                {ficha.actividades.map((act, i) => (
                  <li key={i}>
                    {act}
                    <div className="border-b border-dotted border-gray-300 h-8 mt-1" />
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === "lectura" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">{lectura.titulo}</h3>
              <p className="text-[10px] text-gray-400 mb-3">Nivel: {nivel} | Asignatura: {asignatura}</p>

              <div className="bg-gray-50 border rounded-lg p-4 mb-4 text-xs leading-relaxed whitespace-pre-line">
                {lectura.texto}
              </div>

              <h4 className="text-xs font-semibold text-gray-600 mb-2">Preguntas de comprensión:</h4>
              <ol className="list-decimal pl-5 text-xs space-y-3">
                {lectura.preguntas.map((p, i) => (
                  <li key={i}>
                    {p}
                    <div className="border-b border-dotted border-gray-300 h-8 mt-1" />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
