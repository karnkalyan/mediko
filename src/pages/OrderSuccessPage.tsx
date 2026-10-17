import { useState, useEffect } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import type { NavProps } from '../types'
import {
  CheckCircle2,
  Package,
  Truck,
  FileText,
  Phone,
  ShieldCheck,
  ArrowRight,
  Printer,
  Building2,
  MapPin,
  X,
} from 'lucide-react'

interface OrderDetails {
  orderNumber: string
  invoiceNumber: string
  date: string
  paymentMethod: string
  paymentStatus: string
  subtotal: number
  discount: number
  shipping: number
  vat: number
  total: number
  customer: {
    name: string
    organization?: string
    phone: string
    email: string
    address: string
    city: string
    province: string
    panNumber?: string
  }
  items: Array<{
    id: number
    title: string
    brand: string
    sku: string
    price: number
    qty: number
    image: string
    warranty?: string
    addons?: string
  }>
}

export default function OrderSuccessPage({ navigate, cartCount, setCartCount }: NavProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [showInvoicePage, setShowInvoicePage] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Reset cart count after successful order
    if (setCartCount) {
      setCartCount(0)
    }

    // Load latest order from localStorage if available, or initialize realistic institutional order
    const savedOrder = localStorage.getItem('mediko_latest_order')
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder))
        return
      } catch (e) {
        console.error('Failed to parse saved order:', e)
      }
    }

    // Default institutional order data
    const defaultOrder: OrderDetails = {
      orderNumber: 'MB-ORD-2026-008129',
      invoiceNumber: 'MB-INV-2026-0081',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      paymentMethod: 'eSewa Mobile Wallet (Verified)',
      paymentStatus: 'Payment received and protected',
      subtotal: 488400,
      discount: 32000,
      shipping: 1200,
      vat: 59332,
      total: 516932,
      customer: {
        name: 'Dr. Rajan Shrestha',
        organization: 'Bir Hospital Kathmandu (Emergency & ICU Care)',
        phone: '+977 9851099887',
        email: 'procurement@birhospital.org',
        address: 'Mahaboudha Marg, Ward 30',
        city: 'Kathmandu',
        province: 'Bagmati Province',
        panNumber: '300021487',
      },
      items: [
        {
          id: 1,
          title: 'Mindray MEC-1200 Patient Monitor 12" Multi-Para TFT',
          brand: 'Mindray',
          sku: 'MDR-MEC1200-NP',
          price: 285000,
          qty: 1,
          image: '/assets/generated/category-ultrasound.png',
          warranty: '2 Years Manufacturer Warranty',
          addons: 'Includes Free On-Site Biomedical Calibration',
        },
        {
          id: 2,
          title: 'Mindray SpO2 Extension Cable Set (3-Meter Heavy Duty)',
          brand: 'Mindray',
          sku: 'MDR-SPO2-3M',
          price: 4200,
          qty: 2,
          image: '/assets/generated/category-monitoring.png',
          warranty: '1 Year Warranty',
        },
        {
          id: 3,
          title: 'Philips IntelliVue MX40 Bedside Patient Monitor',
          brand: 'Philips',
          sku: 'PHL-MX40-NP',
          price: 195000,
          qty: 1,
          image: '/assets/generated/category-respiratory.png',
          warranty: '1 Year Full Warranty',
          addons: 'Installation & BMET Protocol Checklist Included',
        },
      ],
    }

    setOrder(defaultOrder)
  }, [setCartCount])

  const copyOrderNumber = () => {
    if (!order) return
    navigator.clipboard.writeText(order.orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const printInvoice = () => {
    window.print()
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col font-sans text-slate-800">
      <PublicHeader navigate={navigate} cartCount={cartCount || 0} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-orange transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('shop')} className="hover:text-orange transition-colors">
            Catalog
          </button>
          <span>/</span>
          <span className="text-slate-600">Order Confirmation</span>
        </nav>

        {/* 1. Primary Success Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#FF5A00]" />

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500 shadow-sm shadow-emerald-500/10">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Medical Procurement Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B45] tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Your medical equipment order has been registered in the Mediko Bazaar procurement system.
            An official invoice has been generated and sent to your registered email.
          </p>

          {/* Quick Order Info Strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Order Number
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs sm:text-sm font-extrabold text-[#071B45] font-mono">
                  {order.orderNumber}
                </span>
                <button
                  onClick={copyOrderNumber}
                  title="Copy Order ID"
                  className="text-[10px] font-bold text-orange hover:underline cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Amount (VAT incl.)
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#FF5A00] mt-0.5 block">
                NPR {order.total.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Payment Channel
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 block truncate">
                {order.paymentMethod}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Estimated Delivery
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5 block">
                2–4 Business Days
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setShowInvoicePage(true)
                window.setTimeout(() => document.getElementById('invoice-page')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
              }}
              className="flex items-center gap-2 rounded-xl bg-[#071B45] px-5 py-2.5 text-xs font-bold text-white hover:bg-navy-light transition shadow-sm"
            >
              <FileText className="w-4 h-4 text-orange" />
              View official invoice
            </button>
            <button
              onClick={() => navigate('shop')}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-orange hover:text-orange transition"
            >
              Continue Procurement
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('customer-dashboard')}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Hospital Dashboard
            </button>
          </div>
        </div>

        {/* 2. Medical Equipment Delivery & Calibration Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-[#071B45] uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange" />
                Live Shipment &amp; Calibration Tracking
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Biomedical engineer inspection protocol and secured transit status.
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 border border-blue-200">
              Tracking: #TRK-MED-9941
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 text-xs">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <strong className="text-sm font-bold text-[#071B45]">Order placed and payment received</strong>
                <span className="text-slate-400 text-[11px]">{order.date}</span>
              </div>
              <p className="text-slate-500 mt-0.5">
                Purchase order confirmed and institutional customer credentials authenticated.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <strong className="text-sm font-bold text-[#071B45]">Official invoice generated</strong>
                <span className="text-slate-400 text-[11px]">Today, Automatically Issued</span>
              </div>
              <p className="text-slate-500 mt-0.5">
                Invoice #{order.invoiceNumber} includes the applicable tax details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 grid h-6 w-6 place-items-center rounded-full bg-orange text-white font-bold text-[10px] shadow-sm animate-pulse">
                ●
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <strong className="text-sm font-bold text-orange">BMET Pre-Dispatch Functional Calibration</strong>
                <span className="text-orange text-[11px] font-bold">In Progress</span>
              </div>
              <p className="text-slate-500 mt-0.5">
                Assigned Biomedical Engineer (Er. Suman Adhikari, NHPC #BM-418) verifying electrical safety and sensor accuracy.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative opacity-60">
              <span className="absolute -left-[31px] top-0 grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-slate-500 font-bold text-[10px]">
                4
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <strong className="text-sm font-bold text-slate-700">Secured Medical Courier Dispatch</strong>
                <span className="text-slate-400 text-[11px]">Scheduled Tomorrow</span>
              </div>
              <p className="text-slate-500 mt-0.5">
                Temperature-controlled medical courier handover for direct transit to {order.customer.city}.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative opacity-60">
              <span className="absolute -left-[31px] top-0 grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-slate-500 font-bold text-[10px]">
                5
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <strong className="text-sm font-bold text-slate-700">Hospital Delivery &amp; Installation Handover</strong>
                <span className="text-slate-400 text-[11px]">Estimated in 2 Days</span>
              </div>
              <p className="text-slate-500 mt-0.5">
                On-site installation, technician training, and final warranty sign-off at {order.customer.organization || order.customer.name}.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Two-Column Grid: Ordered Items + Delivery Destination */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {/* Ordered Items Table (2 cols) */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-extrabold text-[#071B45] uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-orange" />
                Ordered Equipment ({order.items.length} Items)
              </span>
              <span className="text-xs font-bold text-slate-400">All Brand New / CPO Certified</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#071B45] line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Brand: <span className="font-semibold text-slate-600">{item.brand}</span> · SKU: <span className="font-mono">{item.sku}</span>
                    </p>
                    {item.warranty && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{item.warranty}</span>
                      </span>
                    )}
                    {item.addons && (
                      <p className="text-[11px] font-semibold text-orange mt-1">
                        + {item.addons}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs sm:text-sm font-extrabold text-[#071B45]">
                      NPR {(item.price * item.qty).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Qty: {item.qty} × NPR {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">NPR {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Institutional Discount</span>
                  <span>- NPR {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Medical Freight &amp; Handling</span>
                <span className="font-semibold text-slate-800">
                  {order.shipping > 0 ? `NPR ${order.shipping.toLocaleString()}` : 'Free'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nepal Legal VAT (13%)</span>
                <span className="font-semibold text-slate-800">NPR {order.vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#071B45] pt-2 border-t border-slate-200">
                <span>Total amount paid</span>
                <span className="text-[#FF5A00]">NPR {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery Destination & Support (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-xs">
              <h3 className="font-bold text-[#071B45] uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange" />
                Delivery Destination
              </h3>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5 text-slate-600">
                {order.customer.organization && (
                  <p className="font-bold text-[#071B45] text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {order.customer.organization}
                  </p>
                )}
                <p className="font-semibold text-slate-700">Attn: {order.customer.name}</p>
                <p>{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.province}, Nepal</p>
                <p className="font-mono text-slate-700">Phone: {order.customer.phone}</p>
                {order.customer.panNumber && (
                  <p className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                    Customer PAN: {order.customer.panNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-xs">
              <h3 className="font-bold text-[#071B45] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                Biomedical Support Desk
              </h3>
              <p className="text-slate-500 mb-3">
                Need urgent calibration certificates, dispatch adjustments, or engineer coordination?
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+9779851188274"
                  className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 font-bold text-[#071B45] border border-slate-200 hover:border-orange hover:text-orange transition"
                >
                  <Phone className="w-3.5 h-3.5 text-orange" />
                  +977 9851188274 (24/7 Hotline)
                </a>
                <a
                  href="mailto:support@medikobazaar.com"
                  className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 font-bold text-[#071B45] border border-slate-200 hover:border-orange hover:text-orange transition"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  support@medikobazaar.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* Official invoice preview */}
      {/* ======================================================== */}
      {showInvoicePage && (
        <section id="invoice-page" className="scroll-mt-20 bg-[#F7F9FC] px-4 py-10">
          <div className="relative mx-auto w-full max-w-3xl bg-white p-6 shadow-lg sm:p-8 border border-slate-200">
            {/* Close Button */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange text-white font-black text-xs">
                  M+
                </span>
                <div>
                  <h3 className="font-extrabold text-[#071B45] text-sm">
                    Official invoice
                  </h3>
                  <p className="text-[10px] text-slate-400">Rule 36 of Value Added Tax Regulations, Nepal</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={printInvoice}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  onClick={() => setShowInvoicePage(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tax Invoice Content */}
            <div className="text-xs text-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-[#071B45] text-base">Mediko Bazar Pvt. Ltd.</h4>
                  <p>Tripureshwor, Ward No. 11, Kathmandu, Nepal</p>
                  <p>Tel: +977 1 4261889 | info@medikobazaar.com</p>
                  <p className="font-bold text-[#071B45] mt-1 font-mono">
                    Seller PAN / VAT No: <span className="text-orange">601294819</span>
                  </p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                    LEGAL TAX INVOICE
                  </span>
                  <p className="font-bold font-mono text-[#071B45]">{order.invoiceNumber}</p>
                  <p className="text-slate-400">Date: {order.date}</p>
                  <p className="text-slate-400">Order Ref: {order.orderNumber}</p>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                <strong className="block text-slate-800 uppercase text-[10px] font-bold text-slate-400 tracking-wider mb-1">
                  Buyer Details
                </strong>
                <p className="font-bold text-[#071B45] text-xs">
                  {order.customer.organization || order.customer.name}
                </p>
                <p>{order.customer.address}, {order.customer.city}</p>
                <p>Contact: {order.customer.phone} · {order.customer.email}</p>
                {order.customer.panNumber && (
                  <p className="font-bold font-mono text-blue-700 mt-1">
                    Buyer PAN No: {order.customer.panNumber}
                  </p>
                )}
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                      <th className="p-2.5">S.N.</th>
                      <th className="p-2.5">Description of Goods</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Rate (NPR)</th>
                      <th className="p-2.5 text-right">Amount (NPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {order.items.map((it, idx) => (
                      <tr key={it.id}>
                        <td className="p-2.5">{idx + 1}</td>
                        <td className="p-2.5 font-sans">
                          <strong className="text-[#071B45]">{it.title}</strong>
                          <span className="block text-[10px] text-slate-400">SKU: {it.sku}</span>
                        </td>
                        <td className="p-2.5 text-center">{it.qty}</td>
                        <td className="p-2.5 text-right">{it.price.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold text-[#071B45]">
                          {(it.price * it.qty).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-right font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span>NPR {(order.subtotal - order.discount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (13%):</span>
                    <span>NPR {order.vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Freight:</span>
                    <span>NPR {order.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#071B45] border-t border-slate-200 pt-1">
                    <span>Grand Total:</span>
                    <span className="text-[#FF5A00]">NPR {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
                <span>This is a computer-generated invoice. No signature is required.</span>
                <span className="font-mono text-emerald-600 font-bold">Status: PAYMENT RECEIVED</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer navigate={navigate} />
    </div>
  )
}
