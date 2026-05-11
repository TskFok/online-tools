import { useMemo, useState } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { countSearchMatches, highlightSearchInPlainText } from '../utils/textSearchHighlight'

export type OutputPanelProps = {
  /** 输出全文，用于展示、搜索与复制（由页面保证与 syntaxHtml 同源） */
  value: string
  emptyHint: string
  /** 内容区域高度/最小高度，如 h-[500px]、min-h-[200px] */
  bodyClassName: string
  /** 无搜索词时若提供则按 HTML 渲染（如 JSON 语法着色）；搜索时改为纯文本 + 高亮 */
  syntaxHtml?: string
  /** 附加在 pre 上的 class */
  preClassName?: string
}

export default function OutputPanel({
  value,
  emptyHint,
  bodyClassName,
  syntaxHtml,
  preClassName = '',
}: OutputPanelProps) {
  const [expanded, setExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const matchCount = useMemo(
    () => countSearchMatches(value, searchQuery),
    [value, searchQuery],
  )

  const searching = searchQuery.trim().length > 0

  const preInnerHtml = useMemo(() => {
    if (!value) return undefined
    if (searching) return highlightSearchInPlainText(value, searchQuery)
    if (syntaxHtml) return syntaxHtml
    return undefined
  }, [value, searching, searchQuery, syntaxHtml])

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

  const preScrollableClass = fixedHeight
    ? 'flex-1 min-h-0 overflow-auto'
    : 'min-h-[200px] max-h-[min(70vh,32rem)] overflow-auto'

  return (
    <div
      className={`w-full flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-gray-50 ${bodyClassName}`}
    >
      <div className="flex flex-wrap items-center gap-2 px-2 py-1.5 border-b border-gray-200 bg-gray-100 shrink-0">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
        >
          {expanded ? (
            <>
              <FiChevronDown className="w-4 h-4" aria-hidden />
              收起
            </>
          ) : (
            <>
              <FiChevronRight className="w-4 h-4" aria-hidden />
              展开
            </>
          )}
        </button>
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
        {searching && syntaxHtml && (
          <span className="text-xs text-amber-800 whitespace-nowrap hidden sm:inline" title="搜索时使用纯文本高亮，关闭搜索恢复着色">
            搜索为纯文本高亮
          </span>
        )}
      </div>
      {expanded ? (
        <pre
          className={`p-4 text-sm whitespace-pre-wrap break-all ${preScrollableClass} ${preClassName}`}
          {...(preInnerHtml !== undefined
            ? { dangerouslySetInnerHTML: { __html: preInnerHtml } }
            : { children: value })}
        />
      ) : (
        <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100 bg-gray-50/80">
          已折叠 · 共 {value.length} 字符
          {searching && ` · ${matchCount > 0 ? `${matchCount} 处匹配` : '无匹配'}`}
        </div>
      )}
    </div>
  )
}
