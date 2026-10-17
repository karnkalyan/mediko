import prisma from '../config/db.js'

export class EngineeringService {
  static async getAllTickets(filters = {}) {
    const where = {}
    if (filters.status) where.status = filters.status
    if (filters.serviceType) where.serviceType = filters.serviceType
    if (filters.engineerId) where.engineerId = Number(filters.engineerId)

    return prisma.serviceBooking.findMany({
      where,
      include: { customer: true, engineer: true, product: true },
      orderBy: { id: 'desc' },
    })
  }

  static async getTicketById(id) {
    return prisma.serviceBooking.findUnique({
      where: { id: Number(id) },
      include: { customer: true, engineer: true, product: true, chatMessages: true },
    })
  }

  static async createServiceRequest(data) {
    const ticketNumber = `SRV-${Date.now().toString().slice(-6)}`
    return prisma.serviceBooking.create({
      data: {
        ticketNumber,
        customerId: Number(data.customerId || 1),
        productId: data.productId ? Number(data.productId) : null,
        equipmentTitle: data.equipmentTitle || 'Medical Device',
        equipmentBrand: data.equipmentBrand || 'Generic',
        equipmentModel: data.equipmentModel || '',
        serialNumber: data.serialNumber || '',
        serviceType: data.serviceType || 'REPAIR',
        problemDescription: data.problemDescription || '',
        hospitalLocation: data.hospitalLocation || 'Kathmandu, Nepal',
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        status: 'NEW',
        cost: data.cost ? Number(data.cost) : 3500,
      },
    })
  }

  static async assignEngineer(ticketId, engineerId, scheduledDate) {
    return prisma.serviceBooking.update({
      where: { id: Number(ticketId) },
      data: {
        engineerId: Number(engineerId),
        status: 'ASSIGNED',
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      },
      include: { engineer: true },
    })
  }

  static async completeService(ticketId, { resolutionNotes, engineerNotes, checklist, cost }) {
    return prisma.serviceBooking.update({
      where: { id: Number(ticketId) },
      data: {
        status: 'COMPLETED',
        resolutionNotes,
        engineerNotes,
        checklist,
        cost: cost ? Number(cost) : undefined,
      },
    })
  }
}
