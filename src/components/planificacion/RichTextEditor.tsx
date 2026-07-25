"use client"

import { useRef, useCallback, useEffect } from "react"

interface ToolbarButton {
  label: string
  icon: string
  cmd: string
  value?: string
}

const buttons: ToolbarButton[] = [
  { label: "Negrita", icon: "B", cmd: "bold" },
  { label: "Cursiva", icon: "I", cmd: "italic" },
  { label: "Subrayado", icon: "U", cmd: "underline" },
  { label: "Alinear izquierda", icon: "≡", cmd: "justifyLeft" },
  { label: "Centrar", icon: "≡", cmd: "justifyCenter" },
  { label: "Alinear derecha", icon: "≡", cmd: "justifyRight" },
]

export default function RichTextEditor({
  value, onChange, minHeight = 80,
}: {
  value: string; onChange: (html: string) => void; minHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const isInternal = useRef(false)

  useEffect(() => {
    if (!ref.current || isInternal.current) { isInternal.current = false; return }
    if (ref.current.innerHTML !== value) ref.current.innerHTML = value
  }, [value])

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    isInternal.current = true
    onChange(ref.current?.innerHTML || "")
  }, [onChange])

  const handleColor = useCallback(() => {
    const color = prompt("Color (hex, ej: #ff0000):", "#000000")
    if (color) { document.execCommand("foreColor", false, color); onChange(ref.current?.innerHTML || "") }
  }, [onChange])

  const handleBgColor = useCallback(() => {
    const color = prompt("Color de fondo (hex, ej: #ffff00):", "#ffff00")
    if (color) { document.execCommand("hiliteColor", false, color); onChange(ref.current?.innerHTML || "") }
  }, [onChange])

  const handleFontSize = useCallback(() => {
    const size = prompt("Tamaño (1-7):", "3")
    if (size) { document.execCommand("fontSize", false, size); onChange(ref.current?.innerHTML || "") }
  }, [onChange])

  const handleImageUpload = useCallback(() => {
    fileRef.current?.click()
  }, [])

  const onFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const img = `<img src="${src}" alt="Imagen" style="max-width:100%;height:auto;display:block;margin:5px 0;" />`
      document.execCommand("insertHTML", false, img)
      isInternal.current = true
      onChange(ref.current?.innerHTML || "")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }, [onChange])

  const handleInsertTable = useCallback(() => {
    const rows = prompt("Filas:", "3")
    if (!rows) return
    const cols = prompt("Columnas:", "2")
    if (!cols) return
    const r = parseInt(rows); const c = parseInt(cols)
    if (r < 1 || c < 1) return

    let html = '<table style="width:100%;border-collapse:collapse;margin:5px 0;font-size:10pt;"><thead><tr>'
    for (let i = 0; i < c; i++) {
      html += `<th style="border:1px solid #000;padding:4px;background:#e0e7ff;">Título ${i + 1}</th>`
    }
    html += "</tr></thead><tbody>"
    for (let i = 0; i < r; i++) {
      html += "<tr>"
      for (let j = 0; j < c; j++) {
        html += '<td style="border:1px solid #000;padding:4px;">&nbsp;</td>'
      }
      html += "</tr>"
    }
    html += "</tbody></table><br/>"

    document.execCommand("insertHTML", false, html)
    isInternal.current = true
    onChange(ref.current?.innerHTML || "")
  }, [onChange])

  const handleInsertReminder = useCallback(() => {
    const html = `<div class="reminder-box"><strong>Recordatorio:</strong> Escriba aquí su recordatorio</div><br/>`
    document.execCommand("insertHTML", false, html)
    isInternal.current = true
    onChange(ref.current?.innerHTML || "")
  }, [onChange])

  const moveImage = useCallback((dir: "up" | "down") => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    let node: Node | null = sel.anchorNode
    if (!node) return
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement

    let img: HTMLImageElement | null = null
    if (node instanceof HTMLImageElement) {
      img = node
    } else if (node instanceof HTMLElement) {
      const imgs = node.querySelectorAll("img")
      if (imgs.length > 0) img = imgs[0] as HTMLImageElement
    }
    if (!img || !img.parentElement) return

    if (dir === "up" && img.previousElementSibling) {
      img.parentElement.insertBefore(img, img.previousElementSibling)
    } else if (dir === "down" && img.nextElementSibling) {
      img.parentElement.insertBefore(img.nextElementSibling, img)
    } else {
      return
    }

    isInternal.current = true
    onChange(ref.current?.innerHTML || "")
    sel.removeAllRanges()
    const r = document.createRange()
    r.selectNode(img)
    sel.addRange(r)
  }, [onChange])

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-0.5 bg-gray-50 border-b border-gray-200 px-1.5 py-1 flex-wrap">
        {buttons.map(b => (
          <button key={b.cmd} type="button" title={b.label}
            onClick={() => exec(b.cmd, b.value)}
            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 rounded transition"
          >{b.icon}</button>
        ))}
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" title="Color de texto" onClick={handleColor}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition"
          style={{ borderBottom: "2px solid #000" }}>A</button>
        <button type="button" title="Color de fondo" onClick={handleBgColor}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition"
          style={{ background: "#ff0" }}>A</button>
        <button type="button" title="Tamaño de letra" onClick={handleFontSize}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition font-bold">T</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" title="Insertar imagen" onClick={handleImageUpload}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition"
        >🖼</button>
        <button type="button" title="Insertar tabla" onClick={handleInsertTable}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition font-bold"
        >⊞</button>
        <button type="button" title="Insertar recordatorio" onClick={handleInsertReminder}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition"
        >💡</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" title="Subir imagen" onClick={() => moveImage("up")}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition font-bold"
        >↑</button>
        <button type="button" title="Bajar imagen" onClick={() => moveImage("down")}
          className="w-7 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition font-bold"
        >↓</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || "")}
        className="px-3 py-2 text-xs outline-none"
        style={{ minHeight, maxHeight: 300, overflowY: "auto" }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileSelected} />
    </div>
  )
}
