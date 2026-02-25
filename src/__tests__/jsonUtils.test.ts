import { describe, it, expect } from 'vitest'
import {
  formatJson,
  compressJson,
  highlightJson,
  parseQueryString,
  parsePhpSerialize,
  parseKeyValue,
  detectFormat,
  serializeToJson,
} from '../utils/jsonUtils'

describe('formatJson', () => {
  it('格式化有效 JSON', () => {
    const result = formatJson('{"name":"test","age":20}')
    expect(result.success).toBe(true)
    expect(result.output).toBe('{\n  "name": "test",\n  "age": 20\n}')
  })

  it('使用 4 空格缩进', () => {
    const result = formatJson('{"a":1}', 4)
    expect(result.success).toBe(true)
    expect(result.output).toBe('{\n    "a": 1\n}')
  })

  it('无效 JSON 返回错误', () => {
    const result = formatJson('{invalid}')
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('空输入返回错误', () => {
    const result = formatJson('  ')
    expect(result.success).toBe(false)
    expect(result.error).toBe('输入不能为空')
  })

  it('格式化包含中文的 JSON', () => {
    const result = formatJson('{"名字":"张三"}')
    expect(result.success).toBe(true)
    expect(JSON.parse(result.output)).toEqual({ '名字': '张三' })
  })
})

describe('compressJson', () => {
  it('压缩格式化的 JSON', () => {
    const result = compressJson('{\n  "name": "test",\n  "age": 20\n}')
    expect(result.success).toBe(true)
    expect(result.output).toBe('{"name":"test","age":20}')
  })

  it('空输入返回错误', () => {
    const result = compressJson('')
    expect(result.success).toBe(false)
  })

  it('无效 JSON 返回错误', () => {
    const result = compressJson('not json')
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

describe('highlightJson', () => {
  it('高亮 JSON 键', () => {
    const html = highlightJson('"key":')
    expect(html).toContain('json-key')
  })

  it('高亮字符串值', () => {
    const html = highlightJson('"hello"')
    expect(html).toContain('json-string')
  })

  it('高亮数字', () => {
    const html = highlightJson('42')
    expect(html).toContain('json-number')
  })

  it('高亮布尔值', () => {
    const html = highlightJson('true')
    expect(html).toContain('json-boolean')
  })

  it('高亮 null', () => {
    const html = highlightJson('null')
    expect(html).toContain('json-null')
  })
})

describe('parseQueryString', () => {
  it('解析简单 query string', () => {
    expect(parseQueryString('a=1&b=2')).toEqual({ a: '1', b: '2' })
  })

  it('处理 URL 编码字符', () => {
    expect(parseQueryString('name=%E5%BC%A0%E4%B8%89')).toEqual({ name: '张三' })
  })

  it('处理重复键', () => {
    const result = parseQueryString('a=1&a=2')
    expect(result.a).toEqual(['1', '2'])
  })

  it('忽略无等号的片段', () => {
    expect(parseQueryString('a=1&invalid&b=2')).toEqual({ a: '1', b: '2' })
  })
})

describe('parsePhpSerialize', () => {
  it('解析字符串', () => {
    expect(parsePhpSerialize('s:5:"hello";')).toBe('hello')
  })

  it('解析整数', () => {
    expect(parsePhpSerialize('i:42;')).toBe(42)
  })

  it('解析浮点数', () => {
    expect(parsePhpSerialize('d:3.14;')).toBe(3.14)
  })

  it('解析布尔值', () => {
    expect(parsePhpSerialize('b:1;')).toBe(true)
    expect(parsePhpSerialize('b:0;')).toBe(false)
  })

  it('解析 null', () => {
    expect(parsePhpSerialize('N;')).toBe(null)
  })

  it('解析关联数组', () => {
    const result = parsePhpSerialize('a:2:{s:4:"name";s:5:"hello";s:3:"age";i:20;}')
    expect(result).toEqual({ name: 'hello', age: 20 })
  })
})

describe('parseKeyValue', () => {
  it('解析冒号分隔的键值对', () => {
    expect(parseKeyValue('name: test\nage: 20')).toEqual({ name: 'test', age: '20' })
  })

  it('解析等号分隔的键值对', () => {
    expect(parseKeyValue('name=test\nage=20')).toEqual({ name: 'test', age: '20' })
  })

  it('跳过空行和注释', () => {
    expect(parseKeyValue('name: test\n\n# comment\n// comment\nage: 20')).toEqual({
      name: 'test',
      age: '20',
    })
  })
})

describe('detectFormat', () => {
  it('检测 PHP 序列化格式', () => {
    expect(detectFormat('a:2:{s:4:"name";s:5:"hello";}')).toBe('php')
  })

  it('检测 query string', () => {
    expect(detectFormat('a=1&b=2')).toBe('querystring')
  })

  it('检测键值对格式', () => {
    expect(detectFormat('name: test\nage: 20')).toBe('keyvalue')
  })
})

describe('parsePhpSerialize - 中文与空字符串', () => {
  it('解析包含中文和空字符串的 PHP 序列化', () => {
    const input =
      'a:6:{s:12:"out_trade_no";s:17:"20191210199912345";s:14:"transaction_id";s:28:"4212345429201912108504590862";s:9:"cert_type";s:6:"IDCARD";s:7:"cert_id";s:18:"220104198203190034";s:4:"name";s:9:"王搜索";s:12:"sub_order_no";s:0:"";}'
    const result = parsePhpSerialize(input)
    expect(result).toEqual({
      out_trade_no: '20191210199912345',
      transaction_id: '4212345429201912108504590862',
      cert_type: 'IDCARD',
      cert_id: '220104198203190034',
      name: '王搜索',
      sub_order_no: '',
    })
  })
})

describe('serializeToJson', () => {
  it('自动检测并转换 query string', () => {
    const result = serializeToJson('name=test&age=20')
    expect(result.success).toBe(true)
    expect(JSON.parse(result.output)).toEqual({ name: 'test', age: '20' })
  })

  it('指定格式转换 PHP 序列化', () => {
    const result = serializeToJson('a:1:{s:4:"name";s:4:"test";}', 'php')
    expect(result.success).toBe(true)
    expect(JSON.parse(result.output)).toEqual({ name: 'test' })
  })

  it('空输入返回错误', () => {
    const result = serializeToJson('')
    expect(result.success).toBe(false)
  })
})
