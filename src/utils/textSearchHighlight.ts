/** 将字符串转义为可安全嵌入 HTML 的文本节点内容 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 转义正则特殊字符，按字面匹配用户输入 */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 在原文字符串中高亮所有匹配（大小写不敏感），返回可放入 innerHTML 的字符串 */
export function highlightSearchInPlainText(text: string, query: string): string {
  const q = query.trim()
  if (!q) return escapeHtml(text)

  const re = new RegExp(escapeRegExp(q), 'gi')
  const parts: string[] = []
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    parts.push(escapeHtml(text.slice(lastIndex, m.index)))
    parts.push(`<mark class="bg-amber-200 text-gray-900 rounded px-0.5">${escapeHtml(m[0])}</mark>`)
    lastIndex = m.index + m[0].length
    if (m[0].length === 0) re.lastIndex++
  }
  parts.push(escapeHtml(text.slice(lastIndex)))
  return parts.join('')
}

export function countSearchMatches(text: string, query: string): number {
  const q = query.trim()
  if (!q) return 0
  const re = new RegExp(escapeRegExp(q), 'gi')
  return [...text.matchAll(re)].length
}
