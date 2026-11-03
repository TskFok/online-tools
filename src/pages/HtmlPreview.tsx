import { useMemo, useState } from 'react'
import { prepareHtmlDocument } from '../utils/htmlPreviewUtils'

const SAMPLE = `<h1>HTML 预览</h1>
<p>在左侧修改这段 HTML，右侧会即时显示。</p>`

export default function HtmlPreview() {
  const [source, setSource] = useState(SAMPLE)
  const documentHtml = useMemo(() => prepareHtmlDocument(source), [source])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-2">HTML 预览</h1>
      <p className="text-sm text-gray-500 mb-5">粘贴 HTML 后在沙箱中预览，脚本不会执行。</p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setSource('')}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          清空
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">HTML</label>
          <textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="粘贴 HTML"
            className="w-full h-[560px] p-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">预览</label>
          {documentHtml ? (
            <iframe
              title="HTML 预览"
              sandbox=""
              srcDoc={documentHtml}
              className="w-full h-[560px] rounded-lg border border-gray-300 bg-white"
            />
          ) : (
            <div className="flex h-[560px] items-center justify-center rounded-lg border border-gray-300 bg-white text-sm text-gray-400">
              在左侧输入 HTML
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
