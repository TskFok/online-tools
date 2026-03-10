export interface RandomStringResult {
  success: boolean
  output: string
  error?: string
}

export interface RandomStringOptions {
  includeUppercase?: boolean
  includeLowercase?: boolean
  includeNumbers?: boolean
  includeSpecialChars?: boolean
  customSpecialChars?: string
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const DEFAULT_SPECIAL_CHARS = '!@#$%^&*()-_=+[]{}|;:\'",.<>?/~`'

/**
 * 根据选项构建字符池
 */
function buildCharPool(options: RandomStringOptions): string {
  const pool: string[] = []
  if (options.includeUppercase) pool.push(UPPERCASE)
  if (options.includeLowercase) pool.push(LOWERCASE)
  if (options.includeNumbers) pool.push(NUMBERS)
  if (options.includeSpecialChars) {
    pool.push(
      options.customSpecialChars?.trim() || DEFAULT_SPECIAL_CHARS
    )
  }
  return pool.join('')
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param count 生成数量
 * @param options 字符内容选项
 */
export function generateRandomStrings(
  length: number,
  count: number,
  options: RandomStringOptions
): RandomStringResult {
  if (!Number.isFinite(length) || length < 1) {
    return { success: false, output: '', error: '长度必须是大于 0 的整数' }
  }

  if (length > 10000) {
    return { success: false, output: '', error: '单次字符串长度最多 10000' }
  }

  if (!Number.isFinite(count) || count < 1) {
    return { success: false, output: '', error: '生成数量必须是大于 0 的整数' }
  }

  if (count > 100) {
    return { success: false, output: '', error: '单次最多生成 100 个随机字符串' }
  }

  const pool = buildCharPool(options)
  if (!pool) {
    return { success: false, output: '', error: '请至少选择一种字符类型（大写、小写、数字、特殊字符）' }
  }

  const strings: string[] = []
  for (let i = 0; i < count; i++) {
    let str = ''
    for (let j = 0; j < length; j++) {
      str += pool[Math.floor(Math.random() * pool.length)]
    }
    strings.push(str)
  }

  return { success: true, output: strings.join('\n') }
}
