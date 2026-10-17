import { Router } from 'express'
import {
  getServiceTickets,
  getServiceTicketDetails,
  createServiceRequest,
  assignEngineer,
  completeTicket,
} from '../controllers/serviceController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', authenticate, getServiceTickets)
router.get('/:id', authenticate, getServiceTicketDetails)
router.post('/', authenticate, createServiceRequest)
router.post('/:id/assign', authenticate, assignEngineer)
router.post('/:id/complete', authenticate, completeTicket)

export default router
