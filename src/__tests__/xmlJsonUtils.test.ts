import { describe, expect, it } from 'vitest'
import { jsonToXml, xmlToJson } from '../utils/xmlJsonUtils'

function expectJson(output: string, value: unknown) {
  expect(JSON.parse(output)).toEqual(value)
  expect(output).toBe(JSON.stringify(value, null, 2))
}

describe('xmlToJson', () => {
  it('空输入返回错误', () => {
    const result = xmlToJson('   ')
    expect(result.success).toBe(false)
    expect(result.output).toBe('')
    expect(result.error).toBe('输入不能为空')
  })

  it('纯文本保持字符串，不转换数字、布尔和前导零', () => {
    const result = xmlToJson('<root><age>20</age><code>01</code><flag>true</flag></root>')
    expect(result.success).toBe(true)
    expectJson(result.output, {
      root: { age: '20', code: '01', flag: 'true' },
    })
  })

  it('属性使用 @_ 前缀，同时存在文本时放入 #text', () => {
    const result = xmlToJson('<user id="01">Tom</user>')
    expect(result.success).toBe(true)
    expectJson(result.output, {
      user: { '@_id': '01', '#text': 'Tom' },
    })
  })

  it('同名重复节点变成数组，只出现一次的保持原值', () => {
    const result = xmlToJson('<list><item>a</item><item>b</item><name>demo</name></list>')
    expect(result.success).toBe(true)
    expectJson(result.output, {
      list: { item: ['a', 'b'], name: 'demo' },
    })
  })

  it('CDATA 当作普通文本，并解码 XML 实体', () => {
    const result = xmlToJson('<root><note><![CDATA[a < b]]></note><extra>a &amp; b</extra></root>')
    expect(result.success).toBe(true)
    expectJson(result.output, {
      root: { note: 'a < b', extra: 'a & b' },
    })
  })

  it('忽略注释和处理指令，保留命名空间前缀', () => {
    const result = xmlToJson(
      '<?xml version="1.0"?><soap:Envelope><?target data?><!-- hidden --><soap:Body>ok</soap:Body></soap:Envelope>',
    )
    expect(result.success).toBe(true)
    expectJson(result.output, {
      'soap:Envelope': { 'soap:Body': 'ok' },
    })
  })

  it('无法解析的 XML 返回错误', () => {
    const result = xmlToJson('<note><to></note>')
    expect(result.success).toBe(false)
    expect(result.output).toBe('')
    expect(result.error).toBeTruthy()
  })
})

describe('jsonToXml', () => {
  it('空输入返回错误', () => {
    const result = jsonToXml('\n')
    expect(result.success).toBe(false)
    expect(result.output).toBe('')
    expect(result.error).toBe('输入不能为空')
  })

  it('无效 JSON 返回错误', () => {
    const result = jsonToXml('{')
    expect(result.success).toBe(false)
    expect(result.output).toBe('')
    expect(result.error).toBeTruthy()
  })

  it('根节点不是对象时返回错误', () => {
    for (const input of ['[]', 'null', '"text"', '1', 'true']) {
      const result = jsonToXml(input)
      expect(result.success).toBe(false)
      expect(result.error).toBe('JSON 根节点必须是对象')
    }
  })

  it('空对象返回错误', () => {
    const result = jsonToXml('{}')
    expect(result.success).toBe(false)
    expect(result.error).toBe('JSON 对象至少需要一个根元素')
  })

  it('单个键作为根元素，属性还原并转义文本', () => {
    const result = jsonToXml(
      JSON.stringify({
        user: { '@_id': '1', '#text': 'Tom & Jerry' },
      }),
    )
    expect(result.success).toBe(true)
    expect(result.output).toBe(
      ['<?xml version="1.0" encoding="UTF-8"?>', '<user id="1">Tom &amp; Jerry</user>'].join('\n'),
    )
  })

  it('多个顶层键外套 root，并按两空格缩进', () => {
    const result = jsonToXml(JSON.stringify({ a: '1', b: '2' }))
    expect(result.success).toBe(true)
    expect(result.output).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<root>',
        '  <a>1</a>',
        '  <b>2</b>',
        '</root>',
      ].join('\n'),
    )
  })

  it('同一组样例可以往返', () => {
    const xml = '<list><item id="1">a</item><item id="2">b</item></list>'
    const json = xmlToJson(xml)
    expect(json.success).toBe(true)
    const back = jsonToXml(json.output)
    expect(back.success).toBe(true)
    expect(xmlToJson(back.output).output).toBe(json.output)
  })
})
