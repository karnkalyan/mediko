import prisma from '../config/db.js'

export const getMessages = async (req, res, next) => {
  try {
    const { ticketId, enquiryId, serviceBookingId } = req.query
    const where = {}
    if (ticketId) where.ticketId = Number(ticketId)
    if (enquiryId) where.enquiryId = Number(enquiryId)
    if (serviceBookingId) where.serviceBookingId = Number(serviceBookingId)

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })
    res.json({ success: true, data: messages })
  } catch (error) {
    next(error)
  }
}

export const sendMessage = async (req, res, next) => {
  try {
    const { ticketId, enquiryId, serviceBookingId, message, attachmentUrl } = req.body
    const chat = await prisma.chatMessage.create({
      data: {
        ticketId: ticketId ? Number(ticketId) : null,
        enquiryId: enquiryId ? Number(enquiryId) : null,
        serviceBookingId: serviceBookingId ? Number(serviceBookingId) : null,
        senderId: req.user?.id || 1,
        senderName: req.user?.fullName || 'Support Engineer',
        senderRole: req.user?.role || 'ENGINEER',
        message,
        attachmentUrl,
      },
    })
    res.status(201).json({ success: true, data: chat })
  } catch (error) {
    next(error)
  }
}
