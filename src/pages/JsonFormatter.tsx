import { useState, useEffect } from 'react'
import { formatJson, compressJson } from '../utils/jsonUtils'
import CopyButton from '../components/CopyButton'
import OutputPanel from '../components/OutputPanel'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [jsonOutputKind, setJsonOutputKind] = useState<'pretty' | 'minify'>('pretty')

  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }
    const result =
      jsonOutputKind === 'pretty' ? formatJson(input, indent) : compressJson(input)
    if (result.success) {
      setOutput(result.output)
      setError('')
    } else {
      setOutput('')
      setError(result.error ?? '')
    }
  }, [input, indent, jsonOutputKind])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">JSON 美化 / 压缩</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setJsonOutputKind('pretty')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            jsonOutputKind === 'pretty'
              ? 'text-white bg-blue-600 hover:bg-blue-700'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          美化
        </button>
        <button
          type="button"
          onClick={() => setJsonOutputKind('minify')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            jsonOutputKind === 'minify'
              ? 'text-white bg-gray-600 hover:bg-gray-700'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          压缩
        </button>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          缩进:
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
          </select>
        </label>

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
          <label className="block text-sm font-medium text-gray-600 mb-2">输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-[500px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">输出结果</label>
          <OutputPanel
            value={output}
            emptyHint="结果将显示在这里"
            bodyClassName="h-[500px]"
            displayMode="jsonTree"
          />
        </div>
      </div>
    </div>
  )
}
