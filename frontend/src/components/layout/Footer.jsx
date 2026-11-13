import { Link, useLocation } from 'react-router-dom'
import { PawPrint } from 'lucide-react'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Find a Vet', to: '/search' },
  { label: 'Explore Services', to: '/#services' },
  { label: 'About Us', to: '/#about' },
]
const moreLinks = [
  { label: 'List Your Business', to: '/list-business' },
  { label: 'Submit a Correction', to: '/#correction' },
]

export default function Footer() {
  const location = useLocation()

  const handleClick = (e, to) => {
    if (to.startsWith('/#') && location.pathname === '/') {
      e.preventDefault()
      document.getElementById(to.slice(2))?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-[#172B3A] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <PawPrint className="w-6 h-6" />
            Practo for Animals
          </Link>
          <p className="text-sm leading-relaxed">
            Your trusted platform to discover quality animal healthcare services across India.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} onClick={e => handleClick(e, l.to)} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">More</h4>
          <ul className="space-y-2 text-sm">
            {moreLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} onClick={e => handleClick(e, l.to)} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm mb-4">support@practoforanimals.com</p>
          <div className="flex gap-4 text-sm">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        &copy; 2024 Practo for Animals. All rights reserved.
      </div>
    </footer>
  )
}
