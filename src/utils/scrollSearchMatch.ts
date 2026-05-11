/** 与 index.css 中 mark.search-mark-active 规则配套 */
export const SEARCH_MARK_ACTIVE_CLASS = 'search-mark-active'

export function clearSearchMarkNavigation(container: Element | null): void {
  if (!container) return
  for (const m of container.querySelectorAll('mark')) {
    m.classList.remove(SEARCH_MARK_ACTIVE_CLASS)
  }
}

export type HighlightSearchMarkResult = {
  count: number
  /** 规范化后的下标（0..count-1） */
  resolvedIndex: number
  scrolled: boolean
}

/**
 * 清除旧高亮，将第 activeIndex 个 mark 标为当前并滚入视口（下标按 DOM 顺序，对长度取模）。
 */
export function highlightAndScrollSearchMark(
  container: Element | null,
  activeIndex: number,
  init: ScrollIntoViewOptions = { block: 'center', inline: 'nearest', behavior: 'smooth' },
): HighlightSearchMarkResult {
  clearSearchMarkNavigation(container)
  if (!container) return { count: 0, resolvedIndex: -1, scrolled: false }
  const marks = [...container.querySelectorAll('mark')]
  if (marks.length === 0) return { count: 0, resolvedIndex: -1, scrolled: false }
  const idx = ((activeIndex % marks.length) + marks.length) % marks.length
  const active = marks[idx]
  active.classList.add(SEARCH_MARK_ACTIVE_CLASS)
  active.scrollIntoView(init)
  return { count: marks.length, resolvedIndex: idx, scrolled: true }
}

/** 兼容：仅滚动到第一个匹配并高亮 */
export function scrollFirstSearchMarkIntoView(
  container: Element | null,
  init?: ScrollIntoViewOptions,
): boolean {
  return highlightAndScrollSearchMark(container, 0, init).scrolled
}
