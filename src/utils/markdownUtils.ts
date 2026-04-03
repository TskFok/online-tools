/**
 * 去除 UTF-8 BOM，并可选剥离标准 YAML Front Matter（首尾 --- 包裹块）。
 */
export function stripYamlFrontmatter(raw: string): string {
  const text = raw.replace(/^\uFEFF/, '')
  if (!text.startsWith('---')) {
    return text
  }

  const lines = text.split(/\r?\n/)
  if (lines[0]?.trim() !== '---') {
    return text
  }

  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') {
      return lines.slice(i + 1).join('\n').replace(/^\n+/, '')
    }
  }

  return text
}
