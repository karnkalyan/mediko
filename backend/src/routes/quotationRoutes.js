import { Router } from 'express'
import {
  getQuotations,
  createQuotation,
  acceptQuotation,
} from '../controllers/quotationController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', authenticate, getQuotations)
router.post('/', authenticate, createQuotation)
router.post('/:id/accept', authenticate, acceptQuotation)

export default router
