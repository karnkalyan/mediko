import { useState, useEffect } from 'react'
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  DollarSign,
  Package,
  CheckCircle2,
} from 'lucide-react'

export interface ProductFormData {
  id?: number
  title: string
  model: string
  sku: string
  brand: string
  category: string
  type: 'NEW' | 'CERTIFIED_PRE_OWNED' | 'RENTAL' | 'SPARE_PART'
  condition: string
  conditionGrade?: 'BRAND_NEW' | 'GRADE_A_PLUS' | 'GRADE_A' | 'GRADE_B'
  regularPriceNpr: number
  salePriceNpr?: number
  askForPrice: boolean
  stockQuantity: number
  minOrderQty: number
  leadTimeDays: number
  rentalDailyRateNpr?: number
  rentalWeeklyRateNpr?: number
  rentalMonthlyRateNpr?: number
  rentalSecurityDepositNpr?: number
  rentalPenaltyDailyNpr?: number
  primaryImage: string
  galleryImages: string[]
  description: string
  features: string[]
  specifications: Array<{ key: string; value: string }>
  warrantyPeriod: string
  originCountry: string
  ddaRegNumber?: string
  isCeApproved: boolean
  isFdaApproved: boolean
  isIsoCertified: boolean
  calibrationIncluded: boolean
  installationAvailable: boolean
  engineerSupport: boolean
}

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: ProductFormData) => void
  initialData?: Partial<ProductFormData> | null
  existingBrands?: string[]
  existingCategories?: string[]
  onOpenAddBrand?: () => void
  onOpenAddCategory?: () => void
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingBrands = ['Mindray', 'GE Healthcare', 'Philips', 'Dräger', 'Siemens', 'Yuwell', 'B. Braun', 'Schiller'],
  existingCategories = [
    'Patient Monitoring',
    'ICU & Critical Care',
    'Respiratory & Oxygen',
    'Radiology & Imaging',
    'Hospital Furniture',
    'Diagnostic & Lab',
    'Surgical & OT',
    'Spare Parts & Sensors',
  ],
  onOpenAddBrand,
  onOpenAddCategory,
}: ProductFormModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'rental' | 'media' | 'specs' | 'compliance'>('general')

  const [form, setForm] = useState<ProductFormData>({
    title: '',
    model: '',
    sku: `MB-MED-${Math.floor(1000 + Math.random() * 9000)}`,
    brand: existingBrands[0] || 'Mindray',
    category: existingCategories[0] || 'Patient Monitoring',
    type: 'NEW',
    condition: 'Brand New (Factory Sealed)',
    conditionGrade: 'BRAND_NEW',
    regularPriceNpr: 185000,
    salePriceNpr: 175000,
    askForPrice: false,
    stockQuantity: 10,
    minOrderQty: 1,
    leadTimeDays: 2,
    rentalDailyRateNpr: 2500,
    rentalWeeklyRateNpr: 12000,
    rentalMonthlyRateNpr: 35000,
    rentalSecurityDepositNpr: 40000,
    rentalPenaltyDailyNpr: 500,
    primaryImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop',
    ],
    description: 'High-precision clinical diagnostic and patient monitoring system built for ICU and emergency hospital wards across Nepal.',
    features: [
      'Real-time multi-parameter sensor telemetry',
      'High-resolution anti-glare medical LCD display',
      'Rechargeable 6-hour lithium backup battery',
      'NIST-traceable calibration with Nepal DDA compliance seal',
    ],
    specifications: [
      { key: 'Display Size', value: '12.1 inch High-Res TFT Color Touch' },
      { key: 'Parameters', value: 'ECG (3/5 Lead), SpO2, NIBP, Respiration, Dual Temp, IBP' },
      { key: 'Power Supply', value: '100-240V AC, 50/60Hz with Surge Protection' },
      { key: 'Battery Runtime', value: 'Up to 360 minutes continuous monitoring' },
      { key: 'Weight', value: '4.2 kg (Portable with Bedside Hook)' },
    ],
    warrantyPeriod: '2 Years Comprehensive Warranty',
    originCountry: 'Germany',
    ddaRegNumber: 'DDA-MD-2082-9912',
    isCeApproved: true,
    isFdaApproved: true,
    isIsoCertified: true,
    calibrationIncluded: true,
    installationAvailable: true,
    engineerSupport: true,
  })

  const [newFeatureInput, setNewFeatureInput] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        specifications: initialData.specifications || prev.specifications,
        features: initialData.features || prev.features,
        galleryImages: initialData.galleryImages || prev.galleryImages,
      }))
    }
  }, [initialData])

  if (!isOpen) return null

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return
    setForm({ ...form, features: [...form.features, newFeatureInput.trim()] })
    setNewFeatureInput('')
  }

  const handleRemoveFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) })
  }

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return
    setForm({
      ...form,
      specifications: [...form.specifications, { key: newSpecKey.trim(), value: newSpecValue.trim() }],
    })
    setNewSpecKey('')
    setNewSpecValue('')
  }

  const handleRemoveSpec = (index: number) => {
    setForm({ ...form, specifications: form.specifications.filter((_, i) => i !== index) })
  }

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return
    setForm({ ...form, galleryImages: [...form.galleryImages, newGalleryUrl.trim()] })
    setNewGalleryUrl('')
  }

  const handleRemoveGalleryImage = (index: number) => {
    setForm({ ...form, galleryImages: form.galleryImages.filter((_, i) => i !== index) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-5 backdrop-blur-xs animate-fadeIn">
      <div className="relative flex flex-col h-full max-h-[92vh] w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange text-white shadow-sm shadow-orange/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-navy">
                {initialData ? 'Edit Medical Product' : 'Add New E-Commerce Product'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure catalog specifications, image gallery, biomedical certifications &amp; rental fleet specs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-slate-200/80 text-slate-500 hover:bg-slate-300 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 overflow-x-auto text-xs font-normal scrollbar-none">
          {[
            { id: 'general', label: '1. Basic Information', icon: Layers, color: 'text-blue-500' },
            { id: 'pricing', label: '2. Pricing & Stock', icon: DollarSign, color: 'text-emerald-500' },
            { id: 'rental', label: '3. Rental Parameters', icon: Clock, color: 'text-cyan-500' },
            { id: 'media', label: '4. Images & Gallery', icon: ImageIcon, color: 'text-purple-500' },
            { id: 'specs', label: '5. Tech Specs & Features', icon: Sparkles, color: 'text-amber-500' },
            { id: 'compliance', label: '6. Biomedical & DDA', icon: ShieldCheck, color: 'text-teal-500' },
          ].map((t) => {
            const Icon = t.icon
            const isActive = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 border-b-2 px-3.5 py-3 whitespace-nowrap transition cursor-pointer font-normal ${
                  isActive
                    ? 'border-orange text-navy bg-orange/5'
                    : 'border-transparent text-slate-500 hover:text-navy hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${t.color}`} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Full Title &amp; Commercial Model <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mindray BeneVision N1 ICU Multi-Parameter Patient Monitor"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-navy outline-none focus:border-orange focus:ring-1 focus:ring-orange/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">Brand / OEM Manufacturer</label>
                    {onOpenAddBrand && (
                      <button
                        type="button"
                        onClick={onOpenAddBrand}
                        className="text-[10px] font-bold text-orange hover:underline cursor-pointer border-none bg-transparent"
                      >
                        + New Brand
                      </button>
                    )}
                  </div>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-navy outline-none focus:border-orange cursor-pointer"
                  >
                    {existingBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">Category</label>
                    {onOpenAddCategory && (
                      <button
                        type="button"
                        onClick={onOpenAddCategory}
                        className="text-[10px] font-bold text-orange hover:underline cursor-pointer border-none bg-transparent"
                      >
                        + New Category
                      </button>
                    )}
                  </div>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-medium text-navy outline-none focus:border-orange cursor-pointer"
                  >
                    {existingCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Listing Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-bold text-navy outline-none focus:border-orange cursor-pointer"
                  >
                    <option value="NEW">Brand New (Factory Sealed)</option>
                    <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned (48-Pt Audit)</option>
                    <option value="RENTAL">Rental Fleet Asset</option>
                    <option value="SPARE_PART">Genuine Replacement Spare Part</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU / Model Number</label>
                  <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-navy outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country of Origin</label>
                  <input
                    value={form.originCountry}
                    onChange={(e) => setForm({ ...form, originCountry: e.target.value })}
                    placeholder="e.g. Germany, Japan, China, USA"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={form.leadTimeDays}
                    onChange={(e) => setForm({ ...form, leadTimeDays: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Commercial Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Clinical applications, intended hospital use, and features..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-navy outline-none focus:border-orange"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STOCK */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Selling Price (NPR)</label>
                  <input
                    type="number"
                    value={form.regularPriceNpr}
                    onChange={(e) => setForm({ ...form, regularPriceNpr: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-navy outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale / Promotional Price (NPR)</label>
                  <input
                    type="number"
                    value={form.salePriceNpr || ''}
                    onChange={(e) => setForm({ ...form, salePriceNpr: Number(e.target.value) || undefined })}
                    placeholder="Optional discount price"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono text-emerald-700 outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Units Available</label>
                  <input
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-navy outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="askForPrice"
                  checked={form.askForPrice}
                  onChange={(e) => setForm({ ...form, askForPrice: e.target.checked })}
                  className="accent-orange h-4 w-4 rounded"
                />
                <label htmlFor="askForPrice" className="text-slate-700 font-bold cursor-pointer">
                  "Ask for Price" Mode (Hide public price, require hospital quotation RFQ submission)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
                  <input
                    type="number"
                    value={form.minOrderQty}
                    onChange={(e) => setForm({ ...form, minOrderQty: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturer Warranty Duration</label>
                  <input
                    value={form.warrantyPeriod}
                    onChange={(e) => setForm({ ...form, warrantyPeriod: e.target.value })}
                    placeholder="e.g. 2 Years Comprehensive Warranty"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RENTAL FLEET PARAMETERS */}
          {activeTab === 'rental' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-purple-700" />
                <span>
                  Configure rental tariff rates and escrow deposits. These parameters are used by the automated Rental Operations and Overdue Penalty Engine.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daily Rental Rate (NPR)</label>
                  <input
                    type="number"
                    value={form.rentalDailyRateNpr || 0}
                    onChange={(e) => setForm({ ...form, rentalDailyRateNpr: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-navy outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weekly Rental Rate (NPR)</label>
                  <input
                    type="number"
                    value={form.rentalWeeklyRateNpr || 0}
                    onChange={(e) => setForm({ ...form, rentalWeeklyRateNpr: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-navy outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Rental Rate (NPR)</label>
                  <input
                    type="number"
                    value={form.rentalMonthlyRateNpr || 0}
                    onChange={(e) => setForm({ ...form, rentalMonthlyRateNpr: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-navy outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Refundable Security Deposit Escrow (NPR)</label>
                  <input
                    type="number"
                    value={form.rentalSecurityDepositNpr || 0}
                    onChange={(e) => setForm({ ...form, rentalSecurityDepositNpr: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-black text-emerald-700 outline-none focus:border-orange"
                  />
                  <small className="text-slate-400 mt-1 block">Held in corporate escrow until physical return verification.</small>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daily Overdue Return Penalty Rate (NPR/Day)</label>
                  <input
                    type="number"
                    value={form.rentalPenaltyDailyNpr || 500}
                    onChange={(e) => setForm({ ...form, rentalPenaltyDailyNpr: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-rose-600 outline-none focus:border-orange"
                  />
                  <small className="text-slate-400 mt-1 block">Accrues automatically per day if returned past scheduled end date.</small>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    required
                    value={form.primaryImage}
                    onChange={(e) => setForm({ ...form, primaryImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-navy font-mono outline-none focus:border-orange"
                  />
                  <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <img src={form.primaryImage} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Photo Gallery (Angle Views &amp; Accessories)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Enter additional photo URL..."
                    className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="flex items-center gap-1 rounded-xl bg-navy px-4 text-white font-bold cursor-pointer hover:bg-navy-deep transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Photo
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {form.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={img} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SPECS & FEATURES */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              {/* Features Builder */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Clinical Highlights (Bullet Points)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    placeholder="e.g. Built-in thermal printer and wireless HL7 export..."
                    className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="flex items-center gap-1 rounded-xl bg-orange px-4 text-white font-bold cursor-pointer hover:bg-orange-hover transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {form.features.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-700">{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Key-Value Builder */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block font-bold text-slate-700 mb-1">Engineering Specifications Table</label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <input
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Spec Parameter (e.g. Battery)"
                    className="col-span-2 h-10 rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                  <input
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="Value (e.g. 6 Hours Lithium)"
                    className="col-span-2 h-10 rounded-xl border border-slate-200 px-3 text-navy outline-none focus:border-orange"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="flex items-center justify-center gap-1 rounded-xl bg-navy text-white font-bold cursor-pointer hover:bg-navy-deep transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {form.specifications.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white text-xs">
                      <span className="font-bold text-slate-700 w-1/3">{s.key}</span>
                      <span className="text-slate-600 flex-1">{s.value}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BIOMEDICAL & COMPLIANCE */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nepal DDA Registration Number</label>
                  <input
                    value={form.ddaRegNumber || ''}
                    onChange={(e) => setForm({ ...form, ddaRegNumber: e.target.value })}
                    placeholder="e.g. DDA-MD-2082-9912"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 font-mono font-bold text-navy outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">BMET Condition Grade</label>
                  <select
                    value={form.conditionGrade || 'BRAND_NEW'}
                    onChange={(e) => setForm({ ...form, conditionGrade: e.target.value as any })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-navy font-bold outline-none focus:border-orange cursor-pointer"
                  >
                    <option value="BRAND_NEW">Grade A+ (Brand New / Factory Sealed)</option>
                    <option value="GRADE_A">Grade A (Like New / Under 500 Hours)</option>
                    <option value="GRADE_B">Grade B (Good Condition / Fully Serviced)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-navy font-bold mb-2">Hospital Procurement Certifications:</strong>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isCeApproved}
                      onChange={(e) => setForm({ ...form, isCeApproved: e.target.checked })}
                      className="accent-orange h-4 w-4"
                    />
                    <span className="font-semibold text-slate-700">CE European Certified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFdaApproved}
                      onChange={(e) => setForm({ ...form, isFdaApproved: e.target.checked })}
                      className="accent-orange h-4 w-4"
                    />
                    <span className="font-semibold text-slate-700">US FDA Approved</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isIsoCertified}
                      onChange={(e) => setForm({ ...form, isIsoCertified: e.target.checked })}
                      className="accent-orange h-4 w-4"
                    />
                    <span className="font-semibold text-slate-700">ISO 13485 Medical QMS</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <strong className="block text-emerald-900 font-bold mb-2">Biomedical Engineer Service Inclusions:</strong>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.calibrationIncluded}
                      onChange={(e) => setForm({ ...form, calibrationIncluded: e.target.checked })}
                      className="accent-emerald-600 h-4 w-4"
                    />
                    <span className="font-semibold text-slate-800">
                      NIST Traceable Calibration Certificate Included (+NPR 1,500 value)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.installationAvailable}
                      onChange={(e) => setForm({ ...form, installationAvailable: e.target.checked })}
                      className="accent-emerald-600 h-4 w-4"
                    />
                    <span className="font-semibold text-slate-800">
                      Hospital On-Site Installation &amp; Wall Mounting (+NPR 3,500 value)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.engineerSupport}
                      onChange={(e) => setForm({ ...form, engineerSupport: e.target.checked })}
                      className="accent-emerald-600 h-4 w-4"
                    />
                    <span className="font-semibold text-slate-800">
                      Dedicated Biomedical Field Engineer Direct Support (+NPR 2,500 value)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">SKU: {form.sku}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-orange px-6 py-2.5 font-bold text-white shadow-lg shadow-orange/25 hover:bg-orange-hover transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{initialData ? 'Update Product' : 'Publish Product to Marketplace'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
