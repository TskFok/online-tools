import { useState } from 'react'
import { serializeToJson, highlightJson, type SerializeFormat } from '../utils/jsonUtils'
import CopyButton from '../components/CopyButton'

const formatOptions: { value: SerializeFormat; label: string }[] = [
  { value: 'auto', label: '自动检测' },
  { value: 'querystring', label: 'Query String' },
  { value: 'php', label: 'PHP Serialize' },
  { value: 'keyvalue', label: '键值对 (key: value)' },
]

export default function SerializeToJson() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [format, setFormat] = useState<SerializeFormat>('auto')

  const handleConvert = () => {
    const result = serializeToJson(input, format)
    if (result.success) {
      setOutput(result.output)
      setError('')
    } else {
      setOutput('')
      setError(result.error ?? '')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">序列化字符串转 JSON</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={handleConvert}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          转换
        </button>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          格式:
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as SerializeFormat)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {formatOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
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
          <label className="block text-sm font-medium text-gray-600 mb-2">输入序列化字符串</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="name=test&age=20 或 a:1:{s:4:&quot;name&quot;;s:4:&quot;test&quot;;}"
            className="w-full h-[500px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">输出 JSON</label>
          {output ? (
            <pre
              className="w-full h-[500px] p-4 text-sm border border-gray-300 rounded-lg overflow-auto bg-gray-50 whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: highlightJson(output) }}
            />
          ) : (
            <div className="w-full h-[500px] p-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
              结果将显示在这里
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
