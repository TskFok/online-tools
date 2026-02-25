export interface CodecResult {
  success: boolean
  output: string
  error?: string
}

export function base64Encode(input: string): CodecResult {
  if (!input) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const bytes = new TextEncoder().encode(input)
    let binary = ''
    for (const byte of bytes) {
      binary += String.fromCharCode(byte)
    }
    return { success: true, output: btoa(binary) }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}

export function base64Decode(input: string): CodecResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const binary = atob(input.trim())
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return { success: true, output: new TextDecoder().decode(bytes) }
  } catch (e) {
    return { success: false, output: '', error: '无效的 Base64 字符串' }
  }
}
