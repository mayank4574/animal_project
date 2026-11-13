import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShieldCheck, Heart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  'Veterinary Clinic',
  'Animal Hospital',
  'Pet Boarding',
  'Diagnostics',
  'Animal Ambulance',
  'Animal NGO',
]

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=80'

export default function HeroSection() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [imgLoaded, setImgLoaded] = useState(true)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location.trim()) params.set('location', location.trim())
    if (category) params.set('category', category)
    navigate(`/search?${params}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#DFF5EF]/80 via-white to-[#F8FAFC] py-12 sm:py-20 lg:py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtext, Search */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFF5EF] text-[#087F8C] text-xs font-semibold mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" /> India’s Trusted Animal Care Network
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#172B3A] leading-[1.15] tracking-tight"
            >
              Better Care for <span className="text-[#087F8C]">Every Paw.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl"
            >
              Find trusted veterinarians, animal hospitals, emergency ambulances, and essential pet-care services near you. Because every animal deserves the best care.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <a
                href="/search"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/search')
                }}
                className="px-6 py-3 rounded-xl bg-[#087F8C] text-white font-medium hover:bg-[#06666f] transition-all shadow-sm"
              >
                Find a Vet
              </a>
              <a
                href="#services"
                className="px-6 py-3 rounded-xl border border-[#087F8C] text-[#087F8C] font-medium hover:bg-[#DFF5EF] transition-all"
              >
                Explore Services
              </a>
            </motion.div>

            {/* Search Component */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 sm:mt-10 p-3 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col sm:flex-row gap-2.5 max-w-xl"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter city, area or PIN code..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                />
              </div>
              <div className="flex-1">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                >
                  <option value="">All Services</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF9B62] text-white font-semibold hover:bg-[#e88a52] transition-colors shrink-0 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </motion.form>
          </div>

          {/* Right Column: Hero Visual with Photography & Badges */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-[#DFF5EF] to-gray-100 aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]">
                {imgLoaded ? (
                  <img
                    src={HERO_IMAGE_URL}
                    alt="Veterinarian examining a friendly dog with love and care"
                    className="w-full h-full object-cover"
                    onError={() => setImgLoaded(false)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#DFF5EF] to-[#087F8C]/15">
                    <Heart className="w-16 h-16 text-[#087F8C] mb-3 animate-pulse" />
                    <p className="font-bold text-[#172B3A] text-lg">Compassionate Animal Care</p>
                    <p className="text-xs text-[#64748B] mt-1">Connecting verified veterinarians and pet parents</p>
                  </div>
                )}
                {/* Subtle bottom gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                  <p className="text-xs font-medium text-white/80">Certified Care Facilities</p>
                  <p className="text-sm font-bold">24/7 Critical Emergency & Routine Clinics</p>
                </div>
              </div>

              {/* Floating Badge 1: Verified Providers */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -top-3 -left-3 sm:-left-6 bg-white/95 backdrop-blur-xs rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#DFF5EF] flex items-center justify-center text-[#087F8C]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#172B3A]">Verified Providers</p>
                  <p className="text-[11px] text-[#64748B]">Across major Indian cities</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Emergency Response */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-4 -right-3 sm:-right-6 bg-white/95 backdrop-blur-xs rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FF9B62]/20 flex items-center justify-center text-[#FF9B62]">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#172B3A]">Instant Ambulances</p>
                  <p className="text-[11px] text-[#64748B]">Oxygen & trauma kits ready</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
