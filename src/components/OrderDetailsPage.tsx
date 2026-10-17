import { useState } from 'react'
import {
  ArrowLeft,
  FileDown,
  Building2,
  Mail,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Package,
  Check,
} from 'lucide-react'
import type { DetailedOrder } from './OrderDetailsModal'
import { generateTaxInvoicePDF } from '../lib/pdfGenerator'

interface OrderDetailsPageProps {
  order: DetailedOrder
  onBack: () => void
  onUpdateStatus?: (orderId: string, status: string, trackingNumber?: string) => void
  onProcessRefund?: (orderId: string, refundData: any) => void
}

// Mediko Bazaar standard buttons
const BTN = {
  primary: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-light text-white rounded text-xs font-normal transition cursor-pointer',
  secondary: 'inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-white hover:bg-bg-section text-text-body rounded text-xs font-normal transition cursor-pointer',
  orange: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange hover:bg-orange-hover text-white rounded text-xs font-normal transition cursor-pointer',
  danger: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-error hover:opacity-90 text-white rounded text-xs font-normal transition cursor-pointer',
}

const ORDER_STEPS = [
  { key: 'PAID_CONFIRMED', label: 'Order Confirmed', desc: 'Hospital PO & Payment Verified' },
  { key: 'PROCESSING', label: 'Biomedical Inspection', desc: '48-Point BMET QA & Packaging' },
  { key: 'DISPATCHED', label: 'Dispatched', desc: 'Handed over to Medical Logistics' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Installed & Calibrated at Ward' },
]

export default function OrderDetailsPage({
  order,
  onBack,
  onUpdateStatus,
  onProcessRefund,
}: OrderDetailsPageProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || 'NPL-MED-89104')
  const [carrierName, setCarrierName] = useState(order.carrierName || 'Sundar Medical Logistics Nepal')
  const [statusUpdatedFeedback, setStatusUpdatedFeedback] = useState(false)

  // Refund Desk State
  const [refundReason, setRefundReason] = useState(order.refundDetails?.reason || 'Defective Sensor / RMA Return')
  const [restockingFeeNpr, setRestockingFeeNpr] = useState(order.refundDetails?.restockingFeeNpr || 0)
  const [refundNotes, setRefundNotes] = useState(order.refundDetails?.notes || '')
  const [refundSuccessMsg, setRefundSuccessMsg] = useState('')

  const netRefundPayable = Math.max(0, order.totalAmountNpr - Number(restockingFeeNpr || 0))

  const handleStatusUpdate = () => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, selectedStatus, trackingNumber)
      setStatusUpdatedFeedback(true)
      setTimeout(() => setStatusUpdatedFeedback(false), 3000)
    }
  }

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onProcessRefund) {
      onProcessRefund(order.id, {
        reason: refundReason,
        restockingFeeNpr: Number(restockingFeeNpr),
        netRefundNpr: netRefundPayable,
        notes: refundNotes,
        status: 'REFUND_APPROVED',
      })
      setRefundSuccessMsg('Institutional refund voucher approved and recorded.')
    }
  }

  const handleDownloadInvoice = () => {
    generateTaxInvoicePDF({
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      issueDate: order.date,
      buyerName: order.customer.name,
      buyerOrg: order.customer.organization,
      buyerPan: order.customer.panVatNumber || '300184920',
      buyerAddress: `${order.customer.address}, ${order.customer.city}, Nepal`,
      buyerPhone: order.customer.phone,
      paymentMethod: order.paymentMethod,
      paymentStatus: 'PAID',
      items: order.items.map((item, index) => ({
        sn: index + 1,
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

  const currentStepIndex =
    selectedStatus === 'DELIVERED'
      ? 3
      : selectedStatus === 'DISPATCHED'
      ? 2
      : selectedStatus === 'PROCESSING'
      ? 1
      : 0

  return (
    <div className="min-h-screen bg-bg-light pb-12" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
      {/* Top Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-white px-4 lg:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className={BTN.secondary}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <span>Orders</span>
                <span>/</span>
                <span className="font-mono text-text-dark">{order.orderNumber}</span>
              </div>
              <h1 className="text-sm font-normal text-navy m-0">
                Order #{order.orderNumber}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-normal ${
                selectedStatus === 'DELIVERED'
                  ? 'bg-success-bg text-success'
                  : selectedStatus === 'REFUNDED'
                  ? 'bg-error-bg text-error'
                  : selectedStatus === 'DISPATCHED'
                  ? 'bg-info-bg text-info'
                  : 'bg-warning-bg text-amber-700'
              }`}
            >
              Consignment: {selectedStatus}
            </span>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className={BTN.primary}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Tax Invoice PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
        {/* Consignment Live Tracking Stepper */}
        <div className="bg-white p-4 rounded border border-border">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange" />
              <h3 className="text-xs font-normal text-navy m-0">Consignment Dispatch & Live Tracking Timeline</h3>
            </div>
            <span className="text-[10px] text-text-muted font-mono">
              Waybill: {trackingNumber} • {carrierName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {ORDER_STEPS.map((step, idx) => {
              const isPastOrCurrent = currentStepIndex >= idx
              const isCurrent = currentStepIndex === idx
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded border transition ${
                    isCurrent
                      ? 'border-navy bg-navy/5'
                      : isPastOrCurrent
                      ? 'border-success/30 bg-success-bg/30'
                      : 'border-border bg-bg-section/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                        isPastOrCurrent
                          ? 'bg-success text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPastOrCurrent ? <Check className="w-3 h-3" /> : idx + 1}
                    </span>
                    <span className="text-[11px] font-normal text-navy">{step.label}</span>
                  </div>
                  <p className="text-[10px] text-text-muted m-0">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Items Ledger & Refund Desk */}
          <div className="lg:col-span-2 space-y-4">
            {/* Equipment Ledger */}
            <div className="bg-white rounded border border-border p-4">
              <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-info" />
                  <h3 className="text-xs font-normal text-navy m-0">Equipment & Line Items Ledger</h3>
                </div>
                <span className="text-[10px] text-text-muted">{order.items.length} Items</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-bg-section border-b border-border text-text-muted text-[10px] font-normal">
                    <tr>
                      <th className="py-2 px-3">Item Description</th>
                      <th className="py-2 px-3">Unit Price</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-bg-section/30">
                        <td className="py-2.5 px-3">
                          <div className="flex items-start gap-2.5">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-10 w-10 rounded object-cover border border-border shrink-0"
                            />
                            <div>
                              <span className="text-navy text-[11px] block">{item.title}</span>
                              <span className="text-[10px] text-text-muted">{item.brand} • Model: {item.model || 'Standard'}</span>
                              {item.serviceAddons && item.serviceAddons.length > 0 && (
                                <div className="mt-1 space-y-0.5">
                                  {item.serviceAddons.map((addon, idx) => (
                                    <div key={idx} className="flex items-center gap-1 text-[9px] text-purple">
                                      <ShieldCheck className="w-3 h-3" />
                                      <span>{addon.name} (+NPR {addon.priceNpr.toLocaleString()})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-text-dark">NPR {item.unitPriceNpr.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center text-navy font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-navy font-mono">
                          NPR {(item.unitPriceNpr * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="mt-3 border-t border-border pt-3 flex justify-end">
                <div className="w-64 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-text-muted">
                    <span>Taxable Subtotal:</span>
                    <span className="text-text-dark font-mono">NPR {order.subtotalNpr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Nepal VAT (13%):</span>
                    <span className="text-text-dark font-mono">NPR {order.vatNpr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Medical Freight:</span>
                    <span className="text-text-dark font-mono">NPR {order.shippingNpr.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-xs text-navy font-normal">
                    <span>Total Amount:</span>
                    <span className="text-navy font-mono">NPR {order.totalAmountNpr.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Institutional Refund & RMA Desk */}
            <div className="bg-white rounded border border-border p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-error" />
                  <h3 className="text-xs font-normal text-navy m-0">Institutional RMA & Refund Desk</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-bg-section text-text-muted border border-border">
                  {order.status === 'REFUND_REQUESTED' ? 'Pending Claim Review' : 'Voucher Desk'}
                </span>
              </div>

              {refundSuccessMsg && (
                <div className="rounded border border-success/30 bg-success-bg p-2.5 text-[11px] text-success flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{refundSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleRefundSubmit} className="space-y-3 text-[11px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-text-muted mb-1">Refund / Return Reason</label>
                    <select
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                    >
                      <option value="Defective Sensor / RMA Return">Defective Sensor / RMA Return</option>
                      <option value="Client Cancelled Before Dispatch">Client Cancelled Before Dispatch</option>
                      <option value="Hospital Tender Specifications Mismatch">Hospital Tender Specifications Mismatch</option>
                      <option value="Transit Damage during Cargo Transport">Transit Damage during Cargo Transport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-text-muted mb-1">Restocking & Logistics Fee (NPR)</label>
                    <input
                      type="number"
                      value={restockingFeeNpr}
                      onChange={(e) => setRestockingFeeNpr(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted mb-1">BMET Return Inspection Findings</label>
                  <textarea
                    rows={2}
                    placeholder="Enter inspection findings, calibration seal status..."
                    value={refundNotes}
                    onChange={(e) => setRefundNotes(e.target.value)}
                    className="w-full p-2 border border-border rounded outline-none focus:border-navy text-text-dark"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <span className="text-text-muted text-[10px] block">Net Payable to Hospital:</span>
                    <span className="text-sm font-normal text-error font-mono">
                      NPR {netRefundPayable.toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className={BTN.danger}
                  >
                    Process Institutional Refund
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Fulfillment Controls & Customer Dossier */}
          <div className="space-y-4">
            {/* Fulfillment & Logistics Controls */}
            <div className="bg-white rounded border border-border p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2.5 text-navy">
                <Truck className="w-4 h-4 text-orange" />
                <h4 className="text-xs font-normal m-0">Fulfillment & Carrier Status</h4>
              </div>

              {statusUpdatedFeedback && (
                <div className="p-2 rounded bg-success-bg border border-success/30 text-success text-[10px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Consignment details successfully updated!</span>
                </div>
              )}

              <div className="space-y-2.5 text-[11px]">
                <div>
                  <label className="block text-text-muted mb-1">Consignment Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  >
                    <option value="PAID_CONFIRMED">PAID &amp; CONFIRMED</option>
                    <option value="PROCESSING">IN WAREHOUSE PROCESSING</option>
                    <option value="DISPATCHED">DISPATCHED IN TRANSIT</option>
                    <option value="DELIVERED">DELIVERED TO HOSPITAL</option>
                    <option value="REFUND_REQUESTED">REFUND REQUESTED</option>
                    <option value="REFUNDED">REFUNDED &amp; CLOSED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Logistics Carrier Name</label>
                  <input
                    type="text"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark"
                  />
                </div>

                <div>
                  <label className="block text-text-muted mb-1">Tracking Waybill #</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    className={`${BTN.primary} w-full justify-center`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Delivery Status</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hospital Customer Card */}
            <div className="bg-white rounded border border-border p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2.5 text-navy">
                <Building2 className="w-4 h-4 text-info" />
                <h4 className="text-xs font-normal m-0">Hospital Customer Profile</h4>
              </div>

              <div className="space-y-2 text-[11px] text-text-body">
                <div>
                  <span className="text-text-muted block text-[10px]">Client / Organization:</span>
                  <span className="text-navy block font-normal">{order.customer.name}</span>
                  <span className="text-text-dark">{order.customer.organization}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span className="text-text-muted">PAN / VAT:</span>
                  <span className="font-mono text-navy">{order.customer.panVatNumber || '300184920'}</span>
                </div>

                <div className="flex items-center gap-2 border-t border-border/50 pt-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-light shrink-0" />
                  <span>{order.customer.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-text-light shrink-0" />
                  <span className="truncate">{order.customer.email}</span>
                </div>

                <div className="flex items-start gap-2 border-t border-border/50 pt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-text-light shrink-0 mt-0.5" />
                  <span>{order.customer.address}, {order.customer.city}, Nepal</span>
                </div>
              </div>
            </div>

            {/* Payment & IRD Invoice Summary */}
            <div className="bg-white rounded border border-border p-4 space-y-2.5">
              <div className="flex items-center gap-2 border-b border-border pb-2 text-navy">
                <CreditCard className="w-4 h-4 text-success" />
                <h4 className="text-xs font-normal m-0">Payment &amp; IRD Settlement</h4>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Payment Mode:</span>
                  <span className="text-navy">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Transaction ID:</span>
                  <span className="font-mono text-text-dark">{order.transactionRef || 'TXN-98412'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Settlement Ref:</span>
                  <span className="font-mono text-text-dark">MB-SET-2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
