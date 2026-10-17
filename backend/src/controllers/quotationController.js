import { EnquiryQuoteService } from '../services/enquiryQuoteService.js'

export const getQuotations = async (req, res, next) => {
  try {
    const list = await EnquiryQuoteService.getAllQuotations()
    res.json({ success: true, data: list })
  } catch (error) {
    next(error)
  }
}

export const createQuotation = async (req, res, next) => {
  try {
    const quotation = await EnquiryQuoteService.createQuotation(req.body)
    res.status(201).json({ success: true, message: 'Quotation generated and dispatched', data: quotation })
  } catch (error) {
    next(error)
  }
}

export const acceptQuotation = async (req, res, next) => {
  try {
    const result = await EnquiryQuoteService.acceptQuotation(req.params.id)
    res.json({ success: true, message: 'Quotation accepted, order and tax invoice generated', data: result })
  } catch (error) {
    next(error)
  }
}
