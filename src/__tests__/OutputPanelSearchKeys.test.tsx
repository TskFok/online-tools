import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OutputPanel from '../components/OutputPanel'
import { SEARCH_MARK_ACTIVE_CLASS } from '../utils/scrollSearchMatch'

describe('OutputPanel 搜索快捷键', () => {
  it('Enter 在至少两处可见匹配时切换到下一处高亮', async () => {
    render(<OutputPanel value="aa bb aa" emptyHint="x" bodyClassName="h-[200px]" />)
    const input = screen.getByLabelText('在输出中搜索')
    fireEvent.change(input, { target: { value: 'aa' } })

    await waitFor(() => {
      const marks = document.querySelectorAll('mark')
      expect(marks.length).toBe(2)
      expect(marks[0].classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(true)
    })

    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false })

    await waitFor(() => {
      const marks = document.querySelectorAll('mark')
      expect(marks[1].classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(true)
      expect(marks[0].classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(false)
    })
  })

  it('Shift+Enter 切换到上一处高亮', async () => {
    render(<OutputPanel value="aa bb aa" emptyHint="x" bodyClassName="h-[200px]" />)
    const input = screen.getByLabelText('在输出中搜索')
    fireEvent.change(input, { target: { value: 'aa' } })

    await waitFor(() => {
      expect(document.querySelectorAll('mark').length).toBe(2)
    })

    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false })

    await waitFor(() => {
      const marks = document.querySelectorAll('mark')
      expect(marks[1].classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(true)
    })

    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })

    await waitFor(() => {
      const marks = document.querySelectorAll('mark')
      expect(marks[0].classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(true)
      expect(marks[1].classList.contains(SEARCH_MARK_ACTIVE_CLASS)).toBe(false)
    })
  })
})
