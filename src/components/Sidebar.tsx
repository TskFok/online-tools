import { NavLink } from 'react-router-dom'
import { FiHome, FiX } from 'react-icons/fi'
import { tools } from '../config/tools'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-medium'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200">
          <NavLink to="/" className="text-lg font-bold text-gray-800" onClick={onClose}>
            🛠 在线工具集
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <FiHome className="w-5 h-5 shrink-0" />
            首页
          </NavLink>

          {tools.map((tool) => (
            <NavLink key={tool.path} to={tool.path} className={linkClass} onClick={onClose}>
              <tool.icon className="w-5 h-5 shrink-0" />
              {tool.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
