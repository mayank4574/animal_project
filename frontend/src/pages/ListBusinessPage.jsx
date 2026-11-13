import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Building2, CheckCircle2, Send, ArrowLeft, ShieldCheck, HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

const categories = [
  'Veterinary Clinic',
  'Animal Hospital',
  'Pet Boarding',
  'Diagnostics',
  'Animal Ambulance',
  'Animal NGO',
]

export default function ListBusinessPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const res = await api.post('/business-listings', data)
      if (res.data?.success) {
        toast.success('Your listing application was submitted successfully! It is currently under review.')
        setSubmissionResult(res.data.data)
        reset()
      } else {
        toast.error(res.data?.message || 'Failed to submit listing.')
      }
    } catch (err) {
      const backendErrors = err.response?.data?.errors
      if (backendErrors && backendErrors.length > 0) {
        toast.error(backendErrors.map(e => e.msg).join(', '))
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit listing. Please check the fields.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#087F8C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Header Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF5EF] text-[#087F8C] text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" /> Provider Partner Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#172B3A]">
            Are You an Animal Care Provider?
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Help more pet parents discover your services by listing your business on Practo for Animals.
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-12"
        >
          {submissionResult ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#DFF5EF] text-[#087F8C] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#172B3A]">Application Submitted!</h2>
                <p className="text-sm text-[#64748B] mt-1 max-w-lg mx-auto">
                  Your business registration has been recorded and submitted to our verification team.
                </p>
              </div>

              {/* Submission Confirmation Card */}
              <div className="bg-[#F8FAFC] border border-gray-200/80 rounded-2xl p-6 max-w-xl mx-auto text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#64748B]">
                    Submission Reference ID
                  </span>
                  <span className="font-mono text-xs font-bold text-[#087F8C] bg-[#DFF5EF] px-2.5 py-1 rounded-md">
                    {submissionResult._id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm pt-1">
                  <div>
                    <span className="text-xs text-[#64748B] block">Business Name</span>
                    <span className="font-semibold text-[#172B3A]">{submissionResult.businessName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#64748B] block">Category</span>
                    <span className="font-semibold text-[#087F8C]">{submissionResult.category}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#64748B] block">Owner / Doctor</span>
                    <span className="font-medium text-[#172B3A]">{submissionResult.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#64748B] block">City</span>
                    <span className="font-medium text-[#172B3A]">{submissionResult.city}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                  <span className="text-[#64748B]">Listing Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold uppercase">
                    {submissionResult.status || 'Pending'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Once reviewed and approved by our team, your practice will be publicly discoverable across Practo for Animals.
              </p>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmissionResult(null)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-[#172B3A] text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Register Another Practice
                </button>
                <Link
                  to="/search"
                  className="px-6 py-2.5 rounded-xl bg-[#087F8C] text-white text-sm font-medium hover:bg-[#06666f] transition-colors"
                >
                  Explore Directory
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Business Overview */}
              <div>
                <h3 className="text-base font-bold text-[#172B3A] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#087F8C]" /> 1. Business & Ownership Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Business / Clinic Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Pet Hospital"
                      {...register('businessName', { required: 'Business name is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    />
                    {errors.businessName && (
                      <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Owner / Doctor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      {...register('ownerName', { required: 'Owner name is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    />
                    {errors.ownerName && (
                      <p className="text-xs text-red-500 mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. contact@apexvet.com"
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Contact Number (Indian Mobile) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210 (10 digits starting with 6-9)"
                      {...register('phone', {
                        required: 'Contact number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Enter a valid 10-digit Indian mobile number'
                        }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Business Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category', { required: 'Please select a business category' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    >
                      <option value="">Select your practice category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Address */}
              <div>
                <h3 className="text-base font-bold text-[#172B3A] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#087F8C]" /> 2. Location & Facility Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Full Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Plot 14, Main Avenue, Indiranagar"
                      {...register('address', { required: 'Full street address is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore"
                        {...register('city', { required: 'City is required' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                      />
                      {errors.city && (
                        <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Karnataka"
                        {...register('state')}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 560038"
                        {...register('pincode')}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Website */}
              <div>
                <h3 className="text-base font-bold text-[#172B3A] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#087F8C]" /> 3. Additional Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Business Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your equipment, team, specializations, surgery capabilities..."
                      {...register('description')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Website URL <span className="text-xs text-[#64748B] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourclinic.com"
                      {...register('website')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  By submitting, you agree to our listing terms and verify that the business details provided are truthful.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#087F8C] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#06666f] transition-all disabled:opacity-60 shadow-sm shrink-0"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting Application...' : 'Submit Business Listing'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}

