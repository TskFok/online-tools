import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  escapeRegExp,
  highlightSearchInPlainText,
  countSearchMatches,
  splitSearchMatches,
} from '../utils/textSearchHighlight'

describe('escapeHtml', () => {
  it('转义 HTML 特殊字符', () => {
    expect(escapeHtml('<a & b>')).toBe('&lt;a &amp; b&gt;')
  })
})

describe('escapeRegExp', () => {
  it('转义正则元字符', () => {
    expect(escapeRegExp('a+b')).toBe('a\\+b')
  })
})

describe('highlightSearchInPlainText', () => {
  it('空查询时只做转义', () => {
    expect(highlightSearchInPlainText('a<b', '')).toBe('a&lt;b')
    expect(highlightSearchInPlainText('hello', '   ')).toBe('hello')
  })

  it('包裹匹配片段且不区分大小写', () => {
    const html = highlightSearchInPlainText('Hello HELLO', 'hello')
    expect(html).toContain('<mark')
    expect(html.match(/<mark/g)?.length).toBe(2)
  })

  it('字面匹配含特殊字符的查询', () => {
    expect(highlightSearchInPlainText('a(1)', '(')).toContain('<mark')
  })

  it('转义匹配内容再放入 mark', () => {
    expect(highlightSearchInPlainText('x<y', '<')).toContain('&lt;')
  })
})

describe('countSearchMatches', () => {
  it('空查询为 0', () => {
    expect(countSearchMatches('aba', '')).toBe(0)
  })

  it('统计不区分大小写出现次数', () => {
    expect(countSearchMatches('AaAaa', 'a')).toBe(5)
  })
})

describe('splitSearchMatches', () => {
  it('空查询返回单片段且不标记为匹配', () => {
    expect(splitSearchMatches('abc', '')).toEqual([{ text: 'abc', match: false }])
    expect(splitSearchMatches('abc', '  ')).toEqual([{ text: 'abc', match: false }])
  })

  it('按匹配切段', () => {
    expect(splitSearchMatches('aXbXc', 'x')).toEqual([
      { text: 'a', match: false },
      { text: 'X', match: true },
      { text: 'b', match: false },
      { text: 'X', match: true },
      { text: 'c', match: false },
    ])
  })
})
