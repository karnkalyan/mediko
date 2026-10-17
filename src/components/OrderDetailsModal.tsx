import { useState } from 'react'
import {
  X,
  FileDown,
  Building2,
  Phone,
  Mail,
  MapPin,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  User,
  Package,
} from 'lucide-react'
import { formatNPR } from '../lib/utils'
import { generateTaxInvoicePDF } from '../lib/pdfGenerator'

export interface OrderLineItem {
  id: string | number
  title: string
  brand: string
  model?: string
  image?: string
  quantity: number
  unitPriceNpr: number
  serviceAddons?: Array<{ name: string; priceNpr: number }>
}

export interface DetailedOrder {
  id: string
  orderNumber: string
  date: string
  status: 'PENDING_ESCROW' | 'PAID_CONFIRMED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'REFUND_REQUESTED' | 'REFUNDED' | 'CANCELLED'
  paymentMethod: string
  transactionRef: string
  customer: {
    name: string
    organization: string
    phone: string
    email: string
    address: string
    city: string
    panVatNumber?: string
  }
  vendor?: {
    name: string
    panVatNumber?: string
    phone?: string
  }
  items: OrderLineItem[]
  subtotalNpr: number
  vatNpr: number
  shippingNpr: number
  totalAmountNpr: number
  trackingNumber?: string
  carrierName?: string
  refundDetails?: {
    requestedDate: string
    reason: string
    restockingFeeNpr: number
    netRefundNpr: number
    refundStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PROCESSED'
    processedDate?: string
    notes?: string
  }
}

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: DetailedOrder | null
  isVendorView?: boolean
  onUpdateStatus?: (orderId: string, newStatus: DetailedOrder['status']) => void
  onProcessRefund?: (
    orderId: string,
    refundData: {
      reason: string
      restockingFeeNpr: number
      netRefundNpr: number
      notes: string
      action: 'APPROVE' | 'REJECT'
    }
  ) => void
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onProcessRefund,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null

  const [activeTab, setActiveTab] = useState<'overview' | 'fulfillment' | 'refund'>('overview')
  const [currentStatus, setCurrentStatus] = useState<DetailedOrder['status']>(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || 'MEDIKO-EXP-98412')
  const [carrier, setCarrier] = useState(order.carrierName || 'Sundar Medical Logistics Nepal')

  // Refund State
  const [showRefundForm, setShowRefundForm] = useState(false)
  const [refundReason, setRefundReason] = useState('Hospital Spec Mismatch / Defective Sensor')
  const [restockingFee, setRestockingFee] = useState(5000)
  const [refundNotes, setRefundNotes] = useState('Biomedical inspection completed. Sensor probe seal intact.')

  const calculatedNetRefund = Math.max(0, order.totalAmountNpr - restockingFee)

  const handleStatusChange = (newStatus: DetailedOrder['status']) => {
    setCurrentStatus(newStatus)
    if (onUpdateStatus) {
      onUpdateStatus(order.id, newStatus)
    }
  }

  const handleDownloadInvoice = () => {
    generateTaxInvoicePDF({
      invoiceNumber: `INV-${order.orderNumber.replace(/[^0-9]/g, '') || '2026-8812'}`,
      orderNumber: order.orderNumber,
      issueDate: order.date,
      buyerName: order.customer.name,
      buyerOrg: order.customer.organization,
      buyerPan: order.customer.panVatNumber || '601289123',
      buyerAddress: `${order.customer.address}, ${order.customer.city}`,
      buyerPhone: order.customer.phone,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.status === 'PAID_CONFIRMED' || order.status === 'DELIVERED' ? 'PAID' : 'ESCROW_HELD',
      items: order.items.map((item, idx) => ({
        sn: idx + 1,
        description: `${item.title} (${item.brand} ${item.model || ''})`,
        qty: item.quantity,
        rate: item.unitPriceNpr,
        amount: item.unitPriceNpr * item.quantity,
      })),
      subtotal: order.subtotalNpr,
      taxableAmount: order.subtotalNpr,
      vatAmount: order.vatNpr,
      shippingCharge: order.shippingNpr,
      grandTotal: order.totalAmountNpr,
    })
  }

  const getStatusBadge = (status: DetailedOrder['status']) => {
    switch (status) {
      case 'PAID_CONFIRMED':
        return <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">Paid &amp; Escrow Secured</span>
      case 'PROCESSING':
        return <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">Processing in Warehouse</span>
      case 'DISPATCHED':
        return <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">Dispatched &amp; In Transit</span>
      case 'DELIVERED':
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">Delivered &amp; Installed</span>
      case 'REFUND_REQUESTED':
        return <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">Refund Requested</span>
      case 'REFUNDED':
        return <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">Refund Processed</span>
      case 'CANCELLED':
        return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">Cancelled</span>
      default:
        return <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">Pending Escrow</span>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange/10 p-2.5 text-orange">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-navy">{order.orderNumber}</h3>
                {getStatusBadge(currentStatus)}
              </div>
              <p className="text-xs text-slate-500">
                Placed on {order.date} · Payment: <strong className="text-slate-700">{order.paymentMethod}</strong> (Ref: {order.transactionRef})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-slate-50 shadow-xs cursor-pointer transition"
            >
              <FileDown className="w-4 h-4 text-orange" />
              <span>Official Tax Invoice PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-orange text-orange'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <FileText className="w-4 h-4" />
            Order Details &amp; Items
          </button>
          <button
            onClick={() => setActiveTab('fulfillment')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'fulfillment'
                ? 'border-orange text-orange'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <Truck className="w-4 h-4" />
            Fulfillment &amp; Dispatch
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'refund'
                ? 'border-orange text-orange'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Refund &amp; Return Desk
            {order.refundDetails && (
              <span className="ml-1 rounded-full bg-amber-500 h-2 w-2"></span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Customer and Vendor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-navy border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-orange" />
                      Hospital / Buyer Institution
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      PAN: {order.customer.panVatNumber || '601289123'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <strong className="block text-navy font-bold text-sm">
                      {order.customer.organization}
                    </strong>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {order.customer.name} (Procurement)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {order.customer.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {order.customer.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {order.customer.address}, {order.customer.city}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-navy border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Fulfillment Partner / Vendor
                    </span>
                    <span className="font-mono text-[11px] text-emerald-600 font-bold">
                      IRD Verified
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <strong className="block text-navy font-bold text-sm">
                      {order.vendor?.name || 'MediTech Solutions Pvt. Ltd.'}
                    </strong>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="font-mono text-[11px]">PAN: {order.vendor?.panVatNumber || '601248991'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {order.vendor?.phone || '+977 1-4491200'}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 bg-white rounded-lg p-2 border border-slate-200">
                      <strong>Escrow Guarantee:</strong> Payment is held in secure trust escrow until BIR Hospital confirms device calibration and delivery inspection.
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 flex justify-between">
                  <span>Purchased Clinical Equipment</span>
                  <span>Amount (NPR)</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/60">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&auto=format&fit=crop&q=80'}
                          alt={item.title}
                          className="h-12 w-12 rounded-lg object-contain bg-slate-50 p-1 border border-slate-200"
                        />
                        <div>
                          <strong className="block text-navy font-bold text-sm">{item.title}</strong>
                          <span className="text-slate-500">
                            Brand: {item.brand} {item.model ? `· Model: ${item.model}` : ''} · Qty: {item.quantity} × {formatNPR(item.unitPriceNpr)}
                          </span>
                          {item.serviceAddons && item.serviceAddons.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.serviceAddons.map((addon, aIdx) => (
                                <span key={aIdx} className="rounded-md bg-orange/10 px-2 py-0.5 text-[10px] font-bold text-orange">
                                  + {addon.name} ({formatNPR(addon.priceNpr)})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-navy">
                          {formatNPR(item.unitPriceNpr * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Totals */}
                <div className="bg-slate-50/80 p-4 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Equipment Subtotal</span>
                    <span className="font-mono font-semibold">{formatNPR(order.subtotalNpr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Nepal Inland Revenue 13% VAT</span>
                    <span className="font-mono font-semibold">{formatNPR(order.vatNpr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Direct Hospital Transport &amp; Insurance</span>
                    <span className="font-mono font-semibold">{formatNPR(order.shippingNpr || 0)}</span>
                  </div>
                  <div className="flex justify-between text-navy font-bold text-sm border-t border-slate-200 pt-2">
                    <span>Total Invoiced Gross Amount</span>
                    <span className="font-mono text-orange text-base">{formatNPR(order.totalAmountNpr)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULFILLMENT & DISPATCH */}
          {activeTab === 'fulfillment' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <h4 className="font-heading text-sm font-bold text-navy flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange" />
                  Order Dispatch &amp; Logistics Control
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Order Status
                    </label>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(e.target.value as any)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
                    >
                      <option value="PAID_CONFIRMED">PAID_CONFIRMED (Escrow Verified)</option>
                      <option value="PROCESSING">PROCESSING (Packaging &amp; Calibration)</option>
                      <option value="DISPATCHED">DISPATCHED (In Carrier Transit)</option>
                      <option value="DELIVERED">DELIVERED (Signed &amp; Installed)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Carrier / Logistics Partner
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Airway Bill / Courier Consignment Tracking #
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-xs text-navy outline-none focus:border-orange"
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <strong className="block text-navy font-bold">Logistics Milestone History:</strong>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Order Paid &amp; Escrow Locked — {order.date} 10:14 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Biomedical Quality Check Completed — {order.date} 02:30 PM</span>
                    </div>
                    {currentStatus === 'DISPATCHED' || currentStatus === 'DELIVERED' ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span>Dispatched via {carrier} (AWB: {trackingNumber})</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(currentStatus)
                      alert(`Fulfillment updated for ${order.orderNumber}`)
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-orange px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-hover transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Save Fulfillment Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND & RETURN DESK */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              {order.refundDetails ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Active Refund Claim on this Order
                    </span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-300">
                      {order.refundDetails.refundStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong>Reason:</strong> {order.refundDetails.reason}</p>
                    <p><strong>Requested Date:</strong> {order.refundDetails.requestedDate}</p>
                    <p><strong>Restocking Deduction:</strong> {formatNPR(order.refundDetails.restockingFeeNpr)}</p>
                    <p><strong>Net Refundable to Buyer:</strong> <span className="font-bold text-emerald-700">{formatNPR(order.refundDetails.netRefundNpr)}</span></p>
                    {order.refundDetails.notes && (
                      <p className="text-slate-500 italic">Notes: {order.refundDetails.notes}</p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Refund Action Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-navy flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-orange" />
                      Initiate / Process Hospital Equipment Refund
                    </h4>
                    <p className="text-xs text-slate-500">
                      Refunds are executed in compliance with Mediko Return Policy &amp; DDA Biomedical Guidelines.
                    </p>
                  </div>
                  {!showRefundForm && (
                    <button
                      type="button"
                      onClick={() => setShowRefundForm(true)}
                      className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                    >
                      Process Refund Claim
                    </button>
                  )}
                </div>

                {showRefundForm && (
                  <div className="border-t border-slate-100 pt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Refund / Return Justification Reason
                      </label>
                      <select
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                      >
                        <option value="Hospital Spec Mismatch / Defective Sensor">
                          Hospital Spec Mismatch / Defective Sensor
                        </option>
                        <option value="Damaged During Logistics Transit">Damaged During Logistics Transit</option>
                        <option value="DDA Wholesale License Regulatory Recall">
                          DDA Wholesale License Regulatory Recall
                        </option>
                        <option value="Order Cancelled Prior to Dispatch">
                          Order Cancelled Prior to Dispatch
                        </option>
                        <option value="Customer Dissatisfaction - 7-Day Guarantee">
                          Customer Dissatisfaction - 7-Day Guarantee
                        </option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Restocking / Inspection Fee (NPR)
                        </label>
                        <input
                          type="number"
                          value={restockingFee}
                          onChange={(e) => setRestockingFee(Number(e.target.value))}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-xs text-navy outline-none focus:border-orange"
                        />
                        <span className="text-[10px] text-slate-400">Deducted for technical testing</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Net Refund Payable to Hospital
                        </label>
                        <div className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 flex items-center font-mono font-bold text-sm text-emerald-700">
                          {formatNPR(calculatedNetRefund)}
                        </div>
                        <span className="text-[10px] text-slate-400">Total {formatNPR(order.totalAmountNpr)} minus fee</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Biomedical Engineer Inspection Note
                      </label>
                      <textarea
                        rows={2}
                        value={refundNotes}
                        onChange={(e) => setRefundNotes(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs text-navy outline-none focus:border-orange"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowRefundForm(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onProcessRefund) {
                            onProcessRefund(order.id, {
                              reason: refundReason,
                              restockingFeeNpr: restockingFee,
                              netRefundNpr: calculatedNetRefund,
                              notes: refundNotes,
                              action: 'APPROVE',
                            })
                          }
                          setCurrentStatus('REFUNDED')
                          setShowRefundForm(false)
                        }}
                        className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Authorize Net Refund ({formatNPR(calculatedNetRefund)})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Mediko Bazaar ERP · Secured by IRD Certified Nepal Billing Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-5 py-2 font-bold text-navy hover:bg-slate-300 transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
