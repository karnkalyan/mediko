import { Router } from 'express'
import {
  getProducts,
  getProductDetails,
  getFeatured,
  getSlider,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', getProducts)
router.get('/featured', getFeatured)
router.get('/slider', getSlider)
router.get('/:idOrSlug', getProductDetails)
router.post('/', authenticate, createProduct)
router.put('/:id', authenticate, updateProduct)
router.delete('/:id', authenticate, deleteProduct)

export default router
