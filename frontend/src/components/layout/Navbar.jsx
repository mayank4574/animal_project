import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PawPrint, Menu, X, ChevronRight } from 'lucide-react'
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

  // Prevent background scrolling while the mobile menu is open
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
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
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
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

          {/* Desktop Right Action CTA */}
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
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-[#172B3A] hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={open}
          >
            <Menu className="w-6 h-6 text-[#172B3A]" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer & Backdrop (Rendered at top level for proper stacking) */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Full-screen dark translucent overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Solid white drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              style={{ backgroundColor: '#ffffff', opacity: 1 }}
              className="fixed top-0 right-0 bottom-0 z-[101] w-[300px] xs:w-[320px] sm:w-[360px] max-w-[85vw] h-full bg-[#FFFFFF] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              {/* Header: Menu Title and Aligned Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2 text-[#172B3A] font-bold text-lg">
                  <div className="w-7 h-7 rounded-lg bg-[#DFF5EF] flex items-center justify-center text-[#087F8C]">
                    <PawPrint className="w-4 h-4" />
                  </div>
                  <span>Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 -mr-2 text-gray-500 hover:text-[#172B3A] hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items: Each on a separate row with clear vertical spacing */}
              <div className="flex flex-col py-6 space-y-2 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={(e) => handleNav(e, link)}
                    className="flex items-center justify-between w-full py-3.5 px-4 rounded-xl text-base font-semibold text-[#172B3A] hover:text-[#087F8C] hover:bg-[#DFF5EF]/60 active:bg-[#DFF5EF] transition-all"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>

              {/* Footer CTA: List Your Business */}
              <div className="pt-4 border-t border-gray-100 shrink-0 mt-auto">
                <Link
                  to="/list-business"
                  onClick={() => setOpen(false)}
                  className="w-full text-center block py-3.5 px-5 rounded-xl bg-[#087F8C] text-white font-semibold text-base hover:bg-[#06666f] transition-all shadow-sm active:scale-[0.98]"
                >
                  List Your Business
                </Link>
                <p className="text-center text-xs text-[#64748B] mt-3">
                  Practo for Animals &bull; Care for Every Paw
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
