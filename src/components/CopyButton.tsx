import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors cursor-pointer ${
        copied
          ? 'border-green-300 bg-green-50 text-green-700'
          : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
      } ${className}`}
    >
      {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
      {copied ? '已复制' : '复制'}
    </button>
  )
}
