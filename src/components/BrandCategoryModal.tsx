import React, { useState } from 'react'
import {
  X,
  Tag,
  FolderTree,
  Building2,
  Globe2,
  Plus,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Wind,
  Bed,
  Scissors,
  FlaskConical,
  Truck,
} from 'lucide-react'
import ImageUploadDropzone from './ImageUploadDropzone'

export interface BrandData {
  id: string | number
  name: string
  originCountry: string
  logoUrl?: string
  isAuthorized: boolean
  distributorName?: string
  website?: string
  departments?: string[]
}

export interface CategoryData {
  id: string | number
  name: string
  slug: string
  department: string
  description?: string
  iconName: string
  imageUrl?: string
  ddaClassification: 'Class A (Low Risk)' | 'Class B (Low-Med)' | 'Class C (Med-High)' | 'Class D (High Risk)'
  colorHex?: string
}

interface BrandCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'brand' | 'category'
  onAddBrand?: (brand: BrandData) => void
  onAddCategory?: (category: CategoryData) => void
  existingBrands?: string[]
  existingCategories?: string[]
}

export default function BrandCategoryModal({
  isOpen,
  onClose,
  initialMode = 'brand',
  onAddBrand,
  onAddCategory,
}: BrandCategoryModalProps) {
  const [mode, setMode] = useState<'brand' | 'category'>(initialMode)

  // Brand Form State
  const [brandName, setBrandName] = useState('')
  const [originCountry, setOriginCountry] = useState('Germany')
  const [logoUrl, setLogoUrl] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(true)
  const [distributorName, setDistributorName] = useState('Mediko BioTech Pvt. Ltd. (Sole Nepal Importer)')
  const [website, setWebsite] = useState('')
  const [selectedDept, setSelectedDept] = useState('Critical Care & ICU')

  // Category Form State
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [catDept, setCatDept] = useState('Biomedical & ICU')
  const [catDesc, setCatDesc] = useState('')
  const [catIcon, setCatIcon] = useState('stethoscope')
  const [catImage, setCatImage] = useState('')
  const [ddaClass, setDdaClass] = useState<'Class A (Low Risk)' | 'Class B (Low-Med)' | 'Class C (Med-High)' | 'Class D (High Risk)'>('Class C (Med-High)')

  if (!isOpen) return null

  const handleCatNameChange = (val: string) => {
    setCatName(val)
    setCatSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleSubmitBrand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandName.trim()) return

    const newBrand: BrandData = {
      id: Date.now(),
      name: brandName.trim(),
      originCountry,
      logoUrl: logoUrl.trim() || `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=160&auto=format&fit=crop&q=80`,
      isAuthorized,
      distributorName: isAuthorized ? distributorName : undefined,
      website,
      departments: [selectedDept],
    }

    if (onAddBrand) onAddBrand(newBrand)
    onClose()
  }

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName.trim()) return

    const newCategory: CategoryData = {
      id: Date.now(),
      name: catName.trim(),
      slug: catSlug || catName.toLowerCase().replace(/\s+/g, '-'),
      department: catDept,
      description: catDesc,
      iconName: catIcon,
      imageUrl: catImage.trim() || undefined,
      ddaClassification: ddaClass,
      colorHex: '#EFF6FF',
    }

    if (onAddCategory) onAddCategory(newCategory)
    onClose()
  }

  const iconOptions = [
    { id: 'stethoscope', label: 'Diagnostic / Stethoscope', icon: Stethoscope },
    { id: 'heart-pulse', label: 'Patient Care / Monitor', icon: HeartPulse },
    { id: 'wind', label: 'Respiratory / Ventilator', icon: Wind },
    { id: 'bed', label: 'Hospital Furniture / ICU Bed', icon: Bed },
    { id: 'scissors', label: 'Surgical / OT Suite', icon: Scissors },
    { id: 'flask-conical', label: 'Lab & Diagnostics', icon: FlaskConical },
    { id: 'truck', label: 'Emergency & Ambulatory', icon: Truck },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-orange/10 p-2 text-orange">
              {mode === 'brand' ? <Building2 className="w-5 h-5" /> : <FolderTree className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-navy">
                {mode === 'brand' ? 'Add Medical Equipment Brand' : 'Create Equipment Category'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'brand'
                  ? 'Register global manufacturer or licensed Nepal distributor'
                  : 'Define clinical category with DDA classification'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 pt-2">
          <button
            type="button"
            onClick={() => setMode('brand')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              mode === 'brand'
                ? 'border-orange text-orange'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <Tag className="w-4 h-4" />
            Brand / Manufacturer
          </button>
          <button
            type="button"
            onClick={() => setMode('category')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              mode === 'category'
                ? 'border-orange text-orange'
                : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Clinical Category
          </button>
        </div>

        {/* Brand Form */}
        {mode === 'brand' && (
          <form onSubmit={handleSubmitBrand} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brand / Manufacturer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Dräger, Mindray, Philips Healthcare, GE Healthcare"
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-navy outline-none focus:border-orange focus:ring-1 focus:ring-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Origin Country</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                >
                  <option value="Germany">Germany (CE Certified)</option>
                  <option value="Japan">Japan (PMDA Certified)</option>
                  <option value="United States">United States (US FDA)</option>
                  <option value="China">China (NMPA / CE)</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="South Korea">South Korea (KFDA)</option>
                  <option value="India">India (CDSCO)</option>
                  <option value="Nepal">Nepal (Domestic Manufactured)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Clinical Domain</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                >
                  <option value="Critical Care & ICU">Critical Care &amp; ICU</option>
                  <option value="Diagnostic Imaging">Diagnostic Imaging &amp; Radiology</option>
                  <option value="Cardiology & CathLab">Cardiology &amp; CathLab</option>
                  <option value="Surgical & OT Suite">Surgical &amp; OT Suite</option>
                  <option value="Pathology & Laboratory">Pathology &amp; Laboratory</option>
                  <option value="Respiratory & Pulmonology">Respiratory &amp; Pulmonology</option>
                  <option value="Hospital Infrastructure">Hospital Infrastructure &amp; Beds</option>
                </select>
              </div>
            </div>

            <div>
              <ImageUploadDropzone
                label="Brand Logo / Insignia"
                sublabel="Drag & drop PNG/SVG logo file from your computer, browse file, or select an official healthcare brand preset."
                value={logoUrl}
                onChange={setLogoUrl}
                presetsType="brands"
                aspectRatio="square"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAuthorized}
                  onChange={(e) => setIsAuthorized(e.target.checked)}
                  className="rounded text-orange focus:ring-orange w-4 h-4"
                />
                <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Official Authorized Distributor in Nepal
                </span>
              </label>

              {isAuthorized && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Licensed Distributor Entity Name
                  </label>
                  <input
                    type="text"
                    value={distributorName}
                    onChange={(e) => setDistributorName(e.target.value)}
                    placeholder="e.g. Mediko BioTech Pvt. Ltd. (DDA Reg #58821)"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-navy outline-none focus:border-orange"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Manufacturer Official Portal</label>
              <div className="flex items-center rounded-xl border border-slate-200 px-3 focus-within:border-orange">
                <Globe2 className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.draeger.com"
                  className="h-10 w-full text-xs text-navy outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-orange hover:bg-orange-hover rounded-xl shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Save Brand Listing
              </button>
            </div>
          </form>
        )}

        {/* Category Form */}
        {mode === 'category' && (
          <form onSubmit={handleSubmitCategory} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => handleCatNameChange(e.target.value)}
                placeholder="e.g. Critical Care ICU Ventilators"
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-navy outline-none focus:border-orange focus:ring-1 focus:ring-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="h-10 w-full font-mono rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Department</label>
                <select
                  value={catDept}
                  onChange={(e) => setCatDept(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange"
                >
                  <option value="Biomedical & ICU">Biomedical &amp; ICU</option>
                  <option value="Radiology & Imaging">Radiology &amp; Imaging</option>
                  <option value="Operation Theater (OT)">Operation Theater (OT)</option>
                  <option value="Emergency & Trauma">Emergency &amp; Trauma</option>
                  <option value="Dialysis & Nephrology">Dialysis &amp; Nephrology</option>
                  <option value="Home Healthcare">Home Healthcare</option>
                  <option value="Pathology Lab">Pathology Lab</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                DDA Nepal Regulatory Device Classification
              </label>
              <select
                value={ddaClass}
                onChange={(e) => setDdaClass(e.target.value as any)}
                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-navy outline-none focus:border-orange font-semibold"
              >
                <option value="Class A (Low Risk)">Class A (Low Risk - e.g. Hospital Beds, Stethoscopes)</option>
                <option value="Class B (Low-Med)">Class B (Low-Moderate - e.g. Syringe Pumps, ECGs)</option>
                <option value="Class C (Med-High)">Class C (Moderate-High - e.g. Ventilators, Dialysis)</option>
                <option value="Class D (High Risk)">Class D (High Risk - e.g. Defibrillators, Heart-Lung)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Icon Representation</label>
              <div className="grid grid-cols-2 gap-2">
                {iconOptions.map((opt) => {
                  const IconComp = opt.icon
                  const isSelected = catIcon === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCatIcon(opt.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? 'border-orange bg-orange/5 text-orange font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-orange' : 'text-slate-500'}`} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <ImageUploadDropzone
                label="Category Banner / Visual Header"
                sublabel="Drag & drop department visual, upload file, or select a medical visual preset."
                value={catImage}
                onChange={setCatImage}
                presetsType="categories"
                aspectRatio="wide"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category Description</label>
              <textarea
                rows={2}
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Brief summary of medical instruments categorized here..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-navy outline-none focus:border-orange"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-orange hover:bg-orange-hover rounded-xl shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Save Category
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
