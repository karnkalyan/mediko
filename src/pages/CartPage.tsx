import { useState, useEffect } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import type { NavProps } from '../types'
import {
  Plus,
  Minus,
  Trash2,
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
  ShoppingBag,
  Building2,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Clock,
  UserCheck,
  FileDown,
} from 'lucide-react'
import { generateQuotationPDF } from '../lib/pdfGenerator'

interface CartItem {
  id: number
  title: string
  brand: string
  sku: string
  condition: string
  price: number
  qty: number
  image: string
  delivery: string
  warranty: string
  seller: string
  sellerVerified: boolean
  hasSupportEngineer?: boolean
  supportEngineerCost?: number
  hasInstallation?: boolean
  installationCost?: number
  hasCalibration?: boolean
  calibrationCost?: number
  isRental?: boolean
  rentalDeposit?: number
  rentalDuration?: string
  bookingId?: string
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: 1,
    title: 'Mindray MEC-1200 Patient Monitor 12" TFT Multi-Para',
    brand: 'Mindray',
    sku: 'MDR-MEC1200-NP',
    condition: 'New',
    price: 285000,
    qty: 1,
    image: '/assets/generated/category-ultrasound.png',
    delivery: 'Free Express',
    warranty: '2 Years Manufacturer',
    seller: 'MediTech Solutions Pvt. Ltd.',
    sellerVerified: true,
    hasInstallation: true,
    installationCost: 3500,
  },
  {
    id: 2,
    title: 'Mindray SpO2 Extension Cable Set (3m Heavy Duty)',
    brand: 'Mindray',
    sku: 'MDR-SPO2-3M',
    condition: 'New',
    price: 4200,
    qty: 2,
    image: '/assets/generated/category-monitoring.png',
    delivery: 'Standard Courier',
    warranty: '1 Year Warranty',
    seller: 'MediTech Solutions Pvt. Ltd.',
    sellerVerified: true,
    hasInstallation: false,
    installationCost: 0,
  },
  {
    id: 3,
    title: 'Philips IntelliVue MX40 Bedside Monitor',
    brand: 'Philips',
    sku: 'PHL-MX40-NP',
    condition: 'Certified Pre-Owned',
    price: 195000,
    qty: 1,
    image: '/assets/generated/category-respiratory.png',
    delivery: 'Secured Medical Logistics',
    warranty: '1 Year Mediko Warranty',
    seller: 'Nepal Med Supply Co.',
    sellerVerified: true,
    hasInstallation: false,
    installationCost: 3500,
  },
]

export default function CartPage({ navigate, cartCount, setCartCount }: NavProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mediko_cart_items')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {
        console.error('Error reading cart from localStorage', e)
      }
    }
    return DEFAULT_ITEMS
  })

  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [province, setProvince] = useState('Bagmati Province')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('mediko_cart_items', JSON.stringify(items))
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0)
    if (setCartCount) {
      setCartCount(totalCount)
    }
  }, [items, setCartCount])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.qty + delta)
            return { ...item, qty: newQty }
          }
          return item
        })
    )
  }

  const removeItem = (id: number, title: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    showToast(`Removed "${title}" from cart`)
  }

  const toggleInstallation = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasInstallation: !item.hasInstallation } : item
      )
    )
  }

  const toggleSupportEngineer = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasSupportEngineer: !item.hasSupportEngineer, supportEngineerCost: 2500 } : item
      )
    )
  }

  const toggleCalibration = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasCalibration: !item.hasCalibration, calibrationCost: 1500 } : item
      )
    )
  }

  // Calculations
  const rawGoodsSubtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const installationSubtotal = items.reduce(
    (sum, item) => sum + (item.hasInstallation ? (item.installationCost || 0) : 0),
    0
  )
  const supportEngineerSubtotal = items.reduce(
    (sum, item) => sum + (item.hasSupportEngineer ? (item.supportEngineerCost || 2500) * item.qty : 0),
    0
  )
  const calibrationSubtotal = items.reduce(
    (sum, item) => sum + (item.hasCalibration ? (item.calibrationCost || 1500) * item.qty : 0),
    0
  )
  const subtotal = rawGoodsSubtotal + installationSubtotal + supportEngineerSubtotal + calibrationSubtotal

  // Discount
  let discount = 0
  if (appliedCoupon === 'MEDIKO10') {
    discount = Math.round(subtotal * 0.1)
  } else if (appliedCoupon === 'HOSPITAL2026') {
    discount = 15000
  }

  // Shipping based on province and subtotal threshold
  const isFreeDelivery = subtotal >= 100000
  let shipping = 0
  if (!isFreeDelivery) {
    if (province === 'Bagmati Province') shipping = 500
    else if (province === 'Gandaki Province') shipping = 1000
    else if (province === 'Koshi Province' || province === 'Madhesh Province') shipping = 1200
    else shipping = 1800
  }

  const totalRentalDeposit = items.reduce(
    (sum, item) => sum + (item.isRental ? (item.rentalDeposit || 0) : 0),
    0
  )
  const taxableAmount = Math.max(0, subtotal - discount)
  const vat = Math.round(taxableAmount * 0.13)
  const total = taxableAmount + shipping + vat + totalRentalDeposit

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    setCouponSuccess('')
    const code = coupon.trim().toUpperCase()

    if (!code) {
      setCouponError('Please enter a promo code')
      return
    }

    if (code === 'MEDIKO10') {
      setAppliedCoupon('MEDIKO10')
      setCouponSuccess('Promo Applied: 10% Institutional Discount!')
    } else if (code === 'HOSPITAL2026') {
      setAppliedCoupon('HOSPITAL2026')
      setCouponSuccess('Promo Applied: NPR 15,000 Medical Subsidy!')
    } else {
      setCouponError('Invalid promo code. Try "MEDIKO10" or "HOSPITAL2026"')
    }
  }

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      showToast('Your cart is empty. Add equipment before checkout.')
      return
    }

    // Save active cart summary to localStorage for Checkout page
    const cartSnapshot = {
      items,
      subtotal,
      discount,
      shipping,
      vat,
      total,
      province,
      appliedCoupon,
    }
    localStorage.setItem('mediko_active_cart_summary', JSON.stringify(cartSnapshot))
    navigate('checkout')
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col font-sans text-slate-800">
      <PublicHeader navigate={navigate} cartCount={cartCount || 0} />

      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#071B45] text-white px-4 py-3 text-xs font-bold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-orange transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('shop')} className="hover:text-orange transition-colors">
            Medical Catalog
          </button>
          <span>/</span>
          <span className="text-slate-600">Procurement Cart</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B45] tracking-tight">
              Hospital Procurement Cart
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Direct hospital order with tax included, a verified supplier and an equipment check before delivery.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3.5 py-1 text-xs font-bold text-orange border border-orange/20 self-start sm:self-auto">
            <ShoppingBag className="w-3.5 h-3.5" />
            {items.reduce((s, i) => s + i.qty, 0)} Units in Cart
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#071B45]">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              Browse our medical catalog for patient monitors, oxygen concentrators, hospital furniture, and spare parts.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-hover transition shadow-md shadow-orange/20"
            >
              Explore Medical Equipment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition hover:border-slate-300"
                >
                  {/* Supplier Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-700">{item.seller}</span>
                      {item.sellerVerified && (
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 border border-blue-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" /> Verified Vendor
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.condition}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#071B45] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Brand: <span className="font-semibold text-slate-600">{item.brand}</span> · SKU: <span className="font-mono">{item.sku}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {item.warranty}
                        </span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          {item.delivery}
                        </span>
                      </div>

                      {/* Specialized Rental Lease Badge */}
                      {item.isRental && (
                        <div className="mt-2.5 rounded-xl bg-purple-50 border border-purple-200 p-2.5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-purple-900 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-purple-700" /> Medical Rental Fleet ({item.rentalDuration || 'Monthly Lease'})
                            </span>
                            <span className="text-[10px] text-purple-700">
                              Refundable security deposit: NPR {(item.rentalDeposit || 0).toLocaleString()}
                            </span>
                          </div>
                          <span className="font-extrabold text-purple-900 bg-purple-100 px-2 py-0.5 rounded text-[10px]">
                            100% Refundable
                          </span>
                        </div>
                      )}

                      {/* Service & Support Add-ons Sub-Options */}
                      <div className="mt-3 space-y-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs">
                        <span className="font-extrabold text-[11px] uppercase tracking-wider text-[#071B45] flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-orange" />
                          Equipment Add-on Services:
                        </span>

                        {/* 1. Support Engineer Addon */}
                        <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-100">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!item.hasSupportEngineer}
                              onChange={() => toggleSupportEngineer(item.id)}
                              className="accent-orange rounded cursor-pointer h-4 w-4"
                            />
                            <div>
                              <span className="font-bold text-[#071B45] flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                Add Support Engineer (+NPR 2,500)
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Biomedical engineer on-site inspection, patient circuit check &amp; staff briefing
                              </span>
                            </div>
                          </label>
                          <span className="font-extrabold text-blue-700 font-mono text-[11px]">
                            {item.hasSupportEngineer ? '+ NPR 2,500' : 'Optional'}
                          </span>
                        </div>

                        {/* 2. On-Site Installation Addon */}
                        <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-100">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!item.hasInstallation}
                              onChange={() => toggleInstallation(item.id)}
                              className="accent-orange rounded cursor-pointer h-4 w-4"
                            />
                            <div>
                              <span className="font-bold text-[#071B45] flex items-center gap-1">
                                <Wrench className="w-3.5 h-3.5 text-orange" />
                                Hospital Installation &amp; Mounting (+NPR 3,500)
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Critical care ward commissioning &amp; electrical safety certification
                              </span>
                            </div>
                          </label>
                          <span className="font-extrabold text-[#071B45] font-mono text-[11px]">
                            {item.hasInstallation ? '+ NPR 3,500' : 'Optional'}
                          </span>
                        </div>

                        {/* 3. Calibration Certificate Addon */}
                        <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-100">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!item.hasCalibration}
                              onChange={() => toggleCalibration(item.id)}
                              className="accent-orange rounded cursor-pointer h-4 w-4"
                            />
                            <div>
                              <span className="font-bold text-[#071B45] flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                DDA Calibration Certificate (+NPR 1,500)
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                Sensor accuracy &amp; legal compliance certificate for hospital audit
                              </span>
                            </div>
                          </label>
                          <span className="font-extrabold text-emerald-700 font-mono text-[11px]">
                            {item.hasCalibration ? '+ NPR 1,500' : 'Optional'}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                            title="Decrease Quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#071B45] min-w-[32px] text-center font-mono">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                            title="Increase Quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.title)}
                          className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price column */}
                    <div className="text-right shrink-0 sm:self-center">
                      <span className="block text-base font-extrabold text-[#071B45]">
                        NPR {(item.price * item.qty).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        NPR {item.price.toLocaleString()} / unit
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Province Selection */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm text-xs">
                <div className="flex items-center gap-2 mb-2 font-bold text-[#071B45]">
                  <Truck className="w-4 h-4 text-orange" />
                  Select Delivery Province in Nepal
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  {[
                    'Bagmati Province',
                    'Gandaki Province',
                    'Koshi Province',
                    'Madhesh Province',
                    'Lumbini Province',
                    'Karnali Province',
                    'Sudurpashchim',
                  ].map((p) => (
                    <button
                      key={p}
                      onClick={() => setProvince(p)}
                      className={`rounded-xl px-3 py-2 text-left font-bold transition border ${
                        province === p
                          ? 'border-orange bg-orange/5 text-orange'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {isFreeDelivery
                    ? 'Orders over NPR 100,000 qualify for Free Secured Freight across Nepal.'
                    : `Estimated freight for ${province}: NPR ${shipping.toLocaleString()}`}
                </p>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon */}
            <div className="space-y-4 sticky top-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-xs">
                <h2 className="text-sm font-extrabold text-[#071B45] uppercase tracking-wider mb-4">
                  Procurement Summary
                </h2>

                <div className="space-y-2.5 pb-4 border-b border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Equipment Subtotal:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      NPR {rawGoodsSubtotal.toLocaleString()}
                    </span>
                  </div>

                  {installationSubtotal > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>BMET Installation &amp; Calibration:</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        NPR {installationSubtotal.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Applied Promo Discount:</span>
                      <span className="font-mono">- NPR {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Medical Freight ({province}):</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {isFreeDelivery ? (
                        <span className="text-emerald-600 font-bold">FREE (Institutional)</span>
                      ) : (
                        `NPR ${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Nepal Legal VAT (13%):</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      NPR {vat.toLocaleString()}
                    </span>
                  </div>

                  {totalRentalDeposit > 0 && (
                    <div className="flex justify-between text-purple-800 font-bold bg-purple-50 p-2 rounded-lg border border-purple-100">
                      <span>Refundable Rental Deposit:</span>
                      <span className="font-mono">+ NPR {totalRentalDeposit.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 pb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-extrabold text-[#071B45]">Grand Total (NPR):</span>
                    <span className="text-xl font-black text-[#FF5A00] font-mono">
                      NPR {total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Includes import charges, local delivery and applicable tax.
                  </p>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="mb-4 pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-orange" />
                    Apply Institutional Promo / Subsidy Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. MEDIKO10, HOSPITAL2026"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono uppercase text-[#071B45] outline-none focus:border-orange"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#071B45] px-4 py-2 text-xs font-bold text-white hover:bg-navy-light transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {couponError}
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {couponSuccess}
                    </p>
                  )}
                </form>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5A00] py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-orange/25 hover:bg-orange-hover transition cursor-pointer"
                >
                  Proceed to Secure Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Instant PDF Quotation Generation CTA */}
                <button
                  onClick={() => {
                    if (items.length === 0) {
                      showToast('Cart is empty. Add equipment before generating quote.')
                      return
                    }
                    generateQuotationPDF({
                      quoteNumber: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                      validUntil: new Date(Date.now() + 86400000 * 15).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                      customerName: 'Hospital Procurement Officer',
                      customerOrg: 'Institutional Hospital / Clinic Nepal',
                      customerPhone: '+977 9851099887',
                      deliveryLocation: `${province}, Nepal`,
                      items: items.map((it) => {
                        const addonNames: string[] = []
                        if (it.hasSupportEngineer) addonNames.push('Support Engineer (+2,500)')
                        if (it.hasInstallation) addonNames.push('Installation (+3,500)')
                        if (it.hasCalibration) addonNames.push('Calibration (+1,500)')
                        const addonText = addonNames.length > 0 ? ` [Addons: ${addonNames.join(', ')}]` : ''
                        return {
                          description: `${it.title}${addonText}`,
                          brandModel: `${it.brand} · SKU: ${it.sku}`,
                          qty: it.qty,
                          unitPrice: it.price + (it.hasSupportEngineer ? 2500 : 0) + (it.hasInstallation ? (it.installationCost || 3500) : 0) + (it.hasCalibration ? 1500 : 0),
                          total: (it.price + (it.hasSupportEngineer ? 2500 : 0) + (it.hasInstallation ? (it.installationCost || 3500) : 0) + (it.hasCalibration ? 1500 : 0)) * it.qty,
                        }
                      }),
                      subtotal: rawGoodsSubtotal + installationSubtotal + supportEngineerSubtotal + calibrationSubtotal,
                      freightAmount: shipping,
                      vatAmount: vat,
                      grandTotal: total,
                      notes: 'Formal estimated quotation registered under Mediko Bazaar Enterprise procurement terms.',
                    })
                    showToast('Official Quotation PDF generated and downloaded!')
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl border border-navy/30 bg-navy/5 py-2.5 text-xs font-bold text-navy hover:bg-navy hover:text-white transition cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-orange" />
                  Download Estimate Quotation (PDF)
                </button>

                <button
                  onClick={() => navigate('shop')}
                  className="w-full mt-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  ← Continue Shopping
                </button>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official invoice provided with every order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Insured Cold-Chain &amp; Medical Logistics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  )
}
