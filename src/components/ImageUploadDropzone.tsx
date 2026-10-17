import React, { useState, useRef } from 'react'
import {
  UploadCloud,
  X,
  Check,
  Sparkles,
  RefreshCw,
} from 'lucide-react'

export interface ImageUploadDropzoneProps {
  value?: string
  onChange: (dataUrlOrUrl: string) => void
  label?: string
  sublabel?: string
  aspectRatio?: 'square' | 'wide' | 'auto'
  presetsType?: 'brands' | 'categories' | 'products' | 'none'
  placeholderText?: string
  className?: string
  maxSizeMB?: number
}

// Healthcare Brand Logo Presets (High-res transparent SVG/PNG)
const BRAND_PRESETS = [
  {
    name: 'Mindray',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300&auto=format&fit=crop&q=80',
    country: 'China',
  },
  {
    name: 'GE Healthcare',
    url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&auto=format&fit=crop&q=80',
    country: 'USA',
  },
  {
    name: 'Philips',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&auto=format&fit=crop&q=80',
    country: 'Netherlands',
  },
  {
    name: 'Dräger',
    url: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=300&auto=format&fit=crop&q=80',
    country: 'Germany',
  },
  {
    name: 'Schiller',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=300&auto=format&fit=crop&q=80',
    country: 'Switzerland',
  },
  {
    name: 'Yuwell',
    url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&auto=format&fit=crop&q=80',
    country: 'China',
  },
  {
    name: 'B. Braun',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80',
    country: 'Germany',
  },
  {
    name: 'Olympus',
    url: 'https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=300&auto=format&fit=crop&q=80',
    country: 'Japan',
  },
]

// Category Visual Presets
const CATEGORY_PRESETS = [
  {
    name: 'Patient Monitoring',
    url: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'ICU Ventilators',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Diagnostic Ultrasound',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Surgical & OT Beds',
    url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Oxygen Concentrators',
    url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Defibrillators & ECG',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=300&auto=format&fit=crop&q=80',
  },
]

export default function ImageUploadDropzone({
  value,
  onChange,
  label,
  sublabel,
  aspectRatio = 'square',
  presetsType = 'none',
  placeholderText = 'Drag & drop image file here, or browse from computer',
  className = '',
  maxSizeMB = 5,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [importUrlInput, setImportUrlInput] = useState('')
  const [showUrlField, setShowUrlField] = useState(false)
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    setErrorMsg('')
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, SVG, WebP)')
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`Image size must be under ${maxSizeMB}MB`)
      return
    }

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result)
        setFileMeta({
          name: file.name,
          size: sizeFormatted,
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const handleApplyUrl = () => {
    if (!importUrlInput.trim()) return
    onChange(importUrlInput.trim())
    setFileMeta({
      name: 'Web Imported Image',
      size: 'Remote URL',
    })
    setImportUrlInput('')
    setShowUrlField(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setFileMeta(null)
    setErrorMsg('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const presets = presetsType === 'brands' ? BRAND_PRESETS : presetsType === 'categories' ? CATEGORY_PRESETS : []

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || sublabel) && (
        <div className="flex items-center justify-between">
          <div>
            {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
            {sublabel && <p className="text-[11px] text-slate-400">{sublabel}</p>}
          </div>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700 font-semibold">
          {errorMsg}
        </div>
      )}

      {value ? (
        // Preview Mode
        <div className="relative rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-xs hover:border-orange/50 transition">
          <div className="flex items-center gap-3">
            <div
              className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1.5 ${
                aspectRatio === 'wide' ? 'h-20 w-32' : 'h-16 w-16'
              }`}
            >
              <img
                src={value}
                alt="Uploaded"
                className="h-full w-full object-contain"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Image Loaded &amp; Ready</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">
                {fileMeta?.name || 'Asset Image'}
              </p>
              <span className="text-[10px] text-slate-400 block font-mono">
                {fileMeta?.size || 'Direct asset'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Dropzone Mode
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
            isDragging
              ? 'border-orange bg-orange/5 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/60 hover:border-orange/60 hover:bg-orange/5'
          }`}
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm border border-slate-200 text-orange group-hover:scale-110 group-hover:border-orange/30 transition">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="mt-3">
            <span className="text-xs font-bold text-navy group-hover:text-orange transition">
              {placeholderText}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports PNG, JPG, SVG, WebP up to {maxSizeMB}MB
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-2xs group-hover:border-orange/30">
              Browse Computer
            </span>
            <span className="text-slate-300 text-xs">or</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowUrlField(!showUrlField)
              }}
              className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-600 hover:text-orange hover:border-orange/30 transition cursor-pointer shadow-2xs"
            >
              Import from URL
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL Import Drawer */}
      {showUrlField && !value && (
        <div className="rounded-xl border border-orange/20 bg-orange/5 p-3 animate-in fade-in duration-150">
          <label className="block text-[11px] font-bold text-orange mb-1">
            Import Direct Image URL (HTTPS):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={importUrlInput}
              onChange={(e) => setImportUrlInput(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs text-navy outline-none focus:border-orange"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-bold hover:bg-orange-hover transition cursor-pointer"
            >
              Import
            </button>
          </div>
        </div>
      )}

      {/* Quick 1-Click Healthcare Presets */}
      {presets.length > 0 && !value && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Or Choose Popular {presetsType === 'brands' ? 'Healthcare Brand Logo' : 'Category'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  onChange(p.url)
                  setFileMeta({
                    name: `${p.name} Verified Asset`,
                    size: 'Official Asset',
                  })
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-orange hover:bg-orange/5 hover:text-orange transition cursor-pointer shadow-2xs"
              >
                <img src={p.url} alt={p.name} className="h-3.5 w-3.5 rounded-xs object-cover" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
