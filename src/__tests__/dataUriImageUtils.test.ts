import { describe, expect, it } from 'vitest'
import { formatByteSize, parseDataUriImage } from '../utils/dataUriImageUtils'

const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
const PNG_URI = `data:image/png;base64,${PNG_BASE64}`

describe('parseDataUriImage', () => {
  it('解析 PNG Data URI', () => {
    const result = parseDataUriImage(PNG_URI)
    expect(result.success).toBe(true)
    expect(result.mimeType).toBe('image/png')
    expect(result.extension).toBe('png')
    expect(result.dataUri).toBe(PNG_URI)
    expect(result.byteLength).toBe(atob(PNG_BASE64).length)
  })

  it('去掉 Base64 中的换行后仍能解析', () => {
    const wrapped = `data:image/png;base64,${PNG_BASE64.slice(0, 20)}\n${PNG_BASE64.slice(20)}`
    const result = parseDataUriImage(wrapped)
    expect(result.success).toBe(true)
    expect(result.dataUri).toBe(PNG_URI)
  })

  it('去掉首尾引号', () => {
    const result = parseDataUriImage(`"${PNG_URI}"`)
    expect(result.success).toBe(true)
    expect(result.dataUri).toBe(PNG_URI)
  })

  it('还原 JSON 里转义的斜杠', () => {
    const result = parseDataUriImage(`"${PNG_URI.replaceAll('/', '\\/')}"`)
    expect(result.success).toBe(true)
    expect(result.dataUri).toBe(PNG_URI)
  })

  it('MIME 与 base64 标记大小写不敏感，并把 image/jpg 规范为 image/jpeg', () => {
    const result = parseDataUriImage(`DATA:IMAGE/JPG;BASE64,${PNG_BASE64}`)
    expect(result.success).toBe(true)
    expect(result.mimeType).toBe('image/jpeg')
    expect(result.extension).toBe('jpg')
    expect(result.dataUri).toBe(`data:image/jpeg;base64,${PNG_BASE64}`)
  })

  it('补齐缺少的 Base64 填充', () => {
    const unpadded = PNG_BASE64.replace(/=+$/, '')
    const result = parseDataUriImage(`data:image/png;base64,${unpadded}`)
    expect(result.success).toBe(true)
    expect(result.dataUri).toBe(PNG_URI)
  })

  it('解析百分号编码的 SVG', () => {
    const result = parseDataUriImage(
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E',
    )
    expect(result.success).toBe(true)
    expect(result.mimeType).toBe('image/svg+xml')
    expect(result.extension).toBe('svg')
    expect(result.byteLength).toBe(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>').length)
  })

  it('空输入返回错误', () => {
    expect(parseDataUriImage('   ').error).toBe('输入不能为空')
  })

  it('拒绝非 Data URI', () => {
    const result = parseDataUriImage(PNG_BASE64)
    expect(result.success).toBe(false)
    expect(result.error).toBe('不是 Data URI，应以 data:image/ 开头')
  })

  it('拒绝非图片 MIME', () => {
    const result = parseDataUriImage('data:text/plain;base64,SGVsbG8=')
    expect(result.success).toBe(false)
    expect(result.error).toBe('仅支持 image/* 类型的 Data URI')
  })

  it('拒绝缺少逗号或数据为空', () => {
    expect(parseDataUriImage('data:image/png;base64').error).toBe('Data URI 缺少逗号分隔的图片数据')
    expect(parseDataUriImage('data:image/png;base64,').error).toBe('图片数据为空')
  })

  it('拒绝无效 Base64', () => {
    expect(parseDataUriImage('data:image/png;base64,!!!!').error).toBe('无效的 Base64 图片数据')
  })
})

describe('formatByteSize', () => {
  it('按字节、KB、MB 显示', () => {
    expect(formatByteSize(70)).toBe('70 B')
    expect(formatByteSize(1536)).toBe('1.5 KB')
    expect(formatByteSize(1024 * 1024)).toBe('1.00 MB')
  })
})
