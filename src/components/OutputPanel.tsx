import { useMemo, useState } from 'react'
import JsonTreeView from './JsonTreeView'
import { countSearchMatches, highlightSearchInPlainText } from '../utils/textSearchHighlight'

export type OutputPanelProps = {
  /** 输出全文，用于展示、搜索与复制 */
  value: string
  emptyHint: string
  /** 内容区域高度/最小高度，如 h-[500px]、min-h-[200px] */
  bodyClassName: string
  /** plain：整块文本；jsonTree：解析为 JSON 并按对象/数组节点折叠 */
  displayMode?: 'plain' | 'jsonTree'
  /** 附加在 plain 模式 pre 上的 class */
  preClassName?: string
}

export default function OutputPanel({
  value,
  emptyHint,
  bodyClassName,
  displayMode = 'plain',
  preClassName = '',
}: OutputPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const matchCount = useMemo(
    () => countSearchMatches(value, searchQuery),
    [value, searchQuery],
  )

  const searching = searchQuery.trim().length > 0

  const parsedJson = useMemo(() => {
    if (displayMode !== 'jsonTree' || !value.trim()) return null
    try {
      return JSON.parse(value) as unknown
    } catch {
      return null
    }
  }, [displayMode, value])

  const preInnerHtml = useMemo(() => {
    if (!value) return undefined
    if (displayMode === 'jsonTree') return undefined
    if (searching) return highlightSearchInPlainText(value, searchQuery)
    return undefined
  }, [value, searching, searchQuery, displayMode])

  if (!value) {
    return (
      <div
        className={`w-full p-4 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center ${bodyClassName}`}
      >
        {emptyHint}
      </div>
    )
  }

  const fixedHeight = /\bh-\[/.test(bodyClassName)

  const scrollClass = fixedHeight
    ? 'flex-1 min-h-0 overflow-auto'
    : 'min-h-[200px] max-h-[min(70vh,32rem)] overflow-auto'

  const mainContent =
    displayMode === 'jsonTree' && parsedJson !== null ? (
      <div className={`p-4 ${scrollClass}`}>
        <JsonTreeView data={parsedJson} searchQuery={searchQuery} />
      </div>
    ) : displayMode === 'jsonTree' && parsedJson === null ? (
      <pre
        className={`p-4 text-sm whitespace-pre-wrap break-all ${scrollClass} ${preClassName}`}
        dangerouslySetInnerHTML={{
          __html: highlightSearchInPlainText(value, searchQuery),
        }}
      />
    ) : (
      <pre
        className={`p-4 text-sm whitespace-pre-wrap break-all ${scrollClass} ${preClassName}`}
        {...(preInnerHtml !== undefined
          ? { dangerouslySetInnerHTML: { __html: preInnerHtml } }
          : { children: value })}
      />
    )

  return (
    <div
      className={`w-full flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-gray-50 ${bodyClassName}`}
    >
      <div className="flex flex-wrap items-center gap-2 px-2 py-1.5 border-b border-gray-200 bg-gray-100 shrink-0">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="在输出中搜索…"
          className="flex-1 min-w-[8rem] max-w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="在输出中搜索"
        />
        {searching && (
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {matchCount > 0 ? `${matchCount} 处匹配` : '无匹配'}
          </span>
        )}
      </div>
      {mainContent}
    </div>
  )
}
