type Nivel = "inicial" | "primaria" | "secundaria"

interface FichaTrabajo {
  titulo: string
  nivel: string
  asignatura: string
  indicaciones: string[]
  actividades: string[]
}

interface Lectura {
  titulo: string
  texto: string
  preguntas: string[]
}

export function generarFicha(nivel: Nivel, asignatura: string, titulo: string): FichaTrabajo {
  const baseActividades = [
    "Lee atentamente las indicaciones antes de iniciar.",
    "Responde las preguntas en tu cuaderno.",
    "Comparte tus respuestas con un compañero.",
    "Revisa y corrige si es necesario.",
  ]
  const asig = asignatura.toLowerCase()
  return {
    titulo: `Ficha de trabajo: ${titulo}`,
    nivel: nivel,
    asignatura: asignatura,
    indicaciones: [
      `Nombre: ____________________ Fecha: ___________ Grado: ___________`,
      "Tiempo estimado: 20 minutos",
      "Lee cada指示 cuidadosamente antes de responder.",
      "Puedes consultar tus apuntes si lo necesitas.",
    ],
    actividades: asig.includes("comunic") || asig.includes("lectura")
      ? [
          "Lee el siguiente texto y responde: (texto proporcionado por el docente)",
          "Identifica las ideas principales del texto.",
          "Escribe un breve resumen (máximo 5 líneas).",
          "Responde: ¿Cuál es la intención del autor?",
          "Crea un organizador gráfico sobre el tema.",
        ]
      : asig.includes("matem")
      ? [
          "Resuelve los siguientes problemas en tu cuaderno.",
          "Muestra todos tus procedimientos.",
          "Verifica tus respuestas usando una estrategia diferente.",
          "Explica cómo llegaste a la solución del problema 1.",
          "Crea un problema similar y compártelo con tu compañero.",
        ]
      : asig.includes("ciencia") || asig.includes("tecnologia")
      ? [
          "Observa el fenómeno o material proporcionado.",
          "Registra tus observaciones en la tabla.",
          "Responde: ¿Qué crees que ocurrirá si...?",
          "Dibuja o describe lo que observaste.",
          "Escribe una conclusión breve.",
        ]
      : [
          "Responde las preguntas planteadas en clase.",
          "Relaciona el tema con tu vida cotidiana.",
          "Comparte tus ideas con el grupo.",
          "Elabora un dibujo o esquema sobre el tema.",
        ],
  }
}

export function generarLectura(nivel: Nivel, asignatura: string, titulo: string): Lectura {
  const asig = asignatura.toLowerCase()
  return {
    titulo: titulo || "Lectura complementaria",
    texto: `Texto adaptado para ${nivel} en el área de ${asignatura}. 
    
[El docente debe insertar aquí el texto seleccionado según el tema de la sesión.]

Sugerencia: Puedes usar textos del MINEDU, cuentos cortos, artículos periodísticos, 
fábulas, poemas o fragmentos de obras literarias adecuados al nivel y al propósito de la sesión.`,
    preguntas: [
      "¿Cuál es el tema principal del texto?",
      "¿Qué personajes o ideas principales aparecen?",
      "Explica con tus propias palabras lo que entendiste.",
      "¿Qué opinas sobre lo leído? ¿Estás de acuerdo? ¿Por qué?",
      "Relaciona el contenido del texto con tu experiencia personal.",
    ],
  }
}
