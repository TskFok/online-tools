import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import HtmlPreview from '../pages/HtmlPreview'

describe('HTML 预览页面', () => {
  it('初始示例作为片段放进沙箱 iframe', () => {
    render(<HtmlPreview />)

    const iframe = screen.getByTitle('HTML 预览')
    expect(iframe.tagName).toBe('IFRAME')
    expect(iframe).toHaveAttribute('sandbox', '')
    expect(iframe.getAttribute('srcdoc')).toContain('<h1>HTML 预览</h1>')
    expect(iframe.getAttribute('srcdoc')).toContain('<!DOCTYPE html>')
    expect(iframe.getAttribute('srcdoc')?.match(/<!DOCTYPE/g)).toHaveLength(1)
  })

  it('改为另一段片段后更新 srcdoc', () => {
    render(<HtmlPreview />)
    fireEvent.change(screen.getByPlaceholderText('粘贴 HTML'), {
      target: { value: '<p>下一段</p><script>alert(1)</script>' },
    })

    const srcdoc = screen.getByTitle('HTML 预览').getAttribute('srcdoc')
    expect(srcdoc).toContain('<p>下一段</p><script>alert(1)</script>')
    expect(srcdoc).toContain('<!DOCTYPE html>')
    expect(srcdoc).not.toContain('<h1>HTML 预览</h1>')
  })

  it('传入完整文档时 srcdoc 不再套第二层外壳', () => {
    render(<HtmlPreview />)
    const doc = '<!DOCTYPE html><html><body><p>原文</p></body></html>'
    fireEvent.change(screen.getByPlaceholderText('粘贴 HTML'), {
      target: { value: doc },
    })

    expect(screen.getByTitle('HTML 预览')).toHaveAttribute('srcdoc', doc)
  })

  it('清空后移除 iframe 并显示空状态', () => {
    render(<HtmlPreview />)
    fireEvent.click(screen.getByRole('button', { name: '清空' }))

    expect(screen.getByPlaceholderText('粘贴 HTML')).toHaveValue('')
    expect(screen.queryByTitle('HTML 预览')).not.toBeInTheDocument()
    expect(screen.getByText('在左侧输入 HTML')).toBeInTheDocument()
  })

  it('工具列表和路由都提供 HTML 预览', async () => {
    window.history.pushState({}, '', '/html-preview')
    render(<App />)

    expect(screen.getByRole('link', { name: 'HTML 预览' })).toHaveAttribute('href', '/html-preview')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'HTML 预览' })).toBeVisible()
    })
  })
})
