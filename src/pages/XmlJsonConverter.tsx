import { useCallback, useState } from 'react'
import CopyButton from '../components/CopyButton'
import OutputPanel from '../components/OutputPanel'
import { useDebouncedOutputConvert } from '../hooks/useDebouncedOutputConvert'
import { jsonToXml, xmlToJson } from '../utils/xmlJsonUtils'

type ConvertMode = 'xml-to-json' | 'json-to-xml'

export default function XmlJsonConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<ConvertMode>('xml-to-json')

  const convert = useCallback(
    (raw: string) => {
      if (!raw.trim()) {
        setOutput('')
        setError('')
        return
      }
      const result = mode === 'xml-to-json' ? xmlToJson(raw) : jsonToXml(raw)
      if (result.success) {
        setOutput(result.output)
        setError('')
      } else {
        setOutput('')
        setError(result.error ?? '')
      }
    },
    [mode],
  )

  useDebouncedOutputConvert(input, convert, [mode])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleSwap = () => {
    setMode(mode === 'xml-to-json' ? 'json-to-xml' : 'xml-to-json')
    setInput(output)
  }

  const xmlToJsonMode = mode === 'xml-to-json'

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">XML / JSON 互转</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setMode('xml-to-json')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              xmlToJsonMode ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            XML → JSON
          </button>
          <button
            onClick={() => setMode('json-to-xml')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              xmlToJsonMode ? 'bg-white text-gray-600 hover:bg-gray-50' : 'bg-blue-600 text-white'
            }`}
          >
            JSON → XML
          </button>
        </div>

        <button
          onClick={handleSwap}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          交换输入输出
        </button>

        <CopyButton text={output} />

        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          清空
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {xmlToJsonMode ? '输入 XML' : '输入 JSON'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={xmlToJsonMode ? '输入 XML...' : '输入 JSON...'}
            className="w-full h-[500px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {xmlToJsonMode ? '输出 JSON' : '输出 XML'}
          </label>
          <OutputPanel
            value={output}
            emptyHint="结果将显示在这里"
            bodyClassName="h-[500px]"
            displayMode={xmlToJsonMode ? 'jsonTree' : 'plain'}
          />
        </div>
      </div>
    </div>
  )
}
