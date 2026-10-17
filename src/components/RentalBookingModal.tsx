import { useState } from 'react'
import {
  X,
  Clock,
  ShieldCheck,
  Calendar,
  Building2,
  Phone,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import type { Product, Page } from '../types'
import { formatNPR } from '../lib/utils'

interface RentalBookingModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  navigate: (page: Page) => void
  onBookingComplete?: () => void
}

export default function RentalBookingModal({
  product,
  isOpen,
  onClose,
  navigate,
  onBookingComplete,
}: RentalBookingModalProps) {
  const baseMonthly = product.rentalMonthly || Math.round((product.price || 150000) * 0.12)
  const baseDaily = Math.round(baseMonthly / 22)
  const baseWeekly = Math.round(baseMonthly * 0.3)
  const refundableDeposit = Math.round(baseMonthly * 1.5)

  const [durationType, setDurationType] = useState<'MONTHLY' | 'WEEKLY' | 'DAILY'>('MONTHLY')
  const [durationValue, setDurationValue] = useState(1)
  const [includeBmetSupport, setIncludeBmetSupport] = useState(true)
  const [hospitalName, setHospitalName] = useState('Bir Hospital Kathmandu')
  const [department, setDepartment] = useState('ICU / Critical Care Ward')
  const [phone, setPhone] = useState('+977 9851099887')
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  )
  const [agreedToRentalTerms, setAgreedToRentalTerms] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  // Rate calculation
  const unitRate =
    durationType === 'MONTHLY' ? baseMonthly : durationType === 'WEEKLY' ? baseWeekly : baseDaily
  const totalRentalFee = unitRate * durationValue
  const bmetFee = includeBmetSupport ? 3500 : 0
  const vatRate = 0.13
  const rentalVat = Math.round((totalRentalFee + bmetFee) * vatRate)
  const totalPayableNow = totalRentalFee + bmetFee + rentalVat + refundableDeposit

  const handleConfirmRental = () => {
    if (!hospitalName.trim()) {
      setError('Hospital or clinic name is required.')
      return
    }
    if (!phone.trim()) {
      setError('Contact phone number is required.')
      return
    }
    if (!agreedToRentalTerms) {
      setError('Please accept the Mediko equipment rental terms.')
      return
    }

    setIsSubmitting(true)

    const randomBookingId = `RNT-${Math.floor(100000 + Math.random() * 900000)}`

    const rentalBooking = {
      bookingId: randomBookingId,
      product: {
        id: product.id,
        title: product.title,
        brand: product.brand,
        image: product.image,
        sku: product.sku || `SKU-MED-${product.id}`,
      },
      durationType,
      durationValue,
      startDate,
      hospitalName,
      department,
      phone,
      unitRate,
      totalRentalFee,
      bmetFee,
      vatAmount: rentalVat,
      refundableDeposit,
      totalPayableNow,
      status: 'ACTIVE_ESCROW',
      assignedEngineer: 'Er. Suman Adhikari (NHPC #BM-418)',
      createdDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }

    // Persist in local rental storage
    try {
      const existingRentals = JSON.parse(localStorage.getItem('mediko_rental_bookings') || '[]')
      existingRentals.unshift(rentalBooking)
      localStorage.setItem('mediko_rental_bookings', JSON.stringify(existingRentals))

      // Also add to the cart with the refundable rental deposit.
      const existingCart = JSON.parse(localStorage.getItem('mediko_cart_items') || '[]')
      existingCart.unshift({
        id: Date.now(),
        productId: product.id,
        title: `[RENTAL ${durationValue} ${durationType}] ${product.title}`,
        brand: product.brand,
        sku: `RNT-${product.sku || product.id}`,
        price: totalRentalFee + bmetFee,
        qty: 1,
        image: product.image,
        warranty: '24/7 Mediko BMET Rapid Replacement',
        isRental: true,
        rentalDeposit: refundableDeposit,
        rentalDuration: `${durationValue} ${durationType.toLowerCase()}`,
        bookingId: randomBookingId,
      })
      localStorage.setItem('mediko_cart_items', JSON.stringify(existingCart))

      // Update active cart summary
      const activeSummary = {
        items: existingCart,
        subtotal: existingCart.reduce((sum: number, it: any) => sum + it.price * it.qty, 0),
        discount: 0,
        shipping: 1500,
        vat: Math.round(existingCart.reduce((sum: number, it: any) => sum + it.price * it.qty, 0) * 0.13),
        total: Math.round(existingCart.reduce((sum: number, it: any) => sum + it.price * it.qty, 0) * 1.13) + refundableDeposit + 1500,
      }
      localStorage.setItem('mediko_active_cart_summary', JSON.stringify(activeSummary))
    } catch (e) {
      console.error('Failed to save rental booking:', e)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      if (onBookingComplete) onBookingComplete()
      navigate('checkout')
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#071B45] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange font-bold text-white shadow">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="m-0 text-base font-extrabold text-white">
                Medical Equipment Rental Agreement
              </h3>
              <p className="m-0 text-[11px] text-white/70">
                Hospital rental with a refundable deposit and an equipment safety check.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg border-0 bg-white/10 text-white hover:bg-white/20 cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Overview Card */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
            <img
              src={product.image}
              alt={product.title}
              className="h-16 w-16 shrink-0 rounded-lg object-contain bg-white p-1 border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange">
                {product.brand} · Biomedical Certified
              </span>
              <h4 className="text-xs font-bold text-[#071B45] truncate">{product.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Monthly Standard Rate: <strong className="text-slate-800 font-mono">{formatNPR(baseMonthly)}/mo</strong>
              </p>
            </div>
          </div>

          {/* Rental Duration Options */}
          <div>
            <label className="block text-xs font-bold text-[#071B45] mb-2">
              1. Select Rental Duration Plan
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDurationType('MONTHLY')
                  setDurationValue(1)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition cursor-pointer text-center ${
                  durationType === 'MONTHLY'
                    ? 'border-orange bg-orange/5 text-orange font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-black">Monthly Plan</span>
                <span className="text-[11px] font-mono mt-0.5">{formatNPR(baseMonthly)}/mo</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Best for ICU &amp; Ward</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDurationType('WEEKLY')
                  setDurationValue(2)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition cursor-pointer text-center ${
                  durationType === 'WEEKLY'
                    ? 'border-orange bg-orange/5 text-orange font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-black">Weekly Plan</span>
                <span className="text-[11px] font-mono mt-0.5">{formatNPR(baseWeekly)}/wk</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Emergency surge</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDurationType('DAILY')
                  setDurationValue(7)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition cursor-pointer text-center ${
                  durationType === 'DAILY'
                    ? 'border-orange bg-orange/5 text-orange font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-black">Daily Plan</span>
                <span className="text-[11px] font-mono mt-0.5">{formatNPR(baseDaily)}/day</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Short-term OT backup</span>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">
                Number of {durationType === 'MONTHLY' ? 'Months' : durationType === 'WEEKLY' ? 'Weeks' : 'Days'}:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDurationValue(Math.max(1, durationValue - 1))}
                  className="h-7 w-7 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm text-[#071B45] w-6 text-center">
                  {durationValue}
                </span>
                <button
                  type="button"
                  onClick={() => setDurationValue(durationValue + 1)}
                  className="h-7 w-7 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Hospital Details & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital / Institution Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g. Patan Hospital, Bir Hospital"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium outline-none focus:border-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department / Ward Name
              </label>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. ICU Wing, CCU, Ward 4"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital Contact Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-mono font-medium outline-none focus:border-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rental Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-medium outline-none focus:border-orange"
                />
              </div>
            </div>
          </div>

          {/* BMET Engineering Service Add-on */}
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-emerald-50/50 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeBmetSupport}
              onChange={(e) => setIncludeBmetSupport(e.target.checked)}
              className="accent-orange mt-0.5 h-4 w-4 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-emerald-900 font-bold">
                  On-Site Biomedical Commissioning &amp; Calibration Certificate
                </strong>
                <span className="font-mono font-bold text-emerald-800">+ NPR 3,500</span>
              </div>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Certified BMET engineer delivers, installs, checks electrical safety (IEC 60601-1), and trains hospital nursing staff.
              </p>
            </div>
          </label>

          {/* Pricing & Refundable Deposit Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>
                Rental Charge ({durationValue} × {formatNPR(unitRate)}):
              </span>
              <span className="font-mono font-semibold">{formatNPR(totalRentalFee)}</span>
            </div>
            {includeBmetSupport && (
              <div className="flex justify-between text-slate-600">
                <span>BMET Installation &amp; Calibration:</span>
                <span className="font-mono font-semibold">{formatNPR(bmetFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Nepal VAT (13%):</span>
              <span className="font-mono font-semibold">{formatNPR(rentalVat)}</span>
            </div>
            <div className="flex justify-between text-blue-700 font-semibold border-t border-slate-200 pt-2">
              <span className="flex items-center gap-1">
                Refundable security deposit:
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              </span>
              <span className="font-mono">{formatNPR(refundableDeposit)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#071B45] border-t border-slate-200 pt-2">
              <span>Total Immediate Payable:</span>
              <span className="font-mono text-orange">{formatNPR(totalPayableNow)}</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1 italic">
              * The security deposit of {formatNPR(refundableDeposit)} is 100% refundable immediately upon equipment return &amp; visual engineering inspection.
            </p>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
            <input
              type="checkbox"
              checked={agreedToRentalTerms}
              onChange={(e) => setAgreedToRentalTerms(e.target.checked)}
              className="accent-orange mt-0.5 h-4 w-4 cursor-pointer"
            />
            <span>
              I accept the Mediko rental terms, replacement policy and refundable deposit conditions.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmRental}
            className="flex items-center gap-2 rounded-xl border-0 bg-orange px-5 py-2 text-xs font-extrabold text-white hover:bg-orange-hover shadow-md cursor-pointer transition disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Processing rental...' : 'Confirm rental and continue'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
