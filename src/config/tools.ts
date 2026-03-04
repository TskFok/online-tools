import type { IconType } from 'react-icons'
import { VscJson } from 'react-icons/vsc'
import { TbTransform } from 'react-icons/tb'
import { BiCodeBlock } from 'react-icons/bi'
import { FiLink, FiClock, FiCode } from 'react-icons/fi'
import { BsQrCode } from 'react-icons/bs'
import { AiOutlineBarcode } from 'react-icons/ai'

export interface ToolConfig {
  name: string
  path: string
  icon: IconType
  description: string
  category: string
}

export const tools: ToolConfig[] = [
  {
    name: 'JSON 美化/压缩',
    path: '/json-formatter',
    icon: VscJson,
    description: '格式化、美化、压缩 JSON 字符串，支持语法高亮和错误提示',
    category: 'JSON',
  },
  {
    name: '序列化转 JSON',
    path: '/serialize-to-json',
    icon: TbTransform,
    description: '将 QueryString、PHP Serialize、键值对等序列化字符串转为 JSON',
    category: 'JSON',
  },
  {
    name: 'Base64 编码/解码',
    path: '/base64',
    icon: BiCodeBlock,
    description: 'Base64 编码与解码，支持 UTF-8 中文字符',
    category: '编码',
  },
  {
    name: '时间戳转换',
    path: '/timestamp',
    icon: FiClock,
    description: '时间戳与日期时间互相转换，支持秒和毫秒单位',
    category: '编码',
  },
  {
    name: 'Unicode 编码转换',
    path: '/unicode',
    icon: FiCode,
    description: 'ASCII/Unicode/中文互转，支持 \\uXXXX 和 U+XXXX 格式',
    category: '编码',
  },
  {
    name: 'URL 编码/解码',
    path: '/url-codec',
    icon: FiLink,
    description: 'URL 编码与解码，支持 encodeURI 和 encodeURIComponent',
    category: '编码',
  },
  {
    name: '二维码生成',
    path: '/qrcode',
    icon: BsQrCode,
    description: '输入文本或链接生成二维码，支持尺寸、纠错级别和颜色配置',
    category: '生成器',
  },
  {
    name: '条形码生成',
    path: '/barcode',
    icon: AiOutlineBarcode,
    description: '生成多种格式条形码，支持 CODE128、EAN13、CODE39 等',
    category: '生成器',
  },
]
