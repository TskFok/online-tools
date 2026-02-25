import { useState, useRef } from 'react'
import Barcode from 'react-barcode'
import toast from 'react-hot-toast'

const barcodeFormats = [
  { value: 'CODE128', label: 'CODE128' },
  { value: 'EAN13', label: 'EAN-13' },
  { value: 'EAN8', label: 'EAN-8' },
  { value: 'UPC', label: 'UPC-A' },
  { value: 'CODE39', label: 'CODE-39' },
  { value: 'ITF14', label: 'ITF-14' },
  { value: 'MSI', label: 'MSI' },
  { value: 'pharmacode', label: 'Pharmacode' },
]

export default function BarcodeGenerator() {
  const [text, setText] = useState('')
  const [format, setFormat] = useState('CODE128')
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(100)
  const [showText, setShowText] = useState(true)
  const barcodeRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const svg = barcodeRef.current?.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const img = new Image()
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0)
      const pngUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = 'barcode.png'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('已下载 PNG')
    }
    img.src = url
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">条形码生成</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">条码内容</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入条码内容..."
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">条码格式</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              {barcodeFormats.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">线条宽度</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Math.max(1, Math.min(5, Number(e.target.value))))}
                min={1}
                max={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">高度 (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(30, Math.min(300, Number(e.target.value))))}
                min={30}
                max={300}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showText"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showText" className="text-sm text-gray-600">
              显示文字
            </label>
          </div>

          <button
            onClick={handleDownload}
            disabled={!text}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            下载 PNG
          </button>
        </div>

        <div className="flex items-start justify-center">
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm" ref={barcodeRef}>
            {text ? (
              <Barcode
                value={text}
                format={format as never}
                width={width}
                height={height}
                displayValue={showText}
              />
            ) : (
              <div className="flex items-center justify-center text-gray-400 text-sm w-64 h-32">
                输入内容后预览条形码
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
