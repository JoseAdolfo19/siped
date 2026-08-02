"use client"

import { useState } from "react"
import { useSession } from "@/lib/useSession"

const planes = [
  { id: "free", label: "Free", price: 0, period: "", credits: 100, features: ["3 sesiones de aprendizaje", "3 evaluaciones", "100 créditos", "Exportación HTML", "Marca de agua en exportaciones"] },
  { id: "weekly", label: "Semanal", price: 10, period: "/semana", credits: 500, features: ["Sesiones ilimitadas", "Evaluaciones ilimitadas", "500 créditos", "Exportación PDF, Word, PPTX", "Sin marca de agua", "Google Drive", "IA (DeepSeek/OpenAI)"] },
  { id: "monthly", label: "Mensual", price: 30, period: "/mes", credits: 2000, features: ["Todo lo del plan Semanal", "2000 créditos", "Unidades didácticas", "Refuerzo y recuperación", "Soporte prioritario"] },
]

export default function PlanesPageClient() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string) => {
    setLoading(planId)
    const res = await fetch("/api/stripe/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planType: planId }),
    })
    const data = await res.json()
    if (data.url) { window.location.href = data.url }
    else { alert(data.error || "Error al procesar") }
    setLoading(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Planes SIPED</h1>
      <p className="text-sm text-center text-gray-500 mb-8">Elige el plan que mejor se adapte a tus necesidades</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planes.map(p => {
          const isActive = session?.user?.planType === p.id
          const isCurrent = isActive && p.id !== "free"
          return (
            <div key={p.id} className={`bg-white rounded-2xl border ${p.id === "monthly" ? "border-purple-300 ring-2 ring-purple-200" : "border-gray-200"} p-6 shadow-sm flex flex-col`}>
              {p.id === "monthly" && <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-0.5 rounded-full font-semibold self-start mb-2">MÁS POPULAR</span>}
              <h2 className="text-lg font-bold text-gray-800">{p.label}</h2>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-gray-800">{p.price === 0 ? "Gratis" : `S/ ${p.price}`}</span>
                {p.period && <span className="text-sm text-gray-400">{p.period}</span>}
              </div>
              <p className="text-xs text-gray-400 mb-4">{p.credits.toLocaleString()} créditos incluidos</p>
              <ul className="text-xs space-y-2 mb-6 flex-1">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <span className="w-full text-center text-xs bg-green-100 text-green-700 py-2 rounded-lg font-semibold">Plan actual</span>
              ) : (
                <button onClick={() => handleCheckout(p.id)} disabled={loading === p.id || p.id === "free"}
                  className={`w-full text-sm py-2.5 rounded-xl font-semibold transition ${p.id === "free" ? "bg-gray-100 text-gray-400 cursor-default" : "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 disabled:opacity-50"}`}>
                  {loading === p.id ? "Procesando..." : p.id === "free" ? "Plan actual" : "Seleccionar"}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
