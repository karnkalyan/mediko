import { Router } from 'express'
import {
  getDashboardMetrics,
  approveProductListing,
  updateKYCStatus,
  getCertifiedPreOwnedVerificationQueue,
  verifyPreOwnedEquipment,
  getUsers,
} from '../controllers/adminController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/metrics', authenticate, getDashboardMetrics)
router.get('/users', authenticate, getUsers)
router.post('/products/:id/approve', authenticate, approveProductListing)
router.patch('/users/:userId/kyc', authenticate, updateKYCStatus)
router.get('/pre-owned/queue', authenticate, getCertifiedPreOwnedVerificationQueue)
router.post('/pre-owned/:id/verify', authenticate, verifyPreOwnedEquipment)

export default router
