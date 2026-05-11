import { splitSearchMatches } from './textSearchHighlight'

export type JsonPath = (string | number)[]

function textHasSearchMatch(text: string, query: string): boolean {
  return splitSearchMatches(text, query).some((p) => p.match)
}

/**
 * 深度优先找到第一个匹配的键或值后，返回需要展开的容器路径前缀列表（含 [] 表示根）。
 * 用于在 JSON 树中展开折叠节点，使搜索高亮出现在 DOM 中。
 */
export function jsonPathPrefixesToUncollapseForFirstSearchHit(
  data: unknown,
  query: string,
): JsonPath[] {
  const q = query.trim()
  if (!q) return []

  function walk(value: unknown, path: JsonPath): JsonPath | null {
    if (value === null || typeof value !== 'object') {
      if (typeof value === 'string' && textHasSearchMatch(JSON.stringify(value), q)) {
        return path
      }
      if ((typeof value === 'number' || typeof value === 'boolean') && textHasSearchMatch(String(value), q)) {
        return path
      }
      return null
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const hit = walk(value[i], [...path, i])
        if (hit) return hit
      }
      return null
    }

    const obj = value as Record<string, unknown>
    for (const k of Object.keys(obj)) {
      if (textHasSearchMatch(JSON.stringify(k), q)) {
        return [...path, k]
      }
      const hit = walk(obj[k], [...path, k])
      if (hit) return hit
    }
    return null
  }

  const hitPath = walk(data, [])
  if (!hitPath) return []

  const prefixes: JsonPath[] = []
  for (let i = 0; i < hitPath.length; i++) {
    prefixes.push(hitPath.slice(0, i))
  }
  return prefixes
}
