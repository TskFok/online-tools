import { describe, expect, it } from 'vitest'
import { normalizeMermaidSource } from '../utils/mermaidUtils'

describe('normalizeMermaidSource', () => {
  it('returns empty for blank input', () => {
    expect(normalizeMermaidSource('')).toBe('')
    expect(normalizeMermaidSource('   \n  ')).toBe('')
  })

  it('trims plain definition', () => {
    expect(normalizeMermaidSource('  graph TD\nA --> B  ')).toBe('graph TD\nA --> B')
  })

  it('strips ```mermaid fence', () => {
    const raw = '```mermaid\ngraph LR\n    a --> b\n```'
    expect(normalizeMermaidSource(raw)).toBe('graph LR\n    a --> b')
  })

  it('strips case-insensitive mermaid fence label', () => {
    const raw = '```MERMAID\nflowchart TD\n  x\n```'
    expect(normalizeMermaidSource(raw)).toBe('flowchart TD\n  x')
  })

  it('strips generic ``` fence without language tag', () => {
    const raw = '```\nsequenceDiagram\n  A->>B: hi\n```'
    expect(normalizeMermaidSource(raw)).toBe('sequenceDiagram\n  A->>B: hi')
  })

  it('leaves content unchanged when opening fence has trailing text', () => {
    const raw = '```mermaid extra\nx\n```'
    expect(normalizeMermaidSource(raw)).toBe(raw.trim())
  })

  it('leaves content unchanged when closing fence is missing', () => {
    const raw = '```mermaid\ngraph TD\nA-->B'
    expect(normalizeMermaidSource(raw)).toBe(raw.trim())
  })
})
