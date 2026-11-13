import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building, ArrowRight, ShieldCheck, Users } from 'lucide-react'

export default function ListBusinessCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#087F8C] to-[#0b5b63] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-3">
              <Building className="w-3.5 h-3.5" /> For Healthcare Providers
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Are You an Animal Care Provider?
            </h2>
            <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed">
              Help more pet parents discover your services by listing your business on Practo for Animals. Join India’s dedicated network for animal healthcare.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-white/80 justify-center lg:justify-start">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#FF9B62]" /> Verified profile badge</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#FF9B62]" /> Reach thousands of pet owners</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="shrink-0"
          >
            <Link
              to="/list-business"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FF9B62] text-white font-semibold text-base shadow-lg hover:bg-[#e88a52] hover:shadow-xl transition-all duration-200"
            >
              List Your Business <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
