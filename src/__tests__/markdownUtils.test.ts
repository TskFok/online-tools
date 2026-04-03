import { describe, expect, it } from 'vitest'
import { stripYamlFrontmatter } from '../utils/markdownUtils'

describe('stripYamlFrontmatter', () => {
  it('removes UTF-8 BOM only when no front matter', () => {
    expect(stripYamlFrontmatter('\uFEFF# Title')).toBe('# Title')
    expect(stripYamlFrontmatter('# Hi')).toBe('# Hi')
  })

  it('strips valid YAML front matter', () => {
    const raw = '---\ntitle: Doc\n---\n\n# Hello\n'
    expect(stripYamlFrontmatter(raw)).toBe('# Hello\n')
  })

  it('does not strip when closing --- is missing', () => {
    const raw = '---\ntitle: x\n# Still open'
    expect(stripYamlFrontmatter(raw)).toBe(raw)
  })

  it('does not treat --- in body as front matter start without leading --- line', () => {
    const raw = 'Text\n---\nMore'
    expect(stripYamlFrontmatter(raw)).toBe(raw)
  })
})
