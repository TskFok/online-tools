import { useCallback, useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import toast from 'react-hot-toast'
import CopyButton from '../components/CopyButton'
import { normalizeMermaidSource, type MermaidTheme } from '../utils/mermaidUtils'

const DEFAULT_SAMPLE = `graph TD
    A[开始] --> B{判断}
    B -->|是| C[处理]
    B -->|否| D[结束]
    C --> D`

export default function MermaidRenderer() {
  const [input, setInput] = useState(DEFAULT_SAMPLE)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const [theme, setTheme] = useState<MermaidTheme>('default')
  const renderSeq = useRef(0)

  const applyMermaidConfig = useCallback((t: MermaidTheme) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: t,
      securityLevel: 'strict',
      fontFamily: 'inherit',
    })
  }, [])

  useEffect(() => {
    applyMermaidConfig(theme)
  }, [theme, applyMermaidConfig])

  const renderWithSeq = useCallback(async (seq: number) => {
    const definition = normalizeMermaidSource(input)
    if (!definition) {
      await Promise.resolve()
      if (seq !== renderSeq.current) return
      setSvg('')
      setError('')
      return
    }

    try {
      const id = `mermaid-${crypto.randomUUID()}`
      const { svg: nextSvg } = await mermaid.render(id, definition)
      if (seq !== renderSeq.current) return
      setSvg(nextSvg)
      setError('')
    } catch (e) {
      if (seq !== renderSeq.current) return
      setSvg('')
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [input])

  useEffect(() => {
    const seq = ++renderSeq.current
    void renderWithSeq(seq)
  }, [input, theme, renderWithSeq])

  const runRender = useCallback(() => {
    const seq = ++renderSeq.current
    void renderWithSeq(seq)
  }, [renderWithSeq])

  const handleDownloadSvg = useCallback(() => {
    if (!svg) return
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.svg'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('已下载 SVG')
  }, [svg])

  const handleClear = () => {
    setInput('')
    setSvg('')
    setError('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Mermaid 图表渲染</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={runRender}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          重新渲染
        </button>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          主题:
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as MermaidTheme)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
          >
            <option value="default">默认</option>
            <option value="dark">暗色</option>
            <option value="forest">森林</option>
            <option value="neutral">中性</option>
          </select>
        </label>

        <CopyButton text={svg} />

        <button
          type="button"
          onClick={handleDownloadSvg}
          disabled={!svg}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下载 SVG
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          清空
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg whitespace-pre-wrap">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Mermaid 源码</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="graph TD&#10;    A --> B"
            className="w-full h-[480px] p-4 text-sm font-mono border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">预览</label>
          {svg ? (
            <div
              className="w-full h-[480px] p-4 border border-gray-300 rounded-lg overflow-auto bg-white [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : error ? (
            <div className="w-full h-[480px] p-4 text-sm border border-gray-200 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center text-center px-6">
              渲染失败，请根据上方错误信息修正源码
            </div>
          ) : normalizeMermaidSource(input) ? (
            <div className="w-full h-[480px] p-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center">
              正在渲染…
            </div>
          ) : (
            <div className="w-full h-[480px] p-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
              在左侧输入 Mermaid 语法
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
