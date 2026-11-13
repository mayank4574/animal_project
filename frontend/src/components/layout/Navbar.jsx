import { useState, useEffect } from 'react'
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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleNav = (e, link) => {
    if (link.to.startsWith('/#')) {
      const id = link.to.slice(2)
      if (location.pathname === '/') {
        e.preventDefault()
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
        
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 text-[#087F8C] font-bold text-xl sm:text-2xl"
        >
          <div className="w-9 h-9 rounded-xl bg-[#087F8C] flex items-center justify-center text-white shadow-xs">
            <PawPrint className="w-5 h-5" />
          </div>
          <span className="tracking-tight text-[#172B3A]">
            Practo <span className="text-[#087F8C]">for Animals</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => handleNav(e, link)}
              className="text-sm font-medium text-[#64748B] hover:text-[#087F8C] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/list-business"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#087F8C] text-white text-sm font-semibold hover:bg-[#06666f] transition-all shadow-xs"
          >
            List Your Business
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl text-[#172B3A] hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer with Backdrop */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <span className="font-bold text-lg text-[#172B3A]">Menu</span>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={(e) => handleNav(e, link)}
                      className="py-3 px-3 rounded-lg text-sm font-medium text-[#172B3A] hover:bg-[#DFF5EF]/50 hover:text-[#087F8C] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <Link
                  to="/list-business"
                  onClick={() => setOpen(false)}
                  className="w-full text-center block py-3 rounded-xl bg-[#087F8C] text-white font-semibold text-sm hover:bg-[#06666f] transition-all shadow-xs"
                >
                  List Your Business
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  )
}
