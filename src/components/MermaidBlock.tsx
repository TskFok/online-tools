import { useCallback, useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { normalizeMermaidSource, type MermaidTheme } from '../utils/mermaidUtils'

interface MermaidBlockProps {
  code: string
  theme: MermaidTheme
}

export default function MermaidBlock({ code, theme }: MermaidBlockProps) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const renderSeq = useRef(0)

  const applyConfig = useCallback((t: MermaidTheme) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: t,
      securityLevel: 'strict',
      fontFamily: 'inherit',
    })
  }, [])

  useEffect(() => {
    applyConfig(theme)
  }, [theme, applyConfig])

  const renderWithSeq = useCallback(
    async (seq: number) => {
      const definition = normalizeMermaidSource(code)
      if (!definition) {
        await Promise.resolve()
        if (seq !== renderSeq.current) return
        setSvg('')
        setError('')
        return
      }
      try {
        const id = `mermaid-md-${crypto.randomUUID()}`
        const { svg: nextSvg } = await mermaid.render(id, definition)
        if (seq !== renderSeq.current) return
        setSvg(nextSvg)
        setError('')
      } catch (e) {
        if (seq !== renderSeq.current) return
        setSvg('')
        setError(e instanceof Error ? e.message : String(e))
      }
    },
    [code],
  )

  useEffect(() => {
    const seq = ++renderSeq.current
    void renderWithSeq(seq)
  }, [code, theme, renderWithSeq])

  if (error) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 my-2 whitespace-pre-wrap">
        {error}
      </div>
    )
  }
  if (!svg) {
    return (
      <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg p-4 my-2 text-center bg-white">
        图表渲染中…
      </div>
    )
  }
  return (
    <div
      className="my-4 flex justify-center overflow-x-auto bg-white rounded-lg border border-gray-100 p-4 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
