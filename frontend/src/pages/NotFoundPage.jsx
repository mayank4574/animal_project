import { Link } from 'react-router-dom'
import { PawPrint, ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#DFF5EF] text-[#087F8C] flex items-center justify-center mx-auto mb-6 shadow-xs">
          <PawPrint className="w-9 h-9" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight sm:text-5xl">
          404
        </h1>
        <p className="text-xl font-bold text-[#172B3A] mt-2">Page Not Found</p>
        <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
          The animal care page or provider link you were looking for doesn’t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087F8C] text-white text-sm font-semibold hover:bg-[#06666f] transition-all shadow-xs"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[#172B3A] text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            <Search className="w-4 h-4 text-[#087F8C]" /> Search Providers
          </Link>
        </div>
      </div>
    </div>
  )
}
