import { describe, it, expect } from 'vitest'
import { base64Encode, base64Decode } from '../utils/base64Utils'

describe('base64Encode', () => {
  it('编码英文字符串', () => {
    const result = base64Encode('Hello, World!')
    expect(result.success).toBe(true)
    expect(result.output).toBe('SGVsbG8sIFdvcmxkIQ==')
  })

  it('编码中文字符串', () => {
    const result = base64Encode('你好世界')
    expect(result.success).toBe(true)
    expect(result.output).toBeTruthy()
    const decoded = base64Decode(result.output)
    expect(decoded.output).toBe('你好世界')
  })

  it('编码空字符串返回错误', () => {
    const result = base64Encode('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('编码特殊字符', () => {
    const result = base64Encode('a+b=c&d')
    expect(result.success).toBe(true)
    const decoded = base64Decode(result.output)
    expect(decoded.output).toBe('a+b=c&d')
  })

  it('编码 emoji', () => {
    const result = base64Encode('Hello 🌍')
    expect(result.success).toBe(true)
    const decoded = base64Decode(result.output)
    expect(decoded.output).toBe('Hello 🌍')
  })
})

describe('base64Decode', () => {
  it('解码有效 Base64', () => {
    const result = base64Decode('SGVsbG8sIFdvcmxkIQ==')
    expect(result.success).toBe(true)
    expect(result.output).toBe('Hello, World!')
  })

  it('空输入返回错误', () => {
    const result = base64Decode('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('无效 Base64 返回错误', () => {
    const result = base64Decode('!!!invalid!!!')
    expect(result.success).toBe(false)
    expect(result.error).toBe('无效的 Base64 字符串')
  })

  it('处理带空白的输入', () => {
    const result = base64Decode('  SGVsbG8=  ')
    expect(result.success).toBe(true)
    expect(result.output).toBe('Hello')
  })
})
