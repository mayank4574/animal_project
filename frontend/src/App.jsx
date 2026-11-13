import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ProviderDetailPage from './pages/ProviderDetailPage'
import ListBusinessPage from './pages/ListBusinessPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/provider/:slug" element={<ProviderDetailPage />} />
        <Route path="/list-business" element={<ListBusinessPage />} />
      </Route>
    </Routes>
  )
}
