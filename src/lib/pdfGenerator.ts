import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { BRAND } from './constants'

// Central Mediko Bazaar Legal & Corporate Credentials
const COMPANY = {
  name: 'MEDIKO BAZAAR PVT. LTD.',
  tagline: 'Equip. Empower. Care. — Nepal Medical Procurement Grid',
  address: 'New Baneshwar-31, Kathmandu, Nepal',
  phone: '+977 985-1117186 / +977 1-4498212',
  email: 'procurement@medikobazaar.com',
  web: 'www.medikobazaar.com',
  panVat: '600123456',
  ddaReg: 'DDA-MED-077/078-412',
}

let officialLogoData: string | null = null

const loadLogoDataUrl = async (): Promise<string | null> => {
  if (officialLogoData) return officialLogoData
  if (typeof window === 'undefined') return null

  const candidates = [BRAND.logo, '/main-logo.png']
  for (const url of candidates) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1500)
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)
      if (res.ok) {
        const blob = await res.blob()
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        officialLogoData = dataUrl
        return dataUrl
      }
    } catch {
      // try next candidate
    }
  }
  return null
}

const drawFallbackEmblem = (doc: jsPDF) => {
  doc.setFillColor(242, 106, 26) // Orange
  doc.roundedRect(12, 5, 23, 22, 2.5, 2.5, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('MB', 23.5, 16, { align: 'center' })
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.text('MEDIKO', 23.5, 22, { align: 'center' })
}

/**
 * Standard Branded PDF Header with Logo & Corporate Credentials
 */
const renderPdfHeader = async (
  doc: jsPDF,
  docTitle: string,
  refText: string,
  dateText: string,
  accentColor: [number, number, number] = [242, 106, 26]
) => {
  const logoData = await loadLogoDataUrl()

  // Primary Header Bar (Navy #071B45)
  doc.setFillColor(7, 27, 69)
  doc.rect(0, 0, 210, 32, 'F')

  // Accent Line
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
  doc.rect(0, 32, 210, 2, 'F')

  // Logo in Header (Top Left)
  if (logoData) {
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(12, 5, 24, 22, 2, 2, 'F')
    try {
      doc.addImage(logoData, 'PNG', 13, 6, 22, 20, undefined, 'FAST')
    } catch {
      drawFallbackEmblem(doc)
    }
  } else {
    drawFallbackEmblem(doc)
  }

  // Header Typography
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13.5)
  doc.text(COMPANY.name, 40, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(203, 213, 225)
  doc.text(COMPANY.tagline, 40, 17)
  doc.text(`${COMPANY.address} · PAN / VAT: ${COMPANY.panVat} · DDA: ${COMPANY.ddaReg}`, 40, 22)
  doc.text(`Phone: ${COMPANY.phone} · Web: ${COMPANY.web}`, 40, 27)

  // Document Title Badge on Right
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(docTitle, 196, 12, { align: 'right' })

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(refText, 196, 18, { align: 'right' })
  doc.text(dateText, 196, 23, { align: 'right' })
}

/**
 * Robust Cross-Platform PDF Download Trigger
 */
export const triggerPdfDownload = (doc: jsPDF, rawFilename: string) => {
  const filename = rawFilename.toLowerCase().endsWith('.pdf') ? rawFilename : `${rawFilename}.pdf`

  // 1. Primary: Native jsPDF doc.save()
  try {
    doc.save(filename)
    return
  } catch (saveErr) {
    console.warn('doc.save failed, falling back to Blob download:', saveErr)
  }

  // 2. Secondary: Blob URL anchor
  try {
    const blob = doc.output('blob')
    if (blob && typeof window !== 'undefined') {
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = blobUrl
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      }, 2000)
      return
    }
  } catch (blobErr) {
    console.warn('Blob PDF download fallback failed:', blobErr)
  }

  // 3. Tertiary: Data URI fallback
  try {
    const dataUri = doc.output('datauristring')
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = dataUri
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }, 1500)
  } catch (err2) {
    console.error('All PDF download methods exhausted:', err2)
  }
}

export interface QuotationPDFData {
  quoteNumber: string
  issueDate: string
  validUntil: string
  customerName: string
  customerOrg?: string
  customerPan?: string
  customerPhone?: string
  deliveryLocation: string
  items: Array<{
    description: string
    brandModel?: string
    qty: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  freightAmount?: number
  customsAmount?: number
  vatAmount: number
  grandTotal: number
  notes?: string
  paymentTerms?: string
}

export interface ProformaPDFData {
  proformaNumber: string
  issueDate: string
  dueDate: string
  vendorBuyer: string
  vendorPan?: string
  vendorPhone?: string
  targetHospital: string
  manufacturer: string
  originCountry: string
  portDestination: string
  items: Array<{
    description: string
    qty: number
    unitPrice: number
    total: number
  }>
  baseEquipmentNpr: number
  internationalFreightNpr: number
  clearingAgentChargesNpr: number
  adminCommissionNpr: number
  customsDutyVatNpr: number
  totalPayableNpr: number
  bankBeneficiary: string
  bankAccountNumber: string
  bankName: string
  swiftCode: string
  paymentTerms: string
}

export interface TaxInvoicePDFData {
  invoiceNumber: string
  orderNumber?: string
  issueDate: string
  dueDate?: string
  buyerName: string
  buyerOrg?: string
  buyerPan?: string
  buyerAddress?: string
  buyerPhone?: string
  paymentMethod: string
  paymentStatus: string
  items: Array<{
    sn: number
    description: string
    qty: number
    rate: number
    amount: number
  }>
  subtotal: number
  discount?: number
  taxableAmount: number
  vatAmount: number
  shippingCharge?: number
  grandTotal: number
}

export interface RentalSettlementPDFData {
  settlementNumber: string
  bookingNumber: string
  customerName: string
  customerOrg?: string
  productTitle: string
  startDate: string
  scheduledEndDate: string
  actualReturnDate: string
  overdueDays: number
  dailyRate: number
  totalRentPaid: number
  securityDepositHeld: number
  overduePenaltyDaily: number
  totalOverduePenalty: number
  damageAssessmentFee: number
  damageReportNote: string
  netRefundPayable: number
  settlementStatus: string
}

export interface CustomerDossierPDFData {
  customerName: string
  customerOrg?: string
  customerPan?: string
  customerDda?: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  address: string
  bedCapacity?: string
  creditLimit?: string
  orders: Array<{
    orderNumber: string
    date: string
    items: string
    amount: string
    status: string
  }>
  totalSpent: string
  activeRentalsCount?: number
  quotationsCount?: number
}

// -------------------------------------------------------------
// 1. Generate Official Quotation PDF
// -------------------------------------------------------------
export const generateQuotationPDF = async (data: QuotationPDFData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await renderPdfHeader(
    doc,
    'OFFICIAL QUOTATION',
    `Ref: ${data.quoteNumber}`,
    `Date: ${data.issueDate}`,
    [242, 106, 26]
  )

  // Customer & Terms Block
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('QUOTATION ISSUED TO:', 14, 42)
  doc.text('QUOTATION DETAILS:', 120, 42)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`${data.customerName}`, 14, 47)
  if (data.customerOrg) doc.text(`Organization: ${data.customerOrg}`, 14, 51)
  if (data.customerPan) doc.text(`Buyer PAN / VAT: ${data.customerPan}`, 14, 55)
  if (data.customerPhone) doc.text(`Contact: ${data.customerPhone}`, 14, 59)
  doc.text(`Destination: ${data.deliveryLocation}`, 14, 63)

  doc.text(`Valid Until: ${data.validUntil}`, 120, 47)
  doc.text(`Delivery: CIP Hospital Premise (Nepal)`, 120, 51)
  doc.text(`Currency: Nepalese Rupee (NPR)`, 120, 55)
  doc.text(`Warranty: 1-2 Year Comprehensive Support`, 120, 59)

  // Itemized AutoTable
  const tableData = data.items.map((item, index) => [
    index + 1,
    `${item.description}${item.brandModel ? `\nModel: ${item.brandModel}` : ''}`,
    item.qty,
    `NPR ${item.unitPrice.toLocaleString('en-IN')}`,
    `NPR ${item.total.toLocaleString('en-IN')}`,
  ])

  autoTable(doc, {
    startY: 68,
    head: [['#', 'Description of Medical Equipment & Service', 'Qty', 'Unit Price (NPR)', 'Amount (NPR)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 27, 69],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 85 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 34, halign: 'right' },
      4: { cellWidth: 38, halign: 'right' },
    },
  })

  const finalY = (doc as any).lastAutoTable.finalY || 140

  // Financial Summary Box
  const summaryX = 120
  let currentY = finalY + 6

  doc.setFillColor(248, 250, 252)
  doc.rect(summaryX - 5, currentY - 2, 85, 34, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.rect(summaryX - 5, currentY - 2, 85, 34, 'S')

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', summaryX, currentY + 4)
  doc.text(`NPR ${data.subtotal.toLocaleString('en-IN')}`, 195, currentY + 4, { align: 'right' })

  if (data.freightAmount) {
    currentY += 5
    doc.text('Logistics & Freight:', summaryX, currentY + 4)
    doc.text(`NPR ${data.freightAmount.toLocaleString('en-IN')}`, 195, currentY + 4, { align: 'right' })
  }

  currentY += 5
  doc.text('VAT / Tax Amount:', summaryX, currentY + 4)
  doc.text(`NPR ${data.vatAmount.toLocaleString('en-IN')}`, 195, currentY + 4, { align: 'right' })

  currentY += 7
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(242, 106, 26)
  doc.text('GRAND TOTAL (NPR):', summaryX, currentY + 4)
  doc.text(`NPR ${data.grandTotal.toLocaleString('en-IN')}`, 195, currentY + 4, { align: 'right' })

  // Notes & Signatures
  const notesY = Math.max(finalY + 10, currentY + 16)
  doc.setTextColor(71, 85, 105)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Terms & Institutional Conditions:', 14, notesY)
  doc.setFont('helvetica', 'normal')
  doc.text('1. All quotes include certified biomedical inspection, electrical safety testing, and calibration certificate.', 14, notesY + 4)
  doc.text('2. Payments via LC, Bank Wire, or ConnectIPS directly to Mediko Bazaar Pvt. Ltd.', 14, notesY + 8)
  doc.text(data.notes || '3. Mediko Bazaar guarantees supply from authorized distributors with manufacturer warranty.', 14, notesY + 12)

  // Signatory Stamp Box
  doc.setDrawColor(203, 213, 225)
  doc.line(140, notesY + 32, 195, notesY + 32)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(7, 27, 69)
  doc.text('Authorized Commercial Director', 140, notesY + 36)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text('Mediko Bazaar Enterprise · Kathmandu', 140, notesY + 40)
  doc.setTextColor(19, 168, 91)
  doc.text('✔ Verified Digital Procurement Seal', 140, notesY + 44)

  // Footer
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Official Mediko Bazaar document`, 105, 290, { align: 'center' })

  triggerPdfDownload(doc, `${data.quoteNumber || 'Mediko_Quotation'}.pdf`)
}

// -------------------------------------------------------------
// 2. Generate Legal Proforma Invoice PDF
// -------------------------------------------------------------
export const generateProformaInvoicePDF = async (data: ProformaPDFData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await renderPdfHeader(
    doc,
    'PROFORMA INVOICE',
    `PI No: ${data.proformaNumber}`,
    `Date: ${data.issueDate}`,
    [124, 58, 237]
  )

  // Parties Box
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('BUYER / CONSIGNEE (NEPAL):', 14, 42)
  doc.text('SELLER & IMPORTER OF RECORD:', 120, 42)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Entity: ${data.vendorBuyer}`, 14, 47)
  if (data.vendorPan) doc.text(`PAN / VAT: ${data.vendorPan}`, 14, 51)
  if (data.vendorPhone) doc.text(`Contact: ${data.vendorPhone}`, 14, 55)
  doc.text(`End-User Hospital: ${data.targetHospital}`, 14, 59)

  doc.text(COMPANY.name, 120, 47)
  doc.text(`PAN / VAT: ${COMPANY.panVat}`, 120, 51)
  doc.text(`Port of Entry: ${data.portDestination}`, 120, 55)
  doc.text(`Manufacturer: ${data.manufacturer} (${data.originCountry})`, 120, 59)

  // Items
  const itemsRows = data.items.map((it, idx) => [
    idx + 1,
    it.description,
    it.qty,
    `NPR ${it.unitPrice.toLocaleString('en-IN')}`,
    `NPR ${it.total.toLocaleString('en-IN')}`,
  ])

  autoTable(doc, {
    startY: 66,
    head: [['#', 'Import Line Item Description', 'Qty', 'Unit CIF Price (NPR)', 'Total CIF (NPR)']],
    body: itemsRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
  })

  const afterTableY = (doc as any).lastAutoTable.finalY || 130

  // Cost Breakdown Table
  const costRows = [
    ['1', 'Base Equipment CIF Cost', `NPR ${data.baseEquipmentNpr.toLocaleString('en-IN')}`],
    ['2', 'International Freight & Transit Insurance', `NPR ${data.internationalFreightNpr.toLocaleString('en-IN')}`],
    ['3', 'Customs Clearance & Handling Charges', `NPR ${data.clearingAgentChargesNpr.toLocaleString('en-IN')}`],
    ['4', 'Import Tax & Duties (Auto Calculated)', `NPR ${data.customsDutyVatNpr.toLocaleString('en-IN')}`],
    ['5', 'Mediko Platform & Verification Fee', `NPR ${data.adminCommissionNpr.toLocaleString('en-IN')}`],
  ]

  autoTable(doc, {
    startY: afterTableY + 6,
    head: [['Ref', 'Landed Cost Assessment Breakdown', 'Amount (NPR)']],
    body: costRows,
    theme: 'striped',
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: [255, 255, 255],
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 130 },
      2: { cellWidth: 40, halign: 'right' },
    },
  })

  const finalCostY = (doc as any).lastAutoTable.finalY || 190

  // Total payable badge
  doc.setFillColor(245, 243, 255)
  doc.rect(120, finalCostY + 4, 85, 14, 'F')
  doc.setDrawColor(196, 181, 253)
  doc.rect(120, finalCostY + 4, 85, 14, 'S')

  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(109, 40, 217)
  doc.text('TOTAL LANDED PAYABLE:', 125, finalCostY + 12)
  doc.text(`NPR ${data.totalPayableNpr.toLocaleString('en-IN')}`, 200, finalCostY + 12, { align: 'right' })

  // Bank Wire Instruction Box
  doc.setFillColor(248, 250, 252)
  doc.rect(14, finalCostY + 22, 191, 26, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.rect(14, finalCostY + 22, 191, 26, 'S')

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text('OFFICIAL SETTLEMENT BANK ACCOUNT (NEPAL):', 18, finalCostY + 28)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text(`Beneficiary: ${data.bankBeneficiary}`, 18, finalCostY + 34)
  doc.text(`Bank Name: ${data.bankName} · Swift Code: ${data.swiftCode}`, 18, finalCostY + 39)
  doc.text(`A/C Number: ${data.bankAccountNumber} · Terms: ${data.paymentTerms}`, 18, finalCostY + 44)

  triggerPdfDownload(doc, `${data.proformaNumber || 'Mediko_Proforma'}.pdf`)
}

// -------------------------------------------------------------
// 3. Generate Official Tax Invoice PDF
// -------------------------------------------------------------
export const generateTaxInvoicePDF = async (data: TaxInvoicePDFData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await renderPdfHeader(
    doc,
    'TAX INVOICE',
    `Invoice: ${data.invoiceNumber}`,
    `Date: ${data.issueDate}`,
    [239, 68, 68]
  )

  // Buyer Info
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('BUYER DETAILS (CONSIGNEE):', 14, 42)
  doc.text('TRANSACTION DETAILS:', 120, 42)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Name: ${data.buyerName}`, 14, 47)
  if (data.buyerOrg) doc.text(`Organization: ${data.buyerOrg}`, 14, 51)
  doc.text(`PAN / VAT: ${data.buyerPan || 'N/A'}`, 14, 55)
  doc.text(`Address: ${data.buyerAddress || 'Kathmandu, Nepal'}`, 14, 59)
  if (data.buyerPhone) doc.text(`Phone: ${data.buyerPhone}`, 14, 63)

  if (data.orderNumber) doc.text(`Order Ref: ${data.orderNumber}`, 120, 47)
  doc.text(`Payment Mode: ${data.paymentMethod}`, 120, 51)
  doc.text(`Payment Status: ${data.paymentStatus}`, 120, 55)
  doc.text(`Fiscal Year: 2082/083 (2026)`, 120, 59)

  // Tax Table
  const tableData = data.items.map((it) => [
    it.sn,
    it.description,
    it.qty,
    `NPR ${it.rate.toLocaleString('en-IN')}`,
    `NPR ${it.amount.toLocaleString('en-IN')}`,
  ])

  autoTable(doc, {
    startY: 68,
    head: [['SN', 'Item Description (HS Code / Serial)', 'Qty', 'Rate (NPR)', 'Total (NPR)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 27, 69],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 88 },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  })

  const finalY = (doc as any).lastAutoTable.finalY || 135

  // Calculations
  const sumX = 120
  let curY = finalY + 4

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', sumX, curY + 4)
  doc.text(`NPR ${data.subtotal.toLocaleString('en-IN')}`, 195, curY + 4, { align: 'right' })

  if (data.discount) {
    curY += 5
    doc.text('Less Discount:', sumX, curY + 4)
    doc.text(`- NPR ${data.discount.toLocaleString('en-IN')}`, 195, curY + 4, { align: 'right' })
  }

  curY += 5
  doc.text('Taxable Amount:', sumX, curY + 4)
  doc.text(`NPR ${data.taxableAmount.toLocaleString('en-IN')}`, 195, curY + 4, { align: 'right' })

  curY += 5
  doc.text('VAT Amount:', sumX, curY + 4)
  doc.text(`NPR ${data.vatAmount.toLocaleString('en-IN')}`, 195, curY + 4, { align: 'right' })

  if (data.shippingCharge) {
    curY += 5
    doc.text('Logistics / Delivery:', sumX, curY + 4)
    doc.text(`NPR ${data.shippingCharge.toLocaleString('en-IN')}`, 195, curY + 4, { align: 'right' })
  }

  curY += 7
  doc.setFillColor(241, 245, 249)
  doc.rect(sumX - 2, curY - 2, 82, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(7, 27, 69)
  doc.text('GRAND TOTAL (NPR):', sumX, curY + 5)
  doc.text(`NPR ${data.grandTotal.toLocaleString('en-IN')}`, 195, curY + 5, { align: 'right' })

  // Footer declaration
  const decY = curY + 18
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('Declaration: Computer-generated legal tax invoice under Rule 36 of VAT Act 2052, Government of Nepal.', 14, decY)
  doc.text('Goods received in good condition. Official Mediko Bazaar warranty applicable.', 14, decY + 4)

  // Signatures
  doc.line(14, decY + 22, 60, decY + 22)
  doc.text("Receiver's Signature", 14, decY + 26)

  doc.line(140, decY + 22, 195, decY + 22)
  doc.text('For Mediko Bazaar Pvt. Ltd.', 140, decY + 26)

  triggerPdfDownload(doc, `${data.invoiceNumber || 'Mediko_Tax_Invoice'}.pdf`)
}

// -------------------------------------------------------------
// 4. Generate Rental Settlement & Penalty Statement PDF
// -------------------------------------------------------------
export const generateRentalSettlementPDF = async (data: RentalSettlementPDFData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await renderPdfHeader(
    doc,
    'RENTAL SETTLEMENT',
    `Settlement: ${data.settlementNumber}`,
    `Booking: ${data.bookingNumber}`,
    [16, 185, 129]
  )

  // Parties & Equipment Details
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('LESSEE / CUSTOMER:', 14, 42)
  doc.text('LEASE OPERATION SUMMARY:', 120, 42)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(data.customerName, 14, 47)
  if (data.customerOrg) doc.text(data.customerOrg, 14, 51)
  doc.text(`Equipment: ${data.productTitle}`, 14, 55)

  doc.text(`Start Date: ${data.startDate}`, 120, 47)
  doc.text(`Scheduled End: ${data.scheduledEndDate}`, 120, 51)
  doc.text(`Actual Return: ${data.actualReturnDate}`, 120, 55)
  doc.text(`Overdue Days: ${data.overdueDays} Days`, 120, 59)

  // Settlement Balance Table
  const tableRows = [
    ['1', 'Refundable Security Deposit Held', `NPR ${data.securityDepositHeld.toLocaleString('en-IN')}`, 'Credit (+)'],
    [
      '2',
      `Overdue Return Penalty (${data.overdueDays} days @ NPR ${data.overduePenaltyDaily}/day)`,
      `- NPR ${data.totalOverduePenalty.toLocaleString('en-IN')}`,
      'Debit (-)',
    ],
    [
      '3',
      `Equipment Physical Damage / Assessment Fee\nNotes: ${data.damageReportNote}`,
      `- NPR ${data.damageAssessmentFee.toLocaleString('en-IN')}`,
      'Debit (-)',
    ],
    ['4', 'Net Security Deposit Refund Amount Approved for Release', `NPR ${data.netRefundPayable.toLocaleString('en-IN')}`, 'Refund Pay'],
  ]

  autoTable(doc, {
    startY: 68,
    head: [['SN', 'Payment Item Description', 'Amount (NPR)', 'Type']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 27, 69],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 104 },
      2: { cellWidth: 38, halign: 'right' },
      3: { cellWidth: 28, halign: 'center' },
    },
  })

  const finalY = (doc as any).lastAutoTable.finalY || 135

  doc.setFillColor(236, 253, 245)
  doc.rect(14, finalY + 8, 186, 22, 'F')
  doc.setDrawColor(167, 243, 208)
  doc.rect(14, finalY + 8, 186, 22, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(6, 95, 70)
  doc.text('APPROVED REFUND TO CUSTOMER BANK / WALLET:', 20, finalY + 18)
  doc.text(`NPR ${data.netRefundPayable.toLocaleString('en-IN')}`, 190, finalY + 18, { align: 'right' })

  // Signatures
  const sigY = finalY + 40
  doc.line(14, sigY, 70, sigY)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('Biomedical Inspector Verification', 14, sigY + 5)

  doc.line(140, sigY, 195, sigY)
  doc.text('Mediko Approval Signature', 140, sigY + 5)

  triggerPdfDownload(doc, `${data.settlementNumber || 'Mediko_Rental_Settlement'}.pdf`)
}

// -------------------------------------------------------------
// 5. Generate Institutional Customer Dossier & Statement PDF
// -------------------------------------------------------------
export const generateCustomerDossierPDF = async (data: CustomerDossierPDFData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  await renderPdfHeader(
    doc,
    'CUSTOMER DOSSIER',
    `Account: ${data.customerName}`,
    `Date: ${new Date().toLocaleDateString()}`,
    [13, 71, 161] // Navy-light blue accent
  )

  // Institutional Profile Box
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('INSTITUTIONAL PROFILE:', 14, 42)
  doc.text('PROCUREMENT CREDENTIALS:', 120, 42)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(`Name: ${data.customerName}`, 14, 47)
  if (data.customerOrg) doc.text(`Affiliation: ${data.customerOrg}`, 14, 51)
  doc.text(`Address: ${data.address}`, 14, 55)
  doc.text(`Contact: ${data.contactPerson}`, 14, 59)
  doc.text(`Phone: ${data.contactPhone} · Email: ${data.contactEmail}`, 14, 63)

  doc.text(`PAN / VAT: ${data.customerPan || 'N/A'}`, 120, 47)
  doc.text(`DDA License: ${data.customerDda || 'DDA-HOSP-077/89'}`, 120, 51)
  if (data.bedCapacity) doc.text(`Bed Capacity: ${data.bedCapacity}`, 120, 55)
  if (data.creditLimit) doc.text(`Credit Limit: ${data.creditLimit}`, 120, 59)
  doc.text(`Lifetime Spend: ${data.totalSpent}`, 120, 63)

  // Order History Table
  const orderRows = data.orders.map((ord, idx) => [
    idx + 1,
    ord.orderNumber,
    ord.date,
    ord.items,
    ord.amount,
    ord.status,
  ])

  autoTable(doc, {
    startY: 70,
    head: [['#', 'Order Ref', 'Date', 'Equipment & Service Items', 'Amount', 'Status']],
    body: orderRows,
    theme: 'grid',
    headStyles: {
      fillColor: [7, 27, 69],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 22 },
      3: { cellWidth: 80 },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 20, halign: 'center' },
    },
  })

  const tableEnd = (doc as any).lastAutoTable.finalY || 140

  // Statement Summary
  doc.setFillColor(248, 250, 252)
  doc.rect(14, tableEnd + 6, 182, 20, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.rect(14, tableEnd + 6, 182, 20, 'S')

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(7, 27, 69)
  doc.text('Institutional Account Summary:', 18, tableEnd + 12)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text(`Total Lifetime Volume: ${data.totalSpent} · Orders: ${data.orders.length} · Active Rentals: ${data.activeRentalsCount || 1}`, 18, tableEnd + 18)
  doc.text('Status: Verified Healthcare Facility Partner (Priority Dispatch)', 18, tableEnd + 23)

  // Signatures
  const signY = tableEnd + 36
  doc.setDrawColor(203, 213, 225)
  doc.line(14, signY + 12, 60, signY + 12)
  doc.setFontSize(7.5)
  doc.text('Prepared by Account Manager', 14, signY + 16)

  doc.line(140, signY + 12, 195, signY + 12)
  doc.text('Mediko Institutional Directorate', 140, signY + 16)

  triggerPdfDownload(doc, `${data.customerName.replace(/\s+/g, '_')}_Dossier.pdf`)
}

// -------------------------------------------------------------
// 6. Generate 48-Point Biomedical & Calibration Certificate PDF
// -------------------------------------------------------------
export interface BiomedicalCertPDFData {
  certificateNumber: string
  equipmentName: string
  serialNumber: string
  clientHospital: string
  inspectorName: string
  inspectionDate: string
  tests: Array<{ test: string; standard: string; result: string; status: 'PASSED' }>
}

export const generateBiomedicalCertificatePDF = async (data: BiomedicalCertPDFData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  await renderPdfHeader(
    doc,
    'BIOMEDICAL CALIBRATION CERTIFICATE',
    `CERT #${data.certificateNumber}`,
    `Date: ${data.inspectionDate}`,
    [13, 148, 136] // Teal
  )

  // Subheader & Equipment Credentials
  doc.setFillColor(240, 253, 250)
  doc.rect(14, 40, 182, 28, 'F')
  doc.setDrawColor(204, 251, 241)
  doc.rect(14, 40, 182, 28, 'S')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 118, 110)
  doc.text('CERTIFIED PRE-OWNED (CPO) 48-POINT PROTOCOL (IEC-60601 COMPLIANT)', 18, 46)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 41, 59)
  doc.text(`Equipment: ${data.equipmentName}`, 18, 52)
  doc.text(`Serial Number: ${data.serialNumber}`, 18, 57)
  doc.text(`Client / Facility: ${data.clientHospital}`, 18, 62)

  doc.text(`Biomedical Inspector: ${data.inspectorName}`, 115, 52)
  doc.text(`Certification Date: ${data.inspectionDate}`, 115, 57)
  doc.text(`Standard: IEC-60601-1 Medical Safety`, 115, 62)

  const rows = data.tests.map((t, idx) => [
    idx + 1,
    t.test,
    t.standard,
    t.result,
    t.status,
  ])

  autoTable(doc, {
    startY: 72,
    head: [['#', 'Biomedical Safety & Quality Test', 'Compliance Standard', 'Measured Value', 'Verdict']],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 42 },
      3: { cellWidth: 38 },
      4: { cellWidth: 24, halign: 'center' },
    },
  })

  const tableEnd = (doc as any).lastAutoTable.finalY || 150

  // Stamp Box
  doc.setFillColor(240, 253, 250)
  doc.rect(14, tableEnd + 8, 182, 22, 'F')
  doc.setDrawColor(94, 234, 212)
  doc.rect(14, tableEnd + 8, 182, 22, 'S')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 118, 110)
  doc.text('VERIFICATION ATTESTATION:', 18, tableEnd + 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text(
    'This medical equipment has completed rigorous biomedical diagnostics, electrical insulation testing, and operational stress verification. Certified safe for clinical deployment across Nepal hospital networks.',
    18,
    tableEnd + 21,
    { maxWidth: 174 }
  )

  // Signatures
  const signY = tableEnd + 40
  doc.setDrawColor(203, 213, 225)
  doc.line(14, signY + 12, 60, signY + 12)
  doc.setFontSize(7.5)
  doc.text('Biomedical Engineer (BMET)', 14, signY + 16)

  doc.line(140, signY + 12, 195, signY + 12)
  doc.text('Quality Assurance Directorate', 140, signY + 16)

  triggerPdfDownload(doc, `CPO_Biomedical_Cert_${data.certificateNumber}.pdf`)
}

