import prisma from '../config/db.js'

export class LandingCostService {
  /**
   * Calculates comprehensive landing cost to Nepal based on concept.html section 18 formula
   */
  static calculateLandingCost({
    productPriceUSD = 1000,
    exchangeRate = 134.50,
    weightKg = 10,
    shippingMode = 'AIR', // AIR, SEA, LAND
    hsCode = '9018.90.00',
    customsDutyRate = 5.0, // Standard medical equipment duty in Nepal is typically 5%
    vatRate = 13.0, // Nepal VAT 13%
    insuranceRate = 1.0, // 1%
    freightPerKg = 12.0, // USD per kg for air cargo
    includeInstallation = false,
    marginRate = 8.0, // Mediko margin %
  }) {
    const usdPrice = Number(productPriceUSD) || 0
    const fxRate = Number(exchangeRate) || 134.50
    const weight = Number(weightKg) || 1

    // 1. Basic converted product cost in NPR
    const productCostNPR = usdPrice * fxRate

    // 2. Freight & Insurance in USD converted to NPR
    const freightUSD = shippingMode === 'AIR' ? weight * freightPerKg : (usdPrice * 0.05)
    const freightNPR = freightUSD * fxRate
    const insuranceUSD = usdPrice * (insuranceRate / 100)
    const insuranceNPR = insuranceUSD * fxRate

    // CIF Value (Cost, Insurance, Freight)
    const cifNPR = productCostNPR + freightNPR + insuranceNPR

    // 3. Customs Duty (based on CIF)
    const customsDutyNPR = cifNPR * (Number(customsDutyRate) / 100)

    // 4. VAT (applied on CIF + Duty)
    const taxableValueNPR = cifNPR + customsDutyNPR
    const vatNPR = taxableValueNPR * (Number(vatRate) / 100)

    // 5. Port clearance, Forex / LC bank charges, Local transit in Nepal
    const portClearanceNPR = 25000
    const bankForexCommissionNPR = 8500
    const localTransportNPR = 12000
    const installationNPR = includeInstallation ? 15000 : 0
    const medikoServiceFeeNPR = 25000

    // 6. Total Base Landing Cost
    const totalLandingCostNPR =
      cifNPR +
      customsDutyNPR +
      vatNPR +
      portClearanceNPR +
      bankForexCommissionNPR +
      localTransportNPR +
      installationNPR +
      medikoServiceFeeNPR

    // 7. Margin & Final localized quotation price
    const marginAmountNPR = totalLandingCostNPR * (Number(marginRate) / 100)
    const finalQuotationPriceNPR = Math.round(totalLandingCostNPR + marginAmountNPR)

    return {
      productPriceUSD: usdPrice,
      exchangeRateNPR: fxRate,
      productCostNPR: Math.round(productCostNPR),
      freightUSD: Math.round(freightUSD),
      freightNPR: Math.round(freightNPR),
      insuranceUSD: Math.round(insuranceUSD),
      insuranceNPR: Math.round(insuranceNPR),
      cifNPR: Math.round(cifNPR),
      customsDutyPercent: Number(customsDutyRate),
      customsDutyNPR: Math.round(customsDutyNPR),
      vatPercent: Number(vatRate),
      vatNPR: Math.round(vatNPR),
      portClearanceNPR,
      bankForexCommissionNPR,
      localTransportNPR,
      installationNPR,
      medikoServiceFeeNPR,
      totalLandingCostNPR: Math.round(totalLandingCostNPR),
      marginPercent: Number(marginRate),
      marginAmountNPR: Math.round(marginAmountNPR),
      finalQuotationPriceNPR,
      currency: 'NPR',
      hsCode,
      shippingMode,
      formulaNote: 'Product Cost (USD to NPR) + Freight + Insurance + Customs Duty + VAT + Clearance + Bank Commission + Local Transport + Installation + Margin',
    }
  }

  static async saveEstimate(enquiryId, calculationData) {
    return prisma.landingCostEstimate.create({
      data: {
        enquiryId: Number(enquiryId),
        productPriceUSD: calculationData.productPriceUSD,
        exchangeRateNPR: calculationData.exchangeRateNPR,
        productCostNPR: calculationData.productCostNPR,
        freightUSD: calculationData.freightUSD,
        insuranceUSD: calculationData.insuranceUSD,
        customsDutyPercent: calculationData.customsDutyPercent,
        customsDutyNPR: calculationData.customsDutyNPR,
        vatPercent: calculationData.vatPercent,
        vatNPR: calculationData.vatNPR,
        portClearanceNPR: calculationData.portClearanceNPR,
        bankForexCommissionNPR: calculationData.bankForexCommissionNPR,
        localTransportNPR: calculationData.localTransportNPR,
        medikoCommissionNPR: calculationData.medikoServiceFeeNPR,
        totalLandingCostNPR: calculationData.totalLandingCostNPR,
        marginPercent: calculationData.marginPercent,
        finalQuotationPriceNPR: calculationData.finalQuotationPriceNPR,
        breakdownJson: calculationData,
      },
    })
  }
}
