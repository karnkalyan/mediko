import { EnquiryQuoteService } from '../services/enquiryQuoteService.js'

export const getEnquiries = async (req, res, next) => {
  try {
    const list = await EnquiryQuoteService.getAllEnquiries(req.query.status)
    res.json({ success: true, data: list })
  } catch (error) {
    next(error)
  }
}

export const getEnquiryDetails = async (req, res, next) => {
  try {
    const enquiry = await EnquiryQuoteService.getEnquiryById(req.params.id)
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' })
    res.json({ success: true, data: enquiry })
  } catch (error) {
    next(error)
  }
}

export const createEnquiry = async (req, res, next) => {
  try {
    const created = await EnquiryQuoteService.createEnquiry({
      ...req.body,
      customerId: req.user?.id || 1,
    })
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', data: created })
  } catch (error) {
    next(error)
  }
}

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const updated = await EnquiryQuoteService.updateEnquiryStatus(req.params.id, req.body.status)
    res.json({ success: true, message: 'Enquiry status updated', data: updated })
  } catch (error) {
    next(error)
  }
}
