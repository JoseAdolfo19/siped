export type Level = "inicial" | "primaria" | "secundaria"

export interface PlanificacionData {
  id: string
  title: string
  level: Level
  subject: string
  grade: string
  section?: string
  institution?: string
  teacher?: string
  duration?: string
  purpose?: string
  competencies?: string
  capacities?: string
  performance?: string
  desempenios_1?: string
  desempenios_2?: string
  evidence?: string
  transversalApproaches?: string
  sequence?: string
  evaluationTechniques?: string
  evaluationInstruments?: string
  resources?: string
  startTime?: string
  reflections?: string
  practicante?: string
  sesionNum?: string
  lugarFecha?: string
  gestionAprendizaje?: string
  seqDurante?: string
  seqDespues?: string
  templateHTML?: string
  createdAt?: string
}
