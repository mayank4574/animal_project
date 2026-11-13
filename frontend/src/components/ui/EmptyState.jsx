import { SearchX } from 'lucide-react'

export default function EmptyState({ message = 'No providers found matching your criteria.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-[#64748B] text-lg">{message}</p>
    </div>
  )
}
