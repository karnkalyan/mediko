import prisma from '../config/db.js'

export const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true, invoices: true },
      orderBy: { id: 'desc' },
    })
    res.json({ success: true, data: orders })
  } catch (error) {
    next(error)
  }
}

export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { customer: true, order: true, rentalBooking: true },
      orderBy: { id: 'desc' },
    })
    res.json({ success: true, data: invoices })
  } catch (error) {
    next(error)
  }
}

export const createOrder = async (req, res, next) => {
  try {
    const { items, subtotal, vatAmount = 0, totalAmount, paymentMethod = 'ESEWA', shippingAddress } = req.body
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: req.user?.id || 1,
        items,
        subtotal: Number(subtotal),
        vatAmount: Number(vatAmount),
        totalAmount: Number(totalAmount),
        paymentMethod,
        shippingAddress,
        deliveryStatus: 'PROCESSING',
      },
    })

    // Automatically create legal tax invoice
    const invoiceNumber = `INV-${orderNumber.slice(4)}`
    await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        customerId: order.customerId,
        invoiceType: 'SALES_TAX_INVOICE',
        subtotal: order.subtotal,
        vatAmount: order.vatAmount,
        grandTotal: order.totalAmount,
        paymentStatus: 'PAID',
      },
    })

    res.status(201).json({ success: true, message: 'Order and Tax Invoice generated successfully', data: order })
  } catch (error) {
    next(error)
  }
}
