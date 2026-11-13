import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  MapPin,
  Building,
  Star
} from 'lucide-react'
import api from '../services/api'
import ProviderCard from '../components/ui/ProviderCard'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import EmptyState from '../components/ui/EmptyState'

const categories = [
  'Veterinary Clinic',
  'Animal Hospital',
  'Pet Boarding',
  'Diagnostics',
  'Animal Ambulance',
  'Animal NGO',
]

const ratingOptions = [
  { label: 'All Ratings', value: '' },
  { label: '4.5 & above', value: '4.5' },
  { label: '4.0 & above', value: '4.0' },
  { label: '3.5 & above', value: '3.5' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [area, setArea] = useState(searchParams.get('area') || '')
  const [locationParam, setLocationParam] = useState(searchParams.get('location') || '')
  const [pincode, setPincode] = useState(searchParams.get('pincode') || '')
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '')
  const [openNow, setOpenNow] = useState(searchParams.get('openNow') === 'true' || searchParams.get('isOpen') === 'true')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  // Drawer for mobile
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Data state
  const [providers, setProviders] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch providers with all combined filters handled by the backend
  const fetchProviders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (searchTerm.trim()) params.set('search', searchTerm.trim())
      if (selectedCategory) params.set('category', selectedCategory)
      if (city.trim()) params.set('city', city.trim())
      if (area.trim()) params.set('area', area.trim())
      if (locationParam.trim()) params.set('location', locationParam.trim())
      if (pincode.trim()) params.set('pincode', pincode.trim())
      if (minRating) params.set('minRating', minRating)
      if (openNow) params.set('isOpen', 'true')
      
      // Sorting
      if (sortBy) params.set('sort', sortBy)

      params.set('page', String(page))
      params.set('limit', '12')

      const res = await api.get(`/providers?${params.toString()}`)
      if (res.data?.success) {
        setProviders(res.data.data || [])
        setPagination(
          res.data.pagination || {
            page: 1,
            limit: 12,
            total: res.data.data?.length || 0,
            pages: 1,
          }
        )
      } else {
        throw new Error(res.data?.message || 'Failed to fetch providers')
      }
    } catch (err) {
      setError(err.message || 'Error connecting to provider service')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, city, area, locationParam, pincode, minRating, openNow, sortBy, page])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  // Sync state to URL query params
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (city) params.set('city', city)
    if (area) params.set('area', area)
    if (locationParam) params.set('location', locationParam)
    if (pincode) params.set('pincode', pincode)
    if (minRating) params.set('minRating', minRating)
    if (openNow) params.set('openNow', 'true')
    if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy)
    if (page > 1) params.set('page', String(page))
    setSearchParams(params, { replace: true })
  }, [searchTerm, selectedCategory, city, area, locationParam, pincode, minRating, openNow, sortBy, page, setSearchParams])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setCity('')
    setArea('')
    setLocationParam('')
    setPincode('')
    setMinRating('')
    setOpenNow(false)
    setSortBy('relevance')
    setPage(1)
  }

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategory || city || area || locationParam || pincode || minRating || openNow
  )

  const filterSidebar = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-bold text-[#172B3A] text-base flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#087F8C]" /> Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-[#FF9B62] hover:underline flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Service Category */}
      <div>
        <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2.5">
          Service Category
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[#172B3A] cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => { setSelectedCategory(''); setPage(1); }}
              className="text-[#087F8C] focus:ring-[#087F8C]"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-[#172B3A] cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => { setSelectedCategory(cat); setPage(1); }}
                className="text-[#087F8C] focus:ring-[#087F8C]"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
          City
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="e.g. Mumbai, Bangalore, Delhi"
            value={city}
            onChange={(e) => { setCity(e.target.value); setLocationParam(''); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
          />
        </div>
      </div>

      {/* Area / Locality */}
      <div>
        <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
          Area / Locality
        </label>
        <div className="relative">
          <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="e.g. Andheri, Dwarka, Koramangala"
            value={area}
            onChange={(e) => { setArea(e.target.value); setLocationParam(''); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
          />
        </div>
      </div>

      {/* PIN Code */}
      <div>
        <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
          PIN Code
        </label>
        <input
          type="text"
          placeholder="e.g. 400053, 560066"
          value={pincode}
          onChange={(e) => { setPincode(e.target.value); setPage(1); }}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
        />
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {ratingOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-[#172B3A] cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === opt.value}
                onChange={() => { setMinRating(opt.value); setPage(1); }}
                className="text-[#087F8C] focus:ring-[#087F8C]"
              />
              <span className="flex items-center gap-1">
                {opt.label}
                {opt.value && <Star className="w-3.5 h-3.5 fill-[#FF9B62] text-[#FF9B62]" />}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Open Now Toggle */}
      <div className="pt-2 border-t border-gray-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-[#172B3A]">Open Now Only</span>
          <input
            type="checkbox"
            checked={openNow}
            onChange={(e) => { setOpenNow(e.target.checked); setPage(1); }}
            className="w-4 h-4 text-[#087F8C] rounded focus:ring-[#087F8C]"
          />
        </label>
      </div>
    </div>
  )

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by clinic name, doctor, area, or treatment..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#172B3A] flex items-center justify-center gap-2 hover:bg-gray-50 shrink-0"
            >
              <Filter className="w-4 h-4 text-[#087F8C]" />
              Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#FF9B62]" />}
            </button>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#64748B] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Sidebar + Right Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {filterSidebar}
            </div>
          </aside>

          {/* Right Provider Listing Area */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* Active filters count & info */}
            <div className="flex items-center justify-between text-sm text-[#64748B]">
              <p>
                Showing <span className="font-semibold text-[#172B3A]">{providers.length}</span> of{' '}
                <span className="font-semibold text-[#172B3A]">{pagination.total}</span> animal care providers
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#087F8C] hover:underline font-medium"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Content states */}
            {loading ? (
              <LoadingSkeleton count={6} />
            ) : error ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-red-100">
                <p className="text-red-500 font-medium mb-3">{error}</p>
                <button
                  onClick={fetchProviders}
                  className="px-5 py-2 rounded-lg bg-[#087F8C] text-white text-sm font-medium hover:bg-[#06666f]"
                >
                  Try Again
                </button>
              </div>
            ) : providers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <EmptyState message="No animal care providers found matching your search and filter criteria." />
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#087F8C] text-white text-sm font-medium hover:bg-[#06666f] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <ProviderCard key={provider._id} provider={provider} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 text-[#172B3A] disabled:opacity-40 hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-[#172B3A] px-4">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="p-2 rounded-lg border border-gray-200 text-[#172B3A] disabled:opacity-40 hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl p-6 overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <h3 className="font-bold text-lg text-[#172B3A]">Search Filters</h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {filterSidebar}
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full mt-8 py-3 rounded-xl bg-[#087F8C] text-white font-medium text-sm hover:bg-[#06666f]"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
