export interface CodecResult {
  success: boolean
  output: string
  error?: string
}

export type UnicodeFormat = 'escape' | 'uplus'

/**
 * 将文本转为 Unicode 编码（支持 ASCII、中文及所有 Unicode 字符）
 * escape: \u0041\u4e2d\u6587
 * uplus: U+0041 U+4E2D U+6587
 */
export function textToUnicode(input: string, format: UnicodeFormat = 'escape'): CodecResult {
  if (!input) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const parts: string[] = []
    for (const char of input) {
      const code = char.codePointAt(0)!
      if (format === 'escape') {
        if (code <= 0xffff) {
          parts.push(`\\u${code.toString(16).padStart(4, '0')}`)
        } else {
          parts.push(`\\u{${code.toString(16)}}`)
        }
      } else {
        parts.push(`U+${code.toString(16).toUpperCase().padStart(code <= 0xffff ? 4 : 6, '0')}`)
      }
    }
    const output = format === 'escape' ? parts.join('') : parts.join('')
    return { success: true, output }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}

/**
 * 将 Unicode 编码转为文本
 * 支持格式: \u0041 \u4e2d \u{1F600} U+0041 U+4E2D
 */
export function unicodeToText(input: string): CodecResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const result: string[] = []
    const str = input.trim()

    // 匹配 \u{1-6位十六进制} 或 \u4位十六进制 或 U+1-6位十六进制（U+ 后可选空格）
    const regex = /\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})|U\+([0-9a-fA-F]{1,6})\s*/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(str)) !== null) {
      // 输出匹配前的普通字符（原样保留）
      if (match.index > lastIndex) {
        result.push(str.slice(lastIndex, match.index))
      }
      const code = parseInt(match[1] ?? match[2] ?? match[3]!, 16)
      if (code > 0x10ffff) {
        return { success: false, output: '', error: `无效的 Unicode 码点: ${code}` }
      }
      result.push(String.fromCodePoint(code))
      lastIndex = regex.lastIndex
    }

    if (lastIndex < str.length) {
      result.push(str.slice(lastIndex))
    }

    return { success: true, output: result.join('') }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}
