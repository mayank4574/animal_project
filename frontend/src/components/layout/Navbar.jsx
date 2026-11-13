import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PawPrint, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Find a Vet', to: '/search' },
  { label: 'Explore Services', to: '/#services' },
  { label: 'About Us', to: '/#about' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const handleNav = (e, link) => {
    if (link.to.startsWith('/#')) {
      const id = link.to.slice(2)
      if (location.pathname === '/') {
        e.preventDefault()
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
      // else let Link navigate to / and hash will scroll via browser
    }
    setOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-[#087F8C] font-bold text-xl">
          <PawPrint className="w-7 h-7" />
          <span>Practo for Animals</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={e => handleNav(e, link)}
              className="text-sm font-medium text-[#64748B] hover:text-[#087F8C] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          to="/list-business"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-lg bg-[#087F8C] text-white text-sm font-medium hover:bg-[#06666f] transition-colors"
        >
          List Your Business
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50 flex flex-col p-6 md:hidden"
          >
            <button onClick={() => setOpen(false)} className="self-end p-2 mb-6" aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={e => handleNav(e, link)}
                className="py-3 text-[#172B3A] font-medium border-b border-gray-100 hover:text-[#087F8C]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/list-business"
              onClick={() => setOpen(false)}
              className="mt-6 text-center px-5 py-3 rounded-lg bg-[#087F8C] text-white font-medium"
            >
              List Your Business
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
