import { describe, it, expect } from 'vitest'
import { jsonPathPrefixesToUncollapseForFirstSearchHit } from '../utils/jsonSearchNavigate'

describe('jsonPathPrefixesToUncollapseForFirstSearchHit', () => {
  it('空查询返回空', () => {
    expect(jsonPathPrefixesToUncollapseForFirstSearchHit({ a: 1 }, '')).toEqual([])
    expect(jsonPathPrefixesToUncollapseForFirstSearchHit({ a: 1 }, '  ')).toEqual([])
  })

  it('根上匹配键', () => {
    expect(jsonPathPrefixesToUncollapseForFirstSearchHit({ findme: 1 }, 'findme')).toEqual([[]])
  })

  it('嵌套值匹配', () => {
    expect(
      jsonPathPrefixesToUncollapseForFirstSearchHit(
        { outer: { inner: 'hello-world' } },
        'world',
      ),
    ).toEqual([[], ['outer']])
  })

  it('数组元素匹配', () => {
    expect(
      jsonPathPrefixesToUncollapseForFirstSearchHit({ items: ['a', 'beta'] }, 'bet'),
    ).toEqual([[], ['items']])
  })
})
