export interface DataUriImageResult {
  success: boolean
  dataUri: string
  mimeType: string
  extension: string
  byteLength: number
  error?: string
}

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'image/avif': 'avif',
  'image/apng': 'png',
}

function fail(error: string): DataUriImageResult {
  return {
    success: false,
    dataUri: '',
    mimeType: '',
    extension: '',
    byteLength: 0,
    error,
  }
}

function normalizeMime(mime: string): string {
  return mime === 'image/jpg' ? 'image/jpeg' : mime
}

function extensionFor(mime: string): string {
  const known = EXTENSIONS[mime]
  if (known) return known
  const subtype = mime.slice('image/'.length).split('+')[0] ?? ''
  const cleaned = subtype.replace(/[^a-z0-9]/g, '')
  return cleaned || 'img'
}

function padBase64(value: string): string {
  const remainder = value.length % 4
  if (remainder === 0) return value
  return value + '='.repeat(4 - remainder)
}

function stripWrappingQuotes(value: string): string {
  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.endsWith(quote) && value.length >= 2) {
    return value.slice(1, -1).trim()
  }
  return value
}

export function parseDataUriImage(input: string): DataUriImageResult {
  const raw = stripWrappingQuotes(input.trim()).replaceAll('\\/', '/')
  if (!raw) return fail('输入不能为空')

  if (!raw.toLowerCase().startsWith('data:')) {
    return fail('不是 Data URI，应以 data:image/ 开头')
  }

  const comma = raw.indexOf(',')
  if (comma < 0) return fail('Data URI 缺少逗号分隔的图片数据')

  const meta = raw.slice('data:'.length, comma).trim()
  const payload = raw.slice(comma + 1)
  if (!meta) return fail('缺少图片 MIME 类型')

  const parts = meta.split(';').map((part) => part.trim()).filter(Boolean)
  const mime = normalizeMime(parts[0].toLowerCase())
  if (!mime.startsWith('image/')) {
    return fail('仅支持 image/* 类型的 Data URI')
  }

  const isBase64 = parts.slice(1).some((part) => part.toLowerCase() === 'base64')
  const extension = extensionFor(mime)

  if (isBase64) {
    const compact = payload.replace(/\s+/g, '')
    if (!compact) return fail('图片数据为空')

    const padded = padBase64(compact)
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(padded)) {
      return fail('无效的 Base64 图片数据')
    }

    let binary = ''
    try {
      binary = atob(padded)
    } catch {
      return fail('无效的 Base64 图片数据')
    }

    return {
      success: true,
      dataUri: `data:${mime};base64,${padded}`,
      mimeType: mime,
      extension,
      byteLength: binary.length,
    }
  }

  if (!payload) return fail('图片数据为空')

  let decoded = payload
  try {
    decoded = decodeURIComponent(payload)
  } catch {
    return fail('图片数据无法解码')
  }

  return {
    success: true,
    dataUri: `data:${mime},${payload}`,
    mimeType: mime,
    extension,
    byteLength: new TextEncoder().encode(decoded).length,
  }
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
