import { RentalService } from '../services/rentalService.js'

export const getRentals = async (req, res, next) => {
  try {
    const list = await RentalService.getAllRentals()
    res.json({ success: true, data: list })
  } catch (error) {
    next(error)
  }
}

export const getRentalDetails = async (req, res, next) => {
  try {
    const rental = await RentalService.getRentalById(req.params.id)
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' })
    res.json({ success: true, data: rental })
  } catch (error) {
    next(error)
  }
}

export const createRentalBooking = async (req, res, next) => {
  try {
    const booking = await RentalService.createBooking({
      ...req.body,
      customerId: req.user?.id || 1,
    })
    res.status(201).json({ success: true, message: 'Rental booking created successfully', data: booking })
  } catch (error) {
    next(error)
  }
}

export const updateRentalStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body
    const updated = await RentalService.updateStatus(req.params.id, status, notes)
    res.json({ success: true, message: `Rental status updated to ${status}`, data: updated })
  } catch (error) {
    next(error)
  }
}

export const processReturn = async (req, res, next) => {
  try {
    const result = await RentalService.processReturnInspection(req.params.id, req.body)
    res.json({ success: true, message: 'Return inspection processed and deposit settled', data: result })
  } catch (error) {
    next(error)
  }
}
