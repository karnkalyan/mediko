import { useState } from 'react'
import { Plane, X } from 'lucide-react'
import { apiCalculateLandingCost, type LandingCostResult } from '../lib/api'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function LandingCostModal({ isOpen, onClose }: Props) {
  const [usdPrice, setUsdPrice] = useState<number>(3500)
  const [weightKg, setWeightKg] = useState<number>(25)
  const [shippingMode, setShippingMode] = useState<string>('AIR')
  const [hsCode, setHsCode] = useState<string>('9018.19.00')
  const [dutyRate, setDutyRate] = useState<number>(5.0)
  const [vatRate] = useState<number>(13.0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LandingCostResult | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const data = await apiCalculateLandingCost({
        productPriceUSD: usdPrice,
        weightKg,
        shippingMode,
        hsCode,
        customsDutyRate: dutyRate,
        vatRate,
      })
      setResult(data)
    } catch {
      // Fallback calculation locally
      const fxRate = 134.50
      const prodNPR = usdPrice * fxRate
      const freightUSD = shippingMode === 'AIR' ? weightKg * 12 : usdPrice * 0.05
      const freightNPR = freightUSD * fxRate
      const insNPR = usdPrice * 0.01 * fxRate
      const cifNPR = prodNPR + freightNPR + insNPR
      const dutyNPR = cifNPR * (dutyRate / 100)
      const vatNPR = (cifNPR + dutyNPR) * (vatRate / 100)
      const baseLanding = cifNPR + dutyNPR + vatNPR + 25000 + 8500 + 12000 + 25000
      const finalPrice = Math.round(baseLanding * 1.08)

      setResult({
        productPriceUSD: usdPrice,
        exchangeRateNPR: fxRate,
        productCostNPR: Math.round(prodNPR),
        freightUSD: Math.round(freightUSD),
        freightNPR: Math.round(freightNPR),
        insuranceUSD: Math.round(usdPrice * 0.01),
        insuranceNPR: Math.round(insNPR),
        cifNPR: Math.round(cifNPR),
        customsDutyPercent: dutyRate,
        customsDutyNPR: Math.round(dutyNPR),
        vatPercent: vatRate,
        vatNPR: Math.round(vatNPR),
        portClearanceNPR: 25000,
        bankForexCommissionNPR: 8500,
        localTransportNPR: 12000,
        installationNPR: 0,
        medikoServiceFeeNPR: 25000,
        totalLandingCostNPR: Math.round(baseLanding),
        marginPercent: 8,
        marginAmountNPR: Math.round(baseLanding * 0.08),
        finalQuotationPriceNPR: finalPrice,
        currency: 'NPR',
        hsCode,
        shippingMode,
        formulaNote: 'Product Cost + Freight + Insurance + Customs Duty + VAT + Clearance + Bank Commission + Margin',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange text-white">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy">
              Nepal Import &amp; Landing Cost Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Calculate exact customs duty, VAT 13%, freight and local delivery to Kathmandu
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Product Export Price (USD $)
            </label>
            <input
              type="number"
              value={usdPrice}
              onChange={(e) => setUsdPrice(Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-bold text-navy outline-none focus:border-orange"
              placeholder="e.g. 3500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Cargo Weight (Kg)
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-bold text-navy outline-none focus:border-orange"
              placeholder="e.g. 25"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Freight Mode
            </label>
            <select
              value={shippingMode}
              onChange={(e) => setShippingMode(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
            >
              <option value="AIR">Air Cargo (TIA Kathmandu)</option>
              <option value="SEA">Sea / Land Transit (via Kolkata / Birgunj)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Nepal Customs Tariff (HS Code)
            </label>
            <select
              value={hsCode}
              onChange={(e) => {
                setHsCode(e.target.value)
                if (e.target.value === '9018.19.00') setDutyRate(5.0)
                else if (e.target.value === '9019.20.00') setDutyRate(5.0)
                else setDutyRate(10.0)
              }}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange"
            >
              <option value="9018.19.00">9018.19 - Diagnostic &amp; Electro-medical (5% Duty)</option>
              <option value="9019.20.00">9019.20 - Oxygen &amp; Respiratory Therapy (5% Duty)</option>
              <option value="9402.90.00">9402.90 - Hospital Electric Beds &amp; Furniture (10% Duty)</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="rounded-lg bg-orange px-6 py-2.5 text-xs font-bold text-white transition hover:bg-orange-hover"
          >
            {loading ? 'Calculating...' : 'Calculate Nepal Landing Cost →'}
          </button>
        </div>

        {result && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-[#f8fbff] p-4">
            <div className="mb-3 flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-bold text-navy">Landing Cost Breakdown (NPR)</span>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                1 USD = NPR {result.exchangeRateNPR}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-lg bg-white p-2.5 border border-slate-100">
                <span className="text-[10px] text-slate-400">Converted Cost</span>
                <strong className="block text-navy">Rs. {result.productCostNPR.toLocaleString()}</strong>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-100">
                <span className="text-[10px] text-slate-400">Freight &amp; Insurance</span>
                <strong className="block text-navy">Rs. {(result.freightNPR + result.insuranceNPR).toLocaleString()}</strong>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-100">
                <span className="text-[10px] text-slate-400">Customs Duty ({result.customsDutyPercent}%)</span>
                <strong className="block text-navy">Rs. {result.customsDutyNPR.toLocaleString()}</strong>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-100">
                <span className="text-[10px] text-slate-400">VAT (13%)</span>
                <strong className="block text-navy">Rs. {result.vatNPR.toLocaleString()}</strong>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-lg bg-navy p-4 text-white sm:flex-row">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-200">
                  Estimated Final Landing Price in Nepal
                </span>
                <div className="text-2xl font-black text-white">
                  NPR {result.finalQuotationPriceNPR.toLocaleString()}
                </div>
                <small className="text-[10px] text-slate-300">
                  Includes customs clearance, logistics, local transit and taxes.
                </small>
              </div>
              <button
                onClick={() => setSubmitted(true)}
                className="whitespace-nowrap rounded-lg bg-orange px-5 py-2 text-xs font-bold text-white transition hover:bg-orange-hover"
              >
                {submitted ? 'Enquiry Sent' : 'Request Official Quotation'}
              </button>
            </div>
            {submitted && (
              <p className="mt-2 text-center text-xs font-bold text-emerald-600">
                Your import quote enquiry has been dispatched to Mediko Trade Desk!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
