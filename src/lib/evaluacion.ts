type Nivel = "inicial" | "primaria" | "secundaria"

interface RubricaItem {
  criterio: string
  niveles: string[] // [inicio, proceso, logrado, destacado]
}

interface ListaCotejo {
  indicadores: string[]
}

interface ExamenItem {
  tipo: string
  preguntas: string[]
}

function rubricaComunicacion(nivel: Nivel): RubricaItem[] {
  const base = [
    { criterio: "Comprensión lectora", niveles: ["No comprende el texto", "Comprende parcialmente", "Comprende el texto y responde preguntas", "Comprende críticamente y opina con argumentos"] },
    { criterio: "Producción escrita", niveles: ["Escribe sin coherencia", "Escribe con poca coherencia", "Escribe con coherencia y cohesión", "Escribe creativamente con estructura adecuada"] },
    { criterio: "Expresión oral", niveles: ["No participa", "Participa con dificultad", "Participa con claridad", "Expresa ideas con fluidez y argumentación"] },
  ]
  if (nivel === "inicial") return base.map(i => ({ ...i, niveles: ["No logrado", "En proceso", "Logrado", ""] }))
  return base
}

function rubricaMatematica(nivel: Nivel): RubricaItem[] {
  return [
    { criterio: "Resolución de problemas", niveles: ["No identifica datos", "Identifica datos pero no resuelve", "Resuelve con apoyo", "Resuelve autónomamente y explica"] },
    { criterio: "Razonamiento matemático", niveles: ["No aplica estrategias", "Aplica estrategias básicas", "Aplica estrategias adecuadas", "Aplica y justifica estrategias"] },
    { criterio: "Comunicación matemática", niveles: ["No expresa resultados", "Expresa con dificultad", "Expresa claramente", "Argumenta con precisión"] },
  ]
}

function rubricaCyT(nivel: Nivel): RubricaItem[] {
  return [
    { criterio: "Indagación científica", niveles: ["No formula hipótesis", "Formula hipótesis básicas", "Formula hipótesis pertinentes", "Formula y contrasta hipótesis"] },
    { criterio: "Experimentación", niveles: ["No sigue procedimientos", "Sigue parcialmente", "Sigue procedimientos correctamente", "Ejecuta y registra datos con precisión"] },
    { criterio: "Comunicación científica", niveles: ["No comunica resultados", "Comunica con dificultad", "Comunica claramente", "Comunica y argumenta con evidencias"] },
  ]
}

export function generarRubrica(nivel: Nivel, asignatura: string): RubricaItem[] {
  const asig = asignatura.toLowerCase()
  if (asig.includes("comunic") || asig.includes("lectura")) return rubricaComunicacion(nivel)
  if (asig.includes("matem")) return rubricaMatematica(nivel)
  if (asig.includes("ciencia") || asig.includes("tecnologia")) return rubricaCyT(nivel)
  if (asig.includes("personal") || asig.includes("social")) return rubricaComunicacion(nivel)
  return rubricaComunicacion(nivel)
}

export function generarListaCotejo(nivel: Nivel, asignatura: string, titulo: string): ListaCotejo {
  const asig = asignatura.toLowerCase()
  const base: string[] = [
    `Participa activamente en la sesión: "${titulo}"`,
    "Respeta las normas de convivencia",
    "Trabaja colaborativamente con sus compañeros",
    "Demuestra interés y compromiso",
    "Cumple con las actividades propuestas",
  ]
  if (asig.includes("comunic") || asig.includes("lectura")) {
    return { indicadores: [...base,
      "Comprende el texto leído a nivel literal",
      "Infiere información implícita del texto",
      "Produce textos con coherencia y cohesión",
      "Revisa y mejora su producción escrita",
    ]}
  }
  if (asig.includes("matem")) {
    return { indicadores: [...base,
      "Identifica datos y condiciones del problema",
      "Selecciona estrategias adecuadas de resolución",
      "Resuelve correctamente las operaciones",
      "Explica el proceso de resolución",
    ]}
  }
  if (asig.includes("ciencia") || asig.includes("tecnologia")) {
    return { indicadores: [...base,
      "Formula preguntas de indagación pertinentes",
      "Sigue el procedimiento experimental correctamente",
      "Registra datos de manera organizada",
      "Elabora conclusiones basadas en evidencias",
    ]}
  }
  return { indicadores: base }
}

export function generarExamen(nivel: Nivel, asignatura: string, titulo: string): ExamenItem[] {
  const asig = asignatura.toLowerCase()
  if (asig.includes("comunic") || asig.includes("lectura")) {
    return [
      { tipo: "Comprensión lectora", preguntas: [
        "¿Cuál es el tema principal del texto?",
        "Menciona dos personajes y describe sus características.",
        "¿Qué mensaje nos transmite el texto?",
        "Explica con tus propias palabras lo que entendiste.",
        "¿Estás de acuerdo con la actitud del personaje principal? ¿Por qué?",
      ]},
      { tipo: "Producción escrita", preguntas: [
        "Escribe un texto breve sobre el tema trabajado (mínimo 5 líneas).",
        "Identifica y escribe 3 palabras clave del texto leído.",
      ]},
      { tipo: "Gramática y ortografía", preguntas: [
        "Separa en sílabas las siguientes palabras: ...",
        "Completa las oraciones con la palabra correcta (homófonos).",
        "Escribe el plural de las siguientes palabras: ...",
      ]},
    ]
  }
  if (asig.includes("matem")) {
    return [
      { tipo: "Operaciones básicas", preguntas: [
        "Resuelve: 345 + 678 = ?",
        "Resuelve: 892 - 456 = ?",
        "Multiplica: 23 × 45 = ?",
        "Divide: 756 ÷ 12 = ?",
      ]},
      { tipo: "Problemas", preguntas: [
        "Juan tiene 24 caramelos y los reparte entre sus 6 amigos. ¿Cuántos caramelos le toca a cada uno?",
        "En una granja hay 125 gallinas y 89 patos. ¿Cuántas aves hay en total?",
        "Si un libro cuesta S/45 y una mochila cuesta S/78, ¿cuánto cuestan juntos?",
      ]},
      { tipo: "Razonamiento", preguntas: [
        "Continúa la secuencia: 2, 4, 6, 8, ?, ?",
        "¿Cuál es el número que falta? 5, 10, ?, 20, 25",
      ]},
    ]
  }
  if (asig.includes("ciencia") || asig.includes("tecnologia")) {
    return [
      { tipo: "Conocimiento científico", preguntas: [
        "¿Qué es un ecosistema? Menciona sus componentes.",
        "Explica el ciclo del agua.",
        "¿Cuáles son los estados de la materia? Da un ejemplo de cada uno.",
      ]},
      { tipo: "Indagación", preguntas: [
        "Describe los pasos del método científico.",
        "Si quisieras investigar si las plantas crecen mejor con luz solar o artificial, ¿cómo lo harías?",
      ]},
      { tipo: "Tecnología", preguntas: [
        "Menciona 3 inventos tecnológicos que facilitan la vida cotidiana.",
        "¿Cómo podemos usar la tecnología para cuidar el medio ambiente?",
      ]},
    ]
  }
  return [
    { tipo: "Conocimientos previos", preguntas: [
      "¿Qué sabes sobre el tema de hoy?",
      "Menciona tres ideas principales de lo trabajado en clase.",
    ]},
    { tipo: "Aplicación", preguntas: [
      "Aplica lo aprendido para resolver la siguiente situación: ...",
      "Explica cómo lo aprendido te sirve en tu vida diaria.",
    ]},
  ]
}
