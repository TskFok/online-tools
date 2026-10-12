import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DataUriImage from '../pages/DataUriImage'
import { OUTPUT_CONVERT_DEBOUNCE_MS } from '../hooks/useDebouncedOutputConvert'

const PNG_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

describe('Data URI 转图片页面', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function typeAndFlush(value: string) {
    fireEvent.change(screen.getByPlaceholderText('粘贴 data:image/png;base64,...'), {
      target: { value },
    })
    act(() => {
      vi.advanceTimersByTime(OUTPUT_CONVERT_DEBOUNCE_MS)
    })
  }

  it('粘贴 PNG Data URI 后预览图片并显示类型与大小', () => {
    render(<DataUriImage />)
    typeAndFlush(PNG_URI)

    expect(screen.getByRole('img', { name: 'Data URI 图片预览' })).toHaveAttribute('src', PNG_URI)
    expect(screen.getByText('image/png')).toBeInTheDocument()
    expect(screen.getByText('70 B')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '下载图片' })).toBeEnabled()
  })

  it('无效输入显示错误且不渲染图片', () => {
    render(<DataUriImage />)
    typeAndFlush('not-a-data-uri')

    expect(screen.getByText('不是 Data URI，应以 data:image/ 开头')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Data URI 图片预览' })).not.toBeInTheDocument()
  })

  it('清空后移除预览', () => {
    render(<DataUriImage />)
    typeAndFlush(PNG_URI)
    fireEvent.click(screen.getByRole('button', { name: '清空' }))

    expect(screen.queryByRole('img', { name: 'Data URI 图片预览' })).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('粘贴 data:image/png;base64,...')).toHaveValue('')
  })
})
