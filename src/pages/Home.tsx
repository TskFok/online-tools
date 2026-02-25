import { tools } from '../config/tools'
import ToolCard from '../components/ToolCard'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">在线工具集</h1>
        <p className="mt-2 text-gray-500">常用开发工具，开箱即用</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.path} tool={tool} />
        ))}
      </div>
    </div>
  )
}
