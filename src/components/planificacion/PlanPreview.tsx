interface PlanPreviewData {
  level: string; institution: string; teacher: string; grade: string; section: string
  classroom: string; subject: string; title: string; duration: string; purpose: string
  competencies: string; capacities: string; performance: string; evidence: string
  transversalApproaches: string; seqInicio: string; seqDesarrollo: string; seqCierre: string
  evaluationTechniques: string; evaluationInstruments: string; resources: string; reflections: string
}

const levelLabel: Record<string, string> = { inicial: "Inicial", primaria: "Primaria", secundaria: "Secundaria" }

export default function PlanPreview({ data }: { data: PlanPreviewData }) {
  const empty = !data.title && !data.subject

  return (
    <div className="bg-white rounded-xl border p-6 min-h-[600px]">
      {empty ? (
        <div className="flex items-center justify-center h-full text-gray-300">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-lg font-medium">Vista previa</p>
            <p className="text-sm">Completa los datos del formulario para ver la previsualización en vivo</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-b border-primary-200 pb-3 mb-4">
            <h2 className="text-xl font-bold text-primary-700">{data.title}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {data.subject} · {levelLabel[data.level] || data.level} · {data.grade}{data.section ? ` - ${data.section}` : ""}{data.duration ? ` · ${data.duration}` : ""}
            </p>
            {(data.institution || data.teacher) && (
              <p className="text-xs text-gray-400 mt-0.5">{data.institution}{data.institution && data.teacher ? " · " : ""}{data.teacher}</p>
            )}
          </div>

          <LiveSection title="Propósito de aprendizaje" content={data.purpose} />
          <LiveSection title="Competencias" content={data.competencies} />
          {data.capacities && <LiveSection title="Capacidades" content={data.capacities} />}
          {data.performance && <LiveSection title="Desempeños" content={data.performance} />}
          {data.evidence && <LiveSection title="Evidencia de aprendizaje" content={data.evidence} />}
          {data.transversalApproaches && <LiveSection title="Enfoques transversales" content={data.transversalApproaches} />}

          {(data.seqInicio || data.seqDesarrollo || data.seqCierre) && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-primary-600 mb-2 border-b pb-1">Secuencia didáctica</h3>
              {data.seqInicio && <SubSec title="Inicio" content={data.seqInicio} />}
              {data.seqDesarrollo && <SubSec title="Desarrollo" content={data.seqDesarrollo} />}
              {data.seqCierre && <SubSec title="Cierre" content={data.seqCierre} />}
            </div>
          )}

          {(data.evaluationTechniques || data.evaluationInstruments) && (
            <LiveSection title="Evaluación">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {data.evaluationTechniques && <div><span className="font-medium text-gray-600">Técnicas:</span><p className="whitespace-pre-wrap mt-0.5">{data.evaluationTechniques}</p></div>}
                {data.evaluationInstruments && <div><span className="font-medium text-gray-600">Instrumentos:</span><p className="whitespace-pre-wrap mt-0.5">{data.evaluationInstruments}</p></div>}
              </div>
            </LiveSection>
          )}

          {data.resources && <LiveSection title="Recursos y materiales" content={data.resources} />}
          {data.reflections && <LiveSection title="Reflexiones" content={data.reflections} />}
        </div>
      )}
    </div>
  )
}

function LiveSection({ title, content, children }: { title: string; content?: string; children?: React.ReactNode }) {
  if (!content && !children) return null
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-primary-600 mb-1 border-b pb-0.5">{title}</h3>
      {children || <p className="text-xs text-gray-700 whitespace-pre-wrap">{content || "—"}</p>}
    </div>
  )
}

function SubSec({ title, content }: { title: string; content: string }) {
  if (!content) return null
  return (
    <div className="mb-2">
      <h4 className="text-xs font-medium text-gray-700">{title}</h4>
      <p className="text-xs text-gray-600 whitespace-pre-wrap">{content}</p>
    </div>
  )
}
