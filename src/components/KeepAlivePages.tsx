import { useEffect, useState, type ComponentType } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import Home from '../pages/Home'
import JsonFormatter from '../pages/JsonFormatter'
import SqlFormatter from '../pages/SqlFormatter'
import SerializeToJson from '../pages/SerializeToJson'
import XmlJsonConverter from '../pages/XmlJsonConverter'
import Base64Codec from '../pages/Base64Codec'
import TimestampConverter from '../pages/TimestampConverter'
import UnicodeCodec from '../pages/UnicodeCodec'
import UrlCodec from '../pages/UrlCodec'
import DataUriImage from '../pages/DataUriImage'
import QrCodeGenerator from '../pages/QrCodeGenerator'
import BarcodeGenerator from '../pages/BarcodeGenerator'
import RandomNumberGenerator from '../pages/RandomNumberGenerator'
import RandomStringGenerator from '../pages/RandomStringGenerator'
import MermaidRenderer from '../pages/MermaidRenderer'
import MarkdownRenderer from '../pages/MarkdownRenderer'
import HtmlPreview from '../pages/HtmlPreview'

interface PageRoute {
  path: string
  component: ComponentType
}

const pageRoutes: PageRoute[] = [
  { path: '/', component: Home },
  { path: '/json-formatter', component: JsonFormatter },
  { path: '/sql-formatter', component: SqlFormatter },
  { path: '/serialize-to-json', component: SerializeToJson },
  { path: '/xml-json', component: XmlJsonConverter },
  { path: '/base64', component: Base64Codec },
  { path: '/timestamp', component: TimestampConverter },
  { path: '/unicode', component: UnicodeCodec },
  { path: '/url-codec', component: UrlCodec },
  { path: '/data-uri-image', component: DataUriImage },
  { path: '/qrcode', component: QrCodeGenerator },
  { path: '/barcode', component: BarcodeGenerator },
  { path: '/random-number', component: RandomNumberGenerator },
  { path: '/random-string', component: RandomStringGenerator },
  { path: '/mermaid', component: MermaidRenderer },
  { path: '/markdown', component: MarkdownRenderer },
  { path: '/html-preview', component: HtmlPreview },
]

function stripBasename(pathname: string, basename?: string) {
  if (!basename || basename === '/') return pathname || '/'
  if (pathname === basename) return '/'
  if (pathname.startsWith(`${basename}/`)) return pathname.slice(basename.length) || '/'
  return pathname || '/'
}

function getActivePath(pathname: string, basename?: string) {
  const routePath = stripBasename(pathname, basename)
  return (
    pageRoutes.find((route) => matchPath({ path: route.path, end: true }, routePath))?.path ?? null
  )
}

interface KeepAlivePagesProps {
  basename?: string
}

export default function KeepAlivePages({ basename }: KeepAlivePagesProps) {
  const { pathname } = useLocation()
  const activePath = getActivePath(pathname, basename)
  const [visitedPaths, setVisitedPaths] = useState<string[]>(() =>
    activePath ? [activePath] : [],
  )
  const renderPaths =
    activePath && !visitedPaths.includes(activePath)
      ? [...visitedPaths, activePath]
      : visitedPaths

  useEffect(() => {
    if (!activePath || visitedPaths.includes(activePath)) return

    const frame = requestAnimationFrame(() => {
      setVisitedPaths((paths) =>
        paths.includes(activePath) ? paths : [...paths, activePath],
      )
    })
    return () => cancelAnimationFrame(frame)
  }, [activePath, visitedPaths])

  return (
    <div className="h-full">
      {pageRoutes.map(({ path, component: Page }) => {
        if (!renderPaths.includes(path)) return null

        return (
          <div
            key={path}
            hidden={activePath !== path}
            data-page-path={path}
            className="h-full overflow-y-auto p-6"
          >
            <Page />
          </div>
        )
      })}
    </div>
  )
}
