import { describe, it, expect } from 'vitest'
import { generateRandomStrings } from '../utils/randomStringUtils'

describe('generateRandomStrings', () => {
  describe('基本生成', () => {
    it('生成指定长度的字符串', () => {
      const result = generateRandomStrings(10, 1, {
        includeLowercase: true,
      })
      expect(result.success).toBe(true)
      expect(result.output).toHaveLength(10)
      expect(result.output).toMatch(/^[a-z]+$/)
    })

    it('仅大写字母', () => {
      const result = generateRandomStrings(8, 1, {
        includeUppercase: true,
      })
      expect(result.success).toBe(true)
      expect(result.output).toHaveLength(8)
      expect(result.output).toMatch(/^[A-Z]+$/)
    })

    it('仅数字', () => {
      const result = generateRandomStrings(6, 1, {
        includeNumbers: true,
      })
      expect(result.success).toBe(true)
      expect(result.output).toHaveLength(6)
      expect(result.output).toMatch(/^[0-9]+$/)
    })

    it('多种字符类型组合', () => {
      const result = generateRandomStrings(20, 1, {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
      })
      expect(result.success).toBe(true)
      expect(result.output).toHaveLength(20)
      expect(result.output).toMatch(/^[A-Za-z0-9]+$/)
    })

    it('包含特殊字符', () => {
      const result = generateRandomStrings(10, 1, {
        includeSpecialChars: true,
      })
      expect(result.success).toBe(true)
      expect(result.output).toHaveLength(10)
      expect(result.output.length).toBe(10)
    })

    it('自定义特殊字符', () => {
      const result = generateRandomStrings(5, 1, {
        includeSpecialChars: true,
        customSpecialChars: '!@#',
      })
      expect(result.success).toBe(true)
      expect(result.output).toHaveLength(5)
      expect(result.output).toMatch(/^[!@#]+$/)
    })

    it('生成多个字符串', () => {
      const result = generateRandomStrings(4, 3, {
        includeLowercase: true,
      })
      expect(result.success).toBe(true)
      const lines = result.output.split('\n')
      expect(lines).toHaveLength(3)
      lines.forEach((line) => {
        expect(line).toHaveLength(4)
        expect(line).toMatch(/^[a-z]+$/)
      })
    })
  })

  describe('参数校验', () => {
    it('length < 1 返回错误', () => {
      const result = generateRandomStrings(0, 1, { includeLowercase: true })
      expect(result.success).toBe(false)
      expect(result.error).toContain('长度')
    })

    it('length > 10000 返回错误', () => {
      const result = generateRandomStrings(10001, 1, { includeLowercase: true })
      expect(result.success).toBe(false)
      expect(result.error).toContain('10000')
    })

    it('count < 1 返回错误', () => {
      const result = generateRandomStrings(10, 0, { includeLowercase: true })
      expect(result.success).toBe(false)
      expect(result.error).toContain('生成数量')
    })

    it('count > 100 返回错误', () => {
      const result = generateRandomStrings(10, 101, { includeLowercase: true })
      expect(result.success).toBe(false)
      expect(result.error).toContain('100')
    })

    it('未选择任何字符类型返回错误', () => {
      const result = generateRandomStrings(10, 1, {})
      expect(result.success).toBe(false)
      expect(result.error).toContain('至少选择一种')
    })

    it('特殊字符选中但自定义为空时使用默认集', () => {
      const result = generateRandomStrings(5, 1, {
        includeSpecialChars: true,
        customSpecialChars: '   ',
      })
      expect(result.success).toBe(true)
      expect(result.output).toHaveLength(5)
    })
  })
})
