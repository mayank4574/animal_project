import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  'Veterinary Clinic', 'Animal Hospital', 'Pet Boarding',
  'Diagnostics', 'Animal Ambulance', 'Animal NGO',
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (category) params.set('category', category)
    navigate(`/search?${params}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#DFF5EF] via-white to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-[#172B3A] leading-tight"
          >
            Better Care for Every Paw.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-[#64748B] leading-relaxed"
          >
            Find trusted veterinarians, animal hospitals and essential pet-care services near you.
            Because every animal deserves the best care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3 mt-6"
          >
            <a
              href="/search"
              onClick={(e) => { e.preventDefault(); navigate('/search') }}
              className="px-6 py-3 rounded-lg bg-[#087F8C] text-white font-medium hover:bg-[#06666f] transition-colors"
            >
              Find a Vet
            </a>
            <a
              href="#services"
              className="px-6 py-3 rounded-lg border border-[#087F8C] text-[#087F8C] font-medium hover:bg-[#DFF5EF] transition-colors"
            >
              Explore Services
            </a>
          </motion.div>
        </div>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl bg-white p-3 rounded-xl shadow-lg border border-gray-100"
        >
          <input
            type="text"
            placeholder="Enter city, area or PIN code"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
          >
            <option value="">All Services</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#FF9B62] text-white font-medium hover:bg-[#e88a52] transition-colors min-w-[44px]"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </motion.form>
      </div>
    </section>
  )
}
