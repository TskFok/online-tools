/**
 * 规范化用户输入：去除首尾空白，并可选剥离 ```mermaid … ``` 代码围栏。
 */
export function normalizeMermaidSource(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  const lines = trimmed.split(/\r?\n/)
  const first = lines[0]?.trim() ?? ''
  if (!/^```(?:mermaid)?$/i.test(first)) {
    return trimmed
  }

  const closeIdx = lines.findIndex((line, i) => i > 0 && line.trim() === '```')
  if (closeIdx === -1) {
    return trimmed
  }

  return lines.slice(1, closeIdx).join('\n').trim()
}

export type MermaidTheme = 'default' | 'dark' | 'forest' | 'neutral'
