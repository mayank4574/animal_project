import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ShieldCheck, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Building2, 
  AlertCircle, 
  X, 
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck2,
  Ban
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  // Auth Header helper
  const authHeader = useCallback(() => {
    return { headers: { Authorization: `Bearer ${token}` } }
  }, [token])

  // Overview Stats
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingBusinesses: 0,
    approvedBusinesses: 0,
    rejectedBusinesses: 0,
    totalCorrections: 0,
    pendingCorrections: 0,
    resolvedCorrections: 0,
    totalProviders: 0,
  })

  // Active Tab: 'businesses' | 'corrections' | 'approved' | 'rejected'
  const [activeTab, setActiveTab] = useState('businesses')

  // Business Listings state
  const [listings, setListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(false)
  const [businessSearch, setBusinessSearch] = useState('')
  const [businessStatus, setBusinessStatus] = useState('all')
  const [businessCategory, setBusinessCategory] = useState('')
  const [businessPage, setBusinessPage] = useState(1)
  const [businessPagination, setBusinessPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  // Corrections state
  const [corrections, setCorrections] = useState([])
  const [correctionsLoading, setCorrectionsLoading] = useState(false)
  const [correctionSearch, setCorrectionSearch] = useState('')
  const [correctionStatus, setCorrectionStatus] = useState('all')
  const [correctionPage, setCorrectionPage] = useState(1)
  const [correctionPagination, setCorrectionPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  // Modals state
  const [selectedListing, setSelectedListing] = useState(null)
  const [selectedCorrection, setSelectedCorrection] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null) // { title, message, onConfirm, type: 'approve'|'reject' }
  const [actionLoading, setActionLoading] = useState(false)

  // Correction update fields state (for manual edits when approving)
  const [correctionUpdates, setCorrectionUpdates] = useState({})

  // Authentication Guard
  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
    }
  }, [token, navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    toast.success('Admin logged out')
    navigate('/admin/login')
  }

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (!token) return
    try {
      const res = await api.get('/admin/stats', authHeader())
      if (res.data?.success) {
        setStats(res.data.data)
      }
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout()
      }
    }
  }, [token, authHeader])

  // Fetch Business Listings
  const fetchListings = useCallback(async () => {
    if (!token) return
    setListingsLoading(true)
    try {
      const params = new URLSearchParams()
      if (businessSearch.trim()) params.set('search', businessSearch.trim())
      
      // Tab overrides
      if (activeTab === 'approved') {
        params.set('status', 'approved')
      } else if (activeTab === 'rejected') {
        params.set('status', 'rejected')
      } else if (businessStatus && businessStatus !== 'all') {
        params.set('status', businessStatus)
      }

      if (businessCategory) params.set('category', businessCategory)
      params.set('page', String(businessPage))
      params.set('limit', '10')

      const res = await api.get(`/admin/business-listings?${params.toString()}`, authHeader())
      if (res.data?.success) {
        setListings(res.data.data || [])
        setBusinessPagination(res.data.pagination || { page: 1, limit: 10, total: 0, pages: 1 })
      }
    } catch (err) {
      toast.error('Failed to load business listings')
    } finally {
      setListingsLoading(false)
    }
  }, [token, activeTab, businessSearch, businessStatus, businessCategory, businessPage, authHeader])

  // Fetch Corrections
  const fetchCorrections = useCallback(async () => {
    if (!token) return
    setCorrectionsLoading(true)
    try {
      const params = new URLSearchParams()
      if (correctionSearch.trim()) params.set('search', correctionSearch.trim())
      if (correctionStatus && correctionStatus !== 'all') params.set('status', correctionStatus)
      params.set('page', String(correctionPage))
      params.set('limit', '10')

      const res = await api.get(`/admin/corrections?${params.toString()}`, authHeader())
      if (res.data?.success) {
        setCorrections(res.data.data || [])
        setCorrectionPagination(res.data.pagination || { page: 1, limit: 10, total: 0, pages: 1 })
      }
    } catch (err) {
      toast.error('Failed to load correction reports')
    } finally {
      setCorrectionsLoading(false)
    }
  }, [token, correctionSearch, correctionStatus, correctionPage, authHeader])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    if (activeTab === 'corrections') {
      fetchCorrections()
    } else {
      fetchListings()
    }
  }, [activeTab, fetchListings, fetchCorrections])

  // Action: Approve Business Listing
  const handleApproveListing = async (listingId) => {
    setActionLoading(true)
    try {
      const res = await api.put(`/admin/business-listings/${listingId}/approve`, {}, authHeader())
      if (res.data?.success) {
        toast.success('Business approved and published to public directory!')
        setSelectedListing(null)
        setConfirmDialog(null)
        fetchStats()
        fetchListings()
      } else {
        toast.error(res.data?.message || 'Approval failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error approving business listing')
    } finally {
      setActionLoading(false)
    }
  }

  // Action: Reject Business Listing
  const handleRejectListing = async (listingId) => {
    setActionLoading(true)
    try {
      const res = await api.put(`/admin/business-listings/${listingId}/reject`, {}, authHeader())
      if (res.data?.success) {
        toast.success('Business listing marked as rejected')
        setSelectedListing(null)
        setConfirmDialog(null)
        fetchStats()
        fetchListings()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error rejecting business listing')
    } finally {
      setActionLoading(false)
    }
  }

  // Action: Approve & Apply Correction
  const handleApproveCorrection = async (correctionId) => {
    setActionLoading(true)
    try {
      const res = await api.put(
        `/admin/corrections/${correctionId}/approve`,
        { updatedFields: correctionUpdates },
        authHeader()
      )
      if (res.data?.success) {
        toast.success('Correction approved and applied to provider record!')
        setSelectedCorrection(null)
        setCorrectionUpdates({})
        setConfirmDialog(null)
        fetchStats()
        fetchCorrections()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error approving correction')
    } finally {
      setActionLoading(false)
    }
  }

  // Action: Reject Correction
  const handleRejectCorrection = async (correctionId) => {
    setActionLoading(true)
    try {
      const res = await api.put(`/admin/corrections/${correctionId}/reject`, {}, authHeader())
      if (res.data?.success) {
        toast.success('Correction rejected; provider record remains unchanged.')
        setSelectedCorrection(null)
        setConfirmDialog(null)
        fetchStats()
        fetchCorrections()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error rejecting correction')
    } finally {
      setActionLoading(false)
    }
  }

  // Action: Mark Correction as Reviewed
  const handleMarkReviewed = async (correctionId) => {
    setActionLoading(true)
    try {
      const res = await api.put(`/admin/corrections/${correctionId}/review`, {}, authHeader())
      if (res.data?.success) {
        toast.success('Correction marked as reviewed')
        setSelectedCorrection(null)
        fetchStats()
        fetchCorrections()
      }
    } catch (err) {
      toast.error('Error marking correction as reviewed')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      
      {/* Top Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087F8C] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#172B3A] flex items-center gap-2">
                Practo for Animals <span className="text-xs bg-[#DFF5EF] text-[#087F8C] px-2 py-0.5 rounded-full uppercase">Admin Portal</span>
              </h1>
              <p className="text-xs text-[#64748B]">
                Authenticated as <span className="font-medium text-[#172B3A]">admin@practoforanimals.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchStats(); if (activeTab === 'corrections') fetchCorrections(); else fetchListings(); }}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-[#087F8C] hover:bg-gray-50 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-xs text-[#64748B] block font-medium">Total Listings</span>
            <span className="text-2xl font-bold text-[#172B3A] mt-1 block">{stats.totalSubmissions}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-xs">
            <span className="text-xs text-amber-700 block font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending Listings
            </span>
            <span className="text-2xl font-bold text-amber-800 mt-1 block">{stats.pendingBusinesses}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
            <span className="text-xs text-emerald-700 block font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Approved
            </span>
            <span className="text-2xl font-bold text-emerald-800 mt-1 block">{stats.approvedBusinesses}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-red-100 bg-red-50/20 shadow-xs">
            <span className="text-xs text-red-700 block font-semibold flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Rejected
            </span>
            <span className="text-2xl font-bold text-red-800 mt-1 block">{stats.rejectedBusinesses}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-orange-100 bg-orange-50/20 shadow-xs">
            <span className="text-xs text-[#FF9B62] block font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Pending Reports
            </span>
            <span className="text-2xl font-bold text-orange-800 mt-1 block">{stats.pendingCorrections}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-teal-100 bg-teal-50/20 shadow-xs">
            <span className="text-xs text-[#087F8C] block font-semibold flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5" /> Resolved Reports
            </span>
            <span className="text-2xl font-bold text-[#087F8C] mt-1 block">{stats.resolvedCorrections}</span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => { setActiveTab('businesses'); setBusinessPage(1); }}
            className={`py-3 px-5 text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
              activeTab === 'businesses'
                ? 'bg-white text-[#087F8C] border-b-2 border-[#087F8C] shadow-xs'
                : 'text-[#64748B] hover:text-[#172B3A]'
            }`}
          >
            Business Submissions ({stats.totalSubmissions})
          </button>
          <button
            onClick={() => { setActiveTab('corrections'); setCorrectionPage(1); }}
            className={`py-3 px-5 text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
              activeTab === 'corrections'
                ? 'bg-white text-[#087F8C] border-b-2 border-[#087F8C] shadow-xs'
                : 'text-[#64748B] hover:text-[#172B3A]'
            }`}
          >
            Correction Requests ({stats.totalCorrections})
          </button>
          <button
            onClick={() => { setActiveTab('approved'); setBusinessPage(1); }}
            className={`py-3 px-5 text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
              activeTab === 'approved'
                ? 'bg-white text-[#087F8C] border-b-2 border-[#087F8C] shadow-xs'
                : 'text-[#64748B] hover:text-[#172B3A]'
            }`}
          >
            Approved Businesses ({stats.approvedBusinesses})
          </button>
          <button
            onClick={() => { setActiveTab('rejected'); setBusinessPage(1); }}
            className={`py-3 px-5 text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
              activeTab === 'rejected'
                ? 'bg-white text-[#087F8C] border-b-2 border-[#087F8C] shadow-xs'
                : 'text-[#64748B] hover:text-[#172B3A]'
            }`}
          >
            Rejected Submissions ({stats.rejectedBusinesses})
          </button>
        </div>

        {/* ================= TAB CONTENT: BUSINESS SUBMISSIONS / APPROVED / REJECTED ================= */}
        {activeTab !== 'corrections' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by business name, owner, city, email, phone..."
                  value={businessSearch}
                  onChange={(e) => { setBusinessSearch(e.target.value); setBusinessPage(1); }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                />
              </div>

              {activeTab === 'businesses' && (
                <select
                  value={businessStatus}
                  onChange={(e) => { setBusinessStatus(e.target.value); setBusinessPage(1); }}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Only</option>
                  <option value="approved">Approved Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
              )}

              <select
                value={businessCategory}
                onChange={(e) => { setBusinessCategory(e.target.value); setBusinessPage(1); }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
              >
                <option value="">All Categories</option>
                <option value="Veterinary Clinic">Veterinary Clinic</option>
                <option value="Animal Hospital">Animal Hospital</option>
                <option value="Pet Boarding">Pet Boarding</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Animal Ambulance">Animal Ambulance</option>
                <option value="Animal NGO">Animal NGO</option>
              </select>
            </div>

            {/* Listings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs uppercase font-semibold text-[#64748B] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Business Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Owner / Contact</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Submitted</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listingsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[#64748B]">
                        Loading business listings...
                      </td>
                    </tr>
                  ) : listings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[#64748B]">
                        No business listings found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    listings.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-[#172B3A]">
                          {item.businessName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#DFF5EF] text-[#087F8C] font-medium whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-medium text-[#172B3A]">{item.ownerName}</p>
                          <p className="text-[#64748B]">{item.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#64748B]">
                          {item.city}{item.state ? `, ${item.state}` : ''}
                        </td>
                        <td className="px-6 py-4 text-xs text-[#64748B]">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                            item.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedListing(item)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#087F8C] hover:bg-gray-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {item.status !== 'approved' && (
                            <button
                              onClick={() => setConfirmDialog({
                                title: `Approve "${item.businessName}"?`,
                                message: 'This will verify and publish this practice directly into the public provider directory.',
                                onConfirm: () => handleApproveListing(item._id),
                                type: 'approve'
                              })}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button
                              onClick={() => setConfirmDialog({
                                title: `Reject "${item.businessName}"?`,
                                message: 'This will mark the application as rejected and remove it from public discovery.',
                                onConfirm: () => handleRejectListing(item._id),
                                type: 'reject'
                              })}
                              className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {businessPagination.pages > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#64748B]">
                <span>
                  Showing page {businessPage} of {businessPagination.pages} ({businessPagination.total} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBusinessPage((p) => Math.max(1, p - 1))}
                    disabled={businessPage <= 1}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setBusinessPage((p) => Math.min(businessPagination.pages, p + 1))}
                    disabled={businessPage >= businessPagination.pages}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB CONTENT: CORRECTIONS ================= */}
        {activeTab === 'corrections' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by facility name, issue, description, user email..."
                  value={correctionSearch}
                  onChange={(e) => { setCorrectionSearch(e.target.value); setCorrectionPage(1); }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                />
              </div>

              <select
                value={correctionStatus}
                onChange={(e) => { setCorrectionStatus(e.target.value); setCorrectionPage(1); }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Corrections Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs uppercase font-semibold text-[#64748B] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Provider / Target</th>
                    <th className="px-6 py-3.5">Issue Category</th>
                    <th className="px-6 py-3.5">Report Description</th>
                    <th className="px-6 py-3.5">Reporter Email</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {correctionsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[#64748B]">
                        Loading correction reports...
                      </td>
                    </tr>
                  ) : corrections.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[#64748B]">
                        No community correction requests found.
                      </td>
                    </tr>
                  ) : (
                    corrections.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-[#172B3A]">
                          {item.providerName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 font-medium whitespace-nowrap capitalize">
                            {item.issueType?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#64748B] max-w-xs truncate" title={item.description}>
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-xs text-[#64748B]">
                          {item.userEmail || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 text-xs text-[#64748B]">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                            item.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'reviewed'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => { setSelectedCorrection(item); setCorrectionUpdates({}); }}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#087F8C] hover:bg-gray-50"
                            title="View Details & Apply"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {item.status !== 'resolved' && (
                            <button
                              onClick={() => { setSelectedCorrection(item); setCorrectionUpdates({}); }}
                              className="px-2.5 py-1 rounded-lg bg-[#087F8C] text-white text-xs font-semibold hover:bg-[#06666f]"
                            >
                              Review & Apply
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {correctionPagination.pages > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#64748B]">
                <span>
                  Showing page {correctionPage} of {correctionPagination.pages} ({correctionPagination.total} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCorrectionPage((p) => Math.max(1, p - 1))}
                    disabled={correctionPage <= 1}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCorrectionPage((p) => Math.min(correctionPagination.pages, p + 1))}
                    disabled={correctionPage >= correctionPagination.pages}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ================= MODAL: BUSINESS LISTING DETAIL ================= */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#DFF5EF] text-[#087F8C] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#172B3A]">{selectedListing.businessName}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#DFF5EF] text-[#087F8C] font-semibold">
                  {selectedListing.category}
                </span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-gray-100 grid grid-cols-2 gap-4 text-xs mb-6">
              <div>
                <span className="text-[#64748B] block">Owner / Doctor:</span>
                <span className="font-semibold text-[#172B3A] text-sm">{selectedListing.ownerName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Contact Phone:</span>
                <span className="font-semibold text-[#172B3A] text-sm">{selectedListing.phone}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Email Address:</span>
                <span className="font-medium text-[#172B3A]">{selectedListing.email}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Application Status:</span>
                <span className="font-bold uppercase text-amber-700">{selectedListing.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#64748B] block">Full Street Address:</span>
                <span className="font-medium text-[#172B3A]">{selectedListing.address}, {selectedListing.city}, {selectedListing.state} - {selectedListing.pincode}</span>
              </div>
              {selectedListing.website && (
                <div className="col-span-2">
                  <span className="text-[#64748B] block">Official Website:</span>
                  <a href={selectedListing.website} target="_blank" rel="noreferrer" className="text-[#087F8C] hover:underline flex items-center gap-1">
                    {selectedListing.website} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {selectedListing.description && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase text-[#64748B] mb-1">Description:</h4>
                <p className="text-sm text-[#172B3A] bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {selectedListing.description}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedListing(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
              {selectedListing.status !== 'rejected' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleRejectListing(selectedListing._id)}
                  className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold"
                >
                  Reject Submission
                </button>
              )}
              {selectedListing.status !== 'approved' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleApproveListing(selectedListing._id)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs"
                >
                  Approve & Publish to Directory
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CORRECTION DETAIL & APPLY ================= */}
      {selectedCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedCorrection(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF9B62] flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#172B3A]">{selectedCorrection.providerName}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 font-semibold capitalize">
                  Issue: {selectedCorrection.issueType?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-gray-100 text-xs mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Report Status:</span>
                <span className="font-bold uppercase text-amber-700">{selectedCorrection.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Reported By:</span>
                <span className="font-medium text-[#172B3A]">{selectedCorrection.userEmail || 'Anonymous community member'}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-[#64748B] block font-semibold mb-1">User's Correction Description:</span>
                <p className="text-sm text-[#172B3A] bg-white p-3 rounded-xl border border-gray-200/60">
                  {selectedCorrection.description}
                </p>
              </div>
            </div>

            {/* Action options for applying updates */}
            {selectedCorrection.issueType === 'closed_business' ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6 text-xs text-red-800">
                <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
                  <Ban className="w-4 h-4" /> Permanent Closure Action
                </p>
                <p>
                  Approving this report will mark <strong>{selectedCorrection.providerName}</strong> as inactive (`isActive: false, isOpen: false`). The provider will be removed from public discovery while keeping its database history.
                </p>
              </div>
            ) : (
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Apply Field Updates to Provider Record (Optional overrides):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#64748B] mb-1">Updated Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={correctionUpdates.phone || ''}
                      onChange={(e) => setCorrectionUpdates({ ...correctionUpdates, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#64748B] mb-1">Updated Website</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={correctionUpdates.website || ''}
                      onChange={(e) => setCorrectionUpdates({ ...correctionUpdates, website: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#64748B] mb-1">Updated Street Address</label>
                    <input
                      type="text"
                      placeholder="New address..."
                      value={correctionUpdates.address || ''}
                      onChange={(e) => setCorrectionUpdates({ ...correctionUpdates, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Existing ratings and review counts will be preserved untouched.
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedCorrection(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium hover:bg-gray-50"
              >
                Close
              </button>
              {selectedCorrection.status !== 'reviewed' && selectedCorrection.status !== 'resolved' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleMarkReviewed(selectedCorrection._id)}
                  className="px-4 py-2 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold"
                >
                  Mark Reviewed
                </button>
              )}
              {selectedCorrection.status !== 'rejected' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleRejectCorrection(selectedCorrection._id)}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                >
                  Reject Report
                </button>
              )}
              {selectedCorrection.status !== 'resolved' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleApproveCorrection(selectedCorrection._id)}
                  className="px-5 py-2 rounded-xl bg-[#087F8C] hover:bg-[#06666f] text-white text-xs font-semibold shadow-xs"
                >
                  {selectedCorrection.issueType === 'closed_business'
                    ? 'Approve & Mark Inactive'
                    : 'Approve & Apply Updates'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#172B3A]">{confirmDialog.title}</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={confirmDialog.onConfirm}
                className={`px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-xs ${
                  confirmDialog.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmDialog.type === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

