import { useState, useEffect } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import type { NavProps, Product } from '../types'
import {
  IconCart, IconFileText, IconHeart, IconShare, IconTruck,
  IconChevronLeft, IconChevronRight, IconDownload,
  IconPlus, IconMinus,
} from '../components/Icons'
import {
  BatteryCharging,
  Wifi,
  ShieldCheck,
  Wrench,
  Clock,
  Globe,
  CheckCircle2,
  ChevronRight,
  Star,
  FileText,
} from 'lucide-react'
import { formatNPR } from '../lib/utils'
import { getRelevantProductImage } from '../lib/productImage'

const DEFAULT_IMAGES = [
  '/assets/generated/category-monitoring.png',
  '/assets/generated/category-ultrasound.png',
  '/assets/generated/category-ecg.png',
  '/assets/generated/category-lab.png',
]

const SPECS = [
  ['Display Size', '12.1" TFT Color LCD'],
  ['Resolution', '1024 × 768 pixels'],
  ['Parameters', 'ECG, SpO₂, NIBP, TEMP, RESP, IBP'],
  ['ECG Leads', '3/5-lead standard'],
  ['Heart Rate Range', '15–350 bpm'],
  ['SpO₂ Range', '0–100%'],
  ['NIBP Method', 'Oscillometric'],
  ['Memory', '120 hours waveforms, 5000 alarms'],
  ['Battery', 'Li-ion, 4+ hours standby'],
  ['Weight', '3.8 kg'],
  ['Dimensions (mm)', '320 × 295 × 205'],
  ['IP Rating', 'IP32 splash-proof'],
]

const TABS = ['Overview', 'Specifications', 'Add-On Services', 'Accessories', 'Documents', 'Reviews', 'Q&A']

export default function ProductDetailPage({ navigate, cartCount, setCartCount }: NavProps) {
  const [activeProduct, setActiveProduct] = useState<Product>(() => {
    try {
      const stored = localStorage.getItem('mediko_selected_product')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.title) return parsed
      }
    } catch {}
    return PRODUCTS[0]
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mediko_selected_product')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.title) setActiveProduct(parsed)
      }
    } catch {}
  }, [])

  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState('Overview')
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  // Service Add-on Options during Add to Cart
  const [addonSupportEngineer, setAddonSupportEngineer] = useState(false)
  const [addonInstallation, setAddonInstallation] = useState(false)
  const [addonCalibration, setAddonCalibration] = useState(false)

  const isAskPrice = activeProduct.askForPrice || !activeProduct.price
  const isRentalMode = activeProduct.type === 'rental'

  const productImages = [getRelevantProductImage(activeProduct), ...DEFAULT_IMAGES.slice(1)]

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <PublicHeader navigate={navigate} cartCount={cartCount} />

      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#F7F9FC', borderBottom: '1px solid #E4E9F1', padding: '12px 32px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#8A94A6' }}>
          <span style={{ cursor: 'pointer', color: '#FF5A00' }} onClick={() => navigate('home')}>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span style={{ cursor: 'pointer', color: '#FF5A00' }} onClick={() => navigate('shop')}>{activeProduct.category || 'Patient Monitoring'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span style={{ color: '#5F6B7C' }}>{activeProduct.title}</span>
        </div>
      </div>

      {/* Product detail */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr 320px', gap: 28 }}>

          {/* Left — Image gallery */}
          <div>
            <div style={{ border: '1px solid #E4E9F1', borderRadius: 12, overflow: 'hidden', backgroundColor: '#F7F9FC', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 12 }}>
              <img src={productImages[activeImage]} alt={activeProduct.title} style={{ maxHeight: 300, maxWidth: '100%', objectFit: 'contain' }} />
              <button onClick={() => setActiveImage(i => Math.max(0, i - 1))} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', border: '1px solid #E4E9F1', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconChevronLeft size={15} color="#071B45" />
              </button>
              <button onClick={() => setActiveImage(i => Math.min(productImages.length - 1, i + 1))} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', border: '1px solid #E4E9F1', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconChevronRight size={15} color="#071B45" />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {productImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{ height: 72, border: `2px solid ${activeImage === i ? '#FF5A00' : '#E4E9F1'}`, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', backgroundColor: '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img src={img} alt="" style={{ maxHeight: 56, maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setWishlisted(!wishlisted)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', border: '1px solid #E4E9F1', borderRadius: 8, backgroundColor: '#fff', fontSize: 12.5, color: '#5F6B7C', cursor: 'pointer', fontFamily: 'Poppins' }}>
                <IconHeart size={14} color={wishlisted ? '#E5484D' : '#8A94A6'} /> Wishlist
              </button>
              <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', border: '1px solid #E4E9F1', borderRadius: 8, backgroundColor: '#fff', fontSize: 12.5, color: '#5F6B7C', cursor: 'pointer', fontFamily: 'Poppins' }}>
                <IconShare size={14} color="#8A94A6" /> Share
              </button>
              <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', border: '1px solid #E4E9F1', borderRadius: 8, backgroundColor: '#fff', fontSize: 12.5, color: '#5F6B7C', cursor: 'pointer', fontFamily: 'Poppins' }}>
                Compare
              </button>
            </div>
          </div>

          {/* Center — Product details */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={{ backgroundColor: '#EAF8F0', color: '#13A85B', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> In Stock
              </span>
              <span style={{ backgroundColor: '#EAF3FF', color: '#1677FF', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={13} /> Genuine &amp; Verified
              </span>
              <span style={{ backgroundColor: '#FFF3EA', color: '#FF5A00', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 4 }}>
                {activeProduct.badge || 'Verified Clinical Grade'}
              </span>
            </div>

            <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#071B45', lineHeight: 1.3 }}>
              {activeProduct.title}
            </h1>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#5F6B7C' }}>
              Brand: <strong style={{ color: '#071B45' }}>{activeProduct.brand}</strong> ·
              Seller: <strong style={{ color: '#FF5A00' }}> {activeProduct.seller || 'MediTech Solutions Pvt. Ltd.'}</strong>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= Math.round(activeProduct.rating || 4.8) ? 'fill-orange text-orange' : 'fill-slate-200 text-slate-200'}`}
                  />
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#071B45' }}>{activeProduct.rating || 4.8}</span>
              <span style={{ fontSize: 12.5, color: '#8A94A6' }}>{activeProduct.reviews || 124} reviews · 238 orders</span>
            </div>

            <p style={{ margin: '0 0 20px', fontSize: 13.5, color: '#5F6B7C', lineHeight: 1.7 }}>
              {activeProduct.description || 'High-precision clinical equipment designed for critical hospital, diagnostic and medical monitoring environments across Nepal. Fully compatible with national healthcare standards and supported by certified biomedical engineers.'}
            </p>

            {/* Feature icons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { icon: <BatteryCharging size={20} className="text-emerald-600" />, label: '4+ Hr Battery' },
                { icon: <Wifi size={20} className="text-blue-600" />, label: 'Wi-Fi Enabled' },
                { icon: <ShieldCheck size={20} className="text-purple-600" />, label: activeProduct.warranty || '2 Year Warranty' },
                { icon: <Wrench size={20} className="text-orange" />, label: 'Free Installation' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ backgroundColor: '#F7F9FC', borderRadius: 8, padding: '12px 10px', textAlign: 'center', border: '1px solid #E4E9F1' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{icon}</div>
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: '#071B45' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Specs table */}
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#071B45' }}>Key Specifications</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <tbody>
                {SPECS.slice(0, 8).map(([key, val]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #F0F4FA' }}>
                    <td style={{ padding: '7px 12px 7px 0', fontSize: 12.5, color: '#8A94A6', fontWeight: 500, width: '40%' }}>{key}</td>
                    <td style={{ padding: '7px 0', fontSize: 12.5, color: '#071B45', fontWeight: 500 }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Documents */}
            <div style={{ display: 'flex', gap: 8 }}>
              {['Product Brochure', 'User Manual', 'Specification Sheet'].map(doc => (
                <button key={doc} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #E4E9F1', borderRadius: 6, backgroundColor: '#F7F9FC', fontSize: 12, color: '#5F6B7C', cursor: 'pointer', fontFamily: 'Poppins' }}>
                  <IconDownload size={12} color="#8A94A6" />
                  {doc}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Purchase / Quote / Rental card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Main Action Card */}
            <div style={{ border: '1.5px solid #E4E9F1', borderRadius: 12, padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(7,27,69,0.06)' }}>
              {isRentalMode ? (
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED' }}>
                      {formatNPR(activeProduct.rentalMonthly || 8500)} / month
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: 12, color: '#5F6B7C' }}>
                    Refundable deposit: <strong style={{ color: '#071B45' }}>{formatNPR(activeProduct.rentalDeposit || 15000)}</strong>
                  </p>
                  <button
                    onClick={() => navigate('request-quote')}
                    style={{ width: '100%', backgroundColor: '#7C3AED', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <Clock size={16} color="#fff" />
                    Book Equipment Rental
                  </button>
                </div>
              ) : isAskPrice ? (
                <div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#071B45' }}>Price on Quotation</span>
                  </div>
                  <div style={{ backgroundColor: '#EFF6FF', borderRadius: 8, padding: '10px 12px', marginBottom: 14, border: '1px solid #DBEAFE' }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#1E40AF' }}>Institutional Commercial RFQ</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748B' }}>
                      Official quotes include hospital pricing, tax VAT invoice, import clearance and BMET warranty.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('request-quote')}
                    style={{ width: '100%', backgroundColor: '#071B45', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <FileText size={16} className="text-orange" />
                    Request for Quotation
                  </button>
                  <p style={{ margin: 0, textAlign: 'center', fontSize: 11, color: '#8A94A6' }}>
                    Direct response within 1 hour from verified vendors
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: '#071B45' }}>{formatNPR(activeProduct.price || 285000)}</span>
                  </div>
                  {activeProduct.oldPrice && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 14, color: '#8A94A6', textDecoration: 'line-through' }}>{formatNPR(activeProduct.oldPrice)}</span>
                      <span style={{ backgroundColor: '#FFF0F0', color: '#E5484D', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>
                        {activeProduct.discount ? `${activeProduct.discount}% OFF` : 'Special Offer'}
                      </span>
                    </div>
                  )}

                  <div style={{ backgroundColor: '#EAF8F0', borderRadius: 7, padding: '10px 12px', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <IconTruck size={15} color="#13A85B" />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#13A85B' }}>Free Delivery to Kathmandu Valley</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#5F6B7C' }}>Estimated: 2–4 business days</p>
                    </div>
                  </div>

                  {/* Qty */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: 12.5, color: '#5F6B7C', fontWeight: 500 }}>Quantity:</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E4E9F1', borderRadius: 7, overflow: 'hidden' }}>
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, border: 'none', backgroundColor: '#F7F9FC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconMinus size={12} color="#071B45" />
                      </button>
                      <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#071B45' }}>{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, border: 'none', backgroundColor: '#F7F9FC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconPlus size={12} color="#071B45" />
                      </button>
                    </div>
                  </div>

                  {/* Add-on Sub-Options for Services */}
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#071B45', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Biomedical Add-on Services
                      </span>
                      <span style={{ fontSize: 10, color: '#FF5A00', fontWeight: 600, marginLeft: 'auto' }}>Optional</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 12, color: '#334155' }}>
                        <input
                          type="checkbox"
                          checked={addonSupportEngineer}
                          onChange={(e) => setAddonSupportEngineer(e.target.checked)}
                          style={{ marginTop: 2, accentColor: '#FF5A00' }}
                        />
                        <div>
                          <strong style={{ color: '#071B45', display: 'block' }}>+ Add Support Engineer (+NPR 2,500)</strong>
                          <span style={{ fontSize: 10.5, color: '#64748B' }}>Certified Biomedical Engineer on-site setup &amp; validation</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 12, color: '#334155' }}>
                        <input
                          type="checkbox"
                          checked={addonInstallation}
                          onChange={(e) => setAddonInstallation(e.target.checked)}
                          style={{ marginTop: 2, accentColor: '#FF5A00' }}
                        />
                        <div>
                          <strong style={{ color: '#071B45', display: 'block' }}>+ Hospital Installation &amp; Wiring (+NPR 3,500)</strong>
                          <span style={{ fontSize: 10.5, color: '#64748B' }}>OT / ICU ward mounting, pipeline &amp; electrical testing</span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 12, color: '#334155' }}>
                        <input
                          type="checkbox"
                          checked={addonCalibration}
                          onChange={(e) => setAddonCalibration(e.target.checked)}
                          style={{ marginTop: 2, accentColor: '#FF5A00' }}
                        />
                        <div>
                          <strong style={{ color: '#071B45', display: 'block' }}>+ DDA Calibration Certificate (+NPR 1,500)</strong>
                          <span style={{ fontSize: 10.5, color: '#64748B' }}>Annual calibration certificate with sensor traceability</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const existingCart = JSON.parse(localStorage.getItem('mediko_cart_items') || '[]')
                      existingCart.unshift({
                        id: Date.now(),
                        title: activeProduct.title,
                        brand: activeProduct.brand,
                        sku: activeProduct.sku || `SKU-${activeProduct.id}`,
                        condition: activeProduct.condition || 'New',
                        price: activeProduct.price,
                        qty,
                        image: getRelevantProductImage(activeProduct),
                        delivery: 'Express Medical Logistics',
                        warranty: activeProduct.warranty || '1 Year',
                        seller: activeProduct.seller || 'MediTech Solutions',
                        sellerVerified: true,
                        hasSupportEngineer: addonSupportEngineer,
                        supportEngineerCost: 2500,
                        hasInstallation: addonInstallation,
                        installationCost: 3500,
                        hasCalibration: addonCalibration,
                        calibrationCost: 1500,
                      })
                      localStorage.setItem('mediko_cart_items', JSON.stringify(existingCart))
                      setCartCount?.(cartCount + qty)
                      navigate('cart')
                    }}
                    style={{ width: '100%', backgroundColor: '#FF5A00', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <IconCart size={16} color="#fff" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => navigate('request-quote')}
                    style={{ width: '100%', backgroundColor: '#fff', color: '#071B45', border: '1.5px solid #CFD7E5', padding: '12px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <IconFileText size={14} color="#071B45" />
                    Request for Quotation
                  </button>
                </div>
              )}

              {/* Payment logos */}
              <div style={{ marginTop: 14, borderTop: '1px solid #F0F4FA', paddingTop: 12 }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, color: '#8A94A6', fontWeight: 500 }}>ACCEPTED PAYMENTS</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['eSewa', 'Khalti', 'Fonepay', 'Bank Transfer', 'COD'].map(p => (
                    <span key={p} style={{ padding: '3px 8px', border: '1px solid #E4E9F1', borderRadius: 4, fontSize: 10.5, color: '#5F6B7C', fontWeight: 500 }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rental card */}
            {(activeProduct.rentalMonthly || !isRentalMode) && (
              <div style={{ border: '1px solid #E4E9F1', borderRadius: 12, padding: '16px', backgroundColor: '#F3EAFE' }}>
                <p style={{ margin: '0 0 6px', fontSize: 12.5, fontWeight: 700, color: '#8B4CCB', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={15} /> Also Available on Rental
                </p>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: '#5F6B7C' }}>From <strong style={{ color: '#8B4CCB' }}>{formatNPR(activeProduct.rentalMonthly || 8500)}/month</strong> — short or long-term rental with delivery, setup, and refundable deposit included.</p>
                <button
                  onClick={() => navigate('request-quote')}
                  style={{ width: '100%', backgroundColor: '#8B4CCB', color: '#fff', border: 'none', padding: '9px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}
                >
                  Request Rental / Book Lease
                </button>
              </div>
            )}

            {/* Bulk purchase support */}
            <div style={{ border: '1px solid #E4E9F1', borderRadius: 12, padding: '16px', backgroundColor: '#EFF6FF' }}>
              <p style={{ margin: '0 0 6px', fontSize: 12.5, fontWeight: 700, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={15} /> Bulk purchase support
              </p>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#5F6B7C' }}>Buying for a hospital or clinic? Our team can help with pricing, paperwork, delivery and installation.</p>
              <button
                onClick={() => navigate('b2b-enquiry')}
                style={{ width: '100%', backgroundColor: '#1D4ED8', color: '#fff', border: 'none', padding: '9px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}
              >
                Request bulk purchase help
              </button>
            </div>

            {/* Engineer card */}
            <div style={{ border: '1px solid #E4E9F1', borderRadius: 12, padding: '16px', backgroundColor: '#FFF3EA' }}>
              <p style={{ margin: '0 0 6px', fontSize: 12.5, fontWeight: 700, color: '#FF5A00', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wrench size={15} /> Need Installation?
              </p>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#5F6B7C' }}>Certified biomedical engineers available for installation, training, and AMC contracts.</p>
              <button
                onClick={() => navigate('engineering-service')}
                style={{ width: '100%', backgroundColor: '#fff', color: '#FF5A00', border: '1.5px solid #FF5A00', padding: '9px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}
              >
                Book an Engineer
              </button>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', borderBottom: '1.5px solid #E4E9F1', marginBottom: 28, gap: 4 }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2.5px solid #FF5A00' : '2.5px solid transparent',
                  marginBottom: -1.5,
                  padding: '11px 20px',
                  fontSize: 13,
                  fontWeight: activeTab === tab ? 600 : 500,
                  color: activeTab === tab ? '#FF5A00' : '#5F6B7C',
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                }}
              >
                {tab}
                {tab === 'Reviews' && <span style={{ marginLeft: 5, backgroundColor: '#F7F9FC', color: '#5F6B7C', fontSize: 11, padding: '1px 6px', borderRadius: 10 }}>124</span>}
              </button>
            ))}
          </div>

          {activeTab === 'Overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#071B45' }}>Product Overview</h3>
                <p style={{ fontSize: 13.5, color: '#5F6B7C', lineHeight: 1.75 }}>
                  The Mindray MEC-1200 is a comprehensive multi-parameter patient monitor designed for acute care environments. It offers exceptional monitoring capabilities with a clear, bright display and intuitive user interface. The modular design allows for easy customization to meet specific clinical needs, while the robust build ensures reliable performance in demanding environments.
                </p>
                <ul style={{ margin: '14px 0 0', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['12.1" TFT display with anti-reflection coating', 'Simultaneous display of up to 8 waveforms', 'Smart alarm management with nurse call integration', 'DICOM and HL7 connectivity support', 'Rechargeable Li-ion battery for portable use'].map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#5F6B7C' }}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#071B45' }}>Add-On Services</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      ['Installation & Setup', 'NPR 3,500', 'Available'],
                      ['User Training (4 hrs)', 'NPR 5,000', 'Available'],
                      ['1-Year AMC', 'NPR 18,000', 'Available'],
                      ['Extended Warranty (2Y)', 'NPR 12,000', 'Available'],
                      ['Calibration Service', 'NPR 4,500', 'Available'],
                    ].map(([srv, price]) => (
                      <tr key={srv} style={{ borderBottom: '1px solid #F0F4FA' }}>
                        <td style={{ padding: '9px 0', fontSize: 12.5, color: '#071B45' }}>{srv}</td>
                        <td style={{ padding: '9px 0', fontSize: 12.5, color: '#FF5A00', fontWeight: 600 }}>{price}</td>
                        <td style={{ padding: '9px 0' }}>
                          <button style={{ fontSize: 11, color: '#13A85B', backgroundColor: '#EAF8F0', border: 'none', padding: '3px 8px', borderRadius: 4, cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600 }}>+ Add</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Specifications' && (
            <div style={{ maxWidth: 720 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {SPECS.map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid #F0F4FA' }}>
                      <td style={{ padding: '10px 12px 10px 0', fontSize: 13, color: '#5F6B7C', fontWeight: 500, width: '35%' }}>{key}</td>
                      <td style={{ padding: '10px 0', fontSize: 13, color: '#071B45', fontWeight: 500 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div>
              <div style={{ display: 'flex', gap: 32, marginBottom: 28 }}>
                <div style={{ textAlign: 'center', padding: '20px 40px', border: '1px solid #E4E9F1', borderRadius: 12 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 48, fontWeight: 800, color: '#071B45' }}>4.8</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 6 }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-orange text-orange" />
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#8A94A6' }}>124 reviews</p>
                </div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 12.5, color: '#5F6B7C', width: 16 }}>{s}</span>
                      <Star className="w-3.5 h-3.5 fill-orange text-orange" />
                      <div style={{ flex: 1, height: 6, backgroundColor: '#F0F4FA', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: '#FF5A00', borderRadius: 3, width: `${[78, 15, 4, 2, 1][5 - s]}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#8A94A6', width: 24 }}>{[78, 15, 4, 2, 1][5 - s]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { name: 'Dr. Rajesh Sharma', role: 'Senior Cardiologist, Bir Hospital', rating: 5, comment: 'Excellent monitor with clear display and reliable readings. The alarm management system is particularly impressive. Highly recommend for ICU use.', date: 'Dec 12, 2024' },
                  { name: 'Nursing Director, TUTH', role: 'Teaching Hospital, Kathmandu', rating: 5, comment: 'We purchased 8 units for our new ward. Installation was smooth and the MediTech team provided excellent training. Display quality is superb.', date: 'Nov 28, 2024' },
                ].map(review => (
                  <div key={review.name} style={{ border: '1px solid #E4E9F1', borderRadius: 10, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: '#071B45' }}>{review.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#8A94A6' }}>{review.role}</p>
                      </div>
                      <span style={{ fontSize: 11.5, color: '#8A94A6' }}>{review.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                      {[1,2,3,4,5].map(s => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= review.rating ? 'fill-orange text-orange' : 'fill-slate-200 text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#5F6B7C', lineHeight: 1.65 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Frequently Bought Together */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: '#071B45' }}>Frequently Bought Together</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {PRODUCTS.slice(0, 4).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => {
                  setActiveProduct(p)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                onAddToCart={() => setCartCount?.(cartCount + 1)}
                onRentClick={(rentP) => {
                  setActiveProduct(rentP)
                  navigate('rental-detail')
                }}
                onQuoteClick={(quoteP) => {
                  setActiveProduct(quoteP)
                  navigate('request-quote')
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer navigate={navigate} />

    </div>
  )
}
