import prisma from '../config/db.js'

export class EnquiryQuoteService {
  static async getAllEnquiries(status) {
    const where = status ? { status } : {}
    return prisma.enquiry.findMany({
      where,
      include: { customer: true, product: true, landingCostEstimate: true, quotations: true },
      orderBy: { id: 'desc' },
    })
  }

  static async getEnquiryById(id) {
    return prisma.enquiry.findUnique({
      where: { id: Number(id) },
      include: { customer: true, product: true, landingCostEstimate: true, quotations: true, chatMessages: true },
    })
  }

  static async createEnquiry(data) {
    const enquiryNumber = `ENQ-${Date.now().toString().slice(-6)}`
    return prisma.enquiry.create({
      data: {
        enquiryNumber,
        customerId: Number(data.customerId || 1),
        productId: data.productId ? Number(data.productId) : null,
        enquiryType: data.enquiryType || 'RFQ',
        title: data.title || 'Product Sourcing / Price Enquiry',
        quantity: Number(data.quantity || 1),
        targetPrice: data.targetPrice ? Number(data.targetPrice) : null,
        countryOfOrigin: data.countryOfOrigin || '',
        shippingMode: data.shippingMode || 'AIR',
        destination: data.destination || 'Kathmandu, Nepal',
        hsCode: data.hsCode || '9018.90.00',
        notes: data.notes || '',
        status: 'NEW',
      },
      include: { product: true },
    })
  }

  static async updateEnquiryStatus(id, status) {
    return prisma.enquiry.update({
      where: { id: Number(id) },
      data: { status },
    })
  }

  // ---------------- Quotations ----------------
  static async getAllQuotations() {
    return prisma.quotation.findMany({
      include: { enquiry: { include: { customer: true, product: true } } },
      orderBy: { id: 'desc' },
    })
  }

  static async createQuotation({
    enquiryId,
    totalBaseAmount,
    freightAmount = 0,
    customsDuty = 0,
    vatAmount = 0,
    commission = 0,
    validityDays = 15,
    terms,
  }) {
    const quotationNumber = `QUO-${Date.now().toString().slice(-6)}`
    const grandTotal =
      Number(totalBaseAmount) +
      Number(freightAmount) +
      Number(customsDuty) +
      Number(vatAmount) +
      Number(commission)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + Number(validityDays))

    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        enquiryId: Number(enquiryId),
        totalBaseAmount: Number(totalBaseAmount),
        freightAmount: Number(freightAmount),
        customsDuty: Number(customsDuty),
        vatAmount: Number(vatAmount),
        commission: Number(commission),
        grandTotal,
        validityDays: Number(validityDays),
        expiresAt,
        status: 'SENT',
        terms: terms || 'Standard Nepal commercial healthcare delivery terms.',
      },
      include: { enquiry: true },
    })

    await prisma.enquiry.update({
      where: { id: Number(enquiryId) },
      data: { status: 'QUOTATION_SENT' },
    })

    return quotation
  }

  static async acceptQuotation(quotationId) {
    const quo = await prisma.quotation.findUnique({
      where: { id: Number(quotationId) },
      include: { enquiry: true },
    })
    if (!quo) throw new Error('Quotation not found')

    // Mark quotation accepted
    const updated = await prisma.quotation.update({
      where: { id: Number(quotationId) },
      data: { status: 'ACCEPTED' },
    })

    // Generate Order automatically
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: quo.enquiry.customerId,
        quotationId: quo.id,
        items: [{ title: quo.enquiry.title, amount: quo.grandTotal, quantity: quo.enquiry.quantity }],
        subtotal: quo.totalBaseAmount,
        vatAmount: quo.vatAmount,
        totalAmount: quo.grandTotal,
        paymentStatus: 'CONFIRMED',
        deliveryStatus: 'CONFIRMED',
      },
    })

    // Generate Legal Tax Invoice
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        customerId: quo.enquiry.customerId,
        invoiceType: 'SALES_TAX_INVOICE',
        subtotal: quo.totalBaseAmount,
        vatAmount: quo.vatAmount,
        grandTotal: quo.grandTotal,
        paymentStatus: 'PAID',
      },
    })

    return { quotation: updated, order, invoice }
  }
}
