import { describe, it, expect } from 'vitest'
import { generateRandomNumbers } from '../utils/randomUtils'

describe('generateRandomNumbers', () => {
  describe('整数模式', () => {
    it('生成单个整数', () => {
      const result = generateRandomNumbers(0, 100, 1, 'integer')
      expect(result.success).toBe(true)
      expect(result.output).toMatch(/^\d+$/)
      const num = Number(result.output)
      expect(num).toBeGreaterThanOrEqual(0)
      expect(num).toBeLessThanOrEqual(100)
    })

    it('生成多个整数', () => {
      const result = generateRandomNumbers(1, 10, 5, 'integer')
      expect(result.success).toBe(true)
      const lines = result.output.split('\n')
      expect(lines).toHaveLength(5)
      lines.forEach((line) => {
        const num = Number(line)
        expect(num).toBeGreaterThanOrEqual(1)
        expect(num).toBeLessThanOrEqual(10)
        expect(Number.isInteger(num)).toBe(true)
      })
    })

    it('边界值 min=max 时返回该值', () => {
      const result = generateRandomNumbers(42, 42, 3, 'integer')
      expect(result.success).toBe(true)
      const lines = result.output.split('\n')
      expect(lines).toHaveLength(3)
      lines.forEach((line) => expect(line).toBe('42'))
    })

    it('支持负数范围', () => {
      const result = generateRandomNumbers(-10, -1, 1, 'integer')
      expect(result.success).toBe(true)
      const num = Number(result.output)
      expect(num).toBeGreaterThanOrEqual(-10)
      expect(num).toBeLessThanOrEqual(-1)
      expect(Number.isInteger(num)).toBe(true)
    })
  })

  describe('小数模式', () => {
    it('生成单个小数', () => {
      const result = generateRandomNumbers(0, 1, 1, 'float')
      expect(result.success).toBe(true)
      const num = Number(result.output)
      expect(num).toBeGreaterThanOrEqual(0)
      expect(num).toBeLessThanOrEqual(1)
    })

    it('生成多个小数', () => {
      const result = generateRandomNumbers(0.5, 1.5, 3, 'float')
      expect(result.success).toBe(true)
      const lines = result.output.split('\n')
      expect(lines).toHaveLength(3)
      lines.forEach((line) => {
        const num = Number(line)
        expect(num).toBeGreaterThanOrEqual(0.5)
        expect(num).toBeLessThanOrEqual(1.5)
      })
    })
  })

  describe('参数校验', () => {
    it('min > max 返回错误', () => {
      const result = generateRandomNumbers(100, 0, 1, 'integer')
      expect(result.success).toBe(false)
      expect(result.error).toContain('最小值不能大于最大值')
    })

    it('count < 1 返回错误', () => {
      const result = generateRandomNumbers(0, 100, 0, 'integer')
      expect(result.success).toBe(false)
      expect(result.error).toContain('生成数量')
    })

    it('count > 10000 返回错误', () => {
      const result = generateRandomNumbers(0, 100, 10001, 'integer')
      expect(result.success).toBe(false)
      expect(result.error).toContain('10000')
    })

    it('min 为 NaN 返回错误', () => {
      const result = generateRandomNumbers(Number.NaN, 100, 1, 'integer')
      expect(result.success).toBe(false)
      expect(result.error).toContain('有效数字')
    })

    it('max 为 Infinity 返回错误', () => {
      const result = generateRandomNumbers(0, Number.POSITIVE_INFINITY, 1, 'integer')
      expect(result.success).toBe(false)
      expect(result.error).toContain('有效数字')
    })
  })

  describe('默认类型', () => {
    it('不传 type 时默认为整数', () => {
      const result = generateRandomNumbers(1, 5, 1)
      expect(result.success).toBe(true)
      const num = Number(result.output)
      expect(Number.isInteger(num)).toBe(true)
      expect(num).toBeGreaterThanOrEqual(1)
      expect(num).toBeLessThanOrEqual(5)
    })
  })
})
