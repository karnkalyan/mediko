import { LandingCostService } from '../services/landingCostService.js'

export const calculateLandingCost = (req, res, next) => {
  try {
    const result = LandingCostService.calculateLandingCost(req.body)
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const saveLandingCostEstimate = async (req, res, next) => {
  try {
    const { enquiryId, calculation } = req.body
    if (!enquiryId || !calculation) {
      return res.status(400).json({ success: false, message: 'enquiryId and calculation data are required' })
    }
    const saved = await LandingCostService.saveEstimate(enquiryId, calculation)
    res.status(201).json({ success: true, message: 'Estimate saved successfully', data: saved })
  } catch (error) {
    next(error)
  }
}
