export interface FormatResult {
  success: boolean
  output: string
  error?: string
}

export function formatJson(input: string, indent: number = 2): FormatResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed, null, indent) }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}

export function compressJson(input: string): FormatResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed) }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}

export function highlightJson(json: string): string {
  return json.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number'
      if (match.startsWith('"')) {
        cls = match.endsWith(':') ? 'json-key' : 'json-string'
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (match === 'null') {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    },
  )
}

export type SerializeFormat = 'auto' | 'querystring' | 'php' | 'keyvalue'

export function parseQueryString(input: string): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {}
  const params = input.split('&')
  for (const param of params) {
    const eqIndex = param.indexOf('=')
    if (eqIndex === -1) continue
    const key = decodeURIComponent(param.slice(0, eqIndex))
    const value = decodeURIComponent(param.slice(eqIndex + 1))
    if (key in result) {
      const existing = result[key]
      result[key] = Array.isArray(existing) ? [...existing, value] : [existing, value]
    } else {
      result[key] = value
    }
  }
  return result
}

/** PHP serialize 中 s:LEN 的 LEN 是 UTF-8 字节数，不是字符数。返回对应字节数的字符数量 */
function utf8CharCountInBytes(input: string, startPos: number, byteLen: number): number {
  const encoder = new TextEncoder()
  let bytes = 0
  let i = startPos
  while (i < input.length && bytes < byteLen) {
    const charBytes = encoder.encode(input[i]).length
    if (bytes + charBytes > byteLen) break
    bytes += charBytes
    i++
  }
  return i - startPos
}

export function parsePhpSerialize(input: string): unknown {
  let pos = 0

  function read(): unknown {
    const type = input[pos]
    if (type === undefined) {
      throw new Error(`解析意外结束 (位置 ${pos})`)
    }

    if (type === 's') {
      pos += 2 // skip 's:'
      const colonPos = input.indexOf(':', pos)
      if (colonPos === -1) throw new Error(`无效的字符串格式 (位置 ${pos})`)
      const len = parseInt(input.slice(pos, colonPos), 10)
      if (isNaN(len)) throw new Error(`无效的长度值 (位置 ${pos})`)
      pos = colonPos + 2 // skip ':<len>:"'
      const charCount = utf8CharCountInBytes(input, pos, len)
      const str = input.slice(pos, pos + charCount)
      pos += charCount + 2 // skip value and '";'
      return str
    }

    if (type === 'i') {
      pos += 2 // skip 'i:'
      const semiPos = input.indexOf(';', pos)
      const num = parseInt(input.slice(pos, semiPos), 10)
      pos = semiPos + 1
      return num
    }

    if (type === 'd') {
      pos += 2 // skip 'd:'
      const semiPos = input.indexOf(';', pos)
      const num = parseFloat(input.slice(pos, semiPos))
      pos = semiPos + 1
      return num
    }

    if (type === 'b') {
      pos += 2 // skip 'b:'
      const val = input[pos] === '1'
      pos += 2 // skip value and ';'
      return val
    }

    if (type === 'N') {
      pos += 2 // skip 'N;'
      return null
    }

    if (type === 'a') {
      pos += 2 // skip 'a:'
      const colonPos = input.indexOf(':', pos)
      const count = parseInt(input.slice(pos, colonPos), 10)
      pos = colonPos + 2 // skip ':<count>:{'
      const obj: Record<string, unknown> = {}
      for (let i = 0; i < count; i++) {
        const key = read()
        const value = read()
        obj[String(key)] = value
      }
      pos += 1 // skip '}'
      return obj
    }

    throw new Error(`不支持的 PHP 序列化类型: ${type} (位置 ${pos})`)
  }

  return read()
}

export function parseKeyValue(input: string): Record<string, string> {
  const result: Record<string, string> = {}
  const lines = input.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue
    const sepIndex = Math.max(trimmed.indexOf(':'), trimmed.indexOf('='))
    if (sepIndex === -1) continue

    const colonIdx = trimmed.indexOf(':')
    const eqIdx = trimmed.indexOf('=')
    let actualIdx: number
    if (colonIdx === -1) actualIdx = eqIdx
    else if (eqIdx === -1) actualIdx = colonIdx
    else actualIdx = Math.min(colonIdx, eqIdx)

    const key = trimmed.slice(0, actualIdx).trim()
    const value = trimmed.slice(actualIdx + 1).trim()
    if (key) result[key] = value
  }
  return result
}

export function detectFormat(input: string): SerializeFormat {
  const trimmed = input.trim()
  if (/^[a-z]:\d+:\{/.test(trimmed) || /^[Nbs]:/.test(trimmed)) return 'php'
  if (/^[^=\n]+=[^=\n]*(&[^=\n]+=[^=\n]*)*$/.test(trimmed)) return 'querystring'
  if (trimmed.includes('\n') && /[^:=]+[:=].+/.test(trimmed)) return 'keyvalue'
  return 'querystring'
}

export function serializeToJson(input: string, format: SerializeFormat = 'auto'): FormatResult {
  if (!input.trim()) {
    return { success: false, output: '', error: '输入不能为空' }
  }

  const detected = format === 'auto' ? detectFormat(input) : format

  try {
    let parsed: unknown
    switch (detected) {
      case 'querystring':
        parsed = parseQueryString(input.trim())
        break
      case 'php':
        parsed = parsePhpSerialize(input.trim())
        break
      case 'keyvalue':
        parsed = parseKeyValue(input)
        break
      default:
        parsed = parseQueryString(input.trim())
    }
    return { success: true, output: JSON.stringify(parsed, null, 2) }
  } catch (e) {
    return { success: false, output: '', error: (e as Error).message }
  }
}
