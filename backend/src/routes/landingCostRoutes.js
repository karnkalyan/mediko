import { Router } from 'express'
import { calculateLandingCost, saveLandingCostEstimate } from '../controllers/landingCostController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/calculate', calculateLandingCost)
router.post('/save', authenticate, saveLandingCostEstimate)

export default router
