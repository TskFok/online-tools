import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import JsonTreeView from './JsonTreeView'
import { countSearchMatches, highlightSearchInPlainText } from '../utils/textSearchHighlight'
import {
  clearSearchMarkNavigation,
  highlightAndScrollSearchMark,
} from '../utils/scrollSearchMatch'

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
  const [activeMatchIndex, setActiveMatchIndex] = useState(0)
  const [visibleMarkCount, setVisibleMarkCount] = useState(0)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const assignScrollRef = useCallback((el: HTMLDivElement | HTMLPreElement | null) => {
    scrollContainerRef.current = el
  }, [])

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

  useEffect(() => {
    setActiveMatchIndex(0)
  }, [searchQuery, value])

  useLayoutEffect(() => {
    const root = scrollContainerRef.current
    const q = searchQuery.trim()
    if (!q || !value.trim() || matchCount === 0) {
      if (root) clearSearchMarkNavigation(root)
      setVisibleMarkCount(0)
      return
    }
    const id = requestAnimationFrame(() => {
      const r = highlightAndScrollSearchMark(root, activeMatchIndex)
      setVisibleMarkCount(r.count)
    })
    return () => cancelAnimationFrame(id)
  }, [searchQuery, value, displayMode, parsedJson, matchCount, preInnerHtml, activeMatchIndex])

  const goPrev = useCallback(() => {
    setActiveMatchIndex((i) => {
      const root = scrollContainerRef.current
      const n = root?.querySelectorAll('mark').length ?? 0
      if (n <= 0) return 0
      return (i - 1 + n) % n
    })
  }, [])

  const goNext = useCallback(() => {
    setActiveMatchIndex((i) => {
      const root = scrollContainerRef.current
      const n = root?.querySelectorAll('mark').length ?? 0
      if (n <= 0) return 0
      return (i + 1) % n
    })
  }, [])

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      const root = scrollContainerRef.current
      const n = root?.querySelectorAll('mark').length ?? 0
      if (n <= 1) return
      e.preventDefault()
      if (e.shiftKey) goPrev()
      else goNext()
    },
    [goPrev, goNext],
  )

  const displayOrdinal =
    visibleMarkCount > 0
      ? ((activeMatchIndex % visibleMarkCount) + visibleMarkCount) % visibleMarkCount + 1
      : 0

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
      <div ref={assignScrollRef} className={`p-4 ${scrollClass}`}>
        <JsonTreeView data={parsedJson} searchQuery={searchQuery} />
      </div>
    ) : displayMode === 'jsonTree' && parsedJson === null ? (
      <pre
        ref={assignScrollRef}
        className={`p-4 text-sm whitespace-pre-wrap break-all ${scrollClass} ${preClassName}`}
        dangerouslySetInnerHTML={{
          __html: highlightSearchInPlainText(value, searchQuery),
        }}
      />
    ) : (
      <pre
        ref={assignScrollRef}
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
      <div className="shrink-0 border-b border-gray-200 bg-gray-100">
        <div className="flex flex-wrap items-center gap-2 px-2 py-1.5">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="在输出中搜索…"
            title="Enter：下一处匹配；Shift+Enter：上一处匹配（至少 2 处可见匹配时）"
            className="flex-1 min-w-[8rem] max-w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="在输出中搜索"
          />
          {searching && (
            <>
              {matchCount > 0 && visibleMarkCount > 0 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={visibleMarkCount <= 1}
                    className="px-2 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="上一处匹配"
                  >
                    上一个
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={visibleMarkCount <= 1}
                    className="px-2 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="下一处匹配"
                  >
                    下一个
                  </button>
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    第 {displayOrdinal} / {visibleMarkCount} 处
                    {matchCount > visibleMarkCount && (
                      <span
                        className="text-amber-800 ml-1 font-normal"
                        title="全文尚有匹配可能在折叠的 JSON 节点内，请展开后使用上一个/下一个"
                      >
                        （全文 {matchCount}）
                      </span>
                    )}
                  </span>
                </>
              )}
              {matchCount > 0 && visibleMarkCount === 0 && (
                <span
                  className="text-xs text-amber-800"
                  title="请展开包含匹配的 JSON 节点"
                >
                  匹配在折叠节点内
                </span>
              )}
              {matchCount === 0 && (
                <span className="text-xs text-gray-600 whitespace-nowrap">无匹配</span>
              )}
            </>
          )}
        </div>
        {searching && (
          <p className="px-2 pb-1.5 text-[11px] text-gray-500 leading-snug">
            快捷键：<span className="font-mono text-gray-600">Enter</span> 下一处 ·{' '}
            <span className="font-mono text-gray-600">Shift+Enter</span> 上一处（至少 2 处可见匹配时）
          </p>
        )}
      </div>
      {mainContent}
    </div>
  )
}
