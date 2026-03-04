import { useState } from 'react'
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
  type TimestampUnit,
} from '../utils/timestampUtils'
import CopyButton from '../components/CopyButton'

export default function TimestampConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate')
  const [unit, setUnit] = useState<TimestampUnit>('s')

  const handleConvert = () => {
    const result =
      mode === 'toDate'
        ? timestampToDate(input, unit)
        : dateToTimestamp(input, unit)
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

  const handleUseCurrent = () => {
    setInput(getCurrentTimestamp(unit))
    setOutput('')
    setError('')
  }

  const handleSwap = () => {
    setMode(mode === 'toDate' ? 'toTimestamp' : 'toDate')
    // 从「时间戳→时间」交换时，提取 ISO 日期便于反向解析
    let nextInput = output
    if (mode === 'toDate' && output) {
      const isoMatch = output.match(/ISO 8601:\s*(.+)/)
      if (isoMatch) nextInput = isoMatch[1].trim()
    }
    setInput(nextInput)
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">时间戳 / 时间 转换</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setMode('toDate')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              mode === 'toDate'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            时间戳 → 时间
          </button>
          <button
            onClick={() => setMode('toTimestamp')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              mode === 'toTimestamp'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            时间 → 时间戳
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          单位:
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as TimestampUnit)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="s">秒</option>
            <option value="ms">毫秒</option>
          </select>
        </label>

        <button
          onClick={handleConvert}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          转换
        </button>

        <button
          onClick={handleUseCurrent}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          当前时间戳
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
            {mode === 'toDate' ? '时间戳' : '日期时间'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'toDate'
                ? `输入时间戳（${unit === 's' ? '秒，如 1700000000' : '毫秒，如 1700000000000'}）...`
                : '输入日期时间，如 2024-01-15 12:00:00 或 2024-01-15T12:00:00.000Z...'
            }
            className="w-full h-[500px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {mode === 'toDate' ? '日期时间' : '时间戳'}
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
