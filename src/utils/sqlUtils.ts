import { format, type SqlLanguage } from 'sql-formatter'

export interface FormatResult {
  success: boolean
  output: string
  error?: string
}

export type SqlDialect = SqlLanguage

export type KeywordCase = 'preserve' | 'upper' | 'lower'

export interface SqlFormatOptions {
  indent?: number
  language?: SqlDialect
  keywordCase?: KeywordCase
}

const COMMON_DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: 'sql', label: '标准 SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'transactsql', label: 'Transact-SQL' },
  { value: 'plsql', label: 'PL/SQL' },
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'snowflake', label: 'Snowflake' },
]

export { COMMON_DIALECTS }

function buildFormatConfig(options: SqlFormatOptions) {
  return {
    language: options.language ?? 'sql',
    tabWidth: options.indent ?? 2,
    keywordCase: options.keywordCase ?? 'upper',
  }
}

export function formatSql(input: string, options: SqlFormatOptions = {}): FormatResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const output = format(input.trim(), buildFormatConfig(options))
    return { success: true, output }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}

/** 压缩 SQL：先格式化再折叠空白，便于对比与复制 */
export function compressSql(input: string, options: SqlFormatOptions = {}): FormatResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const formatted = format(input.trim(), {
      ...buildFormatConfig(options),
      keywordCase: options.keywordCase ?? 'preserve',
    })
    const output = formatted
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),;])\s*/g, '$1')
      .trim()
    return { success: true, output }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}
