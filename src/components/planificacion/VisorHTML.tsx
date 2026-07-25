"use client"

import { useState } from "react"

const template = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>{{titulo_doc}}</title>
<style>
@page {
  size: A4;
  margin: 25mm 20mm;
  @top-center { content: "{{encabezado}}"; font-size: 9pt; color: #555; }
  @bottom-center { content: "Página " counter(page); font-size: 9pt; color: #555; }
}
body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; font-size: 11pt; line-height: 1.3; }
*,*::before,*::after { box-sizing: border-box; }
h1,h2,h3,h4,h5,h6 { font-family: Arial, sans-serif; margin-top: 10px; margin-bottom: 10px; }
p { margin-top: 5px; margin-bottom: 5px; }
ul,ol { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
li { margin-bottom: 3px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
th,td { border: 1px solid #000; padding: 5px; text-align: left; vertical-align: top; }
.header-title { text-align: center; font-weight: bold; }
.section-title { font-weight: bold; margin-top: 15px; }
.table-no-border,.table-no-border td { border: none !important; }
.diagram-box { border: 1px solid #000; padding: 10px; margin: 10px 0; text-align: center; }
.flex-container { display: table; width: 100%; }
.flex-col { display: table-cell; vertical-align: top; padding: 5px; }
.normas-box { border: 1px solid #000; padding: 8px; text-align: center; margin: 2px; }
.page-footer { text-align: center; font-size: 9pt; color: #555; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 6px; }
.page-header { text-align: center; font-size: 9pt; color: #555; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
</style>
</head>
<body>

<div class="page-header">{{encabezado}}</div>

<header>
  <section class="section-title"><h2>{{titulo_principal}}</h2></section>
  <section><h1>{{nombre_ie}}</h1><h2>{{nivel_modalidad}}</h2></section>
  <section>
    <table class="table-no-border">
      <tr>
        <td style="width:50%">
          <p><strong>Docente(s):</strong> <span>{{docentes}}</span></p>
          <p><strong>Grado:</strong> <span>{{grado}}</span></p>
          <p><strong>Sección:</strong> <span>{{seccion}}</span></p>
          <p><strong>Director(a):</strong> <span>{{director}}</span></p>
          <p><strong>Sub Director(a):</strong> <span>{{subdirector}}</span></p>
        </td>
        <td style="width:50%">
          <p><strong>Ciclo:</strong> <span>{{ciclo}}</span></p>
          <p><strong>Turno:</strong> <span>{{turno}}</span></p>
          <p><strong>Fecha:</strong> <span>{{fecha}}</span></p>
        </td>
      </tr>
    </table>
  </section>
</header>

<main>
  <section>
    <h2 class="section-title">{{titulo_seccion_1}}</h2>
    <table>
      <thead><tr><th>{{th1}}</th><th>{{th2}}</th><th>{{th3}}</th><th>{{th4}}</th></tr></thead>
      <tbody>
        <tr>
          <td><p>{{celda1_1}}</p><ul><li>{{li1_1}}</li><li>{{li1_2}}</li><li>{{li1_3}}</li><li>{{li1_4}}</li></ul></td>
          <td><p>{{celda1_2}}</p></td>
          <td><ul><li>{{li2_1}}</li><li>{{li2_2}}</li><li>{{li2_3}}</li></ul></td>
          <td><p>{{celda1_3}}</p><p>{{celda1_4}}</p><p>{{celda1_5}}</p></td>
        </tr>
      </tbody>
    </table>

    <h3>{{subtitulo_1}}</h3>
    <table>
      <thead><tr><th>{{th5}}</th><th>{{th6}}</th><th>{{th7}}</th><th>{{th8}}</th></tr></thead>
      <tbody>
        <tr>
          <td><p>{{celda2_1}}</p><p>{{celda2_2}}</p><ul><li>{{li3_1}}</li><li>{{li3_2}}</li><li>{{li3_3}}</li></ul></td>
          <td><p>{{celda2_3}}</p></td>
          <td><ul><li>{{li4_1}}</li></ul></td>
          <td><p>{{celda2_4}}</p></td>
        </tr>
      </tbody>
    </table>

    <h3>{{subtitulo_2}}</h3>
    <table>
      <thead><tr><th>{{th9}}</th><th>{{th10}}</th></tr></thead>
      <tbody><tr><td><p>{{celda3_1}}</p></td><td><p>{{celda3_2}}</p></td></tr></tbody>
    </table>
  </section>

  <section>
    <h2 class="section-title">{{titulo_seccion_2}}</h2>
    <table>
      <thead><tr><th>{{th11}}</th><th>{{th12}}</th></tr></thead>
      <tbody>
        <tr>
          <td><ul><li>{{li5_1}}</li><li>{{li5_2}}</li><li>{{li5_3}}</li></ul></td>
          <td><ul><li>{{li6_1}}</li><li>{{li6_2}}</li><li>{{li6_3}}</li><li>{{li6_4}}</li></ul></td>
        </tr>
      </tbody>
    </table>
  </section>
</main>

<div class="page-footer">{{pie_pagina}}</div>

</body>
</html>`

type Values = Record<string, string>

const defaultValues: Values = {
  encabezado: "",
  pie_pagina: "Página 1 de 1",
  titulo_doc: "Planificación Anual",
  titulo_principal: "PLANIFICACIÓN ANUAL 2025",
  nombre_ie: "I.E. ...",
  nivel_modalidad: "...",
  docentes: "",
  grado: "",
  seccion: "",
  director: "",
  subdirector: "",
  ciclo: "",
  turno: "",
  fecha: "",
  titulo_seccion_1: "I. DATOS GENERALES",
  th1: "", th2: "", th3: "", th4: "",
  celda1_1: "", celda1_2: "", celda1_3: "", celda1_4: "", celda1_5: "",
  li1_1: "", li1_2: "", li1_3: "", li1_4: "",
  li2_1: "", li2_2: "", li2_3: "",
  subtitulo_1: "",
  th5: "", th6: "", th7: "", th8: "",
  celda2_1: "", celda2_2: "", celda2_3: "", celda2_4: "",
  li3_1: "", li3_2: "", li3_3: "",
  li4_1: "",
  subtitulo_2: "",
  th9: "", th10: "",
  celda3_1: "", celda3_2: "",
  titulo_seccion_2: "II. ASPECTOS GENERALES",
  th11: "", th12: "",
  li5_1: "", li5_2: "", li5_3: "",
  li6_1: "", li6_2: "", li6_3: "", li6_4: "",
}

function renderHTML(tpl: string, vals: Values): string {
  let html = tpl
  for (const [k, v] of Object.entries(vals)) {
    html = html.replaceAll(`{{${k}}}`, v || `<span style="color:#bbb">[${k}]</span>`)
  }
  return html
}

const fieldLabels: Record<string, string> = {
  encabezado: "Encabezado del documento",
  pie_pagina: "Pie de página",
  titulo_doc: "Título del documento",
  titulo_principal: "Título principal",
  nombre_ie: "Nombre de la IE",
  nivel_modalidad: "Nivel / Modalidad",
  docentes: "Docente(s)",
  grado: "Grado",
  seccion: "Sección",
  director: "Director(a)",
  subdirector: "Sub director(a)",
  ciclo: "Ciclo",
  turno: "Turno",
  fecha: "Fecha",
  titulo_seccion_1: "Sección I - Título",
  th1: "Tabla 1 - Col 1", th2: "Tabla 1 - Col 2", th3: "Tabla 1 - Col 3", th4: "Tabla 1 - Col 4",
  celda1_1: "Celda 1.1", celda1_2: "Celda 1.2", celda1_3: "Celda 1.3", celda1_4: "Celda 1.4", celda1_5: "Celda 1.5",
  li1_1: "Lista 1 - Item 1", li1_2: "Lista 1 - Item 2", li1_3: "Lista 1 - Item 3", li1_4: "Lista 1 - Item 4",
  li2_1: "Lista 2 - Item 1", li2_2: "Lista 2 - Item 2", li2_3: "Lista 2 - Item 3",
  subtitulo_1: "Subtítulo 1",
  th5: "Tabla 2 - Col 1", th6: "Tabla 2 - Col 2", th7: "Tabla 2 - Col 3", th8: "Tabla 2 - Col 4",
  celda2_1: "Celda 2.1", celda2_2: "Celda 2.2", celda2_3: "Celda 2.3", celda2_4: "Celda 2.4",
  li3_1: "Lista 3 - Item 1", li3_2: "Lista 3 - Item 2", li3_3: "Lista 3 - Item 3",
  li4_1: "Lista 4 - Item 1",
  subtitulo_2: "Subtítulo 2",
  th9: "Tabla 3 - Col 1", th10: "Tabla 3 - Col 2",
  celda3_1: "Celda 3.1", celda3_2: "Celda 3.2",
  titulo_seccion_2: "Sección II - Título",
  th11: "Tabla 4 - Col 1", th12: "Tabla 4 - Col 2",
  li5_1: "Lista 5 - Item 1", li5_2: "Lista 5 - Item 2", li5_3: "Lista 5 - Item 3",
  li6_1: "Lista 6 - Item 1", li6_2: "Lista 6 - Item 2", li6_3: "Lista 6 - Item 3", li6_4: "Lista 6 - Item 4",
}

export default function VisorHTML() {
  const [vals, setVals] = useState<Values>(defaultValues)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setVals(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Left Panel - Editor (4/12) */}
      <div className="w-4/12 overflow-y-auto bg-white border-r p-5 space-y-2">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Editor de contenido</h2>

        {/* Encabezado - always first */}
        <div className="bg-gradient-to-r from-primary-50 to-transparent -mx-5 px-5 py-3 mb-2 border-b border-primary-100">
          <label className="text-xs font-semibold text-primary-700 mb-1 block">📌 ENCABEZADO</label>
          <input value={vals.encabezado} onChange={set("encabezado")} placeholder="Ej: I.E. San José - 2025" className="w-full text-xs border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>

        {Object.keys(fieldLabels).filter(k => k !== "encabezado" && k !== "pie_pagina").map(k => (
          <div key={k}>
            <label className="text-xs font-medium text-gray-500 mb-0.5 block">{fieldLabels[k]}</label>
            {k.startsWith("li") || k.startsWith("celda") ? (
              <textarea value={vals[k]} onChange={set(k)} rows={2} className="w-full text-xs border rounded-lg px-3 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400" />
            ) : (
              <input value={vals[k]} onChange={set(k)} className="w-full text-xs border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400" />
            )}
          </div>
        ))}

        {/* Pie de página - always last */}
        <div className="bg-gradient-to-r from-gray-50 to-transparent -mx-5 px-5 py-3 mt-4 border-t border-gray-200">
          <label className="text-xs font-semibold text-gray-600 mb-1 block">📄 PIE DE PÁGINA</label>
          <input value={vals.pie_pagina} onChange={set("pie_pagina")} placeholder="Ej: Página 1 de 1" className="w-full text-xs border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
      </div>

      {/* Right Panel - Preview (8/12) */}
      <div className="w-8/12 overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 z-10 px-6 py-3 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600">Vista previa del documento</h2>
        </div>
        <div className="p-6 flex justify-center">
          <div
            className="w-[210mm] min-h-[297mm] bg-white shadow-xl border p-8"
            dangerouslySetInnerHTML={{ __html: renderHTML(template, vals) }}
          />
        </div>
      </div>
    </div>
  )
}
