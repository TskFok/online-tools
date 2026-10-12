import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useDebouncedOutputConvert } from '../hooks/useDebouncedOutputConvert'
import {
  formatByteSize,
  parseDataUriImage,
  type DataUriImageResult,
} from '../utils/dataUriImageUtils'

const PLACEHOLDER = '粘贴 data:image/png;base64,...'

export default function DataUriImage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<DataUriImageResult | null>(null)
  const [loadError, setLoadError] = useState(false)

  const convert = useCallback((raw: string) => {
    setLoadError(false)
    if (!raw.trim()) {
      setResult(null)
      return
    }
    setResult(parseDataUriImage(raw))
  }, [])

  useDebouncedOutputConvert(input, convert, [])

  const handleClear = () => {
    setInput('')
    setResult(null)
    setLoadError(false)
  }

  const handleDownload = () => {
    if (!result?.success) return
    const link = document.createElement('a')
    link.href = result.dataUri
    link.download = `image.${result.extension}`
    link.click()
    toast.success('已开始下载')
  }

  const preview = result?.success ? result : null

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Data URI 转图片</h1>
      <p className="text-sm text-gray-500 mb-5">
        将 data:image/png;base64,... 这类 Data URI 渲染为图片，支持 PNG、JPEG、GIF、WebP、SVG 等
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!preview}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          下载图片
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          清空
        </button>
      </div>

      {result && !result.success && (
        <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {result.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Data URI</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            className="w-full h-[420px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">图片预览</label>
            {preview && (
              <span className="text-xs text-gray-500">
                <span>{preview.mimeType}</span>
                <span className="mx-1.5">·</span>
                <span>{formatByteSize(preview.byteLength)}</span>
              </span>
            )}
          </div>
          <div
            className="h-[420px] rounded-lg border border-gray-200 flex items-center justify-center overflow-auto p-4"
            style={{
              backgroundColor: '#fff',
              backgroundImage:
                'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
            }}
          >
            {preview && !loadError ? (
              <img
                src={preview.dataUri}
                alt="Data URI 图片预览"
                className="max-w-full max-h-full object-contain"
                onError={() => setLoadError(true)}
              />
            ) : (
              <p className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded">
                {loadError ? '浏览器无法显示这张图片' : '图片将显示在这里'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
