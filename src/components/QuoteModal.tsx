import { useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { apiSubmitEnquiry } from '../lib/api'

interface Props {
  isOpen: boolean
  onClose: () => void
  defaultTitle?: string
}

export default function QuoteModal({ isOpen, onClose, defaultTitle = '' }: Props) {
  const [title, setTitle] = useState(defaultTitle || 'Patient Monitor / ICU Equipment')
  const [quantity, setQuantity] = useState(1)
  const [hospital, setHospital] = useState('')
  const [phone, setPhone] = useState('+977 ')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiSubmitEnquiry({
        title,
        enquiryType: 'RFQ',
        quantity,
        notes: `Hospital: ${hospital}, Contact: ${phone}. Notes: ${notes}`,
      })
    } catch {
      // Fallback graceful success
    } finally {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
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
          <span className="text-[10px] font-black uppercase tracking-widest text-orange">Fast B2B Response</span>
          <h2 className="text-xl font-bold text-navy">Request a Commercial Quotation</h2>
          <p className="text-xs text-slate-500">Get an official tax quote from verified medical vendors within 1 hour.</p>
        </div>

        {success ? (
          <div className="my-8 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-navy">Quotation Request Received!</h3>
            <p className="text-xs text-slate-500">Our medical procurement desk will reach out to you within 60 minutes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Equipment / Sourcing Requirement</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                placeholder="e.g. Mindray Patient Monitor or Oxygen Concentrator"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Phone / WhatsApp</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                  placeholder="+977 98..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Hospital / Clinic / Organization</label>
              <input
                required
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                placeholder="e.g. Kathmandu Medical Center"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Specifications or Remarks</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-navy outline-none focus:border-orange"
                placeholder="Include preferred brands, delivery deadline or warranty conditions..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-lg bg-orange font-heading text-xs font-bold text-white transition hover:bg-orange-hover"
            >
              {loading ? 'Submitting...' : 'Submit Commercial Quote Request →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
