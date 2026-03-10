import { useState } from 'react'
import { generateRandomNumbers, type RandomType } from '../utils/randomUtils'
import CopyButton from '../components/CopyButton'

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('0')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [type, setType] = useState<RandomType>('integer')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = () => {
    const minNum = Number(min)
    const maxNum = Number(max)
    const countNum = Math.floor(Number(count))

    const result = generateRandomNumbers(minNum, maxNum, countNum, type)
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
      <h1 className="text-xl font-bold text-gray-800 mb-5">随机数生成</h1>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">最小值</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">最大值</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="100"
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
              max={10000}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">类型</label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
            <button
              onClick={() => setType('integer')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                type === 'integer' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              整数
            </button>
            <button
              onClick={() => setType('float')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                type === 'float' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              小数
            </button>
          </div>
        </div>

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
          <pre className="w-full min-h-[200px] p-4 text-sm border border-gray-300 rounded-lg overflow-auto bg-gray-50 whitespace-pre-wrap break-all">
            {output}
          </pre>
        ) : (
          <div className="w-full min-h-[200px] p-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
            点击「生成」获取随机数
          </div>
        )}
      </div>
    </div>
  )
}
