import prisma from '../config/db.js'

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalVendors,
      totalEnquiries,
      totalRentals,
      totalServices,
      recentOrders,
      pendingApprovals,
    ] = await Promise.all([
      prisma.product.count({ where: { isApproved: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: { in: ['VENDOR', 'INTERNATIONAL_SELLER'] } } }),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.rentalBooking.count({ where: { status: 'ACTIVE' } }),
      prisma.serviceBooking.count({ where: { status: { in: ['NEW', 'ASSIGNED'] } } }),
      prisma.order.findMany({
        take: 6,
        orderBy: { id: 'desc' },
        include: { customer: true },
      }),
      prisma.product.findMany({
        where: { isApproved: false },
        take: 5,
      }),
    ])

    res.json({
      success: true,
      data: {
        kpis: {
          grossSales: 'NPR 4.2 Cr',
          ordersCount: totalOrders,
          customersCount: totalCustomers,
          vendorsCount: totalVendors,
          openEnquiries: totalEnquiries,
          liveProducts: totalProducts,
          activeRentals: totalRentals,
          pendingServices: totalServices,
        },
        recentOrders,
        pendingApprovals,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const approveProductListing = async (req, res, next) => {
  try {
    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { isApproved: true },
    })
    res.json({ success: true, message: 'Product listing approved', data: updated })
  } catch (error) {
    next(error)
  }
}

export const updateKYCStatus = async (req, res, next) => {
  try {
    const { status } = req.body // VERIFIED, REJECTED
    const updated = await prisma.user.update({
      where: { id: Number(req.params.userId) },
      data: { kycStatus: status },
    })
    res.json({ success: true, message: `KYC status updated to ${status}`, data: updated })
  } catch (error) {
    next(error)
  }
}

export const getCertifiedPreOwnedVerificationQueue = async (req, res, next) => {
  try {
    const queue = await prisma.product.findMany({
      where: { type: 'CERTIFIED_PRE_OWNED' },
      include: { seller: true },
      orderBy: { id: 'desc' },
    })
    res.json({ success: true, data: queue })
  } catch (error) {
    next(error)
  }
}

export const verifyPreOwnedEquipment = async (req, res, next) => {
  try {
    const { inspectionStatus, conditionGrade, verificationStatus } = req.body
    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        inspectionStatus: inspectionStatus || 'Passed',
        conditionGrade: conditionGrade || 'GRADE_A',
        verificationStatus: verificationStatus || 'Mediko Certified',
        isApproved: true,
      },
    })
    res.json({ success: true, message: 'Equipment certified and badge published', data: updated })
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query
    const where = {}
    if (role) {
      if (role.includes(',')) {
        where.role = { in: role.split(',') }
      } else {
        where.role = role
      }
    }
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        organization: true,
        panVatNumber: true,
        city: true,
        address: true,
        kycStatus: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { id: 'desc' },
    })
    res.json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
}


