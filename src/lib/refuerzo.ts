const refuerzoNiveles: Record<string, { areas: Record<string, string[]> }> = {
  inicial: {
    areas: {
      "Comunicación": [
        "Identifica sonidos iniciales y finales de palabras.",
        "Asocia imágenes con palabras escritas.",
        "Repite rimas y canciones cortas.",
        "Reconoce su nombre escrito.",
      ],
      "Matemática": [
        "Cuenta objetos hasta 10.",
        "Clasifica objetos por tamaño y color.",
        "Identifica figuras geométricas básicas.",
        "Compara cantidades (más que / menos que).",
      ],
      "Personal Social": [
        "Reconoce emociones básicas.",
        "Sigue normas de convivencia en el aula.",
        "Practica hábitos de higiene personal.",
      ],
      "Ciencia y Ambiente": [
        "Identifica partes del cuerpo.",
        "Reconoce fenómenos naturales (sol, lluvia).",
        "Cuida plantas y animales.",
      ],
    },
  },
  primaria: {
    areas: {
      "Comunicación": [
        "Lee textos cortos con fluidez.",
        "Comprende la idea principal de un texto.",
        "Escribe oraciones con concordancia gramatical.",
        "Identifica sustantivos, adjetivos y verbos.",
        "Produce textos narrativos breves.",
      ],
      "Matemática": [
        "Resuelve operaciones de suma y resta con llevada.",
        "Identifica fracciones en contextos cotidianos.",
        "Resuelve problemas de multiplicación simple.",
        "Lee y escribe números hasta 4 cifras.",
        "Reconoce figuras geométricas y sus propiedades.",
      ],
      "Ciencia y Tecnología": [
        "Describe el ciclo del agua.",
        "Identifica los estados de la materia.",
        "Reconoce los sentidos y su función.",
        "Explica la cadena alimenticia simple.",
      ],
      "Personal Social": [
        "Describe su historia personal y familiar.",
        "Reconoce deberes y derechos del niño.",
        "Identifica instituciones de su comunidad.",
        "Practica hábitos de alimentación saludable.",
      ],
    },
  },
  secundaria: {
    areas: {
      "Comunicación": [
        "Analiza textos literarios identificando estructura.",
        "Produce textos argumentativos con tesis y conclusiones.",
        "Identifica figuras literarias en poemas y cuentos.",
        "Comprende textos expositivos complejos.",
        "Expresa opiniones fundamentadas oralmente.",
      ],
      "Matemática": [
        "Resuelve ecuaciones de primer grado.",
        "Identifica y calcula áreas y volúmenes.",
        "Resuelve problemas de regla de tres simple y compuesta.",
        "Representa datos en gráficos estadísticos.",
        "Identifica relaciones de proporcionalidad.",
      ],
      "Ciencia y Tecnología": [
        "Explica la fotosíntesis y su importancia.",
        "Identifica los sistemas del cuerpo humano.",
        "Resuelve problemas de genética básica (Leyes de Mendel).",
        "Reconoce compuestos químicos en la vida diaria.",
      ],
      "Ciencias Sociales": [
        "Analiza procesos históricos del Perú (independencia).",
        "Identifica las regiones naturales del Perú.",
        "Reconoce la estructura del Estado peruano.",
        "Explica conceptos económicos básicos (oferta y demanda).",
      ],
    },
  },
}

const estrategias = [
  "Trabajo en pares con estudiante monitor.",
  "Uso de material concreto y manipulativo.",
  "Refuerzo visual con organizadores gráficos.",
  "Actividades lúdicas y juegos didácticos.",
  "Lectura guiada con preguntas de comprensión.",
  "Secuencias didácticas graduadas en dificultad.",
  "Uso de tecnología educativa (videos, simuladores).",
  "Evaluaciones formativas cortas y frecuentes.",
  "Rúbricas de observación para seguimiento.",
  "Diálogo reflexivo para identificar dificultades.",
]

export interface RefuerzoData {
  nivel: string
  area: string
  estudiante: string
  competencias: string[]
  estrategias: string[]
  actividades: string[]
  fechaInicio: string
  duracion: string
  responsables: string
}

export function generarRefuerzo(nivel: string, area: string, estudiante: string): RefuerzoData {
  const nivelData = refuerzoNiveles[nivel]
  const competencias = nivelData?.areas[area] || ["Competencia curricular general."]
  const selectedEstrategias = estrategias.sort(() => Math.random() - 0.5).slice(0, 4)
  const actividades = competencias.map(c => `Actividad para: ${c}`)

  return {
    nivel,
    area,
    estudiante,
    competencias,
    estrategias: selectedEstrategias,
    actividades,
    fechaInicio: new Date().toLocaleDateString("es-PE"),
    duracion: "4 semanas",
    responsables: "Docente de aula + Coordinador pedagógico",
  }
}

export function getNivelesRefuerzo() {
  return Object.keys(refuerzoNiveles)
}

export function getAreasRefuerzo(nivel: string) {
  const nivelData = refuerzoNiveles[nivel]
  return nivelData ? Object.keys(nivelData.areas) : []
}
