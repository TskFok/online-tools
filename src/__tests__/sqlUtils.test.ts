import { describe, it, expect } from 'vitest'
import { formatSql, compressSql, COMMON_DIALECTS } from '../utils/sqlUtils'

describe('formatSql', () => {
  it('美化简单 SELECT 语句', () => {
    const result = formatSql('select id,name from users where status=1')
    expect(result.success).toBe(true)
    expect(result.output).toContain('SELECT')
    expect(result.output).toContain('FROM')
    expect(result.output).toContain('users')
  })

  it('使用 4 空格缩进', () => {
    const result = formatSql('select * from t', { indent: 4 })
    expect(result.success).toBe(true)
    expect(result.output).toBeTruthy()
  })

  it('关键字小写', () => {
    const result = formatSql('SELECT id FROM users', { keywordCase: 'lower' })
    expect(result.success).toBe(true)
    expect(result.output).toMatch(/select/i)
    expect(result.output).toContain('select')
  })

  it('支持 MySQL 方言', () => {
    const result = formatSql('SELECT `name` FROM `users` LIMIT 10', { language: 'mysql' })
    expect(result.success).toBe(true)
    expect(result.output).toContain('`name`')
  })

  it('空输入返回错误', () => {
    const result = formatSql('  ')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('无效 SQL 返回错误', () => {
    const result = formatSql('SELECT "unclosed')
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

describe('compressSql', () => {
  it('压缩多行 SQL 为单行', () => {
    const input = `SELECT id,
      name
    FROM users
    WHERE status = 1`
    const result = compressSql(input)
    expect(result.success).toBe(true)
    expect(result.output).not.toContain('\n')
    expect(result.output).toContain('SELECT')
    expect(result.output).toContain('users')
  })

  it('空输入返回错误', () => {
    const result = compressSql('')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })
})

describe('COMMON_DIALECTS', () => {
  it('包含常用方言选项', () => {
    const values = COMMON_DIALECTS.map((d) => d.value)
    expect(values).toContain('sql')
    expect(values).toContain('mysql')
    expect(values).toContain('postgresql')
    expect(values).toContain('sqlite')
  })
})
