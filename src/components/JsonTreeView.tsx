import { useCallback, useLayoutEffect, useState, type ReactNode } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { splitSearchMatches } from '../utils/textSearchHighlight'
import { jsonPathPrefixesToUncollapseForFirstSearchHit } from '../utils/jsonSearchNavigate'

export type JsonPath = (string | number)[]

function pathToKey(path: JsonPath): string {
  return JSON.stringify(path)
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const parts = splitSearchMatches(text, q)
  return (
    <>
      {parts.map((p, i) =>
        p.match ? (
          <mark key={i} className="bg-amber-200 text-gray-900 rounded px-0.5">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  )
}

function JsonStringValue({ value, query }: { value: string; query: string }) {
  const rendered = JSON.stringify(value)
  return (
    <span className="json-string">
      <HighlightText text={rendered} query={query} />
    </span>
  )
}

function JsonKeyLabel({ name, query }: { name: string; query: string }) {
  const prefix = JSON.stringify(name)
  return (
    <span className="json-key">
      <HighlightText text={prefix} query={query} />
      <span>:</span>
    </span>
  )
}

function Toggle({
  expanded,
  onClick,
}: {
  expanded: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className="mt-0.5 shrink-0 p-0.5 rounded text-gray-600 hover:bg-gray-200 cursor-pointer"
      title={expanded ? '折叠' : '展开'}
    >
      {expanded ? <FiChevronDown className="w-4 h-4" aria-hidden /> : <FiChevronRight className="w-4 h-4" aria-hidden />}
    </button>
  )
}

export type JsonTreeViewProps = {
  data: unknown
  searchQuery: string
}

const CHILD_INDENT = 'ml-4 pl-3 border-l border-gray-200'

export default function JsonTreeView({ data, searchQuery }: JsonTreeViewProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set())

  useLayoutEffect(() => {
    const prefixes = jsonPathPrefixesToUncollapseForFirstSearchHit(data, searchQuery)
    if (prefixes.length === 0) return
    setCollapsed((prev) => {
      const next = new Set(prev)
      for (const p of prefixes) {
        next.delete(pathToKey(p))
      }
      return next
    })
  }, [data, searchQuery])

  const toggle = useCallback((path: JsonPath) => {
    const k = pathToKey(path)
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }, [])

  const isCollapsed = useCallback(
    (path: JsonPath) => collapsed.has(pathToKey(path)),
    [collapsed],
  )

  const renderPrimitive = useCallback(
    (v: unknown): ReactNode => {
      if (v === null) return <span className="json-null">null</span>
      if (typeof v === 'boolean') {
        return (
          <span className="json-boolean">
            <HighlightText text={String(v)} query={searchQuery} />
          </span>
        )
      }
      if (typeof v === 'number') {
        return (
          <span className="json-number">
            <HighlightText text={String(v)} query={searchQuery} />
          </span>
        )
      }
      if (typeof v === 'string') {
        return <JsonStringValue value={v} query={searchQuery} />
      }
      return (
        <span className="text-gray-600">
          <HighlightText text={String(v)} query={searchQuery} />
        </span>
      )
    },
    [searchQuery],
  )

  const renderNode = useCallback(
    (value: unknown, path: JsonPath): ReactNode => {
      if (value === null || typeof value !== 'object') {
        return renderPrimitive(value)
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return <span className="text-gray-800">[]</span>
        }
        const folded = isCollapsed(path)
        return (
          <div className="inline-block align-top w-full min-w-0">
            <div className="flex items-start gap-0.5">
              <Toggle expanded={!folded} onClick={() => toggle(path)} />
              <div className="min-w-0 flex-1">
                <span className="text-gray-800">[</span>
                {folded && (
                  <>
                    <span className="text-gray-500 mx-1">···{value.length} 项</span>
                    <span className="text-gray-800">]</span>
                  </>
                )}
              </div>
            </div>
            {!folded && (
              <>
                <div className={CHILD_INDENT}>
                  {value.map((item, i) => (
                    <div key={i} className="flex gap-1 flex-wrap items-baseline min-w-0">
                      <span className="flex-1 min-w-0">{renderNode(item, [...path, i])}</span>
                      {i < value.length - 1 && <span className="text-gray-600">,</span>}
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-0.5">
                  <span className="w-7 shrink-0" aria-hidden />
                  <span className="text-gray-800">]</span>
                </div>
              </>
            )}
          </div>
        )
      }

      const obj = value as Record<string, unknown>
      const keys = Object.keys(obj)
      if (keys.length === 0) {
        return <span className="text-gray-800">{'{}'}</span>
      }
      const folded = isCollapsed(path)
      return (
        <div className="inline-block align-top w-full min-w-0">
          <div className="flex items-start gap-0.5">
            <Toggle expanded={!folded} onClick={() => toggle(path)} />
            <div className="min-w-0 flex-1">
              <span className="text-gray-800">{'{'}</span>
              {folded && (
                <>
                  <span className="text-gray-500 mx-1">···{keys.length} 个键</span>
                  <span className="text-gray-800">{'}'}</span>
                </>
              )}
            </div>
          </div>
          {!folded && (
            <>
              <div className={CHILD_INDENT}>
                {keys.map((k, i) => (
                  <div key={k} className="flex flex-wrap gap-x-1 gap-y-0 min-w-0 items-baseline">
                    <JsonKeyLabel name={k} query={searchQuery} />
                    {renderNode(obj[k], [...path, k])}
                    {i < keys.length - 1 && <span className="text-gray-600">,</span>}
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-0.5">
                <span className="w-7 shrink-0" aria-hidden />
                <span className="text-gray-800">{'}'}</span>
              </div>
            </>
          )}
        </div>
      )
    },
    [isCollapsed, renderPrimitive, searchQuery, toggle],
  )

  return <div className="json-tree font-mono text-sm text-gray-800 select-text">{renderNode(data, [])}</div>
}
