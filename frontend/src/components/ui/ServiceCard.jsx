import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ServiceCard({ icon: Icon, title, description, category }) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Link
        to={`/search?category=${encodeURIComponent(category)}`}
        className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
      >
        <div className="w-12 h-12 rounded-lg bg-[#DFF5EF] flex items-center justify-center text-[#087F8C] mb-4 group-hover:bg-[#087F8C] group-hover:text-white transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-[#172B3A] mb-1">{title}</h3>
        <p className="text-sm text-[#64748B] leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  )
}
