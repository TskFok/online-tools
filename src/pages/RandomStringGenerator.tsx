import { useState } from 'react'
import { generateRandomStrings, type RandomStringOptions } from '../utils/randomStringUtils'
import CopyButton from '../components/CopyButton'

export default function RandomStringGenerator() {
  const [length, setLength] = useState('16')
  const [count, setCount] = useState('1')
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false)
  const [customSpecialChars, setCustomSpecialChars] = useState('!@#$%^&*()-_=+[]{}|;:\'",.<>?/~`')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = () => {
    const lengthNum = Math.floor(Number(length))
    const countNum = Math.floor(Number(count))

    const options: RandomStringOptions = {
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSpecialChars,
    }
    if (includeSpecialChars && customSpecialChars.trim()) {
      options.customSpecialChars = customSpecialChars
    }

    const result = generateRandomStrings(lengthNum, countNum, options)
    if (result.success) {
      setOutput(result.output)
      setError('')
    } else {
      setOutput('')
      setError(result.error ?? '')
    }
  }

  const handleClear = () => {
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">随机字符串生成</h1>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">字符串长度</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="16"
              min={1}
              max={10000}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">生成数量</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="1"
              min={1}
              max={100}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">字符内容</label>
          <div className="flex flex-wrap gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">大写字母 (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">小写字母 (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">数字 (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSpecialChars}
                onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">特殊字符</span>
            </label>
          </div>
        </div>

        {includeSpecialChars && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">自定义特殊字符</label>
            <input
              type="text"
              value={customSpecialChars}
              onChange={(e) => setCustomSpecialChars(e.target.value)}
              placeholder={'!@#$%^&*()-_=+[]{}|;\'",.<>?/~`'}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <p className="mt-1 text-xs text-gray-500">留空则使用默认特殊字符集</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            生成
          </button>
          <CopyButton text={output} />
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            清空
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">生成结果</label>
        {output ? (
          <pre className="w-full min-h-[200px] p-4 text-sm border border-gray-300 rounded-lg overflow-auto bg-gray-50 whitespace-pre-wrap break-all font-mono">
            {output}
          </pre>
        ) : (
          <div className="w-full min-h-[200px] p-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
            选择字符类型后点击「生成」获取随机字符串
          </div>
        )}
      </div>
    </div>
  )
}
