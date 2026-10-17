import { Router } from 'express'
import {
  getEnquiries,
  getEnquiryDetails,
  createEnquiry,
  updateEnquiryStatus,
} from '../controllers/enquiryController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', authenticate, getEnquiries)
router.get('/:id', authenticate, getEnquiryDetails)
router.post('/', authenticate, createEnquiry)
router.patch('/:id/status', authenticate, updateEnquiryStatus)

export default router
