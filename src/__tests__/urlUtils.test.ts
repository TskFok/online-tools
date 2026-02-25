import { describe, it, expect } from 'vitest'
import { urlEncode, urlDecode } from '../utils/urlUtils'

describe('urlEncode', () => {
  it('编码中文字符 (component 模式)', () => {
    const result = urlEncode('你好世界', 'component')
    expect(result.success).toBe(true)
    expect(result.output).toBe('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C')
  })

  it('编码特殊字符 (component 模式)', () => {
    const result = urlEncode('a=1&b=2', 'component')
    expect(result.success).toBe(true)
    expect(result.output).toBe('a%3D1%26b%3D2')
  })

  it('编码 URL (uri 模式保留分隔符)', () => {
    const result = urlEncode('https://example.com/path?q=你好', 'uri')
    expect(result.success).toBe(true)
    expect(result.output).toContain('https://example.com/path?q=')
    expect(result.output).not.toContain('你好')
  })

  it('空输入返回错误', () => {
    const result = urlEncode('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })
})

describe('urlDecode', () => {
  it('解码中文字符 (component 模式)', () => {
    const result = urlDecode('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C', 'component')
    expect(result.success).toBe(true)
    expect(result.output).toBe('你好世界')
  })

  it('解码特殊字符', () => {
    const result = urlDecode('a%3D1%26b%3D2', 'component')
    expect(result.success).toBe(true)
    expect(result.output).toBe('a=1&b=2')
  })

  it('空输入返回错误', () => {
    const result = urlDecode('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('无效编码返回错误', () => {
    const result = urlDecode('%ZZ')
    expect(result.success).toBe(false)
    expect(result.error).toBe('无效的编码字符串')
  })

  it('处理带空白的输入', () => {
    const result = urlDecode('  hello%20world  ')
    expect(result.success).toBe(true)
    expect(result.output).toBe('hello world')
  })
})
