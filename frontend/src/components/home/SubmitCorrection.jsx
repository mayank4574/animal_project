import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { AlertCircle, Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

const issueOptions = [
  { value: 'incorrect_name', label: 'Incorrect Business Name' },
  { value: 'incorrect_address', label: 'Incorrect Address / Location' },
  { value: 'wrong_phone', label: 'Incorrect Phone Number' },
  { value: 'incorrect_category', label: 'Incorrect Service Category' },
  { value: 'closed_business', label: 'Business Permanently Closed' },
  { value: 'incorrect_website', label: 'Incorrect Website' },
  { value: 'other', label: 'Other Information' },
]

export default function SubmitCorrection() {
  const [submitting, setSubmitting] = useState(false)
  const [correctionResult, setCorrectionResult] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const res = await api.post('/corrections', formData)
      if (res.data?.success) {
        toast.success('Thank you! Your correction report has been submitted for review.')
        setCorrectionResult(res.data.data)
        reset()
      } else {
        toast.error(res.data?.message || 'Submission failed. Please try again.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit correction. Check your details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="correction" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF5EF] text-[#087F8C] text-xs font-semibold uppercase tracking-wider mb-2">
            <AlertCircle className="w-3.5 h-3.5" /> Community Accuracy
          </div>
          <h2 className="text-3xl font-bold text-[#172B3A]">
            Help Us Keep Information Accurate.
          </h2>
          <p className="text-[#64748B] mt-2 text-base">
            Noticed outdated hours, wrong numbers, or a moved clinic? Let us know and we’ll review and update it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10"
        >
          {correctionResult ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#DFF5EF] text-[#087F8C] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#172B3A]">Correction Report Logged!</h3>
                <p className="text-sm text-[#64748B] mt-1 max-w-md mx-auto">
                  Thank you for contributing to the pet community! Our verification team will review this report and apply updates.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#64748B]">
                    Correction Reference ID
                  </span>
                  <span className="font-mono text-xs font-bold text-[#087F8C] bg-[#DFF5EF] px-2 py-0.5 rounded">
                    {correctionResult._id}
                  </span>
                </div>
                <div className="text-xs space-y-1 pt-1">
                  <div>
                    <span className="text-[#64748B]">Target Facility: </span>
                    <span className="font-semibold text-[#172B3A]">{correctionResult.providerName}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Issue Category: </span>
                    <span className="font-medium text-[#172B3A] capitalize">
                      {correctionResult.issueType?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-[#64748B]">Review Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold uppercase text-[11px]">
                      {correctionResult.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setCorrectionResult(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#087F8C] text-white text-sm font-medium hover:bg-[#06666f] transition-colors"
                >
                  Submit Another Correction
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                    Provider / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Happy Tails Veterinary Clinic"
                    {...register('providerName', { required: 'Provider name is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                  />
                  {errors.providerName && (
                    <p className="text-xs text-red-500 mt-1">{errors.providerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                    Issue Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('issueType', { required: 'Please select an issue type' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                  >
                    <option value="">Select issue category</option>
                    {issueOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.issueType && (
                    <p className="text-xs text-red-500 mt-1">{errors.issueType.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                  Description of Correction <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Please describe what needs to be corrected (e.g. 'The phone number has changed to 9876543210', 'Moved to 2nd Avenue')..."
                  {...register('description', { required: 'Correction description is required' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                  Your Email <span className="text-xs text-[#64748B] font-normal">(Optional — in case we need to clarify)</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('userEmail')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]/30 focus:border-[#087F8C]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#087F8C] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#06666f] transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting Report...' : 'Submit Correction'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
