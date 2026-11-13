import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Clock, 
  Star, 
  ArrowLeft, 
  Navigation, 
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import api from '../services/api'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'

export default function ProviderDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api.get(`/providers/${slug}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setProvider(res.data.data)
        } else {
          setError('Provider not found')
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load provider profile')
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <LoadingSkeleton count={1} />
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#172B3A] mb-2">Provider Not Found</h2>
        <p className="text-[#64748B] mb-6">The animal care provider profile you are looking for does not exist or has been removed.</p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#087F8C] text-white font-medium hover:bg-[#06666f]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>
      </div>
    )
  }

  const {
    name,
    category,
    description,
    image,
    phone,
    email,
    website,
    address,
    city,
    state,
    pincode,
    services = [],
    rating,
    reviewCount,
    openingHours,
    isOpen,
    verificationStatus
  } = provider

  const fullAddress = [address, city, state, pincode].filter(Boolean).join(', ')
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${fullAddress}`)}`

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#087F8C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Cover Header Banner */}
          <div className="h-48 sm:h-64 bg-gradient-to-r from-[#087F8C] via-[#0b6c77] to-[#172B3A] relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-[#087F8C] text-xs font-semibold backdrop-blur-xs shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#087F8C]" /> Verified Provider
                </span>
              )}
              {isOpen !== undefined && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs shadow-xs ${
                  isOpen ? 'bg-emerald-500/90 text-white' : 'bg-gray-800/80 text-gray-200'
                }`}>
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-10">
            {/* Avatar & Header Meta */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-8">
              <div className="flex items-end gap-5">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white p-2 shadow-lg border border-gray-100 overflow-hidden shrink-0">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#DFF5EF] to-[#087F8C]/20 relative flex items-center justify-center text-[#087F8C] font-bold text-center text-xs p-2 overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                    <span className="absolute inset-0 flex items-center justify-center text-[#087F8C] font-semibold text-xs -z-0">
                      {category}
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-0">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#087F8C] bg-[#DFF5EF] px-3 py-0.5 rounded-full">
                    {category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#172B3A] mt-2">
                    {name}
                  </h1>
                  <p className="flex items-center gap-1.5 text-sm text-[#64748B] mt-1">
                    <MapPin className="w-4 h-4 text-[#087F8C] shrink-0" />
                    {[city, state].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#087F8C] text-white font-medium text-sm hover:bg-[#06666f] transition-all shadow-sm"
                  >
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                )}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-[#172B3A] font-medium text-sm hover:bg-gray-50 transition-all shadow-xs"
                >
                  <Navigation className="w-4 h-4 text-[#FF9B62]" /> Get Directions
                </a>
              </div>
            </div>

            {/* Ratings & Quick Stats */}
            {rating != null && (
              <div className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FF9B62]/10 text-[#FF9B62] flex items-center justify-center font-bold text-lg">
                    {rating}
                  </div>
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(rating)
                              ? 'fill-[#FF9B62] text-[#FF9B62]'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {reviewCount != null && (
                      <p className="text-xs text-[#64748B] mt-0.5">Based on {reviewCount} client reviews</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Description & Services */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-[#172B3A] mb-3">About the Facility</h3>
                  <p className="text-[#64748B] text-base leading-relaxed whitespace-pre-line">
                    {description || 'No detailed description provided by this facility.'}
                  </p>
                </div>

                {services.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#172B3A] mb-3">Available Services & Specializations</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {services.map((svc, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#DFF5EF] text-[#087F8C] text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" /> {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Contact & Operating Hours Card */}
              <div className="space-y-6">
                
                {/* Contact Information */}
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-4">
                  <h3 className="font-bold text-[#172B3A] text-base">Contact Information</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                      <span className="text-[#64748B]">{fullAddress}</span>
                    </div>

                    {phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#087F8C] shrink-0" />
                        <a href={`tel:${phone}`} className="text-[#172B3A] font-medium hover:text-[#087F8C]">
                          +91 {phone}
                        </a>
                      </div>
                    )}

                    {email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#087F8C] shrink-0" />
                        <a href={`mailto:${email}`} className="text-[#64748B] hover:text-[#087F8C] truncate">
                          {email}
                        </a>
                      </div>
                    )}

                    {website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-[#087F8C] shrink-0" />
                        <a
                          href={website.startsWith('http') ? website : `https://${website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#087F8C] hover:underline truncate"
                        >
                          Visit Official Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                {openingHours && Object.keys(openingHours).length > 0 && (
                  <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-3">
                    <h3 className="font-bold text-[#172B3A] text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#087F8C]" /> Operating Hours
                    </h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(openingHours).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                          <span className="capitalize text-[#64748B]">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="font-medium text-[#172B3A]">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
