import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileDown,
  Building2,
  Save,
  Store,
  CheckCircle2,
  UserCheck,
} from 'lucide-react'
import { generateQuotationPDF, generateProformaInvoicePDF } from '../lib/pdfGenerator'

// Mediko standard button tokens
const BTN = {
  primary: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-light text-white rounded text-xs font-normal transition cursor-pointer',
  secondary: 'inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-white hover:bg-bg-section text-text-body rounded text-xs font-normal transition cursor-pointer',
  orange: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange hover:bg-orange-hover text-white rounded text-xs font-normal transition cursor-pointer',
  danger: 'inline-flex items-center gap-1.5 px-2.5 py-1 text-error hover:bg-error-bg rounded text-xs font-normal transition cursor-pointer',
}

export const PRESET_HOSPITALS = [
  {
    id: 'CUST-001',
    name: 'Dr. Ramesh Karki',
    organization: 'Bir Hospital (National Trauma Center)',
    panVatNumber: '301248991',
    address: 'Mahakantipur, Ward 11, Kathmandu, Nepal',
    phone: '+977 1-4221119',
    email: 'procurement@birhospital.gov.np',
  },
  {
    id: 'CUST-002',
    name: 'Dr. Subhash Acharya',
    organization: 'Tribhuvan University Teaching Hospital (TUTH)',
    panVatNumber: '300456123',
    address: 'Maharajgunj-03, Kathmandu, Nepal',
    phone: '+977 1-4412505',
    email: 'procurement@tuth.org.np',
  },
  {
    id: 'CUST-003',
    name: 'Anita Thapa',
    organization: 'Patan Hospital (PAHS)',
    panVatNumber: '300892114',
    address: 'Lagankhel, Lalitpur, Nepal',
    phone: '+977 1-5522295',
    email: 'biomedical@patanhospital.org.np',
  },
  {
    id: 'CUST-004',
    name: 'Dr. Chakra Raj Pandey',
    organization: 'Grande International Hospital',
    panVatNumber: '601289123',
    address: 'Dhapasi, Tokha, Kathmandu, Nepal',
    phone: '+977 1-5159266',
    email: 'info@grandehospital.com',
  },
  {
    id: 'CUST-005',
    name: 'Dr. Rajan Maharjan',
    organization: 'Nepal Mediciti Hospital',
    panVatNumber: '604218901',
    address: 'Bhaisepati, Lalitpur, Nepal',
    phone: '+977 1-4217766',
    email: 'procurement@nepalmediciti.com',
  },
  {
    id: 'CUST-006',
    name: 'Gopal Bhattarai',
    organization: 'Nepal Red Cross Society Central Transfusion',
    panVatNumber: '602189445',
    address: 'Red Cross Marg, Kalimati, Kathmandu',
    phone: '+977 1-4270650',
    email: 'bloodtransfusion@nrcs.org',
  },
]

export const PRESET_VENDORS = [
  {
    id: 'SEL-01',
    name: 'MediTech Solutions Pvt. Ltd.',
    panVatNumber: '601248991',
    address: 'Gairidhara-02, Kathmandu, Nepal',
    phone: '+977 1-4491200',
    email: 'sales@meditech.com.np',
  },
  {
    id: 'SEL-02',
    name: 'Mediko BioTech Pvt. Ltd. (Sole Partner)',
    panVatNumber: '600123456',
    address: 'New Baneshwar-31, Kathmandu, Nepal',
    phone: '+977 985-1117186',
    email: 'partners@medikobazaar.com',
  },
  {
    id: 'SEL-03',
    name: 'Global Medical Imports Nepal',
    panVatNumber: '602189441',
    address: 'New Baneshwar, Kathmandu, Nepal',
    phone: '+977 985-1122334',
    email: 'import@globalmed.com.np',
  },
  {
    id: 'SEL-04',
    name: 'Swiss Med Nepal Pvt. Ltd.',
    panVatNumber: '601982341',
    address: 'Durbarmarg, Kathmandu, Nepal',
    phone: '+977 1-4229988',
    email: 'info@swissmed.com.np',
  },
  {
    id: 'SEL-05',
    name: 'MediCare Nepal Direct',
    panVatNumber: '601182390',
    address: 'Teku-12, Kathmandu, Nepal',
    phone: '+977 1-4231890',
    email: 'direct@medicare.com.np',
  },
  {
    id: 'SEL-06',
    name: 'Spare Parts Nepal Depot',
    panVatNumber: '603847291',
    address: 'Kumaripati Biomedical Arcade, Lalitpur',
    phone: '+977 984-1827461',
    email: 'support@spareparts.com.np',
  },
]

interface QuotationStudioPageProps {
  onBack: () => void
  initialEnquiry?: any
  onSaveQuote?: (quoteData: any) => void
  existingCustomers?: any[]
  existingVendors?: any[]
}

export default function QuotationStudioPage({
  onBack,
  initialEnquiry,
  onSaveQuote,
  existingCustomers,
  existingVendors,
}: QuotationStudioPageProps) {
  const [docType, setDocType] = useState<'quotation' | 'proforma'>('quotation')
  const [docNumber, setDocNumber] = useState(
    initialEnquiry?.enquiryNumber
      ? `QT-${initialEnquiry.enquiryNumber}`
      : `MB-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  )
  const [validUntilDays, setValidUntilDays] = useState(14)

  // Merged customer list
  const allCustomers = useMemo(() => {
    const list = [...PRESET_HOSPITALS]
    if (existingCustomers && Array.isArray(existingCustomers)) {
      existingCustomers.forEach((c) => {
        if (!list.some((item) => item.organization === c.name || item.name === c.person)) {
          list.push({
            id: c.id || `CUST-${Math.random()}`,
            name: c.person || c.name,
            organization: c.name || c.affiliation,
            panVatNumber: c.pan || '300184920',
            address: c.address || 'Kathmandu, Nepal',
            phone: c.phone || '+977 1-4221119',
            email: c.email || 'procurement@hospital.gov.np',
          })
        }
      })
    }
    return list
  }, [existingCustomers])

  // Merged vendor list
  const allVendors = useMemo(() => {
    const list = [...PRESET_VENDORS]
    if (existingVendors && Array.isArray(existingVendors)) {
      existingVendors.forEach((v) => {
        if (!list.some((item) => item.name === v.name)) {
          list.push({
            id: v.id || `SEL-${Math.random()}`,
            name: v.name,
            panVatNumber: v.pan || '601248991',
            address: v.address || v.city || 'Kathmandu, Nepal',
            phone: v.phone || '+977 985-1110000',
            email: v.email || 'sales@vendor.com.np',
          })
        }
      })
    }
    return list
  }, [existingVendors])

  // Selected customer & vendor tracking
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(allCustomers[0]?.id || '')
  const [selectedVendorId, setSelectedVendorId] = useState<string>(allVendors[0]?.id || '')

  // Customer Information
  const [customer, setCustomer] = useState({
    name: initialEnquiry?.customer?.fullName || allCustomers[0]?.name || 'Dr. Ramesh Karki',
    organization: initialEnquiry?.customer?.organization || allCustomers[0]?.organization || 'Bir Hospital (National Trauma Center)',
    panVatNumber: allCustomers[0]?.panVatNumber || '301248991',
    address: allCustomers[0]?.address || 'Mahakantipur, Ward 11, Kathmandu, Nepal',
    phone: initialEnquiry?.customer?.phone || allCustomers[0]?.phone || '+977 1-4221119',
    email: initialEnquiry?.customer?.email || allCustomers[0]?.email || 'procurement@birhospital.gov.np',
  })

  // Supplying Vendor
  const [vendor, setVendor] = useState({
    name: allVendors[0]?.name || 'MediTech Solutions Pvt. Ltd.',
    panVatNumber: allVendors[0]?.panVatNumber || '601248991',
    address: allVendors[0]?.address || 'Gairidhara-02, Kathmandu, Nepal',
    phone: allVendors[0]?.phone || '+977 1-4491200',
  })

  // Handler for customer dropdown selection
  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id)
    const match = allCustomers.find((c) => c.id === id)
    if (match) {
      setCustomer({
        name: match.name,
        organization: match.organization,
        panVatNumber: match.panVatNumber,
        address: match.address,
        phone: match.phone,
        email: match.email,
      })
    }
  }

  // Handler for vendor dropdown selection
  const handleVendorSelect = (id: string) => {
    setSelectedVendorId(id)
    const match = allVendors.find((v) => v.id === id)
    if (match) {
      setVendor({
        name: match.name,
        panVatNumber: match.panVatNumber,
        address: match.address,
        phone: match.phone,
      })
    }
  }

  // Quotation Line Items
  const [items, setItems] = useState([
    {
      id: 'item_1',
      description: initialEnquiry?.title || 'Mindray MEC-1200 Multi-Parameter Patient Monitor',
      brandModel: 'Mindray MEC-1200 / 12.1" TFT Display',
      qty: initialEnquiry?.quantity || 2,
      unitPrice: initialEnquiry?.targetPrice || 285000,
    },
  ])

  // Terms & Conditions
  const [warrantyTerms, setWarrantyTerms] = useState(
    '2 Years Comprehensive On-Site Warranty including Bi-annual Biomedical PM Calibration.'
  )
  const [paymentTerms, setPaymentTerms] = useState(
    '30% Advance with Purchase Order, 70% upon delivery, installation and acceptance certificate.'
  )
  const [deliveryTimeline, setDeliveryTimeline] = useState(
    'Immediate dispatch from Central Kathmandu Warehouse (3-5 business days across Nepal).'
  )
  const [shippingFreight, setShippingFreight] = useState(3500)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (it.qty * it.unitPrice || 0), 0)
  const vatAmount = Math.round(subtotal * 0.13)
  const grandTotal = subtotal + vatAmount + Number(shippingFreight || 0)

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        description: 'Medical Equipment / Diagnostic Unit',
        brandModel: 'Standard ISO Model',
        qty: 1,
        unitPrice: 150000,
      },
    ])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return
    setItems(items.filter((it) => it.id !== id))
  }

  const handleUpdateItem = (id: string, field: string, val: any) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    )
  }

  const handleDownloadPdf = () => {
    const validUntilDate = new Date()
    validUntilDate.setDate(validUntilDate.getDate() + Number(validUntilDays))

    if (docType === 'quotation') {
      generateQuotationPDF({
        quoteNumber: docNumber,
        issueDate: new Date().toLocaleDateString('en-GB'),
        validUntil: validUntilDate.toLocaleDateString('en-GB'),
        customerName: customer.name,
        customerOrg: customer.organization,
        customerPan: customer.panVatNumber,
        customerPhone: customer.phone,
        deliveryLocation: customer.address,
        items: items.map((it) => ({
          description: it.description,
          brandModel: it.brandModel,
          qty: Number(it.qty),
          unitPrice: Number(it.unitPrice),
          total: Number(it.qty) * Number(it.unitPrice),
        })),
        subtotal: subtotal,
        freightAmount: shippingFreight,
        vatAmount: vatAmount,
        grandTotal: grandTotal,
        paymentTerms: paymentTerms,
        notes: `${warrantyTerms} — ${deliveryTimeline}`,
      })
    } else {
      generateProformaInvoicePDF({
        proformaNumber: docNumber,
        issueDate: new Date().toLocaleDateString('en-GB'),
        dueDate: validUntilDate.toLocaleDateString('en-GB'),
        vendorBuyer: customer.organization || customer.name,
        targetHospital: customer.organization,
        manufacturer: vendor.name,
        originCountry: 'Germany / Japan',
        portDestination: 'Tribhuvan International Airport (TIA Customs Desk)',
        items: items.map((it) => ({
          description: it.description,
          qty: Number(it.qty),
          unitPrice: Number(it.unitPrice),
          total: Number(it.qty) * Number(it.unitPrice),
        })),
        baseEquipmentNpr: subtotal,
        internationalFreightNpr: shippingFreight,
        clearingAgentChargesNpr: 2500,
        adminCommissionNpr: 0,
        customsDutyVatNpr: vatAmount,
        totalPayableNpr: grandTotal,
        bankBeneficiary: 'Mediko Bazaar Nepal Payment Account',
        bankAccountNumber: '01800175028912',
        bankName: 'Nabil Bank Ltd.',
        swiftCode: 'NABILNPKA',
        paymentTerms: paymentTerms,
      })
    }
  }

  const handleSave = () => {
    if (onSaveQuote) {
      onSaveQuote({
        docNumber,
        docType,
        customer,
        hospitalName: customer.organization,
        clientPan: customer.panVatNumber,
        items,
        subtotal,
        vatAmount,
        grandTotal,
        validUntil: `${validUntilDays} Days`,
        docDate: new Date().toLocaleDateString('en-GB'),
      })
    }
    setSaveSuccessMsg(`Official ${docType === 'quotation' ? 'Quotation' : 'Proforma'} #${docNumber} recorded!`)
  }

  return (
    <div className="min-h-screen bg-bg-light pb-12" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
      {/* Top Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-white px-4 lg:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className={BTN.secondary}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Quotations</span>
            </button>
            <div className="h-4 w-px bg-border" />
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <span>Quotation Desk</span>
                <span>/</span>
                <span className="font-mono text-text-dark">{docNumber}</span>
              </div>
              <h1 className="text-sm font-normal text-navy m-0">
                B2B Medical Quotation &amp; Proforma Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded border border-border bg-bg-section p-0.5">
              <button
                type="button"
                onClick={() => setDocType('quotation')}
                className={`px-2.5 py-1 text-xs rounded transition cursor-pointer font-normal ${
                  docType === 'quotation' ? 'bg-white text-navy shadow-xs border border-border' : 'text-text-muted hover:text-text-dark'
                }`}
              >
                Official Quotation
              </button>
              <button
                type="button"
                onClick={() => setDocType('proforma')}
                className={`px-2.5 py-1 text-xs rounded transition cursor-pointer font-normal ${
                  docType === 'proforma' ? 'bg-white text-navy shadow-xs border border-border' : 'text-text-muted hover:text-text-dark'
                }`}
              >
                Import Proforma
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className={BTN.orange}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={BTN.primary}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
        {saveSuccessMsg && (
          <div className="rounded border border-success/30 bg-success-bg p-2.5 text-xs text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main 2 Columns: Items & Terms */}
          <div className="lg:col-span-2 space-y-4">
            {/* Multi-Item Line Items Table */}
            <div className="bg-white rounded border border-border p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <h3 className="text-xs font-normal text-navy m-0">Itemized Equipment &amp; Tariffs</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Configure medical devices, specifications, quantities, and wholesale rates.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className={BTN.primary}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div key={it.id} className="p-3 bg-bg-section/60 rounded border border-border space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-muted">Item #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(it.id)}
                          className={BTN.danger}
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-text-muted block text-[10px] mb-1">Equipment Description *</label>
                        <input
                          type="text"
                          value={it.description}
                          onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-text-muted block text-[10px] mb-1">Brand &amp; Technical Model</label>
                        <input
                          type="text"
                          value={it.brandModel}
                          onChange={(e) => handleUpdateItem(it.id, 'brandModel', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-text-muted block text-[10px] mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={it.qty}
                          onChange={(e) => handleUpdateItem(it.id, 'qty', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-text-muted block text-[10px] mb-1">Unit Price (NPR)</label>
                        <input
                          type="number"
                          value={it.unitPrice}
                          onChange={(e) => handleUpdateItem(it.id, 'unitPrice', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-text-muted block text-[10px] mb-1">Line Total</label>
                        <div className="px-2.5 py-1.5 border border-border rounded bg-white text-navy font-mono">
                          NPR {(it.qty * it.unitPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations Summary */}
              <div className="border-t border-border pt-3 flex justify-end">
                <div className="w-64 space-y-1 text-[11px]">
                  <div className="flex justify-between text-text-muted">
                    <span>Taxable Subtotal:</span>
                    <span className="text-text-dark font-mono">NPR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Nepal VAT (13%):</span>
                    <span className="text-text-dark font-mono">NPR {vatAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Logistics / Freight:</span>
                    <span className="text-text-dark font-mono">NPR {shippingFreight.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-1.5 flex justify-between text-xs text-navy">
                    <span>Grand Total:</span>
                    <span className="text-navy font-mono font-normal">NPR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Card */}
            <div className="bg-white rounded border border-border p-4 space-y-3">
              <h3 className="text-xs font-normal text-navy border-b border-border pb-2 m-0">
                Commercial Terms &amp; Compliance Notes
              </h3>
              <div className="space-y-2 text-[11px]">
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Warranty &amp; Service Agreement</label>
                  <input
                    type="text"
                    value={warrantyTerms}
                    onChange={(e) => setWarrantyTerms(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Payment Terms</label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Logistics &amp; Delivery Timeline</label>
                  <input
                    type="text"
                    value={deliveryTimeline}
                    onChange={(e) => setDeliveryTimeline(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Customer Picker, Vendor Picker & Metadata */}
          <div className="space-y-4">
            {/* Document Metadata Card */}
            <div className="bg-white rounded border border-border p-4 space-y-2.5 text-[11px]">
              <h4 className="text-xs font-normal text-navy border-b border-border pb-2 m-0">
                Document Settings
              </h4>
              <div>
                <label className="block text-text-muted mb-1 text-[10px]">Reference Number</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Validity (Days)</label>
                  <input
                    type="number"
                    value={validUntilDays}
                    onChange={(e) => setValidUntilDays(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Freight (NPR)</label>
                  <input
                    type="number"
                    value={shippingFreight}
                    onChange={(e) => setShippingFreight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark"
                  />
                </div>
              </div>
            </div>

            {/* CUSTOMER PICKER & Hospital Card */}
            <div className="bg-white rounded border border-border p-4 space-y-3 text-[11px]">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-1.5 text-navy">
                  <Building2 className="w-4 h-4 text-sky-500" />
                  <h4 className="text-xs font-normal m-0">Hospital / Customer Client</h4>
                </div>
                <span className="text-[9px] text-text-muted">Database Selection</span>
              </div>

              {/* Quick Customer Picker Dropdown */}
              <div className="bg-sky-50/60 p-2.5 rounded border border-sky-100 space-y-1.5">
                <label className="block text-[10px] text-sky-900 font-normal flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-sky-600" /> Choose Registered Hospital:
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="w-full px-2 py-1.5 border border-sky-200 rounded text-[11px] text-navy bg-white outline-none focus:border-navy"
                >
                  <option value="">-- Choose Hospital from Database --</option>
                  {allCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.organization} ({c.name})
                    </option>
                  ))}
                  <option value="custom">+ Enter Custom Hospital Details</option>
                </select>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Contact Person / Doctor</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Hospital / Institution Name</label>
                  <input
                    type="text"
                    value={customer.organization}
                    onChange={(e) => setCustomer({ ...customer, organization: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-text-muted mb-1 text-[10px]">PAN / VAT Number</label>
                    <input
                      type="text"
                      value={customer.panVatNumber}
                      onChange={(e) => setCustomer({ ...customer, panVatNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[10px]">Phone Number</label>
                    <input
                      type="text"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Address / Department</label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
              </div>
            </div>

            {/* VENDOR PICKER & Supplying Entity Card */}
            <div className="bg-white rounded border border-border p-4 space-y-3 text-[11px]">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-1.5 text-navy">
                  <Store className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-normal m-0">Supplying Vendor / Partner</h4>
                </div>
                <span className="text-[9px] text-text-muted">Vendor Selection</span>
              </div>

              {/* Quick Vendor Picker Dropdown */}
              <div className="bg-emerald-50/60 p-2.5 rounded border border-emerald-100 space-y-1.5">
                <label className="block text-[10px] text-emerald-900 font-normal flex items-center gap-1">
                  <Store className="w-3 h-3 text-emerald-600" /> Choose Authorized Vendor:
                </label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => handleVendorSelect(e.target.value)}
                  className="w-full px-2 py-1.5 border border-emerald-200 rounded text-[11px] text-navy bg-white outline-none focus:border-navy"
                >
                  <option value="">-- Choose Vendor from Database --</option>
                  {allVendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                  <option value="custom">+ Enter Custom Vendor Details</option>
                </select>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Vendor Legal Name</label>
                  <input
                    type="text"
                    value={vendor.name}
                    onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-text-muted mb-1 text-[10px]">Vendor PAN / VAT</label>
                    <input
                      type="text"
                      value={vendor.panVatNumber}
                      onChange={(e) => setVendor({ ...vendor, panVatNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-text-muted mb-1 text-[10px]">Phone Number</label>
                    <input
                      type="text"
                      value={vendor.phone}
                      onChange={(e) => setVendor({ ...vendor, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-text-muted mb-1 text-[10px]">Registered Address</label>
                  <input
                    type="text"
                    value={vendor.address}
                    onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
