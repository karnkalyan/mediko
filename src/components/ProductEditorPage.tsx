import { useState } from 'react'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  ShieldCheck,
  Clock,
  Layers,
  DollarSign,
  Package,
  CheckCircle2,
  Save,
} from 'lucide-react'
import type { ProductFormData } from './ProductFormModal'
import ImageUploadDropzone from './ImageUploadDropzone'

interface ProductEditorPageProps {
  onBack: () => void
  onSave: (product: ProductFormData) => void
  initialData?: Partial<ProductFormData> | null
  existingBrands?: string[]
  existingCategories?: string[]
  onOpenAddBrand?: () => void
  onOpenAddCategory?: () => void
}

export default function ProductEditorPage({
  onBack,
  onSave,
  initialData,
  existingBrands = [
    'Mindray',
    'GE Healthcare',
    'Philips Healthcare',
    'Dräger',
    'Yuwell',
    'B. Braun',
    'Schiller',
    'Olympus',
    'Stryker',
  ],
  existingCategories = [
    'Diagnostic & ICU Equipment',
    'Patient Monitoring Systems',
    'Respiratory & Oxygen Therapy',
    'Surgical & OT Workstations',
    'Imaging & Ultrasound',
    'Hospital Furniture & Beds',
    'Infusion & Syringe Pumps',
    'Biomedical Testing & Calibration',
  ],
  onOpenAddBrand,
}: ProductEditorPageProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'rental' | 'media' | 'specs' | 'compliance'>('general')

  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    model: initialData?.model || '',
    sku: initialData?.sku || `MB-${Math.floor(100000 + Math.random() * 900000)}`,
    brand: initialData?.brand || existingBrands[0] || 'Mindray',
    category: initialData?.category || existingCategories[0] || 'Diagnostic & ICU Equipment',
    type: initialData?.type || 'NEW',
    condition: initialData?.condition || 'Factory Brand New with OEM Seals',
    conditionGrade: initialData?.conditionGrade || 'BRAND_NEW',
    regularPriceNpr: initialData?.regularPriceNpr || 250000,
    salePriceNpr: initialData?.salePriceNpr || undefined,
    askForPrice: initialData?.askForPrice || false,
    stockQuantity: initialData?.stockQuantity !== undefined ? initialData.stockQuantity : 5,
    minOrderQty: initialData?.minOrderQty || 1,
    leadTimeDays: initialData?.leadTimeDays || 3,
    rentalDailyRateNpr: initialData?.rentalDailyRateNpr || 1800,
    rentalWeeklyRateNpr: initialData?.rentalWeeklyRateNpr || 10500,
    rentalMonthlyRateNpr: initialData?.rentalMonthlyRateNpr || 38000,
    rentalSecurityDepositNpr: initialData?.rentalSecurityDepositNpr || 25000,
    rentalPenaltyDailyNpr: initialData?.rentalPenaltyDailyNpr || 500,
    primaryImage: initialData?.primaryImage || '/assets/generated/category-monitoring.png',
    galleryImages: initialData?.galleryImages?.length
      ? initialData.galleryImages
      : [
          '/assets/generated/category-monitoring.png',
          '/assets/generated/hero-marketplace.png',
        ],
    description:
      initialData?.description ||
      'Clinical-grade medical system designed for continuous patient monitoring, operating theatres, and ICU facilities across Nepal. Compliant with DDA regulations and certified for high-altitude electrical reliability.',
    features: initialData?.features?.length
      ? initialData.features
      : [
          '12.1-inch High-Resolution Anti-Glare Multi-Touch TFT Color Display',
          'Standard 5-Lead ECG, SpO2 (Nellcor Compatible), NIBP, Dual Temp & Respiration',
          '4-Hour Internal Rechargeable Lithium-ion Battery with Dual AC/DC Input',
          'Automated Arrhythmia Detection & ST Segment Analysis',
          'Central Monitoring Station (CMS) Network Ready via Ethernet & Wi-Fi',
        ],
    specifications: initialData?.specifications?.length
      ? initialData.specifications
      : [
          { key: 'Screen Size', value: '12.1 inch TFT Color Display' },
          { key: 'Resolution', value: '800 x 600 pixels RGB' },
          { key: 'Battery Backup', value: '4.0 Hours Continuous Operation' },
          { key: 'Input Voltage', value: '100-240V AC, 50/60 Hz (Nepal Standard)' },
          { key: 'Electrical Safety', value: 'Class I, Type CF Defibrillator Protected' },
          { key: 'Weight', value: '4.5 kg (with battery)' },
        ],
    warrantyPeriod: initialData?.warrantyPeriod || '2 Years Comprehensive Warranty',
    originCountry: initialData?.originCountry || 'Germany',
    ddaRegNumber: initialData?.ddaRegNumber || 'DDA-MD-2026-8812',
    isCeApproved: initialData?.isCeApproved !== undefined ? initialData.isCeApproved : true,
    isFdaApproved: initialData?.isFdaApproved !== undefined ? initialData.isFdaApproved : true,
    isIsoCertified: initialData?.isIsoCertified !== undefined ? initialData.isIsoCertified : true,
    calibrationIncluded: initialData?.calibrationIncluded !== undefined ? initialData.calibrationIncluded : true,
    installationAvailable: initialData?.installationAvailable !== undefined ? initialData.installationAvailable : true,
    engineerSupport: initialData?.engineerSupport !== undefined ? initialData.engineerSupport : true,
  })

  const [newFeatureText, setNewFeatureText] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleRemoveGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      galleryImages: formData.galleryImages.filter((_, i) => i !== index),
    })
  }

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return
    setFormData({
      ...formData,
      features: [...formData.features, newFeatureText.trim()],
    })
    setNewFeatureText('')
  }

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: newSpecKey.trim(), value: newSpecValue.trim() }],
    })
    setNewSpecKey('')
    setNewSpecValue('')
  }

  const handleRemoveSpecification = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setErrorMsg('Product title is required')
      setActiveTab('general')
      return
    }
    if (formData.regularPriceNpr <= 0) {
      setErrorMsg('Please enter a valid regular price in NPR')
      setActiveTab('pricing')
      return
    }
    setErrorMsg('')
    onSave(formData)
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-16">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Products</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                <span>Products</span>
                <span>/</span>
                <span className="font-semibold text-[#071B45]">
                  {initialData?.id ? `Edit #${initialData.id}` : 'New Product'}
                </span>
              </div>
              <h1 className="font-heading text-base font-bold text-[#071B45]">
                {initialData?.id ? `Edit Product: ${formData.title || 'Equipment'}` : 'Add Medical Equipment'}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D47A1] hover:bg-[#071B45] px-4 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-6">
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Tab Selection Bar - Clean Segmented Control */}
        <div className="mb-6 flex overflow-x-auto rounded border border-border bg-bg-section p-1 gap-1">
          {[
            { id: 'general', label: 'Basic Information', icon: Package, color: 'text-blue-500' },
            { id: 'pricing', label: 'Pricing & Inventory', icon: DollarSign, color: 'text-emerald-500' },
            { id: 'rental', label: 'Rental Tariffs', icon: Clock, color: 'text-cyan-500' },
            { id: 'media', label: 'Media & Visuals', icon: ImageIcon, color: 'text-purple-500' },
            { id: 'specs', label: 'Technical Specifications', icon: Layers, color: 'text-amber-500' },
            { id: 'compliance', label: 'Regulatory Compliance', icon: ShieldCheck, color: 'text-teal-500' },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 px-3 text-xs whitespace-nowrap transition cursor-pointer font-normal ${
                  isActive
                    ? 'bg-white text-navy shadow-xs border border-border'
                    : 'text-text-muted hover:text-text-dark hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Form Body: 2 Columns */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2-Column Primary Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* TAB 1: GENERAL */}
              {activeTab === 'general' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-navy">General Product Information</h3>
                    <p className="text-xs text-slate-500">Provide hospital clients with precise medical equipment details and classifications.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Title / Nomenclature *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Mindray MEC-1200 Multi-Parameter Patient Monitor"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs text-navy outline-none focus:border-orange font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Manufacturer *</label>
                      <div className="flex gap-2">
                        <select
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange bg-white font-medium"
                        >
                          {existingBrands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        {onOpenAddBrand && (
                          <button
                            type="button"
                            onClick={onOpenAddBrand}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-navy hover:border-orange hover:text-orange shrink-0 cursor-pointer"
                          >
                            + Brand
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Model / SKU Reference</label>
                      <input
                        type="text"
                        placeholder="e.g. MEC-1200"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange bg-white font-medium"
                      >
                        {existingCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Listing Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange bg-white font-medium"
                      >
                        <option value="NEW">Brand New</option>
                        <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned (CPO)</option>
                        <option value="RENTAL">Rental Fleet Asset</option>
                        <option value="SPARE_PART">Spare Part / Accessory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Country of Origin</label>
                      <input
                        type="text"
                        placeholder="e.g., Germany, USA, Japan"
                        value={formData.originCountry}
                        onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-medium"
                      />
                    </div>
                  </div>

                  {formData.type === 'CERTIFIED_PRE_OWNED' && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 space-y-2">
                      <label className="block text-xs font-bold text-blue-900">Biomedical Condition Grade</label>
                      <select
                        value={formData.conditionGrade}
                        onChange={(e) => setFormData({ ...formData, conditionGrade: e.target.value as any })}
                        className="h-10 w-full rounded-xl border border-blue-200 bg-white px-3 text-xs text-navy outline-none focus:border-orange font-bold"
                      >
                        <option value="GRADE_A_PLUS">Grade A+ (Pristine Cosmetic &amp; Fresh Calibration)</option>
                        <option value="GRADE_A">Grade A (Minor Cosmetic Marks, 100% Operational)</option>
                        <option value="GRADE_B">Grade B (Standard Hospital Usage, Recalibrated)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Description &amp; Usage Overview</label>
                    <textarea
                      rows={5}
                      placeholder="Detail clinical applications, department suitability (ICU, NICU, OT), patient compatibility..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs text-navy outline-none focus:border-orange font-medium"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & STOCK */}
              {activeTab === 'pricing' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-navy">Pricing, Commercial Terms &amp; Stock</h3>
                    <p className="text-xs text-slate-500">Define hospital wholesale rates, minimum order quantities, and Nepal warehouse lead times.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Regular Retail Price (NPR) *</label>
                      <input
                        type="number"
                        required
                        value={formData.regularPriceNpr}
                        onChange={(e) => setFormData({ ...formData, regularPriceNpr: Number(e.target.value) })}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs text-navy outline-none focus:border-orange font-bold text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sale / Discounted Price (NPR)</label>
                      <input
                        type="number"
                        placeholder="Leave blank if no discount"
                        value={formData.salePriceNpr || ''}
                        onChange={(e) => setFormData({ ...formData, salePriceNpr: e.target.value ? Number(e.target.value) : undefined })}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-xs text-navy outline-none focus:border-orange font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <input
                      type="checkbox"
                      id="askForPrice"
                      checked={formData.askForPrice}
                      onChange={(e) => setFormData({ ...formData, askForPrice: e.target.checked })}
                      className="h-4 w-4 rounded text-orange focus:ring-orange"
                    />
                    <label htmlFor="askForPrice" className="text-xs font-bold text-navy cursor-pointer">
                      "Request Quotation / RFQ Only" (Hide public price and require hospital formal enquiry)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Available Stock Quantity *</label>
                      <input
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Qty (MOQ)</label>
                      <input
                        type="number"
                        value={formData.minOrderQty}
                        onChange={(e) => setFormData({ ...formData, minOrderQty: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Lead Time (Days)</label>
                      <input
                        type="number"
                        value={formData.leadTimeDays}
                        onChange={(e) => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RENTAL FLEET */}
              {activeTab === 'rental' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-navy">Medical Equipment Rental Fleet Tariffs</h3>
                    <p className="text-xs text-slate-500">Set rental prices and refundable deposits for hospitals and clinics.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Daily Rental Tariff (NPR)</label>
                      <input
                        type="number"
                        value={formData.rentalDailyRateNpr || 0}
                        onChange={(e) => setFormData({ ...formData, rentalDailyRateNpr: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Weekly Rental Tariff (NPR)</label>
                      <input
                        type="number"
                        value={formData.rentalWeeklyRateNpr || 0}
                        onChange={(e) => setFormData({ ...formData, rentalWeeklyRateNpr: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rental Tariff (NPR)</label>
                      <input
                        type="number"
                        value={formData.rentalMonthlyRateNpr || 0}
                        onChange={(e) => setFormData({ ...formData, rentalMonthlyRateNpr: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Refundable deposit (NPR)</label>
                      <input
                        type="number"
                        value={formData.rentalSecurityDepositNpr || 0}
                        onChange={(e) => setFormData({ ...formData, rentalSecurityDepositNpr: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-emerald-700 outline-none focus:border-orange font-black"
                      />
                      <small className="text-[10px] text-slate-400">Returned after the equipment is received and checked.</small>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Automated Overdue Daily Penalty (NPR)</label>
                      <input
                        type="number"
                        value={formData.rentalPenaltyDailyNpr || 500}
                        onChange={(e) => setFormData({ ...formData, rentalPenaltyDailyNpr: Number(e.target.value) })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-rose-600 outline-none focus:border-orange font-bold"
                      />
                      <small className="text-[10px] text-slate-400">Charged per day past scheduled lease return.</small>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & VISUALS */}
              {activeTab === 'media' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-navy">Product Media &amp; Visual Assets</h3>
                    <p className="text-xs text-slate-500">
                      Upload high-resolution clinical photographs, display interfaces, control panels, and probe attachments.
                    </p>
                  </div>

                  {/* Primary Product Photo with Drag & Drop */}
                  <div>
                    <ImageUploadDropzone
                      label="Primary Product Image *"
                      sublabel="Main display photo used across marketplace search, catalog cards, and tax invoices."
                      value={formData.primaryImage}
                      onChange={(val) => setFormData({ ...formData, primaryImage: val })}
                      placeholderText="Drag & drop primary product image here, or click to browse files"
                      aspectRatio="wide"
                    />
                  </div>

                  {/* Multi-Angle Gallery with Drag & Drop */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Multi-Angle Gallery Photographs</h4>
                      <p className="text-[11px] text-slate-400">
                        Add side angles, back connector ports, accessory attachments, and packaging views.
                      </p>
                    </div>

                    {/* Quick dropzone to append to gallery */}
                    <ImageUploadDropzone
                      placeholderText="Drag & drop additional photo to append to product gallery"
                      onChange={(newImg) => {
                        if (newImg) {
                          setFormData({
                            ...formData,
                            galleryImages: [...formData.galleryImages, newImg],
                          })
                        }
                      }}
                      aspectRatio="wide"
                    />

                    {/* Gallery Thumbnails List */}
                    {formData.galleryImages.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Current Gallery Images ({formData.galleryImages.length})
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {formData.galleryImages.map((imgUrl, i) => (
                            <div
                              key={i}
                              className="group relative rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden shadow-2xs hover:border-orange transition"
                            >
                              <img
                                src={imgUrl}
                                alt={`Gallery ${i + 1}`}
                                className="h-24 w-full rounded-lg object-contain bg-white"
                              />
                              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                                <span className="font-semibold">Photo #{i + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(i)}
                                  className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: SPECS & FEATURES */}
              {activeTab === 'specs' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                  <div>
                    <div className="border-b border-slate-100 pb-3 mb-4">
                      <h3 className="font-heading text-base font-bold text-navy">Technical Specifications (Key-Value Builder)</h3>
                      <p className="text-xs text-slate-500">Enter technical parameters (Display, Battery, Power, Safety Standards, Dimensions).</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Parameter (e.g. Sampling Rate)"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        className="sm:col-span-2 h-10 rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                      />
                      <input
                        type="text"
                        placeholder="Specification Value (e.g. 1000 Hz)"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        className="sm:col-span-2 h-10 rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpecification}
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-orange px-3 text-xs font-bold text-white hover:bg-orange-hover cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Row</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black">
                          <tr>
                            <th className="p-2.5">Technical Parameter</th>
                            <th className="p-2.5">Specification Value</th>
                            <th className="p-2.5 w-12 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {formData.specifications.map((spec, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold text-navy">{spec.key}</td>
                              <td className="p-2.5 text-slate-700">{spec.value}</td>
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecification(i)}
                                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bulleted Feature Highlights */}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="font-heading text-sm font-bold text-navy mb-2">Key Clinical Features &amp; Highlights</h4>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Add clinical highlight or functionality..."
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="inline-flex items-center gap-1 rounded-xl bg-navy px-4 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.features.map((feat, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-700">
                          <span className="font-medium">• {feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(i)}
                            className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: COMPLIANCE & DDA */}
              {activeTab === 'compliance' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-heading text-base font-bold text-navy">Biomedical Engineering &amp; DDA Nepal Regulatory Compliance</h3>
                    <p className="text-xs text-slate-500">Ensure equipment conforms to Nepal Drug Administration (DDA) rules and NHPC hospital verification.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">DDA Medical Device Registration #</label>
                      <input
                        type="text"
                        value={formData.ddaRegNumber || ''}
                        onChange={(e) => setFormData({ ...formData, ddaRegNumber: e.target.value })}
                        placeholder="e.g. DDA-MD-2026-8812"
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Warranty Term</label>
                      <input
                        type="text"
                        value={formData.warrantyPeriod}
                        onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isCeApproved}
                        onChange={(e) => setFormData({ ...formData, isCeApproved: e.target.checked })}
                        className="h-4 w-4 rounded text-orange"
                      />
                      <span>CE Certified (Europe)</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFdaApproved}
                        onChange={(e) => setFormData({ ...formData, isFdaApproved: e.target.checked })}
                        className="h-4 w-4 rounded text-orange"
                      />
                      <span>US-FDA 510(k) Cleared</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isIsoCertified}
                        onChange={(e) => setFormData({ ...formData, isIsoCertified: e.target.checked })}
                        className="h-4 w-4 rounded text-orange"
                      />
                      <span>ISO 13485:2016 Compliant</span>
                    </label>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.calibrationIncluded}
                        onChange={(e) => setFormData({ ...formData, calibrationIncluded: e.target.checked })}
                        className="h-4 w-4 rounded text-orange"
                      />
                      <span>Pre-Dispatch Calibration &amp; Traceable Certificate Included</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.installationAvailable}
                        onChange={(e) => setFormData({ ...formData, installationAvailable: e.target.checked })}
                        className="h-4 w-4 rounded text-orange"
                      />
                      <span>On-Site Hospital Installation &amp; Clinical In-Service Training Available</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.engineerSupport}
                        onChange={(e) => setFormData({ ...formData, engineerSupport: e.target.checked })}
                        className="h-4 w-4 rounded text-orange"
                      />
                      <span>24/7 Dedicated Nepal NHPC Certified Biomedical Field Support</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Publishing Summary & Metadata (Shopify style) */}
            <div className="space-y-5">
              {/* Publishing Status Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h4 className="font-heading text-xs font-bold text-slate-500 uppercase tracking-wider">Publishing Status</h4>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[9px] font-bold">
                    Ready to Publish
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Listing SKU:</span>
                    <span className="font-mono font-bold text-navy">{formData.sku}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Stock Count:</span>
                    <span className="font-bold text-navy">{formData.stockQuantity} units in stock</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Portal Target:</span>
                    <span className="font-semibold text-slate-700">Mediko Bazaar Nepal</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange font-bold text-xs text-white shadow-md shadow-orange/20 hover:bg-orange-hover transition cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Publish Listing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Organization & Categorization Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h4 className="font-heading text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Classification</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1">Assigned Department</label>
                    <span className="font-semibold text-navy block p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {formData.category}
                    </span>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Manufacturer Brand</label>
                    <span className="font-bold text-navy block p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {formData.brand}
                    </span>
                  </div>
                </div>
              </div>

              {/* DDA Compliance Badge Checklist */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  <h4 className="font-heading text-xs font-bold uppercase tracking-wider">Nepal Compliance Checklist</h4>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>DDA Reg # specified ({formData.ddaRegNumber})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>13% Nepal VAT compliant pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>NHPC Biomedical Support assigned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Warranty: {formData.warrantyPeriod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
