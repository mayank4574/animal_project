import { CheckCircle2, MapPin, SlidersHorizontal, Search, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

const benefits = [
  {
    icon: CheckCircle2,
    title: 'All Services in One Place',
    desc: 'From routine vet visits to emergency ambulances and NGOs, discover comprehensive animal-care facilities on a single unified platform.'
  },
  {
    icon: MapPin,
    title: 'Location-Based Discovery',
    desc: 'Easily locate certified veterinary professionals and hospitals nearest to your current neighborhood or PIN code.'
  },
  {
    icon: SlidersHorizontal,
    title: 'Transparent Comparison',
    desc: 'Compare opening hours, ratings, community feedback, and specializations to make informed decisions for your pet.'
  },
  {
    icon: Search,
    title: 'Effortless Search Experience',
    desc: 'Fast, responsive filtering by categories, ratings, and operating status designed for pet parents in stressful moments.'
  },
  {
    icon: RefreshCw,
    title: 'Community-Driven Accuracy',
    desc: 'Regular updates and community-reported corrections ensure clinic details, phone numbers, and addresses stay current.'
  }
]

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs uppercase tracking-wider font-semibold text-[#087F8C] bg-[#DFF5EF] px-3 py-1 rounded-full">
            Platform Benefits
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#172B3A] mt-3">
            Why Pet Parents Choose Practo for Animals
          </h2>
          <p className="text-[#64748B] mt-3 text-base sm:text-lg">
            Dedicated infrastructure for animal healthcare, built to connect you with compassionate, verified care providers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 hover:border-[#087F8C]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#DFF5EF] flex items-center justify-center text-[#087F8C] mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172B3A] mb-2">{b.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{b.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

