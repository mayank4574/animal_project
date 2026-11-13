import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#172B3A]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </div>
  )
}
