import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('页面切换状态保留', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/json-formatter')
  })

  it('切换到其他工具页再返回时保留原页面输入内容', async () => {
    render(<App />)

    fireEvent.change(screen.getByPlaceholderText('{"key": "value"}'), {
      target: { value: '{"name":"online-tools"}' },
    })

    fireEvent.click(screen.getByRole('link', { name: 'SQL 美化/压缩' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'SQL 美化 / 压缩' })).toBeVisible()
    })

    fireEvent.click(screen.getByRole('link', { name: 'JSON 美化/压缩' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'JSON 美化 / 压缩' })).toBeVisible()
    })

    expect(screen.getByPlaceholderText('{"key": "value"}')).toHaveValue(
      '{"name":"online-tools"}',
    )
  })

  it('切换页面后分别保留各页面的滚动位置', async () => {
    render(<App />)

    const jsonPage = document.querySelector('[data-page-path="/json-formatter"]') as HTMLElement
    jsonPage.scrollTop = 240

    fireEvent.click(screen.getByRole('link', { name: 'SQL 美化/压缩' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'SQL 美化 / 压缩' })).toBeVisible()
    })

    const sqlPage = document.querySelector('[data-page-path="/sql-formatter"]') as HTMLElement
    sqlPage.scrollTop = 80

    fireEvent.click(screen.getByRole('link', { name: 'JSON 美化/压缩' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'JSON 美化 / 压缩' })).toBeVisible()
    })

    expect(jsonPage.scrollTop).toBe(240)
    expect(sqlPage.scrollTop).toBe(80)
  })
})
