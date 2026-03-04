import { describe, it, expect } from 'vitest'
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
} from '../utils/timestampUtils'

describe('timestampToDate', () => {
  it('将秒级时间戳转为日期', () => {
    const result = timestampToDate('1700000000', 's')
    expect(result.success).toBe(true)
    expect(result.output).toContain('本地时间:')
    expect(result.output).toContain('ISO 8601:')
    expect(result.output).toContain('2023-11-')
    expect(result.output).toContain('UTC 时间:')
  })

  it('将毫秒级时间戳转为日期', () => {
    const result = timestampToDate('1700000000000', 'ms')
    expect(result.success).toBe(true)
    expect(result.output).toContain('ISO 8601:')
    expect(result.output).toContain('2023-11-')
  })

  it('空输入返回错误', () => {
    const result = timestampToDate('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('纯空格输入返回错误', () => {
    const result = timestampToDate('   ')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('非数字输入返回错误', () => {
    const result = timestampToDate('abc')
    expect(result.success).toBe(false)
    expect(result.error).toBe('请输入有效的数字')
  })

  it('处理带空白的数字', () => {
    const result = timestampToDate('  1700000000  ', 's')
    expect(result.success).toBe(true)
    expect(result.output).toContain('ISO 8601:')
  })
})

describe('dateToTimestamp', () => {
  it('将 ISO 日期转为秒级时间戳', () => {
    const result = dateToTimestamp('2023-11-15T10:13:20.000Z', 's')
    expect(result.success).toBe(true)
    expect(result.output).toMatch(/^\d{10}$/)
    expect(Number(result.output)).toBeGreaterThan(1700000000)
    expect(Number(result.output)).toBeLessThan(1800000000)
  })

  it('将 ISO 日期转为毫秒级时间戳', () => {
    const result = dateToTimestamp('2023-11-15T10:13:20.000Z', 'ms')
    expect(result.success).toBe(true)
    expect(result.output).toMatch(/^\d{13}$/)
  })

  it('支持常见日期格式', () => {
    const result = dateToTimestamp('2024-01-15 12:00:00', 's')
    expect(result.success).toBe(true)
    expect(result.output).toMatch(/^\d+$/)
  })

  it('空输入返回错误', () => {
    const result = dateToTimestamp('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('无效日期返回错误', () => {
    const result = dateToTimestamp('invalid-date')
    expect(result.success).toBe(false)
    expect(result.error).toContain('无法解析')
  })
})

describe('dateToTimestamp 与 timestampToDate 互逆', () => {
  it('秒级时间戳往返转换', () => {
    const ts = '1700000000'
    const toDateResult = timestampToDate(ts, 's')
    expect(toDateResult.success).toBe(true)

    const isoMatch = toDateResult.output.match(/ISO 8601:\s*(.+)/)
    expect(isoMatch).toBeTruthy()
    const isoStr = isoMatch![1].trim()

    const toTsResult = dateToTimestamp(isoStr, 's')
    expect(toTsResult.success).toBe(true)
    expect(toTsResult.output).toBe(ts)
  })

  it('毫秒级时间戳往返转换', () => {
    const ts = '1700000000000'
    const toDateResult = timestampToDate(ts, 'ms')
    expect(toDateResult.success).toBe(true)

    const isoMatch = toDateResult.output.match(/ISO 8601:\s*(.+)/)
    expect(isoMatch).toBeTruthy()
    const isoStr = isoMatch![1].trim()

    const toTsResult = dateToTimestamp(isoStr, 'ms')
    expect(toTsResult.success).toBe(true)
    expect(toTsResult.output).toBe(ts)
  })
})

describe('getCurrentTimestamp', () => {
  it('返回秒级当前时间戳', () => {
    const result = getCurrentTimestamp('s')
    expect(result).toMatch(/^\d{10}$/)
    const now = Math.floor(Date.now() / 1000)
    expect(Math.abs(Number(result) - now)).toBeLessThan(2)
  })

  it('返回毫秒级当前时间戳', () => {
    const result = getCurrentTimestamp('ms')
    expect(result).toMatch(/^\d{13}$/)
    const now = Date.now()
    expect(Math.abs(Number(result) - now)).toBeLessThan(2000)
  })

  it('默认返回秒级', () => {
    const result = getCurrentTimestamp()
    expect(result).toMatch(/^\d{10}$/)
  })
})
