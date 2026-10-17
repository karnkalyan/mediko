export interface ImportQuote {
  quoteNumber: string
  issueDate: string
  validUntil: string
  baseEquipmentNpr: number
  estimatedFreightNpr: number
  estimatedCustomsNpr: number
  totalQuoteNpr: number
  deliveryTerms: string
  notes: string
}

export interface ProformaInvoice {
  proformaNumber: string
  issueDate: string
  dueDate: string
  equipmentBasePriceNpr: number
  internationalFreightNpr: number
  clearingAgentChargesNpr: number
  adminCommissionNpr: number
  customsDutyVatNpr: number
  totalPayableNpr: number
  bankBeneficiary: string
  bankAccountNumber: string
  swiftCode: string
  paymentTerms: string
}

export interface VendorPaymentDetails {
  paymentMode: 'BANK_LC' | 'SWIFT_TRANSFER' | 'BANK_ESCROW' | 'ESEWA_CORPORATE'
  referenceNumber: string
  bankName: string
  paymentDate: string
  receiptNote?: string
}

export interface PackagingDeliveryDetails {
  packagingProtocol: string
  crateDimensionsWeight: string
  shockSensorSerial: string
  freightCarrier: string
  airwayBillNumber: string
  clearingAgentName: string
  clearingAgentPhone: string
  customsPort: string
  dispatchDate: string
  estimatedDeliveryDate: string
  status: string
  freightChargesNpr?: number
  agentChargesNpr?: number
  adminCommissionNpr?: number
}

export type ImportRequestStatus =
  | 'PENDING_ADMIN_QUOTE'
  | 'QUOTE_SENT'
  | 'PROFORMA_REQUESTED'
  | 'PROFORMA_ISSUED'
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_CONFIRMED_DISPATCHED'

export interface ImportRequestItem {
  id: string
  requestNumber: string
  productTitle: string
  sellerManufacturer: string
  originCountry: string
  category: string
  quantity: number
  targetHospital: string
  deliveryCity: string
  vendorName: string
  vendorPan: string
  vendorPhone: string
  requestDate: string
  status: ImportRequestStatus
  notes?: string
  quote?: ImportQuote
  proforma?: ProformaInvoice
  payment?: VendorPaymentDetails
  delivery?: PackagingDeliveryDetails
}

const STORAGE_KEY = 'mediko_b2b_import_requests'

const INITIAL_IMPORT_REQUESTS: ImportRequestItem[] = [
  {
    id: 'IMP-2026-101',
    requestNumber: 'REQ-IMP-9841',
    productTitle: 'GE CARESCAPE B650 Bedside Monitor with PDM Module',
    sellerManufacturer: 'GE Healthcare Global (USA / Japan)',
    originCountry: 'United States',
    category: 'Patient Monitoring',
    quantity: 2,
    targetHospital: 'Bir Hospital (ICU Wing)',
    deliveryCity: 'Kathmandu Metropolitan',
    vendorName: 'MediTech Solutions Pvt. Ltd.',
    vendorPan: '601248991',
    vendorPhone: '+977 9851099887',
    requestDate: '2026-09-05',
    status: 'PROFORMA_ISSUED',
    notes: 'Urgent ICU expansion request. Vendor requests Mediko Admin to manage import and clearing.',
    quote: {
      quoteNumber: 'QTE-MED-8821',
      issueDate: '2026-09-06',
      validUntil: '2026-09-20',
      baseEquipmentNpr: 1850000,
      estimatedFreightNpr: 95000,
      estimatedCustomsNpr: 120000,
      totalQuoteNpr: 2065000,
      deliveryTerms: 'CIP Tribhuvan International Airport Cargo, Kathmandu',
      notes: 'Includes manufacturer export crating and 1-year international warranty.',
    },
    proforma: {
      proformaNumber: 'PI-MED-2026-4412',
      issueDate: '2026-09-07',
      dueDate: '2026-09-14',
      equipmentBasePriceNpr: 1850000,
      internationalFreightNpr: 92000,
      clearingAgentChargesNpr: 38000,
      adminCommissionNpr: 74000,
      customsDutyVatNpr: 254800,
      totalPayableNpr: 2308800,
      bankBeneficiary: 'Mediko Bazaar Enterprise Pvt. Ltd.',
      bankAccountNumber: '00100488219002 (Nepal Bank Ltd)',
      swiftCode: 'NEBLNPKT',
      paymentTerms: '100% Escrow LC or Swift Wire before port clearance',
    },
  },
  {
    id: 'IMP-2026-102',
    requestNumber: 'REQ-IMP-9842',
    productTitle: 'Mindray Resona 7 Premium Diagnostic Ultrasound System',
    sellerManufacturer: 'Mindray Bio-Medical Electronics Co., Shenzhen',
    originCountry: 'China',
    category: 'Radiology & Imaging',
    quantity: 1,
    targetHospital: 'Patan Hospital',
    deliveryCity: 'Lalitpur',
    vendorName: 'MediTech Solutions Pvt. Ltd.',
    vendorPan: '601248991',
    vendorPhone: '+977 9851099887',
    requestDate: '2026-09-06',
    status: 'QUOTE_SENT',
    notes: 'Hospital requested convex, linear, and phased array cardiac probes.',
    quote: {
      quoteNumber: 'QTE-MED-8822',
      issueDate: '2026-09-07',
      validUntil: '2026-09-21',
      baseEquipmentNpr: 3200000,
      estimatedFreightNpr: 110000,
      estimatedCustomsNpr: 220000,
      totalQuoteNpr: 3530000,
      deliveryTerms: 'DDP Hospital Site Patan (Includes Unloading & Calibration)',
      notes: 'Direct factory shipment with factory calibration certificate and NHPC installation.',
    },
  },
  {
    id: 'IMP-2026-103',
    requestNumber: 'REQ-IMP-9843',
    productTitle: 'Philips Respironics Trilogy Evo Portable Ventilator',
    sellerManufacturer: 'Philips Medical Systems (Netherlands)',
    originCountry: 'Netherlands',
    category: 'Respiratory Care',
    quantity: 3,
    targetHospital: 'Teaching Hospital (TUTH)',
    deliveryCity: 'Kathmandu',
    vendorName: 'MediTech Solutions Pvt. Ltd.',
    vendorPan: '601248991',
    vendorPhone: '+977 9851099887',
    requestDate: '2026-09-07',
    status: 'PENDING_ADMIN_QUOTE',
    notes: 'Awaiting Admin liaison with European distributor for bulk discount pricing.',
  },
  {
    id: 'IMP-2026-104',
    requestNumber: 'REQ-IMP-9840',
    productTitle: 'Siemens Mobilett Mira Max Digital Mobile X-Ray',
    sellerManufacturer: 'Siemens Healthineers (Germany)',
    originCountry: 'Germany',
    category: 'Radiology & Imaging',
    quantity: 1,
    targetHospital: 'Grande International Hospital',
    deliveryCity: 'Dhapasi, Kathmandu',
    vendorName: 'MediTech Solutions Pvt. Ltd.',
    vendorPan: '601248991',
    vendorPhone: '+977 9851099887',
    requestDate: '2026-09-02',
    status: 'PAYMENT_CONFIRMED_DISPATCHED',
    notes: 'High-frequency digital mobile X-ray for OT & ICU orthopedic imaging.',
    quote: {
      quoteNumber: 'QTE-MED-8819',
      issueDate: '2026-09-03',
      validUntil: '2026-09-17',
      baseEquipmentNpr: 4500000,
      estimatedFreightNpr: 180000,
      estimatedCustomsNpr: 350000,
      totalQuoteNpr: 5030000,
      deliveryTerms: 'CIP Tribhuvan International Airport Cargo',
      notes: 'German export crating with certified radiation shielding.',
    },
    proforma: {
      proformaNumber: 'PI-MED-2026-4408',
      issueDate: '2026-09-04',
      dueDate: '2026-09-10',
      equipmentBasePriceNpr: 4500000,
      internationalFreightNpr: 175000,
      clearingAgentChargesNpr: 45000,
      adminCommissionNpr: 135000,
      customsDutyVatNpr: 618800,
      totalPayableNpr: 5473800,
      bankBeneficiary: 'Mediko Bazaar Enterprise Pvt. Ltd.',
      bankAccountNumber: '00100488219002 (Nepal Bank Ltd)',
      swiftCode: 'NEBLNPKT',
      paymentTerms: 'Bank LC Confirmed Irrevocable',
    },
    payment: {
      paymentMode: 'BANK_LC',
      referenceNumber: 'LC-NIBL-2026-90928',
      bankName: 'Nepal Investment Mega Bank Ltd.',
      paymentDate: '2026-09-05',
      receiptNote: 'Confirmed 100% LC Letter of Credit released to Mediko Escrow.',
    },
    delivery: {
      packagingProtocol: 'Heavy-Duty Moisture-Barrier Wooden Crate with TiltWatch & ShockWatch 2G Sensors',
      crateDimensionsWeight: '190cm × 110cm × 165cm · 420 kg Gross Weight',
      shockSensorSerial: 'SW-DE-99214',
      freightCarrier: 'Nepal Airlines Air Cargo (Flight RA-218 Frankfurt to KTM)',
      airwayBillNumber: 'AWB-285-9921482',
      clearingAgentName: 'Himalayan Freight & Customs Clearance Agency (TIA Cargo Complex)',
      clearingAgentPhone: '+977 9841223344 (Mr. Ramesh Karki)',
      customsPort: 'Tribhuvan International Airport Cargo Terminal, Kathmandu',
      dispatchDate: '2026-09-06',
      estimatedDeliveryDate: '2026-09-10',
      status: 'In Customs Transit - TIA Cargo Clearance Pending',
    },
  },
]

export function getImportRequests(): ImportRequestItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_IMPORT_REQUESTS))
      return INITIAL_IMPORT_REQUESTS
    }
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return INITIAL_IMPORT_REQUESTS
  } catch (e) {
    return INITIAL_IMPORT_REQUESTS
  }
}

export function saveImportRequests(items: ImportRequestItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error('Failed to save import requests to localStorage', e)
  }
}

export function createVendorImportRequest(req: {
  productTitle: string
  sellerManufacturer: string
  originCountry: string
  category: string
  quantity: number
  targetHospital: string
  deliveryCity: string
  notes?: string
}): ImportRequestItem {
  const all = getImportRequests()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const newReq: ImportRequestItem = {
    id: `IMP-2026-${randomNum}`,
    requestNumber: `REQ-IMP-${randomNum}`,
    productTitle: req.productTitle,
    sellerManufacturer: req.sellerManufacturer,
    originCountry: req.originCountry,
    category: req.category,
    quantity: req.quantity,
    targetHospital: req.targetHospital,
    deliveryCity: req.deliveryCity,
    vendorName: 'MediTech Solutions Pvt. Ltd.',
    vendorPan: '601248991',
    vendorPhone: '+977 9851099887',
    requestDate: new Date().toISOString().split('T')[0],
    status: 'PENDING_ADMIN_QUOTE',
    notes: req.notes,
  }
  all.unshift(newReq)
  saveImportRequests(all)
  return newReq
}

export function adminSendQuote(
  id: string,
  quote: {
    baseEquipmentNpr: number
    estimatedFreightNpr: number
    estimatedCustomsNpr: number
    deliveryTerms: string
    notes?: string
  }
): ImportRequestItem | null {
  const all = getImportRequests()
  const target = all.find((item) => item.id === id)
  if (!target) return null

  const randomQuoteNum = Math.floor(1000 + Math.random() * 9000)
  target.status = 'QUOTE_SENT'
  target.quote = {
    quoteNumber: `QTE-MED-${randomQuoteNum}`,
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    baseEquipmentNpr: quote.baseEquipmentNpr,
    estimatedFreightNpr: quote.estimatedFreightNpr,
    estimatedCustomsNpr: quote.estimatedCustomsNpr,
    totalQuoteNpr:
      quote.baseEquipmentNpr + quote.estimatedFreightNpr + quote.estimatedCustomsNpr,
    deliveryTerms: quote.deliveryTerms,
    notes: quote.notes || 'Includes manufacturer standard warranty and BMET calibration certificate.',
  }
  saveImportRequests(all)
  return target
}

export function vendorApproveQuoteAndRequestProforma(id: string): ImportRequestItem | null {
  const all = getImportRequests()
  const target = all.find((item) => item.id === id)
  if (!target) return null
  target.status = 'PROFORMA_REQUESTED'
  saveImportRequests(all)
  return target
}

export function adminIssueProformaInvoice(
  id: string,
  data: {
    equipmentBasePriceNpr: number
    internationalFreightNpr: number
    clearingAgentChargesNpr: number
    adminCommissionNpr: number
    customsDutyVatNpr: number
    paymentTerms: string
  }
): ImportRequestItem | null {
  const all = getImportRequests()
  const target = all.find((item) => item.id === id)
  if (!target) return null

  const randomPiNum = Math.floor(1000 + Math.random() * 9000)
  const total =
    data.equipmentBasePriceNpr +
    data.internationalFreightNpr +
    data.clearingAgentChargesNpr +
    data.adminCommissionNpr +
    data.customsDutyVatNpr

  target.status = 'PROFORMA_ISSUED'
  target.proforma = {
    proformaNumber: `PI-MED-2026-${randomPiNum}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    equipmentBasePriceNpr: data.equipmentBasePriceNpr,
    internationalFreightNpr: data.internationalFreightNpr,
    clearingAgentChargesNpr: data.clearingAgentChargesNpr,
    adminCommissionNpr: data.adminCommissionNpr,
    customsDutyVatNpr: data.customsDutyVatNpr,
    totalPayableNpr: total,
    bankBeneficiary: 'Mediko Bazaar Enterprise Pvt. Ltd.',
    bankAccountNumber: '00100488219002 (Nepal Bank Ltd)',
    swiftCode: 'NEBLNPKT',
    paymentTerms: data.paymentTerms,
  }
  saveImportRequests(all)
  return target
}

export function vendorSubmitPaymentConfirmation(
  id: string,
  payment: VendorPaymentDetails
): ImportRequestItem | null {
  const all = getImportRequests()
  const target = all.find((item) => item.id === id)
  if (!target) return null
  target.status = 'PAYMENT_SUBMITTED'
  target.payment = payment
  saveImportRequests(all)
  return target
}

export function adminConfirmPaymentAndDispatch(
  id: string,
  delivery: {
    packagingProtocol: string
    crateDimensionsWeight: string
    shockSensorSerial: string
    freightCarrier: string
    airwayBillNumber: string
    clearingAgentName: string
    clearingAgentPhone: string
    customsPort: string
    estimatedDeliveryDate: string
    freightChargesNpr?: number
    agentChargesNpr?: number
    adminCommissionNpr?: number
  }
): ImportRequestItem | null {
  const all = getImportRequests()
  const target = all.find((item) => item.id === id)
  if (!target) return null

  target.status = 'PAYMENT_CONFIRMED_DISPATCHED'
  target.delivery = {
    ...delivery,
    freightChargesNpr: delivery.freightChargesNpr || target.proforma?.internationalFreightNpr || 95000,
    agentChargesNpr: delivery.agentChargesNpr || target.proforma?.clearingAgentChargesNpr || 38000,
    adminCommissionNpr: delivery.adminCommissionNpr || target.proforma?.adminCommissionNpr || 74000,
    dispatchDate: new Date().toISOString().split('T')[0],
    status: 'Customs Clearance In Progress - Kathmandu TIA Cargo',
  }
  saveImportRequests(all)
  return target
}
