import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import XmlJsonConverter from '../pages/XmlJsonConverter'
import { OUTPUT_CONVERT_DEBOUNCE_MS } from '../hooks/useDebouncedOutputConvert'

describe('XML / JSON 互转页面', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function typeAndFlush(value: string) {
    fireEvent.change(screen.getByPlaceholderText(/输入/), { target: { value } })
    act(() => {
      vi.advanceTimersByTime(OUTPUT_CONVERT_DEBOUNCE_MS)
    })
  }

  it('把 XML 转成 JSON，并在树中显示属性和文本', () => {
    render(<XmlJsonConverter />)
    typeAndFlush('<user id="01">Tom</user>')

    expect(screen.getByText('"@_id"')).toBeInTheDocument()
    expect(screen.getByText('"01"')).toBeInTheDocument()
    expect(screen.getByText('"#text"')).toBeInTheDocument()
    expect(screen.getByText('"Tom"')).toBeInTheDocument()
    expect(screen.queryByText(/Expected closing tag|无效/)).not.toBeInTheDocument()
  })

  it('切换到 JSON → XML 后输出带声明的 XML', () => {
    render(<XmlJsonConverter />)
    fireEvent.click(screen.getByRole('button', { name: 'JSON → XML' }))
    typeAndFlush(JSON.stringify({ a: '1', b: '2' }))

    expect(screen.getByText(/<\?xml version="1.0" encoding="UTF-8"\?>/)).toBeInTheDocument()
    expect(screen.getByText(/<root>/)).toBeInTheDocument()
    expect(screen.getByText(/<a>1<\/a>/)).toBeInTheDocument()
  })

  it('无效 XML 显示错误', () => {
    render(<XmlJsonConverter />)
    typeAndFlush('<note><to></note>')

    expect(screen.getByText(/Expected closing tag 'to'/)).toBeInTheDocument()
  })

  it('交换后用当前输出按反方向再转换', () => {
    render(<XmlJsonConverter />)
    typeAndFlush('<age>01</age>')
    fireEvent.click(screen.getByRole('button', { name: '交换输入输出' }))
    act(() => {
      vi.advanceTimersByTime(OUTPUT_CONVERT_DEBOUNCE_MS)
    })

    expect(screen.getByRole('button', { name: 'JSON → XML' })).toHaveClass('bg-blue-600')
    expect(screen.getByPlaceholderText(/输入/)).toHaveValue('{\n  "age": "01"\n}')
    expect(screen.getByText(/<age>01<\/age>/)).toBeInTheDocument()
  })
})
