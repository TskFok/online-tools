import { Children, isValidElement, useMemo, useState, type ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CopyButton from '../components/CopyButton'
import MermaidBlock from '../components/MermaidBlock'
import { stripYamlFrontmatter } from '../utils/markdownUtils'
import type { MermaidTheme } from '../utils/mermaidUtils'
import type { Components } from 'react-markdown'

const DEFAULT_SAMPLE = `# Markdown 预览示例

支持 **粗体**、*斜体*、[链接](https://example.com)、行内 \`代码\`。

## 列表示例

- 无序列表
- [ ] GFM 任务（未完成）
- [x] GFM 任务（完成）

1. 有序一
2. 有序二

## 表格（GFM）

| 列 A | 列 B |
| ---- | ---- |
| a1   | b1   |

## 代码块

\`\`\`ts
const msg: string = 'hello'
\`\`\`

## Mermaid

\`\`\`mermaid
graph LR
    A[笔记] --> B[预览]
\`\`\`
`

function markdownComponents(mermaidTheme: MermaidTheme): Components {
  return {
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="text-blue-600 underline hover:text-blue-800"
        {...props}
      >
        {children}
      </a>
    ),
    img: ({ src, alt, ...props }) => (
      <img src={src} alt={alt ?? ''} className="my-4 max-w-full rounded-lg border border-gray-100" {...props} />
    ),
    pre: ({ children }: { children?: ReactNode }) => {
      const first = Children.toArray(children)[0]
      if (isValidElement(first) && first.type === MermaidBlock) {
        return <>{children}</>
      }
      return (
        <pre className="mb-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-4 text-sm text-gray-900">
          {children}
        </pre>
      )
    },
    code: ({ className, children, ...props }) => {
      const lang = /language-(\w+)/.exec(className ?? '')?.[1]
      if (lang === 'mermaid') {
        return <MermaidBlock code={String(children).replace(/\n$/, '')} theme={mermaidTheme} />
      }
      const isBlock = Boolean(className?.includes('language-'))
      return (
        <code
          className={
            isBlock
              ? `${className ?? ''} block bg-transparent p-0 text-[13px] leading-relaxed`.trim()
              : `${className ?? ''} rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em] text-gray-800`.trim()
          }
          {...props}
        >
          {children}
        </code>
      )
    },
  }
}

const previewBoxClass =
  'markdown-body text-[15px] leading-relaxed text-gray-800 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-gray-200 [&_h1]:pb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2 [&_hr]:my-8 [&_hr]:border-gray-200 [&_input[type=checkbox]]:mr-2'

export default function MarkdownRenderer() {
  const [source, setSource] = useState(DEFAULT_SAMPLE)
  const [stripFm, setStripFm] = useState(false)
  const [mermaidTheme, setMermaidTheme] = useState<MermaidTheme>('default')

  const markdown = useMemo(
    () => (stripFm ? stripYamlFrontmatter(source) : source.replace(/^\uFEFF/, '')),
    [source, stripFm],
  )

  const components = useMemo(() => markdownComponents(mermaidTheme), [mermaidTheme])

  const handleClear = () => {
    setSource('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Markdown 渲染</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={stripFm}
            onChange={(e) => setStripFm(e.target.checked)}
            className="rounded border-gray-300"
          />
          忽略 YAML Front Matter
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          Mermaid 主题:
          <select
            value={mermaidTheme}
            onChange={(e) => setMermaidTheme(e.target.value as MermaidTheme)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
          >
            <option value="default">默认</option>
            <option value="dark">暗色</option>
            <option value="forest">森林</option>
            <option value="neutral">中性</option>
          </select>
        </label>

        <CopyButton text={source} />

        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          清空
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Markdown 源码</label>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="# 标题"
            className="w-full h-[560px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">预览</label>
          <div
            className={`w-full h-[560px] overflow-y-auto rounded-lg border border-gray-300 bg-white p-5 ${previewBoxClass}`}
          >
            {markdown.trim() ? (
              <Markdown remarkPlugins={[remarkGfm]} components={components}>
                {markdown}
              </Markdown>
            ) : (
              <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-gray-400">
                在左侧输入 Markdown
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
