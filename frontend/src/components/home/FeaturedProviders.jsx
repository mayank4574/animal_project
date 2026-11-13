import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import ProviderCard from '../ui/ProviderCard'
import LoadingSkeleton from '../ui/LoadingSkeleton'

export default function FeaturedProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/providers/featured')
      .then(res => setProviders(res.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-[#172B3A]">Featured Providers</h2>
          <p className="text-[#64748B] mt-2">Top-rated animal care providers</p>
        </motion.div>

        {loading && <LoadingSkeleton count={3} />}

        {error && (
          <p className="text-center text-[#64748B] py-8">
            Unable to load featured providers right now. Please try again later.
          </p>
        )}

        {!loading && !error && providers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map(p => <ProviderCard key={p._id} provider={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}
