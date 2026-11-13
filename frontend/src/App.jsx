import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ProviderDetailPage from './pages/ProviderDetailPage'
import ListBusinessPage from './pages/ListBusinessPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <>
      <Routes>
        {/* Public App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/provider/:slug" element={<ProviderDetailPage />} />
          <Route path="/list-business" element={<ListBusinessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Dedicated Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </>
  )
}
