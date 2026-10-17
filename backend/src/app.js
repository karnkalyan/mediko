import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import rentalRoutes from './routes/rentalRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import enquiryRoutes from './routes/enquiryRoutes.js'
import quotationRoutes from './routes/quotationRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import landingCostRoutes from './routes/landingCostRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js'

dotenv.config()

const app = express()

// Global Middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Mediko Bazaar services',
    chat: 'available',
  })
})

// Core API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/rentals', rentalRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/quotations', quotationRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/landing-cost', landingCostRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/chat', chatRoutes)

// Production Static Frontend Assets & SPA Routing
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../../dist')

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next()
    }
    const indexPath = path.join(distPath, 'index.html')
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath)
    }
    next()
  })
}

// 404 and Global Error Handlers for API
app.use(notFoundHandler)
app.use(errorHandler)

export default app

