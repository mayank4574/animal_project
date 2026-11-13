import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PawPrint, Shield, FileText, X, Mail, Phone, MapPin } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const exploreServices = [
  { label: 'Veterinary Clinics', to: '/search?category=Veterinary%20Clinic' },
  { label: 'Animal Hospitals', to: '/search?category=Animal%20Hospital' },
  { label: 'Pet Boarding & Daycare', to: '/search?category=Pet%20Boarding' },
  { label: 'Diagnostics & Pathology', to: '/search?category=Diagnostics' },
  { label: 'Animal Ambulances', to: '/search?category=Animal%20Ambulance' },
  { label: 'Animal Rescue NGOs', to: '/search?category=Animal%20NGO' },
]

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Find a Vet', to: '/search' },
  { label: 'List Your Business', to: '/list-business' },
  { label: 'About Us', to: '/#about' },
  { label: 'Submit a Correction', to: '/#correction' },
]

export default function Footer() {
  const location = useLocation()
  const [modalType, setModalType] = useState(null) // 'privacy' | 'terms' | null

  const handleHashNav = (e, to) => {
    if (to.startsWith('/#')) {
      const id = to.slice(2)
      if (location.pathname === '/') {
        e.preventDefault()
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-[#172B3A] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-[#087F8C] flex items-center justify-center text-white">
              <PawPrint className="w-5 h-5" />
            </div>
            <span>Practo for Animals</span>
          </Link>
          <p className="text-sm text-gray-300 leading-relaxed">
            India’s dedicated discovery platform connecting pet owners with verified veterinary clinics, animal hospitals, emergency ambulances, and welfare NGOs.
          </p>
          <div className="pt-2 text-xs text-gray-400">
            Dedicated to better care for every paw.
          </div>
        </div>

        {/* Explore Services */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Explore Services
          </h4>
          <ul className="space-y-2.5 text-sm">
            {exploreServices.map((svc) => (
              <li key={svc.label}>
                <Link
                  to={svc.to}
                  className="hover:text-white hover:underline transition-colors text-gray-300"
                >
                  {svc.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={(e) => handleHashNav(e, link.to)}
                  className="hover:text-white hover:underline transition-colors text-gray-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Legal */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Support & Community
          </h4>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF9B62]" />
              <a href="mailto:support@practoforanimals.com" className="hover:text-white">
                support@practoforanimals.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF9B62]" />
              <span>+91 1800-CARE-PAW</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF9B62]" />
              <span>Bangalore, Karnataka, India</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700/60 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => setModalType('privacy')}
              className="hover:text-white underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-gray-600">•</span>
            <button
              type="button"
              onClick={() => setModalType('terms')}
              className="hover:text-white underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-gray-600">•</span>
            <Link to="/admin" className="hover:text-white underline cursor-pointer text-[#087F8C]">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-400 px-4">
        &copy; {new Date().getFullYear()} Practo for Animals. All rights reserved. Demo MVP for educational evaluation.
      </div>

      {/* Privacy Policy & Terms Modal */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white text-[#172B3A] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              {modalType === 'privacy' ? (
                <div>
                  <div className="flex items-center gap-2 text-[#087F8C] mb-3">
                    <Shield className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-[#172B3A]">Privacy Policy</h3>
                  </div>
                  <div className="space-y-3 text-sm text-[#64748B] leading-relaxed">
                    <p>
                      <strong>1. Information Collection:</strong> Practo for Animals collects submitted business listing information (business name, doctor contact, address) and community correction feedback solely to maintain accurate animal healthcare records.
                    </p>
                    <p>
                      <strong>2. Pet Parent Protection:</strong> User search queries, locations, and filter choices are processed in real-time and never sold or shared with commercial advertising brokers.
                    </p>
                    <p>
                      <strong>3. Communication:</strong> Contact phone numbers and emails submitted through our partner portal are strictly utilized to verify clinical registrations and alert providers of profile updates.
                    </p>
                    <p>
                      <strong>4. Data Security:</strong> All API interactions utilize standard encryption and secured administrative access controls.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-[#087F8C] mb-3">
                    <FileText className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-[#172B3A]">Terms of Service</h3>
                  </div>
                  <div className="space-y-3 text-sm text-[#64748B] leading-relaxed">
                    <p>
                      <strong>1. Medical Disclaimer:</strong> Practo for Animals is a discovery directory platform. We do not provide direct veterinary diagnoses. For acute animal trauma or critical emergencies, immediately contact an emergency animal hospital or ambulance.
                    </p>
                    <p>
                      <strong>2. Listing Accuracy:</strong> Partner healthcare providers agree to furnish accurate operating hours, addresses, and practitioner certifications. Community members can submit corrections at any time.
                    </p>
                    <p>
                      <strong>3. Demo Content:</strong> Sample listings in this MVP are demonstrative and clearly identified to maintain community trust.
                    </p>
                    <p>
                      <strong>4. Responsible Use:</strong> Users agree to use the platform respectfully and avoid fraudulent registration submissions.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-5 py-2 rounded-xl bg-[#087F8C] text-white text-sm font-medium hover:bg-[#06666f]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  )
}
