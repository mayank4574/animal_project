import { Link } from 'react-router-dom'
import { Star, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProviderCard({ provider }) {
  const { name, slug, category, address, city, rating, reviewCount, phone, description, image } = provider

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
    >
      {/* Image placeholder */}
      <div className="h-44 bg-gradient-to-br from-[#DFF5EF] via-[#e8f7f3] to-[#087F8C]/15 relative overflow-hidden flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
        <div className="absolute inset-0 -z-0 flex items-center justify-center text-[#087F8C]/40 font-semibold text-sm">
          {category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#172B3A] line-clamp-1">{name}</h3>
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-[#DFF5EF] text-[#087F8C] font-medium">
            {category}
          </span>
        </div>

        <p className="text-sm text-[#64748B] line-clamp-1">{[address, city].filter(Boolean).join(', ')}</p>

        {rating != null && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-[#FF9B62] text-[#FF9B62]" />
            <span className="font-medium">{rating}</span>
            {reviewCount != null && <span className="text-[#64748B]">({reviewCount} reviews)</span>}
          </div>
        )}

        <p className="text-sm text-[#64748B] line-clamp-2 flex-1">
          {description?.slice(0, 100)}{description?.length > 100 ? '…' : ''}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <Link
            to={`/provider/${slug}`}
            className="flex-1 text-center py-2 rounded-lg bg-[#087F8C] text-white text-sm font-medium hover:bg-[#06666f] transition-colors"
          >
            View Details
          </Link>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#087F8C] text-[#087F8C] text-sm font-medium hover:bg-[#DFF5EF] transition-colors"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
