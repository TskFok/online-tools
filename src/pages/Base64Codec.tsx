import { useState } from 'react'
import { base64Encode, base64Decode } from '../utils/base64Utils'
import CopyButton from '../components/CopyButton'

export default function Base64Codec() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleConvert = () => {
    const result = mode === 'encode' ? base64Encode(input) : base64Decode(input)
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

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Base64 编码 / 解码</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            编码
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            解码
          </button>
        </div>

        <button
          onClick={handleConvert}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          转换
        </button>

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
            {mode === 'encode' ? '原始文本' : 'Base64 字符串'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'}
            className="w-full h-[500px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {mode === 'encode' ? 'Base64 结果' : '解码结果'}
          </label>
          {output ? (
            <pre className="w-full h-[500px] p-4 text-sm border border-gray-300 rounded-lg overflow-auto bg-gray-50 whitespace-pre-wrap break-all">
              {output}
            </pre>
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
