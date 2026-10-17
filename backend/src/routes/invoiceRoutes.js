import { Router } from 'express'
import { getOrders, getInvoices, createOrder } from '../controllers/orderInvoiceController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/orders', authenticate, getOrders)
router.post('/orders', authenticate, createOrder)
router.get('/invoices', authenticate, getInvoices)

export default router
