import { describe, it, expect } from 'vitest'
import { textToUnicode, unicodeToText } from '../utils/unicodeUtils'

describe('textToUnicode', () => {
  it('ASCII 转 Unicode escape 格式', () => {
    const result = textToUnicode('A', 'escape')
    expect(result.success).toBe(true)
    expect(result.output).toBe('\\u0041')
  })

  it('中文转 Unicode escape 格式', () => {
    const result = textToUnicode('中文', 'escape')
    expect(result.success).toBe(true)
    expect(result.output).toBe('\\u4e2d\\u6587')
  })

  it('ASCII 转 U+ 格式', () => {
    const result = textToUnicode('AB', 'uplus')
    expect(result.success).toBe(true)
    expect(result.output).toBe('U+0041U+0042')
  })

  it('中文转 U+ 格式', () => {
    const result = textToUnicode('中', 'uplus')
    expect(result.success).toBe(true)
    expect(result.output).toBe('U+4E2D')
  })

  it('emoji 转 Unicode 使用大括号格式', () => {
    const result = textToUnicode('😀', 'escape')
    expect(result.success).toBe(true)
    expect(result.output).toBe('\\u{1f600}')
  })

  it('空输入返回错误', () => {
    const result = textToUnicode('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('混合 ASCII 和中文', () => {
    const result = textToUnicode('Hello世界', 'escape')
    expect(result.success).toBe(true)
    const decoded = unicodeToText(result.output)
    expect(decoded.success).toBe(true)
    expect(decoded.output).toBe('Hello世界')
  })
})

describe('unicodeToText', () => {
  it('\\uXXXX 解码为 ASCII', () => {
    const result = unicodeToText('\\u0041')
    expect(result.success).toBe(true)
    expect(result.output).toBe('A')
  })

  it('\\uXXXX 解码为中文', () => {
    const result = unicodeToText('\\u4e2d\\u6587')
    expect(result.success).toBe(true)
    expect(result.output).toBe('中文')
  })

  it('U+XXXX 格式解码', () => {
    const result = unicodeToText('U+4E2D U+6587')
    expect(result.success).toBe(true)
    expect(result.output).toBe('中文')
  })

  it('\\u{XXXX} 格式解码 emoji', () => {
    const result = unicodeToText('\\u{1f600}')
    expect(result.success).toBe(true)
    expect(result.output).toBe('😀')
  })

  it('混合格式解码', () => {
    const result = unicodeToText('\\u0041U+4E2D\\u6587')
    expect(result.success).toBe(true)
    expect(result.output).toBe('A中文')
  })

  it('保留非 Unicode 的普通字符', () => {
    const result = unicodeToText('hello\\u4e2d\\u6587world')
    expect(result.success).toBe(true)
    expect(result.output).toBe('hello中文world')
  })

  it('空输入返回错误', () => {
    const result = unicodeToText('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('纯空格输入返回错误', () => {
    const result = unicodeToText('   ')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('无 Unicode 转义时原样返回', () => {
    const result = unicodeToText('plain text')
    expect(result.success).toBe(true)
    expect(result.output).toBe('plain text')
  })
})

describe('textToUnicode 与 unicodeToText 互逆', () => {
  it('escape 格式往返', () => {
    const original = 'Hello中文😀'
    const encoded = textToUnicode(original, 'escape')
    expect(encoded.success).toBe(true)
    const decoded = unicodeToText(encoded.output)
    expect(decoded.success).toBe(true)
    expect(decoded.output).toBe(original)
  })

  it('uplus 格式往返', () => {
    const original = 'ABC'
    const encoded = textToUnicode(original, 'uplus')
    expect(encoded.success).toBe(true)
    const decoded = unicodeToText(encoded.output)
    expect(decoded.success).toBe(true)
    expect(decoded.output).toBe(original)
  })
})
