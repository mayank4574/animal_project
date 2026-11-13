import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, ArrowRight, PawPrint } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@practoforanimals.com')
  const [password, setPassword] = useState('Admin@Practo2024!')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/admin/login', { email, password })
      if (res.data?.success && res.data?.token) {
        localStorage.setItem('adminToken', res.data.token)
        localStorage.setItem('adminUser', JSON.stringify(res.data.admin))
        toast.success('Admin authenticated successfully')
        navigate('/admin')
      } else {
        toast.error(res.data?.message || 'Login failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-10">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#087F8C] text-white flex items-center justify-center mx-auto shadow-md mb-4">
            <PawPrint className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#172B3A]">Admin Portal</h2>
          <p className="text-sm text-[#64748B] mt-1.5">
            Practo for Animals Management System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@practoforanimals.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
              />
            </div>
          </div>

          <div className="bg-[#DFF5EF]/50 rounded-xl p-3 border border-[#087F8C]/15 text-xs text-[#087F8C]">
            <p className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Secure Admin Access
            </p>
            <p className="mt-0.5 text-[#172B3A]/80">
              Authorized verification personnel only. All session changes are audited.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#087F8C] text-white font-semibold text-sm hover:bg-[#06666f] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

