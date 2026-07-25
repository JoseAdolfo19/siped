const unidadesData: Record<string, Record<string, string[]>> = {
  inicial: {
    Comunicación: [
      "Unidad 1: Me conozco y me expreso",
      "Unidad 2: Los cuentos y mis emociones",
      "Unidad 3: Las letras y sus sonidos",
      "Unidad 4: Escribo mi nombre",
      "Unidad 5: Leo imágenes y palabras",
    ],
    Matemática: [
      "Unidad 1: Los números del 1 al 10",
      "Unidad 2: Formas y colores a mi alrededor",
      "Unidad 3: Agrupo y clasifico objetos",
      "Unidad 4: Comparo cantidades",
      "Unidad 5: Secuencias y patrones",
    ],
  },
  primaria: {
    Comunicación: [
      "Unidad 1: Narro historias de mi comunidad",
      "Unidad 2: Leo y comprendo cuentos",
      "Unidad 3: Escribo descripciones",
      "Unidad 4: Textos instructivos: recetas y manuales",
      "Unidad 5: Poemas y rimas para expresarme",
    ],
    Matemática: [
      "Unidad 1: Números hasta 1000",
      "Unidad 2: Sumo y resto con estrategias",
      "Unidad 3: Multiplicación: tablas y problemas",
      "Unidad 4: Fracciones en la vida cotidiana",
      "Unidad 5: Figuras geométricas y medidas",
    ],
    "Ciencia y Tecnología": [
      "Unidad 1: Los seres vivos y su entorno",
      "Unidad 2: El agua: ciclo y cuidado",
      "Unidad 3: La materia y sus cambios",
      "Unidad 4: El sistema solar",
      "Unidad 5: Energía y tecnología en casa",
    ],
    "Personal Social": [
      "Unidad 1: Mi historia familiar",
      "Unidad 2: Deberes y derechos del niño",
      "Unidad 3: Mi comunidad y sus instituciones",
      "Unidad 4: El Perú: regiones y símbolos patrios",
      "Unidad 5: Alimentación saludable",
    ],
  },
  secundaria: {
    Comunicación: [
      "Unidad 1: Textos narrativos: el cuento latinoamericano",
      "Unidad 2: Textos argumentativos: el ensayo",
      "Unidad 3: Poesía: recursos literarios",
      "Unidad 4: Comunicación masiva: medios y publicidad",
      "Unidad 5: Teatro: expresión corporal y dramática",
    ],
    Matemática: [
      "Unidad 1: Números reales y operaciones",
      "Unidad 2: Ecuaciones e inecuaciones",
      "Unidad 3: Funciones lineales y cuadráticas",
      "Unidad 4: Geometría: áreas y volúmenes",
      "Unidad 5: Estadística y probabilidades",
    ],
    "Ciencia y Tecnología": [
      "Unidad 1: Biología celular y genética",
      "Unidad 2: Química: tabla periódica y enlaces",
      "Unidad 3: Física: movimiento y fuerzas",
      "Unidad 4: Ecología y desarrollo sostenible",
      "Unidad 5: Tecnología e innovación",
    ],
    "Ciencias Sociales": [
      "Unidad 1: Procesos históricos: independencia del Perú",
      "Unidad 2: Geografía: regiones y recursos naturales",
      "Unidad 3: Ciudadanía y participación democrática",
      "Unidad 4: Economía: producción y mercado",
      "Unidad 5: Globalización y desafíos actuales",
    ],
  },
}

export interface UnidadData {
  nivel: string
  area: string
  titulo: string
  duracion: string
  propositos: string[]
  competencias: string[]
  contenidos: string[]
  actividades: string[]
  evaluacion: string
}

export function generarUnidad(nivel: string, area: string, indice?: number): UnidadData {
  const nivelUnits = unidadesData[nivel]?.[area] || ["Unidad didáctica general"]
  const idx = indice ?? Math.floor(Math.random() * nivelUnits.length)
  const titulo = nivelUnits[idx]

  return {
    nivel,
    area,
    titulo,
    duracion: "4 semanas (12 sesiones)",
    propositos: [
      `Comprender los conceptos fundamentales de ${area.toLowerCase()}.`,
      `Aplicar estrategias para resolver problemas de ${area.toLowerCase()}.`,
      "Desarrollar habilidades de pensamiento crítico y creativo.",
    ],
    competencias: [
      `Competencia específica de ${area} nivel ${nivel}.`,
      "Competencia transversal: resolución de problemas.",
      "Competencia transversal: trabajo en equipo.",
    ],
    contenidos: [
      `Tema 1: Introducción a ${titulo.toLowerCase()}`,
      `Tema 2: Desarrollo de habilidades en ${area.toLowerCase()}`,
      `Tema 3: Aplicación práctica y evaluación`,
    ],
    actividades: [
      "Sesión 1: Presentación y diagnóstico.",
      "Sesión 2: Exploración de saberes previos.",
      "Sesión 3: Construcción del aprendizaje (teoría).",
      "Sesión 4: Práctica guiada y trabajo en equipo.",
      "Sesión 5: Aplicación y producción individual.",
      "Sesión 6: Retroalimentación y cierre.",
    ],
    evaluacion: "Evaluación formativa (rúbrica) + Evaluación sumativa (producto final)",
  }
}

export function getNivelesUnidades() {
  return Object.keys(unidadesData)
}

export function getAreasUnidades(nivel: string) {
  return Object.keys(unidadesData[nivel] || {})
}

export function getTitulosUnidades(nivel: string, area: string) {
  return unidadesData[nivel]?.[area] || []
}
