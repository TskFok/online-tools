import { useState, useCallback } from 'react'
import {
  formatSql,
  compressSql,
  COMMON_DIALECTS,
  type SqlDialect,
  type KeywordCase,
} from '../utils/sqlUtils'
import CopyButton from '../components/CopyButton'
import OutputPanel from '../components/OutputPanel'
import { useDebouncedOutputConvert } from '../hooks/useDebouncedOutputConvert'

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [dialect, setDialect] = useState<SqlDialect>('sql')
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper')
  const [sqlOutputKind, setSqlOutputKind] = useState<'pretty' | 'minify'>('pretty')

  const convert = useCallback(
    (raw: string) => {
      if (!raw.trim()) {
        setOutput('')
        setError('')
        return
      }
      const options = { indent, language: dialect, keywordCase }
      const result =
        sqlOutputKind === 'pretty' ? formatSql(raw, options) : compressSql(raw, options)
      if (result.success) {
        setOutput(result.output)
        setError('')
      } else {
        setOutput('')
        setError(result.error ?? '')
      }
    },
    [indent, dialect, keywordCase, sqlOutputKind],
  )

  useDebouncedOutputConvert(input, convert, [indent, dialect, keywordCase, sqlOutputKind])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">SQL 美化 / 压缩</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setSqlOutputKind('pretty')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            sqlOutputKind === 'pretty'
              ? 'text-white bg-blue-600 hover:bg-blue-700'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          美化
        </button>
        <button
          type="button"
          onClick={() => setSqlOutputKind('minify')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            sqlOutputKind === 'minify'
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
            disabled={sqlOutputKind === 'minify'}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm disabled:opacity-50"
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          方言:
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as SqlDialect)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {COMMON_DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          关键字:
          <select
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="upper">大写</option>
            <option value="lower">小写</option>
            <option value="preserve">保持原样</option>
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
          <label className="block text-sm font-medium text-gray-600 mb-2">输入 SQL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT id, name FROM users WHERE status = 1 ORDER BY created_at DESC"
            className="w-full h-[500px] p-4 text-sm font-mono border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">输出结果</label>
          <OutputPanel
            value={output}
            emptyHint="结果将显示在这里"
            bodyClassName="h-[500px]"
            preClassName="font-mono"
          />
        </div>
      </div>
    </div>
  )
}
