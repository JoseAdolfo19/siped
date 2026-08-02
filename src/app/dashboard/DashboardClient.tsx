"use client"

import { CreditAction } from "@/lib/credits"
import { useSession } from "@/lib/useSession"
import { useEffect, useState } from "react"

interface Props {
  credits: number
  planType: string
  planLabel: string
  totalPlanes: number
  planesEsteMes: number
  costos: Record<CreditAction, number>
}

export default function DashboardClient({ credits, planType, planLabel, totalPlanes, planesEsteMes, costos }: Props) {
  const { data: session } = useSession()
  const [liveCredits, setLiveCredits] = useState(credits)

  useEffect(() => {
    fetch("/api/credits").then(r => r.json()).then(d => {
      if (d.credits != null) setLiveCredits(d.credits)
    })
  }, [])

  const actions: { key: CreditAction; label: string }[] = [
    { key: "EXPORT_PDF", label: "Exportar PDF" },
    { key: "EXPORT_WORD", label: "Exportar Word" },
    { key: "AUTO_FILL", label: "Autollenado IA" },
    { key: "GENERATE_EVALUACION", label: "Generar evaluación" },
    { key: "GENERATE_MATERIAL", label: "Generar material" },
    { key: "GENERATE_PPTX", label: "Generar PPTX" },
    { key: "GENERATE_REFUERZO", label: "Refuerzo y recuperación" },
    { key: "GENERATE_UNIDAD", label: "Unidad didáctica" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard</h1>

      {/* Plan info and credits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-purple-100 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Plan</p>
          <p className="text-xl font-bold text-purple-700 mt-1">{planLabel}</p>
        </div>
        <div className="bg-white rounded-xl border border-cyan-100 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Creditos</p>
          <p className="text-xl font-bold text-cyan-600 mt-1">{liveCredits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Planes totales</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{totalPlanes}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-100 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Este mes</p>
          <p className="text-xl font-bold text-green-600 mt-1">{planesEsteMes}</p>
        </div>
      </div>

      {/* Cost table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-8">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Costos por accion</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {actions.map(a => (
            <div key={a.key} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
              <span className="text-gray-600">{a.label}</span>
              <span className="font-bold text-purple-600">{costos[a.key]} <span className="text-[9px] text-gray-400">cr</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade prompt for free users */}
      {planType === "free" && (
        <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border border-purple-200 p-5">
          <h3 className="text-sm font-bold text-purple-800 mb-1">Mejora tu plan</h3>
          <p className="text-xs text-gray-600 mb-3">Obtén más créditos y funcionalidades premium con un plan semanal o mensual.</p>
          <div className="flex gap-3">
            <span className="text-[10px] bg-white px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 font-medium">Semanal — 500 créditos</span>
            <span className="text-[10px] bg-white px-3 py-1.5 rounded-lg border border-cyan-200 text-cyan-700 font-medium">Mensual — 2000 créditos</span>
          </div>
        </div>
      )}

      {/* User info */}
      <div className="mt-8 text-[10px] text-gray-400 border-t border-gray-100 pt-4">
        {session?.user?.email && <span>Conectado como <strong>{session.user.email}</strong></span>}
      </div>
    </div>
  )
}
