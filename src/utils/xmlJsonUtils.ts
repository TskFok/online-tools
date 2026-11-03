import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser'
import type { FormatResult } from './jsonUtils'

const ATTRIBUTE_PREFIX = '@_'
const TEXT_NODE = '#text'

const sharedOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: ATTRIBUTE_PREFIX,
  textNodeName: TEXT_NODE,
  parseTagValue: false,
  parseAttributeValue: false,
}

const parser = new XMLParser({
  ...sharedOptions,
  trimValues: true,
  ignoreDeclaration: true,
  ignorePiTags: true,
})

const builder = new XMLBuilder({
  ...sharedOptions,
  format: true,
  indentBy: '  ',
  suppressEmptyNode: false,
})

function emptyInput(): FormatResult {
  return { success: false, output: '', error: '输入不能为空' }
}

function reorderNode(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(reorderNode)
  if (!value || typeof value !== 'object') return value

  const source = value as Record<string, unknown>
  const keys = Object.keys(source)
  const orderedKeys = [
    ...keys.filter((key) => key.startsWith(ATTRIBUTE_PREFIX)),
    ...keys.filter((key) => key === TEXT_NODE),
    ...keys.filter((key) => !key.startsWith(ATTRIBUTE_PREFIX) && key !== TEXT_NODE),
  ]
  const ordered: Record<string, unknown> = {}
  for (const key of orderedKeys) ordered[key] = reorderNode(source[key])
  return ordered
}

export function xmlToJson(input: string): FormatResult {
  if (!input.trim()) return emptyInput()

  const validation = XMLValidator.validate(input)
  if (validation !== true) {
    return { success: false, output: '', error: validation.err.msg }
  }

  try {
    const parsed = reorderNode(parser.parse(input))
    return { success: true, output: JSON.stringify(parsed, null, 2) }
  } catch (error) {
    return { success: false, output: '', error: (error as Error).message }
  }
}

export function jsonToXml(input: string): FormatResult {
  if (!input.trim()) return emptyInput()

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    return { success: false, output: '', error: (error as Error).message }
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { success: false, output: '', error: 'JSON 根节点必须是对象' }
  }

  const record = parsed as Record<string, unknown>
  const keys = Object.keys(record)
  if (keys.length === 0) {
    return { success: false, output: '', error: 'JSON 对象至少需要一个根元素' }
  }

  const rooted = keys.length === 1 ? record : { root: record }
  try {
    const body = builder.build(rooted).trimEnd()
    return {
      success: true,
      output: `<?xml version="1.0" encoding="UTF-8"?>\n${body}`,
    }
  } catch (error) {
    return { success: false, output: '', error: (error as Error).message }
  }
}
