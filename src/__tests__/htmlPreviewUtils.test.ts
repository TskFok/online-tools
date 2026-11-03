import { describe, expect, it } from 'vitest'
import { prepareHtmlDocument } from '../utils/htmlPreviewUtils'

const shell = (fragment: string) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
${fragment}
</body>
</html>`

describe('prepareHtmlDocument', () => {
  it('空白、只有空格、只有 BOM 时返回 null', () => {
    expect(prepareHtmlDocument('')).toBeNull()
    expect(prepareHtmlDocument('   \n\t')).toBeNull()
    expect(prepareHtmlDocument('\uFEFF')).toBeNull()
    expect(prepareHtmlDocument('\uFEFF \n ')).toBeNull()
  })

  it('把片段包进最小文档，外壳只出现一次', () => {
    const result = prepareHtmlDocument('  <p>甲</p>  ')
    expect(result).toBe(shell('<p>甲</p>'))
    expect(result?.match(/<!DOCTYPE/g)).toHaveLength(1)
    expect(result?.match(/<html(?=$|[\s>/])/gi)).toHaveLength(1)
  })

  it('片段中的 script 原样保留', () => {
    const fragment = '<script>alert(1)</script>'
    expect(prepareHtmlDocument(fragment)).toBe(shell(fragment))
  })

  it('完整文档去掉首尾空白后原样返回，且只有一个 doctype', () => {
    const doc = '<!DOCTYPE html><html><body>hi</body></html>'
    const result = prepareHtmlDocument(`  ${doc}  `)
    expect(result).toBe(doc)
    expect(result?.match(/<!DOCTYPE/gi)).toHaveLength(1)
  })

  it('去掉完整文档开头的 BOM，并且不再套外壳', () => {
    const doc = '<!DOCTYPE html><html></html>'
    expect(prepareHtmlDocument(`\uFEFF${doc}`)).toBe(doc)
  })

  it('没有 doctype 但有 html 标签的文档原样返回', () => {
    const doc = '<HTML lang="zh"><body>你好</body></HTML>'
    const result = prepareHtmlDocument(doc)
    expect(result).toBe(doc)
    expect(result?.match(/<html(?=$|[\s>/])/gi)).toHaveLength(1)
  })

  it('html 标签结尾、自闭合和字符串结尾都算完整文档', () => {
    expect(prepareHtmlDocument('<Html><body></body></Html>')).toBe(
      '<Html><body></body></Html>',
    )
    expect(prepareHtmlDocument('<html/>')).toBe('<html/>')
    expect(prepareHtmlDocument('<html')).toBe('<html')
  })

  it('htmlfoo 仍按片段套外壳', () => {
    expect(prepareHtmlDocument('<htmlfoo></htmlfoo>')).toBe(shell('<htmlfoo></htmlfoo>'))
  })

  it('大小写混合的 doctype 与 html 判定为完整文档', () => {
    const doc = '<!Doctype html><Html><body>x</body></Html>'
    expect(prepareHtmlDocument(`\n${doc}\n`)).toBe(doc)
  })

  it('正文里出现 html 标签时整段按完整文档返回', () => {
    const doc = '<pre><html></pre>'
    expect(prepareHtmlDocument(doc)).toBe(doc)
  })
})
