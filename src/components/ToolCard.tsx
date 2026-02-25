import { Link } from 'react-router-dom'
import type { ToolConfig } from '../config/tools'

export default function ToolCard({ tool }: { tool: ToolConfig }) {
  return (
    <Link
      to={tool.path}
      className="group block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
          <tool.icon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
          {tool.name}
        </h3>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
      <span className="inline-block mt-3 px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">
        {tool.category}
      </span>
    </Link>
  )
}
