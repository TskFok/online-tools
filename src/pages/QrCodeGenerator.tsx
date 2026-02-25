import { useState, useRef, useCallback } from 'react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

export default function QrCodeGenerator() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [level, setLevel] = useState<ErrorLevel>('M')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [renderType, setRenderType] = useState<'canvas' | 'svg'>('canvas')
  const canvasWrapperRef = useRef<HTMLDivElement>(null)
  const svgWrapperRef = useRef<HTMLDivElement>(null)

  const handleDownloadPng = useCallback(() => {
    const canvas = canvasWrapperRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
    toast.success('已下载 PNG')
  }, [])

  const handleDownloadSvg = useCallback(() => {
    const svg = svgWrapperRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.svg'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('已下载 SVG')
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">二维码生成</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">文本内容</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入文本或 URL..."
              className="w-full h-32 p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">尺寸 (px)</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Math.max(64, Math.min(1024, Number(e.target.value))))}
                min={64}
                max={1024}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">纠错级别</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as ErrorLevel)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">前景色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">背景色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">渲染方式</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
              <button
                onClick={() => setRenderType('canvas')}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  renderType === 'canvas' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Canvas (PNG)
              </button>
              <button
                onClick={() => setRenderType('svg')}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  renderType === 'svg' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                SVG
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {renderType === 'canvas' ? (
              <button
                onClick={handleDownloadPng}
                disabled={!text}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                下载 PNG
              </button>
            ) : (
              <button
                onClick={handleDownloadSvg}
                disabled={!text}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                下载 SVG
              </button>
            )}
          </div>
        </div>

        <div className="flex items-start justify-center">
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            {text ? (
              renderType === 'canvas' ? (
                <div ref={canvasWrapperRef}>
                  <QRCodeCanvas
                    value={text}
                    size={size}
                    level={level}
                    fgColor={fgColor}
                    bgColor={bgColor}
                  />
                </div>
              ) : (
                <div ref={svgWrapperRef}>
                  <QRCodeSVG
                    value={text}
                    size={size}
                    level={level}
                    fgColor={fgColor}
                    bgColor={bgColor}
                  />
                </div>
              )
            ) : (
              <div
                className="flex items-center justify-center text-gray-400 text-sm"
                style={{ width: size, height: size }}
              >
                输入内容后预览二维码
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
