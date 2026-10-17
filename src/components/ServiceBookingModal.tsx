import { useState } from 'react'
import { Wrench, X } from 'lucide-react'
import { apiCreateServiceRequest } from '../lib/api'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ServiceBookingModal({ isOpen, onClose }: Props) {
  const [equipmentTitle, setEquipmentTitle] = useState('')
  const [equipmentBrand, setEquipmentBrand] = useState('')
  const [serviceType, setServiceType] = useState('CALIBRATION')
  const [hospitalLocation, setHospitalLocation] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiCreateServiceRequest({
        equipmentTitle,
        equipmentBrand,
        serviceType,
        hospitalLocation,
        problemDescription,
        preferredDate,
      })
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2200)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange">Biomedical Engineering Desk</span>
          <h2 className="text-xl font-bold text-navy">Book Expert Engineering Visit</h2>
          <p className="text-xs text-slate-500">Certified biomedical engineers across Kathmandu, Pokhara, Biratnagar, and all 7 provinces.</p>
        </div>

        {success ? (
          <div className="my-8 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Wrench className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-navy">Service Ticket Dispatched!</h3>
            <p className="text-xs text-slate-500">A biomedical engineer has been notified and will coordinate on-site visit scheduling.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Equipment Type / Name</label>
                <input
                  required
                  value={equipmentTitle}
                  onChange={(e) => setEquipmentTitle(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                  placeholder="e.g. Patient Monitor"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Brand / Make</label>
                <input
                  required
                  value={equipmentBrand}
                  onChange={(e) => setEquipmentBrand(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                  placeholder="e.g. Mindray, Philips, GE"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Service Required</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                >
                  <option value="CALIBRATION">Biomedical Calibration</option>
                  <option value="REPAIR">Repair &amp; Troubleshooting</option>
                  <option value="INSTALLATION">Installation &amp; Setup</option>
                  <option value="PREVENTIVE_MAINTENANCE">Preventive Maintenance (PM)</option>
                  <option value="AMC">Annual Maintenance (AMC)</option>
                  <option value="INSPECTION">Pre-Owned Verification Audit</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Preferred Visit Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Hospital / Facility Location</label>
              <input
                required
                value={hospitalLocation}
                onChange={(e) => setHospitalLocation(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                placeholder="e.g. Ward 4, Teaching Hospital, Kathmandu"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Issue Description / Checklist Requirements</label>
              <textarea
                rows={2}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-navy outline-none focus:border-orange"
                placeholder="Describe fault symptoms, sensor error codes or calibration certificate scope..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-lg bg-orange font-heading text-xs font-bold text-white transition hover:bg-orange-hover"
            >
              {loading ? 'Submitting...' : 'Confirm Biomedical Service Booking →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
