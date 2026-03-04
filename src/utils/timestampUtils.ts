export interface TimestampResult {
  success: boolean
  output: string
  error?: string
}

export type TimestampUnit = 's' | 'ms'

/**
 * 将时间戳转为日期时间字符串
 */
export function timestampToDate(
  input: string,
  unit: TimestampUnit = 's'
): TimestampResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { success: false, output: '', error: '输入不能为空' }
  }

  const num = Number(trimmed)
  if (!Number.isFinite(num)) {
    return { success: false, output: '', error: '请输入有效的数字' }
  }

  const ms = unit === 's' ? num * 1000 : num
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) {
    return { success: false, output: '', error: '无效的时间戳' }
  }

  const localStr = date.toLocaleString('zh-CN')
  const isoStr = date.toISOString()
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' })

  const output = [
    `本地时间: ${localStr}`,
    `ISO 8601: ${isoStr}`,
    `UTC 时间: ${utcStr}`,
  ].join('\n')

  return { success: true, output }
}

/**
 * 将日期时间字符串转为时间戳
 */
export function dateToTimestamp(
  input: string,
  unit: TimestampUnit = 's'
): TimestampResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { success: false, output: '', error: '输入不能为空' }
  }

  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return { success: false, output: '', error: '无法解析的日期格式，请使用 ISO 格式或常见日期格式' }
  }

  const ms = date.getTime()
  const ts = unit === 's' ? Math.floor(ms / 1000) : ms
  return { success: true, output: String(ts) }
}

/**
 * 获取当前时间戳
 */
export function getCurrentTimestamp(unit: TimestampUnit = 's'): string {
  const ms = Date.now()
  return unit === 's' ? String(Math.floor(ms / 1000)) : String(ms)
}
