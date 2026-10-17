import { Router } from 'express'
import {
  getRentals,
  getRentalDetails,
  createRentalBooking,
  updateRentalStatus,
  processReturn,
} from '../controllers/rentalController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', authenticate, getRentals)
router.get('/:id', authenticate, getRentalDetails)
router.post('/', authenticate, createRentalBooking)
router.patch('/:id/status', authenticate, updateRentalStatus)
router.post('/:id/return-inspection', authenticate, processReturn)

export default router
