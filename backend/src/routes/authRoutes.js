import { Router } from 'express'
import {
  login,
  register,
  refreshToken,
  logout,
  getProfile,
  getQueueStats,
} from '../controllers/authController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)
router.post('/logout', logout)
router.get('/profile', authenticate, getProfile)
router.get('/me', authenticate, getProfile)
router.get('/queue-stats', authenticate, getQueueStats)

export default router
