"use client"

import { useState } from "react"
import PlanForm from "./PlanForm"
import PlanPreview from "./PlanPreview"

interface PlanData {
  id?: string; level?: string; institution?: string; teacher?: string; grade?: string
  section?: string; classroom?: string; subject?: string; title?: string; duration?: string
  purpose?: string; competencies?: string; capacities?: string; performance?: string
  evidence?: string; transversalApproaches?: string; sequence?: string
  evaluationTechniques?: string; evaluationInstruments?: string; resources?: string; reflections?: string
}

export default function PlanEditor({ plan }: { plan?: PlanData }) {
  const [previewVisible, setPreviewVisible] = useState(true)
  const [formData, setFormData] = useState<any>(null)

  const handleFormChange = (data: any) => {
    setFormData(data)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className={`overflow-y-auto border-r bg-white ${previewVisible ? "w-1/2" : "w-full"} transition-all`}>
        <PlanForm plan={plan} onChange={handleFormChange} />
      </div>

      {previewVisible && (
        <div className="w-1/2 overflow-y-auto bg-gray-50">
          <div className="sticky top-0 bg-gray-50 z-10 px-4 py-3 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">Vista previa en vivo</h2>
            <button onClick={() => setPreviewVisible(false)} className="text-xs text-gray-400 hover:text-gray-600">Ocultar</button>
          </div>
          <div className="p-4">
            <PlanPreview data={formData || {}} />
          </div>
        </div>
      )}

      {!previewVisible && (
        <button onClick={() => setPreviewVisible(true)} className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium hover:bg-primary-700 z-20">
          👁 Vista previa
        </button>
      )}
    </div>
  )
}
