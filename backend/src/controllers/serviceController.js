import { EngineeringService } from '../services/engineeringService.js'

export const getServiceTickets = async (req, res, next) => {
  try {
    const list = await EngineeringService.getAllTickets(req.query)
    res.json({ success: true, data: list })
  } catch (error) {
    next(error)
  }
}

export const getServiceTicketDetails = async (req, res, next) => {
  try {
    const ticket = await EngineeringService.getTicketById(req.params.id)
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' })
    res.json({ success: true, data: ticket })
  } catch (error) {
    next(error)
  }
}

export const createServiceRequest = async (req, res, next) => {
  try {
    const created = await EngineeringService.createServiceRequest({
      ...req.body,
      customerId: req.user?.id || 1,
    })
    res.status(201).json({ success: true, message: 'Service ticket created successfully', data: created })
  } catch (error) {
    next(error)
  }
}

export const assignEngineer = async (req, res, next) => {
  try {
    const { engineerId, scheduledDate } = req.body
    const updated = await EngineeringService.assignEngineer(req.params.id, engineerId, scheduledDate)
    res.json({ success: true, message: 'Biomedical engineer assigned successfully', data: updated })
  } catch (error) {
    next(error)
  }
}

export const completeTicket = async (req, res, next) => {
  try {
    const updated = await EngineeringService.completeService(req.params.id, req.body)
    res.json({ success: true, message: 'Service completed successfully', data: updated })
  } catch (error) {
    next(error)
  }
}
