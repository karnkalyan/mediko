import { useState } from 'react'
import {
  X,
  FileDown,
  Plus,
  Trash2,
  Building2,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { formatNPR } from '../lib/utils'
import { generateQuotationPDF, generateProformaInvoicePDF } from '../lib/pdfGenerator'
import { PRODUCTS } from '../data/products'

export interface QuoteLineItem {
  id: string
  description: string
  brand: string
  model: string
  hsnCode: string
  quantity: number
  unitPriceNpr: number
  warranty: string
  totalNpr: number
}

interface QuotationBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'quotation' | 'proforma'
  onSaveQuote?: (quoteData: any) => void
  initialEnquiry?: {
    id?: number
    customerName?: string
    organization?: string
    phone?: string
    productTitle?: string
    targetPrice?: number
    quantity?: number
  } | null
}

export default function QuotationBuilderModal({
  isOpen,
  onClose,
  initialMode = 'quotation',
  onSaveQuote,
  initialEnquiry,
}: QuotationBuilderModalProps) {
  if (!isOpen) return null

  const [docType, setDocType] = useState<'quotation' | 'proforma'>(initialMode)

  // Document Meta
  const [docNumber, setDocNumber] = useState(() =>
    initialMode === 'quotation'
      ? `QTE-2026-${Math.floor(1000 + Math.random() * 9000)}`
      : `PI-2026-${Math.floor(1000 + Math.random() * 9000)}`
  )
  const [docDate, setDocDate] = useState(() => new Date().toISOString().split('T')[0])
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split('T')[0]
  })
  const [paymentTerms, setPaymentTerms] = useState('100% Bank LC / Escrow Prior to Dispatch')
  const [deliveryLeadTime, setDeliveryLeadTime] = useState('7 - 14 Business Days')

  // Vendor / Issuer
  const [vendorName, setVendorName] = useState('MediTech Solutions Pvt. Ltd.')
  const [vendorPan, setVendorPan] = useState('601248991')
  const [vendorPhone, setVendorPhone] = useState('+977 1-4491200 / 9851099887')

  // Hospital / Client
  const [hospitalName, setHospitalName] = useState(
    initialEnquiry?.organization || 'Bir Hospital (ICU & Critical Care Division)'
  )
  const [clientContact, setClientContact] = useState(initialEnquiry?.customerName || 'Dr. Ramesh Karki')
  const [clientPhone] = useState(initialEnquiry?.phone || '+977 9851099887')
  const [clientAddress] = useState('Mahakantipur, Kathmandu')
  const [clientPan, setClientPan] = useState('601289123')

  // Line items
  const [items, setItems] = useState<QuoteLineItem[]>(() => {
    if (initialEnquiry?.productTitle) {
      return [
        {
          id: 'item_1',
          description: initialEnquiry.productTitle,
          brand: 'Mindray',
          model: 'MEC-1200 Pro',
          hsnCode: '9018.19.00',
          quantity: initialEnquiry.quantity || 1,
          unitPriceNpr: initialEnquiry.targetPrice || 285000,
          warranty: '2 Years Comprehensive AMC Included',
          totalNpr: (initialEnquiry.targetPrice || 285000) * (initialEnquiry.quantity || 1),
        },
      ]
    }
    return [
      {
        id: 'item_1',
        description: 'Mindray MEC-1200 Patient Monitor (12.1" TFT Touchscreen)',
        brand: 'Mindray',
        model: 'MEC-1200',
        hsnCode: '9018.19.00',
        quantity: 2,
        unitPriceNpr: 285000,
        warranty: '2 Years Comprehensive AMC Included',
        totalNpr: 570000,
      },
      {
        id: 'item_2',
        description: 'Biomedical Installation, Calibration & Onsite Training',
        brand: 'Mediko Services',
        model: 'BIO-INST-01',
        hsnCode: '9987.19.00',
        quantity: 2,
        unitPriceNpr: 15000,
        warranty: 'Standard Certification',
        totalNpr: 30000,
      },
    ]
  })

  // Financial calculations
  const [discountPercent, setDiscountPercent] = useState(5)
  const [includeVat, setIncludeVat] = useState(true)
  const [transportFee, setTransportFee] = useState(3500)

  const rawSubtotal = items.reduce((sum, item) => sum + item.totalNpr, 0)
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100)
  const netSubtotal = rawSubtotal - discountAmount
  const vatAmount = includeVat ? Math.round(netSubtotal * 0.13) : 0
  const grandTotal = netSubtotal + vatAmount + transportFee

  const handleUpdateItem = (id: string, field: keyof QuoteLineItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'unitPriceNpr') {
            updated.totalNpr = (Number(updated.quantity) || 0) * (Number(updated.unitPriceNpr) || 0)
          }
          return updated
        }
        return item
      })
    )
  }

  const handleAddItem = () => {
    const newItem: QuoteLineItem = {
      id: `item_${Date.now()}`,
      description: 'Medical Instrument / Sensor Probe Accessories',
      brand: 'Standard Biomedical',
      model: 'GEN-2026',
      hsnCode: '9018.90.00',
      quantity: 1,
      unitPriceNpr: 45000,
      warranty: '1 Year Warranty',
      totalNpr: 45000,
    }
    setItems([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return
    setItems(items.filter((item) => item.id !== id))
  }

  const handleQuickAddFromCatalog = (product: any) => {
    const newItem: QuoteLineItem = {
      id: `item_${Date.now()}`,
      description: product.title,
      brand: product.brand,
      model: product.model || 'Standard',
      hsnCode: '9018.19.00',
      quantity: 1,
      unitPriceNpr: product.price || 150000,
      warranty: '1 Year Manufacturer Warranty',
      totalNpr: product.price || 150000,
    }
    setItems([...items, newItem])
  }

  const handleGeneratePdf = () => {
    if (docType === 'quotation') {
      generateQuotationPDF({
        quoteNumber: docNumber,
        issueDate: docDate,
        validUntil,
        customerName: clientContact,
        customerOrg: hospitalName,
        customerPan: clientPan,
        customerPhone: clientPhone,
        deliveryLocation: clientAddress,
        items: items.map((i) => ({
          description: `${i.description} (${i.warranty})`,
          brandModel: `${i.brand} ${i.model}`,
          qty: i.quantity,
          unitPrice: i.unitPriceNpr,
          total: i.totalNpr,
        })),
        subtotal: netSubtotal,
        vatAmount,
        grandTotal,
        paymentTerms,
        notes: `Delivery Lead Time: ${deliveryLeadTime}. Vendor: ${vendorName} (PAN: ${vendorPan}).`,
      })
    } else {
      generateProformaInvoicePDF({
        proformaNumber: docNumber,
        issueDate: docDate,
        dueDate: validUntil,
        vendorBuyer: `${vendorName} (PAN: ${vendorPan})`,
        vendorPan,
        vendorPhone: vendorPhone,
        targetHospital: hospitalName,
        manufacturer: items[0]?.brand || 'Mindray Bio-Medical',
        originCountry: 'Germany / China (CE/FDA)',
        portDestination: 'TIA Cargo Complex, Kathmandu, Nepal',
        items: items.map((i) => ({
          description: `${i.description} [${i.brand} ${i.model}] (HS: ${i.hsnCode})`,
          qty: i.quantity,
          unitPrice: i.unitPriceNpr,
          total: i.totalNpr,
        })),
        baseEquipmentNpr: netSubtotal,
        internationalFreightNpr: transportFee,
        clearingAgentChargesNpr: 15000,
        adminCommissionNpr: 25000,
        customsDutyVatNpr: vatAmount,
        totalPayableNpr: grandTotal,
        bankBeneficiary: 'MediTech Solutions Pvt. Ltd.',
        bankAccountNumber: '01800175028912',
        bankName: 'Nabil Bank Ltd. (Tinkune Branch)',
        swiftCode: 'NARBNPKA',
        paymentTerms,
      })
    }
  }

  const handleSaveAndSubmit = () => {
    const payload = {
      docType,
      docNumber,
      docDate,
      validUntil,
      hospitalName,
      clientContact,
      clientPhone,
      clientPan,
      vendorName,
      items,
      subtotalNpr: netSubtotal,
      vatNpr: vatAmount,
      grandTotalNpr: grandTotal,
      paymentTerms,
    }

    if (onSaveQuote) onSaveQuote(payload)
    handleGeneratePdf()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange/10 p-2.5 text-orange">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-navy">
                  {docType === 'quotation' ? 'Enterprise B2B Quotation Desk' : 'Proforma Invoice (P/I) Generator'}
                </h3>
                <span className="rounded-full bg-orange/10 px-2.5 py-0.5 text-xs font-mono font-bold text-orange border border-orange/20">
                  {docNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Authorized Nepal Medical Equipment Quotation with IRD 13% VAT &amp; DDA Standard Terms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setDocType('quotation')
                  setDocNumber(`QTE-2026-${Math.floor(1000 + Math.random() * 9000)}`)
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  docType === 'quotation' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                }`}
              >
                Quotation
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocType('proforma')
                  setDocNumber(`PI-2026-${Math.floor(1000 + Math.random() * 9000)}`)
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  docType === 'proforma' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                }`}
              >
                Proforma Invoice (P/I)
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Vendor & Hospital Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor Details */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 text-xs">
              <span className="font-bold text-navy flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Issuing Licensed Vendor / Distributor
              </span>
              <div className="space-y-1.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Vendor Entity</label>
                  <select
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-navy outline-none"
                  >
                    <option value="MediTech Solutions Pvt. Ltd.">MediTech Solutions Pvt. Ltd. (PAN: 601248991)</option>
                    <option value="Himalayan Biomedical Importers">Himalayan Biomedical Importers (PAN: 600192841)</option>
                    <option value="BioMed Nepal Healthcare">BioMed Nepal Healthcare (PAN: 604918231)</option>
                    <option value="Mediko Bazaar Direct Procure">Mediko Bazaar Direct Procure (PAN: 609991244)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">PAN/VAT</label>
                    <input
                      value={vendorPan}
                      onChange={(e) => setVendorPan(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs text-navy outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Phone</label>
                    <input
                      value={vendorPhone}
                      onChange={(e) => setVendorPhone(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-navy outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hospital / Buyer Details */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 text-xs">
              <span className="font-bold text-navy flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                <Building2 className="w-4 h-4 text-orange" />
                Hospital / Buyer Institution
              </span>
              <div className="space-y-1.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500">Hospital / Clinic Name</label>
                  <input
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-navy outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Attention (Contact Person)</label>
                    <input
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-navy outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500">Hospital PAN/VAT</label>
                    <input
                      value={clientPan}
                      onChange={(e) => setClientPan(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs text-navy outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Terms Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600">Issue Date</label>
              <input
                type="date"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600">Delivery Lead Time</label>
              <input
                value={deliveryLeadTime}
                onChange={(e) => setDeliveryLeadTime(e.target.value)}
                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600">Payment Terms</label>
              <input
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs"
              />
            </div>
          </div>

          {/* Quick Insert from Featured Products */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Quick Add Catalog Items:</span>
            {PRODUCTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickAddFromCatalog(p)}
                className="shrink-0 flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-orange hover:text-orange transition cursor-pointer"
              >
                <Plus className="w-3 h-3" /> {p.title.split(' ').slice(0, 3).join(' ')} ({formatNPR(p.price || 0)})
              </button>
            ))}
          </div>

          {/* Line Items Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 grid grid-cols-12 gap-2">
              <span className="col-span-5">Equipment Description &amp; Technical Model</span>
              <span className="col-span-2">HSN / Custom</span>
              <span className="col-span-1 text-center">Qty</span>
              <span className="col-span-2 text-right">Unit Price (NPR)</span>
              <span className="col-span-2 text-right">Line Total</span>
            </div>

            <div className="divide-y divide-slate-100 p-2 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-slate-100 hover:border-slate-300">
                  <div className="col-span-5 space-y-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      placeholder="Equipment Title & Specs"
                      className="h-8 w-full rounded border border-slate-200 px-2 text-xs font-bold text-navy outline-none"
                    />
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <input
                        type="text"
                        value={item.brand}
                        onChange={(e) => handleUpdateItem(item.id, 'brand', e.target.value)}
                        placeholder="Brand (e.g. Mindray)"
                        className="h-6 rounded border border-slate-200 px-1.5"
                      />
                      <input
                        type="text"
                        value={item.warranty}
                        onChange={(e) => handleUpdateItem(item.id, 'warranty', e.target.value)}
                        placeholder="Warranty / AMC"
                        className="h-6 rounded border border-slate-200 px-1.5 text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      value={item.hsnCode}
                      onChange={(e) => handleUpdateItem(item.id, 'hsnCode', e.target.value)}
                      placeholder="9018.19.00"
                      className="h-8 w-full font-mono text-xs rounded border border-slate-200 px-2 outline-none"
                    />
                  </div>

                  <div className="col-span-1">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                      className="h-8 w-full text-center font-bold text-xs rounded border border-slate-200 px-1 outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.unitPriceNpr}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPriceNpr', Number(e.target.value))}
                      className="h-8 w-full font-mono text-right text-xs rounded border border-slate-200 px-2 outline-none"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-between pl-2">
                    <span className="font-mono font-bold text-xs text-navy">
                      {formatNPR(item.totalNpr)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-bold text-orange hover:text-orange-hover cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Line Item
              </button>
              <span className="text-xs text-slate-500">{items.length} line items listed</span>
            </div>
          </div>

          {/* Financial Calculation Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-navy flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-orange" />
                Institutional Discount &amp; Levies
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Institutional Discount (%)</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="h-8 w-20 rounded border border-slate-200 bg-white px-2 font-mono text-right font-bold"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => setIncludeVat(e.target.checked)}
                    className="rounded text-orange focus:ring-orange w-4 h-4"
                  />
                  <span className="text-slate-700 font-bold">Apply Nepal Inland Revenue 13% VAT</span>
                </label>
                <span className="font-mono font-bold text-slate-700">13%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Local Transport &amp; Handling (NPR)</span>
                <input
                  type="number"
                  value={transportFee}
                  onChange={(e) => setTransportFee(Number(e.target.value))}
                  className="h-8 w-24 rounded border border-slate-200 bg-white px-2 font-mono text-right"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Equipment Value</span>
                <span className="font-mono font-semibold">{formatNPR(rawSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Special Discount ({discountPercent}%)</span>
                  <span className="font-mono font-semibold">- {formatNPR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Taxable Net Subtotal</span>
                <span className="font-mono font-semibold">{formatNPR(netSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nepal 13% VAT</span>
                <span className="font-mono font-semibold">{formatNPR(vatAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transport &amp; Freight</span>
                <span className="font-mono font-semibold">{formatNPR(transportFee)}</span>
              </div>
              <div className="flex justify-between text-navy font-black text-sm border-t border-slate-300 pt-2">
                <span>Grand Total Final Quotation</span>
                <span className="font-mono text-orange text-lg">{formatNPR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Official Mediko Document Engine · Compatible with Nepal Public Procurement (PPMO) Format
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-navy hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGeneratePdf}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-navy hover:bg-slate-50 shadow-xs transition cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-orange" />
              <span>Download PDF Only</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndSubmit}
              className="flex items-center gap-1.5 rounded-xl bg-orange px-5 py-2 font-bold text-white hover:bg-orange-hover shadow-sm transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save &amp; Generate {docType === 'quotation' ? 'Quotation' : 'Proforma'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
