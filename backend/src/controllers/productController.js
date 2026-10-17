import { ProductService } from '../services/productService.js'

export const getProducts = async (req, res, next) => {
  try {
    const result = await ProductService.getAllProducts(req.query)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const getProductDetails = async (req, res, next) => {
  try {
    const product = await ProductService.getProductBySlugOrId(req.params.idOrSlug)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    res.json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const getFeatured = async (req, res, next) => {
  try {
    const products = await ProductService.getFeaturedProducts()
    res.json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
}

export const getSlider = async (req, res, next) => {
  try {
    const products = await ProductService.getSliderProducts()
    res.json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body)
    res.status(201).json({ success: true, message: 'Product created successfully', data: product })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body)
    res.json({ success: true, message: 'Product updated successfully', data: product })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id)
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    next(error)
  }
}
