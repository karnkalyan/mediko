import prisma from '../config/db.js'

export class RentalService {
  static async getAllRentals() {
    return prisma.rentalBooking.findMany({
      include: { product: true, customer: true },
      orderBy: { id: 'desc' },
    })
  }

  static async getRentalById(id) {
    return prisma.rentalBooking.findUnique({
      where: { id: Number(id) },
      include: { product: true, customer: true, invoices: true },
    })
  }

  static async createBooking({
    customerId = 1,
    productId,
    durationType = 'MONTHLY',
    durationValue = 1,
    startDate,
    deliveryAddress,
  }) {
    const product = await prisma.product.findUnique({ where: { id: Number(productId) } })
    if (!product) throw new Error('Product not found for rental')

    let rate = Number(product.rentalMonthly || 0)
    if (durationType === 'DAILY') rate = Number(product.rentalDaily || 0)
    if (durationType === 'WEEKLY') rate = Number(product.rentalWeekly || 0)

    const totalRent = rate * Number(durationValue)
    const deposit = Number(product.rentalDeposit || 5000)

    const start = new Date(startDate || Date.now())
    const end = new Date(start)
    if (durationType === 'DAILY') end.setDate(end.getDate() + Number(durationValue))
    else if (durationType === 'WEEKLY') end.setDate(end.getDate() + Number(durationValue) * 7)
    else end.setMonth(end.getMonth() + Number(durationValue))

    const bookingNumber = `RNT-${Date.now().toString().slice(-6)}`

    return prisma.rentalBooking.create({
      data: {
        bookingNumber,
        customerId: Number(customerId),
        productId: Number(productId),
        durationType,
        durationValue: Number(durationValue),
        startDate: start,
        endDate: end,
        rentAmount: totalRent,
        depositAmount: deposit,
        status: 'REQUESTED',
        deliveryAddress: deliveryAddress || 'Kathmandu, Nepal',
      },
      include: { product: true },
    })
  }

  static async updateStatus(id, status, notes) {
    return prisma.rentalBooking.update({
      where: { id: Number(id) },
      data: {
        status,
        conditionCheckNotes: notes,
      },
    })
  }

  static async processReturnInspection(id, { penaltyAmount = 0, penaltyReason, inspectionReport }) {
    const rental = await prisma.rentalBooking.findUnique({ where: { id: Number(id) } })
    if (!rental) throw new Error('Rental not found')

    const penalty = Number(penaltyAmount) || 0
    const refund = Math.max(0, Number(rental.depositAmount) - penalty)

    const updated = await prisma.rentalBooking.update({
      where: { id: Number(id) },
      data: {
        status: 'COMPLETED',
        returnDate: new Date(),
        penaltyAmount: penalty,
        penaltyReason,
        engineerInspection: inspectionReport,
      },
    })

    // Automatically create adjustment settlement invoice
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-RET-${rental.bookingNumber}`,
        rentalBookingId: rental.id,
        customerId: rental.customerId,
        invoiceType: 'RENTAL_PENALTY',
        subtotal: rental.rentAmount,
        penaltyDeduction: penalty,
        depositRefund: refund,
        grandTotal: penalty,
        paymentStatus: 'SETTLED',
      },
    })

    return { updated, refundAmount: refund, penaltyAmount: penalty }
  }
}
