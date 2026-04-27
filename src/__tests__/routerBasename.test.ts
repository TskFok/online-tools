import { describe, it, expect } from 'vitest'
import { routerBasenameFromViteBase } from '../utils/routerBasename'

describe('routerBasenameFromViteBase', () => {
  it('子路径下去掉尾部斜杠', () => {
    expect(routerBasenameFromViteBase('/online-tools/')).toBe('/online-tools')
  })

  it('已无前缀尾部斜杠时原样返回', () => {
    expect(routerBasenameFromViteBase('/app')).toBe('/app')
  })

  it('根路径返回 undefined 以使用默认路由根', () => {
    expect(routerBasenameFromViteBase('/')).toBeUndefined()
  })

  it('空字符串与根相同', () => {
    expect(routerBasenameFromViteBase('')).toBeUndefined()
  })
})
