export interface CodecResult {
  success: boolean
  output: string
  error?: string
}

export type UrlEncodeMode = 'component' | 'uri'

export function urlEncode(input: string, mode: UrlEncodeMode = 'component'): CodecResult {
  if (!input) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const output = mode === 'component' ? encodeURIComponent(input) : encodeURI(input)
    return { success: true, output }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}

export function urlDecode(input: string, mode: UrlEncodeMode = 'component'): CodecResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const output = mode === 'component' ? decodeURIComponent(input.trim()) : decodeURI(input.trim())
    return { success: true, output }
  } catch (e) {
    return { success: false, output: '', error: '无效的编码字符串' }
  }
}
