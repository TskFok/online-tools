import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCallback } from 'react'
import {
  useDebouncedOutputConvert,
  OUTPUT_CONVERT_DEBOUNCE_MS,
} from '../hooks/useDebouncedOutputConvert'

describe('useDebouncedOutputConvert', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('挂载时按 optionDeps 立即执行一次', () => {
    const spy = vi.fn()
    renderHook(() => {
      const convert = useCallback((raw: string) => spy(raw), [])
      useDebouncedOutputConvert('hello', convert, [42])
    })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('hello')
  })

  it('输入变化后在防抖间隔后再次执行', () => {
    const spy = vi.fn()
    const { rerender } = renderHook(
      ({ value }: { value: string }) => {
        const convert = useCallback((raw: string) => spy(raw), [])
        useDebouncedOutputConvert(value, convert, [])
      },
      { initialProps: { value: 'a' } },
    )
    expect(spy).toHaveBeenCalledWith('a')
    spy.mockClear()
    rerender({ value: 'ab' })
    expect(spy).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(OUTPUT_CONVERT_DEBOUNCE_MS)
    })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('ab')
  })

  it('optionDeps 变化时立即用当前 input 执行', () => {
    const spy = vi.fn()
    const { rerender } = renderHook(
      ({ dep, value }: { dep: number; value: string }) => {
        const convert = useCallback(
          (raw: string) => {
            spy(dep, raw)
          },
          [dep],
        )
        useDebouncedOutputConvert(value, convert, [dep])
      },
      { initialProps: { dep: 0, value: 'x' } },
    )
    spy.mockClear()
    rerender({ dep: 1, value: 'x' })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(1, 'x')
  })

  it('输入清空时立即 convert 空串，不等待防抖', () => {
    const spy = vi.fn()
    const { rerender } = renderHook(
      ({ value }: { value: string }) => {
        const convert = useCallback((raw: string) => spy(raw), [])
        useDebouncedOutputConvert(value, convert, [])
      },
      { initialProps: { value: 'a' } },
    )
    spy.mockClear()
    rerender({ value: '' })
    expect(spy).toHaveBeenCalledWith('')
    spy.mockClear()
    act(() => {
      vi.advanceTimersByTime(OUTPUT_CONVERT_DEBOUNCE_MS)
    })
    expect(spy).not.toHaveBeenCalled()
  })
})
