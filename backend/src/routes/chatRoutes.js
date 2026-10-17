import { Router } from 'express'
import { getMessages, sendMessage } from '../controllers/chatController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', authenticate, getMessages)
router.post('/', authenticate, sendMessage)

export default router
