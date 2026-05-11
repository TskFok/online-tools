import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  SEARCH_MARK_ACTIVE_CLASS,
  clearSearchMarkNavigation,
  highlightAndScrollSearchMark,
  scrollFirstSearchMarkIntoView,
} from '../utils/scrollSearchMatch'

function mockScrollIntoView(el: Element) {
  const fn = vi.fn()
  Object.defineProperty(el, 'scrollIntoView', { value: fn, configurable: true })
  return fn
}

describe('scrollFirstSearchMarkIntoView', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('container 为 null 时返回 false', () => {
    expect(scrollFirstSearchMarkIntoView(null)).toBe(false)
  })

  it('无 mark 时返回 false', () => {
    const div = document.createElement('div')
    div.textContent = 'hello'
    expect(scrollFirstSearchMarkIntoView(div)).toBe(false)
  })

  it('对第一个 mark 调用 scrollIntoView 并添加当前项样式类', () => {
    const div = document.createElement('div')
    div.innerHTML = '<span>pre</span><mark id="m">hit</mark><mark>two</mark>'
    document.body.append(div)
    const first = div.querySelector('mark#m')!
    const scrollIntoView = mockScrollIntoView(first)
    expect(scrollFirstSearchMarkIntoView(div)).toBe(true)
    expect(scrollIntoView).toHaveBeenCalledOnce()
    expect(scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ block: 'center', inline: 'nearest', behavior: 'smooth' }),
    )
    expect(first.classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(true)
    const second = div.querySelectorAll('mark')[1]
    expect(second.classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(false)
  })
})

describe('highlightAndScrollSearchMark', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('activeIndex 为 1 时高亮第二个 mark', () => {
    const div = document.createElement('div')
    div.innerHTML = '<mark>a</mark><mark id="b">b</mark>'
    document.body.append(div)
    const m0 = div.querySelectorAll('mark')[0]
    const m1 = div.querySelector('mark#b')!
    mockScrollIntoView(m1)
    const r = highlightAndScrollSearchMark(div, 1)
    expect(r.count).toBe(2)
    expect(r.resolvedIndex).toBe(1)
    expect(r.scrolled).toBe(true)
    expect(m0.classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(false)
    expect(m1.classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(true)
  })

  it('clearSearchMarkNavigation 移除所有当前项样式', () => {
    const div = document.createElement('div')
    const mark = document.createElement('mark')
    mark.classList.add(SEARCH_MARK_ACTIVE_CLASS)
    div.append(mark)
    clearSearchMarkNavigation(div)
    expect(mark.classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(false)
  })
})
