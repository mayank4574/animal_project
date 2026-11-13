import { ShieldCheck, Search, Layers, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const items = [
  { icon: ShieldCheck, title: 'Verified Providers', desc: 'All listed providers are reviewed for quality and authenticity.' },
  { icon: Search, title: 'Easy Discovery', desc: 'Search by location, category, or service to find the right care.' },
  { icon: Layers, title: 'Multiple Services', desc: 'From clinics to ambulances, find every animal care service in one place.' },
  { icon: Heart, title: 'Better Healthcare', desc: 'Helping animals get timely, quality healthcare across India.' },
]

export default function TrustIndicators() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-5 rounded-xl"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[#DFF5EF] flex items-center justify-center text-[#087F8C]">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#172B3A]">{item.title}</h3>
              <p className="text-sm text-[#64748B] mt-1">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
