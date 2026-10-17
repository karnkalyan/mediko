import { useState, useEffect, useMemo } from 'react'
import type { NavProps, Product, Page, ProductType } from '../types'
import { PRODUCTS, getLiveProducts } from '../data/products'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import { apiGetFeaturedProducts } from '../lib/api'
import {
  ShieldCheck,
  Truck,
  Headphones,
  Lock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Wind,
  Bed,
  Scissors,
  Cog,
  Wrench,
  Building2,
  ClipboardCheck,
  FileText,
  BadgeCheck,
  Heart,
  MessageSquare,
  Clock,
  Sparkles,
  Shield,
  Layers,
  Activity,
  Eye,
  AlertCircle,
  Globe,
} from 'lucide-react'

export default function Homepage({ navigate, cartCount, setCartCount, currentPage }: NavProps) {
  const [activeTab, setActiveTab] = useState<'top' | 'bestseller' | 'trending' | 'new' | 'rental' | 'spare'>('top')
  const [sliderIndex, setSliderIndex] = useState(0)
  const [heroSlide, setHeroSlide] = useState(0)
  const [isHeroPaused, setIsHeroPaused] = useState(false)
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'ICU' | 'RESPIRATORY' | 'DIAGNOSTIC' | 'RENTAL' | 'SPARE' | 'FURNITURE'>('ALL')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [featuredList, setFeaturedList] = useState<Product[]>(() => getLiveProducts().slice(0, 12))

  useEffect(() => {
    const handleSync = () => {
      setFeaturedList(getLiveProducts().slice(0, 12))
    }
    window.addEventListener('mediko_products_updated', handleSync)
    return () => window.removeEventListener('mediko_products_updated', handleSync)
  }, [])

  // Auto-play hero slider every 5.5 seconds unless paused on mouse hover
  useEffect(() => {
    if (isHeroPaused) return
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 5)
    }, 5500)
    return () => clearInterval(timer)
  }, [isHeroPaused])

  useEffect(() => {
    apiGetFeaturedProducts()
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          const adapted: Product[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            brand: item.brand,
            model: item.model,
            sku: item.sku,
            seller: item.sellerName || 'MediTech Solutions',
            sellerVerified: item.sellerVerified ?? true,
            category: item.category?.name || 'Medical Equipment',
            type: (item.type === 'RENTAL' ? 'rental' : item.type === 'CERTIFIED_PRE_OWNED' ? 'used' : item.type === 'SPARE_PART' ? 'spare-part' : 'new') as ProductType,
            condition: item.condition || 'New',
            price: item.price ? Number(item.price) : null,
            oldPrice: item.oldPrice ? Number(item.oldPrice) : undefined,
            askForPrice: item.askForPrice || false,
            currency: item.currency || 'NPR',
            rating: Number(item.rating) || 4.8,
            reviews: item.reviewsCount || 42,
            image: item.image,
            badge: item.badge,
            inStock: item.inStock ?? true,
            rentalDaily: item.rentalDaily ? Number(item.rentalDaily) : undefined,
            rentalWeekly: item.rentalWeekly ? Number(item.rentalWeekly) : undefined,
            rentalMonthly: item.rentalMonthly ? Number(item.rentalMonthly) : undefined,
            rentalDeposit: item.rentalDeposit ? Number(item.rentalDeposit) : undefined,
            description: item.description,
          }))
          setFeaturedList(adapted)
        }
      })
      .catch(() => {
        // Fallback to initial PRODUCTS slice
      })
  }, [])

  const openQuoteForProduct = (_title: string) => navigate('request-quote')

  const handleAddToCart = () => {
    if (setCartCount) setCartCount(cartCount + 1)
  }

  const [selectedCategoryTab, setSelectedCategoryTab] = useState('ALL')

  // 24 Comprehensive Categories with high-definition medical photos and matching Lucide icons
  const categories = [
    {
      name: 'ICU & Patient Care',
      dept: 'CRITICAL_CARE',
      count: '1,240+ Products',
      icon: <HeartPulse className="h-5 w-5 text-blue-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-monitoring.png',
    },
    {
      name: 'Radiology & Imaging',
      dept: 'DIAGNOSTIC',
      count: '480+ Systems',
      icon: <Layers className="h-5 w-5 text-indigo-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-ultrasound.png',
    },
    {
      name: 'Cardiology & ECG',
      dept: 'CRITICAL_CARE',
      count: '650+ Devices',
      icon: <Activity className="h-5 w-5 text-rose-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-ecg.png',
    },
    {
      name: 'Diagnostic & Lab',
      dept: 'DIAGNOSTIC',
      count: '1,150+ Items',
      icon: <Stethoscope className="h-5 w-5 text-emerald-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-lab.png',
    },
    {
      name: 'Respiratory & Oxygen',
      dept: 'CRITICAL_CARE',
      count: '720+ Products',
      icon: <Wind className="h-5 w-5 text-cyan-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-respiratory.png',
    },
    {
      name: 'Hospital Furniture',
      dept: 'HOSPITAL_SETUP',
      count: '840+ Products',
      icon: <Bed className="h-5 w-5 text-amber-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-furniture.png',
    },
    {
      name: 'Surgical & OT Suite',
      dept: 'CRITICAL_CARE',
      count: '980+ Instruments',
      icon: <Scissors className="h-5 w-5 text-rose-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-surgical.png',
    },
    {
      name: 'Biomedical Spares',
      dept: 'SERVICES_SPARES',
      count: '2,800+ Parts',
      icon: <Cog className="h-5 w-5 text-slate-600" />,
      page: 'spare-parts' as Page,
      image: '/assets/generated/category-spares.png',
    },
    {
      name: 'Certified Pre-Owned',
      dept: 'RENTAL_USED',
      count: '450+ 48-Pt Audited',
      icon: <ShieldCheck className="h-5 w-5 text-teal-600" />,
      page: 'used-products' as Page,
      image: '/assets/generated/hero-diagnostics.png',
    },
    {
      name: 'Rental Fleets',
      dept: 'RENTAL_USED',
      count: '180+ Available Now',
      icon: <Clock className="h-5 w-5 text-purple-600" />,
      page: 'rental-products' as Page,
      image: '/assets/generated/hero-homecare.png',
    },
    {
      name: 'Home Healthcare',
      dept: 'HOSPITAL_SETUP',
      count: '890+ Devices',
      icon: <Building2 className="h-5 w-5 text-orange" />,
      page: 'home-care' as Page,
      image: '/assets/generated/hero-homecare.png',
    },
    {
      name: 'Emergency & Trauma',
      dept: 'CRITICAL_CARE',
      count: '410+ Units',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-monitoring.png',
    },
    {
      name: 'Ophthalmic & Dental',
      dept: 'DIAGNOSTIC',
      count: '390+ Equipment',
      icon: <Eye className="h-5 w-5 text-sky-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-ultrasound.png',
    },
    {
      name: 'Sterilization & Autoclave',
      dept: 'HOSPITAL_SETUP',
      count: '610+ Systems',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-700" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-lab.png',
    },
    {
      name: 'Neonatal & Pediatric',
      dept: 'CRITICAL_CARE',
      count: '290+ Incubators & Warmers',
      icon: <HeartPulse className="h-5 w-5 text-pink-500" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-monitoring.png',
    },
    {
      name: 'Orthopedic & Rehab',
      dept: 'HOSPITAL_SETUP',
      count: '340+ Implants & Supports',
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-furniture.png',
    },
    {
      name: 'Endoscopy & Laparoscopy',
      dept: 'CRITICAL_CARE',
      count: '175+ Towers & Scopes',
      icon: <Eye className="h-5 w-5 text-teal-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-surgical.png',
    },
    {
      name: 'Dialysis & Renal Care',
      dept: 'CRITICAL_CARE',
      count: '130+ Machines & Filters',
      icon: <Activity className="h-5 w-5 text-indigo-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/hero-diagnostics.png',
    },
    {
      name: 'Pathology & Blood Bank',
      dept: 'DIAGNOSTIC',
      count: '420+ Centrifuges & Shakers',
      icon: <Stethoscope className="h-5 w-5 text-purple-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-lab.png',
    },
    {
      name: 'Medical Gas Pipeline (MGPS)',
      dept: 'HOSPITAL_SETUP',
      count: '210+ Regulators & Outlets',
      icon: <Wind className="h-5 w-5 text-cyan-700" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-respiratory.png',
    },
    {
      name: 'PPE & Hospital Disposables',
      dept: 'HOSPITAL_SETUP',
      count: '1,500+ Consumables',
      icon: <ShieldCheck className="h-5 w-5 text-amber-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-surgical.png',
    },
    {
      name: 'Doctor Clinic OPD Setup',
      dept: 'HOSPITAL_SETUP',
      count: '540+ Clinic Units',
      icon: <Building2 className="h-5 w-5 text-emerald-600" />,
      page: 'shop' as Page,
      image: '/assets/generated/category-furniture.png',
    },
    {
      name: 'Biomedical Engineering',
      dept: 'SERVICES_SPARES',
      count: 'NHPC BMET Network',
      icon: <Wrench className="h-5 w-5 text-blue-700" />,
      page: 'engineering-service' as Page,
      image: '/assets/generated/hero-engineering.png',
    },
    {
      name: 'B2B Import Procurement',
      dept: 'SERVICES_SPARES',
      count: 'Customs & LC Desk',
      icon: <Truck className="h-5 w-5 text-amber-700" />,
      page: 'b2b-enquiry' as Page,
      image: '/assets/generated/hero-diagnostics.png',
    },
  ]

  // Mini carousel products
  const miniProducts = [
    { title: 'Yuwell 8F-5AW', subtitle: 'Oxygen Concentrator', price: 'Rs. 85,000', image: '/assets/generated/category-respiratory.png' },
    { title: 'Microlife NEB 400', subtitle: 'Nebulizer Therapy', price: 'Rs. 7,500', image: '/assets/generated/category-respiratory.png' },
    { title: 'Welch Allyn 767', subtitle: 'Wall Diagnostic Set', price: 'Rs. 65,000', image: '/assets/generated/category-monitoring.png' },
    { title: 'BLT Portable BPU60', subtitle: 'Ultrasound Scanner', price: 'Rs. 1,25,000', image: '/assets/generated/category-ultrasound.png' },
    { title: 'Mindray uMEC12', subtitle: 'Patient Monitor 12"', price: 'Rs. 1,25,000', image: '/assets/generated/category-monitoring.png' },
    { title: 'SunTech CT40', subtitle: 'Spot Check BP', price: 'Rs. 22,000', image: '/assets/generated/category-ecg.png' },
  ]

  // Multi-Slide Hero Carousel Configuration using official graphics from /slider/
  const heroSlides = [
    {
      badge: "Nepal's National Healthcare Exchange",
      badgeIcon: <Sparkles className="h-3.5 w-3.5 text-orange" />,
      titleLine1: "Equip. Empower. Care.",
      titleLine2: "Nepal's Premier Medical",
      titleHighlight: "Procurement Grid",
      description:
        "Direct access to 10,000+ DDA-registered medical devices, ICU ventilators, patient monitors, ultrasound systems, and genuine biomedical spares across all 7 provinces.",
      features: [
        'DDA Verified Medical Equipment',
        'Transparent 13% VAT Invoices',
        'Nationwide Dispatch & Delivery',
        'Zero Capex Rental Fleet Desk',
        'Certified Biomedical Engineers',
        'Global OEM Import Consignee',
      ],
      primaryCta: { label: 'Explore Medical Catalog', action: () => navigate('shop') },
      secondaryCta: { label: 'Rent Equipment', action: () => navigate('rental-products') },
      tertiaryCta: { label: 'Request Official Quote', action: () => openQuoteForProduct('General Medical Equipment Procurement') },
      stats: [
        { value: '10,000+', label: 'Products' },
        { value: '500+', label: 'Verified Sellers' },
        { value: '2,000+', label: 'Healthcare Clients' },
        { value: '24/7', label: 'Biomedical Support' },
      ],
      image: '/assets/generated/hero-marketplace.png',
      imageAlt: 'Mediko Bazaar Diagnostic & Hospital Systems',
      trustBadgeTitle: 'DDA Registered',
      trustBadgeSubtitle: 'Hospital Verified Suppliers',
      trustBadgeIcon: <ShieldCheck className="h-6 w-6 text-cyan-300" />,
    },
    {
      badge: 'Zero Capex Medical Rentals',
      badgeIcon: <Clock className="h-3.5 w-3.5 text-orange" />,
      titleLine1: 'On-Demand ICU &',
      titleLine2: 'Hospital Fleet',
      titleHighlight: 'Equipment Rentals',
      description:
        'Equip your emergency wards and ICUs instantly with ventilators, dialysis systems, 10L oxygen concentrators, and electric ICU beds with zero capex and immediate Kathmandu dispatch.',
      features: [
        'Zero Capex Capital Outlay',
        'Daily, Weekly & Monthly Leases',
        'Free Biomedical Calibration',
        'Fast Dispatch across Nepal',
        'Refundable Deposit Protection',
        'Instant Replacement Backups',
      ],
      primaryCta: { label: 'Browse Rental Fleet', action: () => navigate('rental-products') },
      secondaryCta: { label: 'Request Rental Quote', action: () => openQuoteForProduct('Medical Equipment Rental Fleet') },
      tertiaryCta: { label: 'Rental Agreement Terms', action: () => navigate('faq') },
      stats: [
        { value: '350+', label: 'Rental Units' },
        { value: '24hr', label: 'Emergency Dispatch' },
        { value: '99.8%', label: 'Equipment Uptime' },
        { value: '100%', label: 'Refund Protection' },
      ],
      image: '/assets/generated/hero-homecare.png',
      imageAlt: 'Hospital ICU Rental Equipment Fleet',
      trustBadgeTitle: 'Payment Protected',
      trustBadgeSubtitle: 'Zero Risk Rental Fleet',
      trustBadgeIcon: <Lock className="h-6 w-6 text-cyan-300" />,
    },
    {
      badge: 'Biomedical Support & Calibration',
      badgeIcon: <Wrench className="h-3.5 w-3.5 text-emerald-600" />,
      titleLine1: 'NHPC Certified',
      titleLine2: 'Biomedical Field',
      titleHighlight: 'Support Engineers',
      description:
        'Connect directly with certified biomedical engineers for on-site hospital equipment setup, electrical safety testing (IEC 62353), emergency repair, and annual maintenance contracts (AMC).',
      features: [
        'NHPC Registered Engineers',
        'On-Site Hospital Dispatch',
        'Traceable Calibration Certificates',
        'Direct Chat with Engineers',
        'Preventive Maintenance (PPM)',
        'Emergency Breakdown Response',
      ],
      primaryCta: { label: 'Book Support Engineer', action: () => navigate('engineering-service') },
      secondaryCta: { label: 'Engineer Login', action: () => navigate('customer-auth') },
      tertiaryCta: { label: 'Verify Calibration Certificate', action: () => navigate('certificate-verify') },
      stats: [
        { value: '80+', label: 'Field Engineers' },
        { value: '4hr', label: 'Rapid Response' },
        { value: 'ISO 17025', label: 'Calibration Standard' },
        { value: '100%', label: 'NHPC Licensed' },
      ],
      image: '/assets/generated/hero-engineering.png',
      imageAlt: 'Biomedical Calibration & Hospital Engineering',
      trustBadgeTitle: 'NHPC Certified',
      trustBadgeSubtitle: 'Calibration & Repair Desk',
      trustBadgeIcon: <CheckCircle2 className="h-6 w-6 text-emerald-300" />,
    },
    {
      badge: 'B2B Global Import Procurement',
      badgeIcon: <Globe className="h-3.5 w-3.5 text-orange" />,
      titleLine1: 'Direct OEM Sourcing &',
      titleLine2: 'Transparent Import',
      titleHighlight: 'Clearance',
      description:
        'Direct procurement from international medical manufacturers. Mediko Bazaar serves as authorized Importer of Record with TIA cargo customs clearing, Letter of Credit (LC), and landed cost calculation.',
      features: [
        'Authorized Importer of Record',
        'Legal Proforma Invoices (USD/NPR)',
        'TIA Cargo Customs Clearance',
        'Real-Time Landed Cost Engine',
        'Direct OEM Global Warranty',
        'Nepal DDA Import Compliance',
      ],
      primaryCta: { label: 'Request Import Cost', action: () => navigate('b2b-enquiry') },
      secondaryCta: { label: 'Request Custom Import', action: () => openQuoteForProduct('Global Medical Import Sourcing') },
      tertiaryCta: { label: 'Explore Global Sourcing', action: () => navigate('shop') },
      stats: [
        { value: '100%', label: 'Tax Compliant' },
        { value: '14-21d', label: 'Delivery Lead Time' },
        { value: '40+', label: 'Global Brands' },
        { value: 'DDA', label: 'Import Clearance' },
      ],
      image: '/assets/generated/hero-diagnostics.png',
      imageAlt: 'Global Medical Imaging and Diagnostics Import',
      trustBadgeTitle: 'Authorized Importer',
      trustBadgeSubtitle: 'TIA Customs & DDA Clear',
      trustBadgeIcon: <ShieldCheck className="h-6 w-6 text-cyan-300" />,
    },
    {
      badge: '48-Point BMET Certified Pre-Owned',
      badgeIcon: <Shield className="h-3.5 w-3.5 text-orange" />,
      titleLine1: '48-Point Certified',
      titleLine2: 'Pre-Owned Hospital',
      titleHighlight: 'Diagnostic Systems',
      description:
        'Save up to 50% on capital expenditure with rigorously tested, BMET-certified pre-owned diagnostic, surgical, and ultrasound equipment backed by 1-year comprehensive warranty.',
      features: [
        '48-Point BMET Verification',
        '1-Year Comprehensive Warranty',
        'Calibration Certificate Included',
        'Genuine Replacement Spares',
        'On-Site Installation Support',
        'AMC / CMC Service Contracts',
      ],
      primaryCta: { label: 'Explore Pre-Owned Systems', action: () => navigate('used-products') },
      secondaryCta: { label: 'Request Equipment Quote', action: () => openQuoteForProduct('Certified Pre-Owned Medical System') },
      tertiaryCta: { label: 'Quality Guarantee', action: () => navigate('faq') },
      stats: [
        { value: '48-Pt', label: 'BMET Audit' },
        { value: '1 Year', label: 'Full Warranty' },
        { value: '50%', label: 'Capex Savings' },
        { value: '100%', label: 'OEM Parts Ready' },
      ],
      image: '/assets/generated/hero-training.png',
      imageAlt: 'Biomedical Engineering and Pre-Owned Medical Equipment',
      trustBadgeTitle: 'BMET Certified',
      trustBadgeSubtitle: 'Audited & Guaranteed',
      trustBadgeIcon: <CheckCircle2 className="h-6 w-6 text-cyan-300" />,
    },
  ]

  // Filtered Featured Products (12 items)
  const displayedFeatured = useMemo(() => {
    let list = featuredList.length >= 12 ? featuredList : PRODUCTS
    if (featuredFilter === 'ICU') {
      list = PRODUCTS.filter(
        (p) =>
          p.category.toLowerCase().includes('icu') ||
          p.category.toLowerCase().includes('critical') ||
          p.category.toLowerCase().includes('cardio') ||
          p.title.toLowerCase().includes('monitor') ||
          p.title.toLowerCase().includes('anesthesia') ||
          p.title.toLowerCase().includes('light') ||
          p.title.toLowerCase().includes('hemodialysis')
      )
    } else if (featuredFilter === 'RESPIRATORY') {
      list = PRODUCTS.filter(
        (p) =>
          p.category.toLowerCase().includes('respiratory') ||
          p.category.toLowerCase().includes('oxygen') ||
          p.title.toLowerCase().includes('ventilator') ||
          p.title.toLowerCase().includes('concentrator') ||
          p.title.toLowerCase().includes('bipap') ||
          p.title.toLowerCase().includes('pump')
      )
    } else if (featuredFilter === 'DIAGNOSTIC') {
      list = PRODUCTS.filter(
        (p) =>
          p.category.toLowerCase().includes('imaging') ||
          p.category.toLowerCase().includes('diagnostic') ||
          p.category.toLowerCase().includes('ultrasound') ||
          p.category.toLowerCase().includes('x-ray') ||
          p.category.toLowerCase().includes('hematology') ||
          p.title.toLowerCase().includes('c-arm') ||
          p.title.toLowerCase().includes('endoscopy') ||
          p.title.toLowerCase().includes('doppler')
      )
    } else if (featuredFilter === 'RENTAL') {
      list = PRODUCTS.filter((p) => p.type === 'rental')
    } else if (featuredFilter === 'SPARE') {
      list = PRODUCTS.filter((p) => p.type === 'spare-part' || p.category.toLowerCase().includes('spare'))
    } else if (featuredFilter === 'FURNITURE') {
      list = PRODUCTS.filter(
        (p) =>
          p.category.toLowerCase().includes('furniture') ||
          p.title.toLowerCase().includes('bed') ||
          p.title.toLowerCase().includes('chair') ||
          p.title.toLowerCase().includes('incubator')
      )
    }
    return list.slice(0, 12)
  }, [featuredFilter])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-text-dark antialiased">
      {/* Public Header with live navigation */}
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage={currentPage} />

      {/* Main Page Container */}
      <main className="mx-auto max-w-[1480px] px-4 py-4 md:px-6 lg:px-8">
        {/* ============================================================ */}
        {/* 1. HERO BANNER SLIDER CAROUSEL SECTION */}
        {/* ============================================================ */}
        <section
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(8,47,73,.06)] transition-all"
        >
          {/* Subtle Background Accents */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-orange/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

          {/* Current Slide Viewport */}
          <div className="relative p-6 md:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              {/* Left Content */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3.5 py-1 text-[11px] font-bold text-orange">
                    {heroSlides[heroSlide].badgeIcon}
                    <span>{heroSlides[heroSlide].badge}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    0{heroSlide + 1} / 0{heroSlides.length}
                  </span>
                </div>

                <h1 className="mt-3.5 font-heading text-3xl font-black leading-tight text-navy sm:text-4xl md:text-5xl lg:text-[46px]">
                  {heroSlides[heroSlide].titleLine1} <br />
                  {heroSlides[heroSlide].titleLine2} <br />
                  <span className="bg-gradient-to-r from-orange to-[#ff8c42] bg-clip-text text-transparent">
                    {heroSlides[heroSlide].titleHighlight}
                  </span>
                </h1>

                <p className="mt-3.5 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {heroSlides[heroSlide].description}
                </p>

                {/* 6 Feature Checkmarks with Clean Lucide SVGs */}
                <div className="mt-6 grid max-w-lg grid-cols-2 gap-y-3 text-xs font-semibold text-slate-700">
                  {heroSlides[heroSlide].features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5">
                      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* 3 Call to Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={heroSlides[heroSlide].primaryCta.action}
                    className="flex h-11 items-center gap-2 rounded-xl bg-navy px-6 text-xs font-bold text-white shadow-md shadow-navy/20 transition hover:bg-navy-deep hover:shadow-lg cursor-pointer"
                  >
                    <span>{heroSlides[heroSlide].primaryCta.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={heroSlides[heroSlide].secondaryCta.action}
                    className="flex h-11 items-center gap-2 rounded-xl bg-orange px-6 text-xs font-bold text-white shadow-md shadow-orange/20 transition hover:bg-orange-hover hover:shadow-lg cursor-pointer"
                  >
                    <span>{heroSlides[heroSlide].secondaryCta.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={heroSlides[heroSlide].tertiaryCta.action}
                    className="flex h-11 items-center rounded-xl border border-slate-250 bg-white px-5 text-xs font-bold text-slate-700 transition hover:border-orange hover:text-orange cursor-pointer"
                  >
                    {heroSlides[heroSlide].tertiaryCta.label}
                  </button>
                </div>

                {/* Stats Counters */}
                <div className="mt-8 grid grid-cols-4 gap-2 border-t border-slate-100 pt-6">
                  {heroSlides[heroSlide].stats.map((stat, sIdx) => (
                    <div key={sIdx}>
                      <strong className="block font-heading text-lg font-extrabold text-navy sm:text-2xl">
                        {stat.value}
                      </strong>
                      <span className="text-[11px] font-medium text-slate-400">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Hero Image Composition */}
              <div className="relative lg:col-span-5">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-[540px] overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-100 to-blue-50/50 p-2 shadow-inner">
                  <img
                    key={heroSlide}
                    src={heroSlides[heroSlide].image}
                    alt={heroSlides[heroSlide].imageAlt}
                    className="h-full w-full rounded-xl object-cover transition-opacity duration-500"
                  />

                  {/* Floating Hospital Trust Badge with SVG */}
                  <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-white">
                      {heroSlides[heroSlide].trustBadgeIcon}
                    </div>
                    <div>
                      <strong className="block text-xs font-black text-navy">
                        {heroSlides[heroSlide].trustBadgeTitle}
                      </strong>
                      <small className="text-[10px] font-semibold text-slate-500">
                        {heroSlides[heroSlide].trustBadgeSubtitle}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Controls: Arrows & Dots Navigation */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100/80 pt-4">
              {/* Slide Indicators */}
              <div className="flex items-center gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      heroSlide === idx ? 'w-8 bg-orange shadow-xs' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Slider Arrow Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-orange hover:bg-orange/5 hover:text-orange cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-orange hover:bg-orange/5 hover:text-orange cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Interactive Thumbnail Carousel Selector */}
            <div className="mt-5 hidden sm:grid sm:grid-cols-5 gap-3 border-t border-slate-100 pt-4">
              {heroSlides.map((slide, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setHeroSlide(sIdx)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    heroSlide === sIdx
                      ? 'bg-orange/5 border-orange ring-2 ring-orange/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.badge}
                    className="w-12 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-black text-navy truncate">{slide.badge}</span>
                    <span className="block text-[9px] text-slate-500 truncate">{slide.titleHighlight}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. TRUST BADGES ROW (ZERO EMOJIS, HIGH QUALITY SVGS) */}
        {/* ============================================================ */}
        <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="flex items-center gap-3 border-r-0 border-slate-100 sm:border-r">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-navy">Verified Sellers</strong>
                <small className="text-[10px] text-slate-400">Strict KYC Verification</small>
              </div>
            </div>

            <div className="flex items-center gap-3 border-r-0 border-slate-100 sm:border-r">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-soft text-orange">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-navy">Rental deposit</strong>
                <small className="text-[10px] text-slate-400">Deposit &amp; Penalty Guard</small>
              </div>
            </div>

            <div className="flex items-center gap-3 border-r-0 border-slate-100 lg:border-r">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-navy">Biomedical Engineers</strong>
                <small className="text-[10px] text-slate-400">Certified Specialists</small>
              </div>
            </div>

            <div className="flex items-center gap-3 border-r-0 border-slate-100 sm:border-r">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-navy">24/7 Operations</strong>
                <small className="text-[10px] text-slate-400">Always Here to Help</small>
              </div>
            </div>

            <div className="flex items-center gap-3 border-r-0 border-slate-100 sm:border-r">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-navy">Nepal Delivery</strong>
                <small className="text-[10px] text-slate-400">Prompt &amp; Secure Logistics</small>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-navy">Secure Payments</strong>
                <small className="text-[10px] text-slate-400">100% Tax Compliant</small>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. SHOP BY CATEGORY (24 CLINICAL DIVISIONS + DEPARTMENT TABS) */}
        {/* ============================================================ */}
        <section className="mb-10">
          <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-0.5 text-[10px] font-extrabold text-orange uppercase tracking-wider mb-1">
                Clinical Divisions
              </div>
              <h2 className="font-heading text-xl font-bold text-navy sm:text-2xl">Shop by Medical Category</h2>
              <p className="text-xs text-slate-500">Comprehensive hospital supply divisions, clinical systems &amp; healthcare tech</p>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="text-xs font-bold text-orange hover:text-orange-hover flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Explore All Products ({categories.length} Categories)</span>
              <span>→</span>
            </button>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Categories', count: categories.length },
              { id: 'CRITICAL_CARE', label: 'ICU & Critical Care', count: categories.filter(c => c.dept === 'CRITICAL_CARE').length },
              { id: 'DIAGNOSTIC', label: 'Diagnostic & Lab', count: categories.filter(c => c.dept === 'DIAGNOSTIC').length },
              { id: 'HOSPITAL_SETUP', label: 'Hospital Infrastructure', count: categories.filter(c => c.dept === 'HOSPITAL_SETUP').length },
              { id: 'RENTAL_USED', label: 'Rentals & Pre-Owned', count: categories.filter(c => c.dept === 'RENTAL_USED').length },
              { id: 'SERVICES_SPARES', label: 'Services & Spares', count: categories.filter(c => c.dept === 'SERVICES_SPARES').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategoryTab === tab.id
                    ? 'bg-[#071B45] text-white border-[#071B45] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange hover:text-orange'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    selectedCategoryTab === tab.id ? 'bg-orange text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {categories
              .filter((cat) => selectedCategoryTab === 'ALL' || cat.dept === selectedCategoryTab)
              .map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => navigate(cat.page)}
                  className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-3 text-center shadow-xs transition-all hover:-translate-y-1 hover:border-orange hover:shadow-md cursor-pointer"
                >
                  <div className="relative mb-2.5 aspect-square w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-1.5 top-1.5 rounded-lg bg-white/95 p-1.5 shadow-xs backdrop-blur-xs">
                      {cat.icon}
                    </div>
                  </div>
                  <strong className="text-xs font-bold text-navy group-hover:text-orange transition-colors line-clamp-1">
                    {cat.name}
                  </strong>
                  <span className="mt-0.5 text-[10px] font-medium text-slate-400">{cat.count}</span>
                </button>
              ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. FEATURED PRODUCTS (12 EXPANDED PRODUCTS WITH CATEGORY FILTERS) */}
        {/* ============================================================ */}
        <section className="mb-10">
          <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-0.5 text-[10px] font-extrabold text-orange uppercase tracking-wider mb-1">
                Verified Medical Supply
              </div>
              <h2 className="font-heading text-lg font-bold text-navy sm:text-xl">Featured Medical Products & Systems</h2>
              <p className="text-xs text-slate-500">Handpicked hospital technology, rentals & genuine clinical components</p>
            </div>
            <button onClick={() => navigate('shop')} className="text-xs font-bold text-orange hover:underline cursor-pointer">
              View All Products ({PRODUCTS.length}) →
            </button>
          </div>

          {/* Department Filter Tabs for Featured Products */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Featured (12)' },
              { id: 'ICU', label: 'ICU & Critical Care' },
              { id: 'RESPIRATORY', label: 'Respiratory & Oxygen' },
              { id: 'DIAGNOSTIC', label: 'Diagnostic & Imaging' },
              { id: 'RENTAL', label: 'Medical Rentals' },
              { id: 'SPARE', label: 'Spare Components' },
              { id: 'FURNITURE', label: 'Hospital Furniture' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFeaturedFilter(tab.id as any)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  featuredFilter === tab.id
                    ? 'bg-[#071B45] text-white border-[#071B45] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange hover:text-orange'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {displayedFeatured.map((product) => {
              const isRental = product.type === 'rental'
              const isCertified = product.type === 'used'
              const isAskPrice = product.askForPrice || !product.price

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition hover:border-orange hover:shadow-md"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 rounded-md bg-orange px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                        {isRental ? 'Rental' : isCertified ? 'Certified Pre-Owned' : product.badge || 'Verified'}
                      </span>
                      <button
                        onClick={() => navigate('customer-dashboard')}
                        title="Add to Wishlist"
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-slate-400 shadow-xs hover:text-red-500 cursor-pointer"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-400">{product.brand}</span>
                    <h3
                      onClick={() => {
                        const full = PRODUCTS.find((p) => p.id === product.id) || product
                        localStorage.setItem('mediko_selected_product', JSON.stringify(full))
                        navigate(isRental ? 'rental-detail' : isCertified ? 'used-detail' : 'product')
                      }}
                      className="line-clamp-2 cursor-pointer text-xs font-bold text-navy hover:text-orange"
                      title={product.title}
                    >
                      {product.title}
                    </h3>

                    {/* Pricing Logic */}
                    <div className="mt-2.5">
                      {isRental ? (
                        <div>
                          <div className="text-xs font-black text-purple-700">
                            Rent from Rs. {product.rentalMonthly?.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">/mo</span>
                          </div>
                          <small className="block text-[9px] text-slate-400">
                            Deposit: Rs. {product.rentalDeposit?.toLocaleString()}
                          </small>
                        </div>
                      ) : isAskPrice ? (
                        <div className="text-xs font-black text-navy">Price on Quotation</div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-black text-navy">
                            Rs. {product.price?.toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              Rs. {product.oldPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 border-t border-slate-100 pt-2.5">
                    {isRental ? (
                      <button
                        onClick={() => {
                          navigate('rental-detail')
                        }}
                        className="w-full rounded-lg bg-purple-700 py-2 text-xs font-bold text-white transition hover:bg-purple-800 cursor-pointer shadow-xs"
                      >
                        Rent Now
                      </button>
                    ) : isAskPrice ? (
                      <button
                        onClick={() => openQuoteForProduct(product.title)}
                        className="w-full rounded-lg bg-navy py-2 text-xs font-bold text-white transition hover:bg-navy-deep cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-orange" />
                        <span>Get Quote</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const full = PRODUCTS.find((p) => p.id === product.id) || product
                          const existingCart = JSON.parse(localStorage.getItem('mediko_cart_items') || '[]')
                          existingCart.unshift({
                            id: Date.now(),
                            title: full.title,
                            brand: full.brand,
                            sku: full.sku || `SKU-${full.id}`,
                            condition: full.condition || 'New',
                            price: full.price || 0,
                            qty: 1,
                            image: full.image,
                            delivery: 'Express Delivery',
                            warranty: full.warranty || '1 Year',
                            seller: full.seller || 'MediTech Solutions',
                            sellerVerified: true,
                          })
                          localStorage.setItem('mediko_cart_items', JSON.stringify(existingCart))
                          handleAddToCart()
                        }}
                        className="w-full rounded-lg bg-navy py-2 text-xs font-bold text-white transition hover:bg-orange cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. CATEGORY TABS & MINI PRODUCT SLIDER */}
        {/* ============================================================ */}
        <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'top', label: 'Top Products' },
                { id: 'bestseller', label: 'Best Selling' },
                { id: 'trending', label: 'Trending' },
                { id: 'new', label: 'New Arrivals' },
                { id: 'rental', label: 'Rental Units' },
                { id: 'spare', label: 'Spare Components' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    activeTab === tab.id ? 'bg-orange text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSliderIndex(Math.max(0, sliderIndex - 1))}
                className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSliderIndex(Math.min(miniProducts.length - 4, sliderIndex + 1))}
                className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {miniProducts.map((item) => (
              <div
                key={item.title}
                onClick={() => navigate('product')}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 p-2.5 transition hover:border-orange hover:bg-slate-50/60"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 p-0.5">
                  <img src={item.image} alt={item.title} className="h-full w-full rounded-md object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-xs font-bold text-navy group-hover:text-orange">
                    {item.title}
                  </strong>
                  <small className="block truncate text-[10px] text-slate-400">{item.subtitle}</small>
                  <span className="text-[11px] font-bold text-orange">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. THREE PROMO FEATURE BANNERS */}
        {/* ============================================================ */}
        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {/* Banner 1: Rental Solutions */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#082f49] to-[#0c4a6e] p-6 text-white shadow-md">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">
              Flexible &amp; Reliable
            </span>
            <h3 className="mt-1 font-heading text-xl font-black">Rental Solutions</h3>
            <p className="mt-1 text-xs text-slate-200">
              Premium equipment with easy daily, weekly and monthly rental plans.
            </p>
            <button
              onClick={() => navigate('rental-products')}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-navy transition hover:bg-orange hover:text-white"
            >
              <span>Explore Rentals</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Banner 2: Service & Support */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f26a1a] to-[#c2410c] p-6 text-white shadow-md">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-200">
              Expert Engineering
            </span>
            <h3 className="mt-1 font-heading text-xl font-black">Service &amp; Support</h3>
            <p className="mt-1 text-xs text-orange-100">
              Installation, AMC, calibration, repair &amp; preventive maintenance by certified experts.
            </p>
            <button
              onClick={() => navigate('engineering-service')}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-navy"
            >
              <span>Book Service</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Banner 3: Import & Landing Cost */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#115e59] p-6 text-white shadow-md">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-200">
              Smart Trading
            </span>
            <h3 className="mt-1 font-heading text-xl font-black">Import &amp; Landing Cost</h3>
            <p className="mt-1 text-xs text-slate-200">
              Get auto-calculated customs tariff, duty, VAT and freight cost for Nepal.
            </p>
            <button
              onClick={() => navigate('b2b-enquiry')}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-teal-900 transition hover:bg-orange hover:text-white"
            >
              <span>Send Import Enquiry</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. ECOSYSTEM WORKFLOWS 2x2 GRID */}
        {/* ============================================================ */}
        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* Card 1: Rental Management Made Easy */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange">Protected delivery and payment</span>
              <h3 className="font-heading text-base font-bold text-navy">Rental Management Made Easy</h3>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
              {[
                { step: '1', title: 'Choose Equipment' },
                { step: '2', title: 'Pay Deposit', note: '(Refundable)' },
                { step: '3', title: 'Select Duration', note: '& Terms' },
                { step: '4', title: 'Delivery / Pickup', note: 'Across Nepal' },
                { step: '5', title: 'Return & Inspection' },
                { step: '6', title: 'Penalty if any' },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center rounded-xl bg-slate-50 p-2 text-center">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-[10px] font-black text-white">
                    {s.step}
                  </span>
                  <strong className="mt-1.5 text-[10px] leading-tight text-navy">{s.title}</strong>
                  {s.note && <small className="text-[8px] text-slate-400">{s.note}</small>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                <strong className="block text-[10px] text-navy">Deposit Required</strong>
                <small className="text-[9px] text-slate-400">Refundable Security</small>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                <strong className="block text-[10px] text-navy">Penalty System</strong>
                <small className="text-[9px] text-slate-400">For Late Returns</small>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                <strong className="block text-[10px] text-navy">Maintenance</strong>
                <small className="text-[9px] text-slate-400">Covered Options</small>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                <strong className="block text-[10px] text-navy">Flexible Duration</strong>
                <small className="text-[9px] text-slate-400">Daily / Monthly</small>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                <strong className="block text-[10px] text-navy">Support</strong>
                <small className="text-[9px] text-slate-400">Quick Assistance</small>
              </div>
            </div>
          </div>

          {/* Card 2: Engineering Service */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange">Expertise on Demand</span>
                <h3 className="font-heading text-base font-bold text-navy">Engineering Service</h3>
                <p className="text-xs text-slate-500">Connect with certified biomedical specialists</p>
              </div>
              <button
                onClick={() => navigate('engineering-service')}
                className="rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-hover"
              >
                Book Visit →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { title: 'Book Engineer', desc: 'Direct technician dispatch', icon: <Wrench className="h-4 w-4 text-blue-600" /> },
                { title: 'Live Chat', desc: 'Contextual technical room', icon: <MessageSquare className="h-4 w-4 text-emerald-600" /> },
                { title: 'On-site Visit', desc: 'Hospital & clinic coverage', icon: <Building2 className="h-4 w-4 text-cyan-600" /> },
                { title: 'Service / AMC', desc: 'Preventive maintenance', icon: <Cog className="h-4 w-4 text-orange" /> },
                { title: 'Service Ticket', desc: 'Audited digital logs', icon: <FileText className="h-4 w-4 text-purple-600" /> },
                { title: 'Follow Up', desc: 'Signed calibration report', icon: <BadgeCheck className="h-4 w-4 text-teal-600" /> },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white shadow-xs">
                    {item.icon}
                  </div>
                  <div>
                    <strong className="block text-[11px] font-bold text-navy">{item.title}</strong>
                    <small className="text-[9px] text-slate-400">{item.desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Import & Landing Cost Calculator (Nepal) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange">Section 18 Engine</span>
              <h3 className="font-heading text-base font-bold text-navy">Import &amp; Landing Cost Calculator (Nepal)</h3>
              <p className="text-xs text-slate-500">Accurate customs tariff, VAT &amp; clearance calculation</p>
            </div>

            <div className="my-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 text-[10px] font-bold text-navy">
              <span>USD Price</span>
              <span>→</span>
              <span>Air/Sea Freight</span>
              <span>→</span>
              <span>Customs Tariff</span>
              <span>→</span>
              <span>VAT 13%</span>
              <span>=</span>
              <span className="rounded-md bg-navy px-2.5 py-1 text-white">Final NPR Landing</span>
            </div>

            <button
              onClick={() => navigate('b2b-enquiry')}
              className="mt-2 w-full rounded-xl bg-navy py-2.5 text-xs font-bold text-white transition hover:bg-orange"
            >
              Open Interactive Nepal Calculator →
            </button>
          </div>

          {/* Card 4: Multi-Vendor Marketplace */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange">B2B &amp; B2C Commerce</span>
              <h3 className="font-heading text-base font-bold text-navy">Multi-Vendor Marketplace</h3>
              <p className="text-xs text-slate-500">Empowering sellers &amp; vendors across Nepal</p>
            </div>

            <div className="my-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-50 p-2">
                <Building2 className="mx-auto h-4 w-4 text-blue-600" />
                <strong className="mt-1 block text-[10px] text-navy">Seller KYC</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <Layers className="mx-auto h-4 w-4 text-emerald-600" />
                <strong className="mt-1 block text-[10px] text-navy">Vendor Portal</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <BadgeCheck className="mx-auto h-4 w-4 text-orange" />
                <strong className="mt-1 block text-[10px] text-navy">Product Approval</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <FileText className="mx-auto h-4 w-4 text-purple-600" />
                <strong className="mt-1 block text-[10px] text-navy">Enquiries</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <ClipboardCheck className="mx-auto h-4 w-4 text-teal-600" />
                <strong className="mt-1 block text-[10px] text-navy">Quote Engine</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <Shield className="mx-auto h-4 w-4 text-cyan-600" />
                <strong className="mt-1 block text-[10px] text-navy">Dashboard</strong>
              </div>
            </div>

            <button
              onClick={() => navigate('customer-auth')}
              className="w-full rounded-xl bg-orange py-2.5 text-xs font-bold text-white transition hover:bg-orange-hover"
            >
              Apply to Sell / Vendor →
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. CERTIFIED PRE-OWNED PRODUCTS PIPELINE */}
        {/* ============================================================ */}
        <section className="mb-10 rounded-2xl border border-teal-200 bg-gradient-to-r from-[#f0fdfa] to-[#ecfeff] p-6 shadow-xs">
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-teal-100 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-800">
              Quality Assured Medical Resale
            </span>
            <h3 className="mt-1 font-heading text-xl font-bold text-navy">Certified Pre-Owned Medical Equipment</h3>
            <p className="text-xs text-slate-600">100% Inspected &amp; Biomedical Verified. Buy with Confidence.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { title: 'Seller Verification', icon: <Building2 className="h-4 w-4 text-teal-700" />, desc: 'Identity & Legal Check' },
              { title: 'Certification Check', icon: <FileText className="h-4 w-4 text-teal-700" />, desc: 'ISO & Calibration Slip' },
              { title: 'Warranty Validation', icon: <ShieldCheck className="h-4 w-4 text-teal-700" />, desc: 'Coverage Duration' },
              { title: 'Authorization Check', icon: <BadgeCheck className="h-4 w-4 text-teal-700" />, desc: 'Authenticity Proof' },
              { title: 'Condition Grading', icon: <Sparkles className="h-4 w-4 text-teal-700" />, desc: 'Grade A/B/C Testing' },
              { title: 'Admin Approval', icon: <CheckCircle2 className="h-4 w-4 text-teal-700" />, desc: 'Seal & Badge Issuance' },
            ].map((step, idx) => (
              <div key={step.title} className="flex flex-col items-center rounded-xl bg-white p-3.5 text-center shadow-xs">
                <div className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-teal-50">
                  {step.icon}
                </div>
                <strong className="text-[11px] font-bold text-navy">{step.title}</strong>
                <small className="text-[9px] text-slate-400">{step.desc}</small>
                <span className="mt-2 rounded-full bg-teal-50 px-2 py-0.5 text-[8px] font-black text-teal-700">
                  Step 0{idx + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              onClick={() => navigate('used-products')}
              className="rounded-xl bg-teal-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-teal-800"
            >
              Explore Certified Pre-Owned Inventory →
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. INTERNAL COMMUNICATION & CHAT SHOWCASE */}
        {/* ============================================================ */}
        <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange">Section 13 Architecture</span>
            <h3 className="font-heading text-lg font-bold text-navy sm:text-xl">Internal Communication &amp; Chat</h3>
            <p className="text-xs text-slate-500">Connect seamlessly within the platform</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-6">
              {[
                { title: 'Customer ↔ Engineer', desc: 'Direct diagnostic chat on assigned service ticket', icon: <Wrench className="h-4 w-4 text-blue-600" /> },
                { title: 'Customer ↔ Seller', desc: 'Quick technical inquiry and lead time clarification', icon: <MessageSquare className="h-4 w-4 text-emerald-600" /> },
                { title: 'Vendor ↔ Admin', desc: 'Transparent KYC, quotation and settlement review', icon: <ShieldCheck className="h-4 w-4 text-orange" /> },
                { title: 'Group Collaboration', desc: 'Team coordination on complex hospital procurement files', icon: <Building2 className="h-4 w-4 text-purple-600" /> },
                { title: 'File Sharing', desc: 'Exchange service checklists, calibration PDFs, and photos', icon: <FileText className="h-4 w-4 text-cyan-600" /> },
                { title: 'Email Enquiry Hooks', desc: 'Automated notification queue for all participants', icon: <Clock className="h-4 w-4 text-slate-600" /> },
              ].map((c) => (
                <div key={c.title} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white shadow-xs">
                    {c.icon}
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-navy">{c.title}</strong>
                    <small className="text-[10px] text-slate-400">{c.desc}</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Chat Interface */}
            <div className="flex flex-col rounded-xl border border-slate-200 bg-[#f8fafc] p-4 lg:col-span-6">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <strong className="text-xs font-bold text-navy">Service Ticket #SRV-2026-084</strong>
                </div>
                <span className="text-[9px] text-slate-400">Context: Mindray Monitor Calibration</span>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <div className="max-w-[80%] rounded-lg bg-white p-2.5 shadow-xs">
                  <strong className="block text-[10px] text-navy">Dr. Rajan Shrestha (Bir Hospital)</strong>
                  <p className="mt-0.5 text-[11px] text-slate-600">Please send the biomedical technician with NIBP test cuff calibration kit today.</p>
                  <small className="text-[8px] text-slate-400">10:14 AM</small>
                </div>
                <div className="ml-auto max-w-[80%] rounded-lg bg-navy p-2.5 text-white shadow-xs">
                  <strong className="block text-[10px] text-orange">Er. Suman Adhikari (Biomedical Lead)</strong>
                  <p className="mt-0.5 text-[11px] text-slate-100">Ticket assigned. I am bringing certified calibration pressure meters. Visit scheduled for 2:00 PM.</p>
                  <small className="text-[8px] text-slate-300">10:18 AM · Attached: Calibration_Checksheet.pdf</small>
                </div>
              </div>

              <div className="mt-3 flex gap-2 border-t border-slate-200 pt-2">
                <input
                  disabled
                  placeholder="Direct contextual chat active..."
                  className="h-8 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none"
                />
                <button
                  onClick={() => navigate('faq')}
                  className="rounded-lg bg-orange px-3 text-xs font-bold text-white hover:bg-orange-hover"
                >
                  Join Support →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 10. TESTIMONIALS & TRUSTED INSTITUTIONS */}
        {/* ============================================================ */}
        <section className="mb-10">
          <div className="mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange">Real Clinical Feedback</span>
            <h2 className="font-heading text-lg font-bold text-navy sm:text-xl">What Our Customers Say</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-xs italic text-slate-600">
                &ldquo;Excellent platform for medical equipment. Rental process is very smooth and support is great.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-soft font-bold text-orange">
                  DR
                </div>
                <div>
                  <strong className="block text-xs text-navy">Dr. Rajan Shrestha</strong>
                  <small className="text-[10px] text-slate-400">Hospital Director, Bir Hospital</small>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-xs italic text-slate-600">
                &ldquo;We got genuine spare parts and fast delivery across Nepal. Highly recommended for biomedical engineers.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 font-bold text-blue-600">
                  BK
                </div>
                <div>
                  <strong className="block text-xs text-navy">Bikesh K.C.</strong>
                  <small className="text-[10px] text-slate-400">Biomedical Engineer, Patan</small>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <p className="text-xs italic text-slate-600">
                &ldquo;Import cost calculation is very accurate. Helped us save time, legal duties calculation and procurement money.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 font-bold text-emerald-600">
                  AT
                </div>
                <div>
                  <strong className="block text-xs text-navy">Anita Thapa</strong>
                  <small className="text-[10px] text-slate-400">Procurement Head, Kathmandu</small>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className="block text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              Trusted by Leading Healthcare Institutions in Nepal
            </span>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-8 text-sm font-extrabold text-navy/70">
              <span className="hover:text-navy">NORVIC INTERNATIONAL</span>
              <span className="hover:text-navy">HAMS HOSPITAL</span>
              <span className="hover:text-navy">GRANDE HOSPITAL</span>
              <span className="hover:text-navy">STAR HOSPITAL</span>
              <span className="hover:text-navy">BIR HOSPITAL</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 11. LATEST INSIGHTS & NEWS + QUOTE / NEWSLETTER FORM */}
        {/* ============================================================ */}
        <section className="mb-10 grid gap-6 lg:grid-cols-12">
          {/* News articles */}
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-navy sm:text-xl">Latest Insights &amp; News</h2>
              <button onClick={() => navigate('blog')} className="text-xs font-bold text-orange hover:underline">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { title: 'How to Maintain Medical Equipment for Longevity', date: 'May 10, 2026', img: '/assets/generated/hero-engineering.png' },
                { title: 'Top 5 Must-Have Equipment for Clinics in 2026', date: 'May 6, 2026', img: '/assets/generated/category-monitoring.png' },
                { title: 'Benefits of Renting vs Buying Medical Equipment', date: 'Apr 28, 2026', img: '/assets/generated/hero-homecare.png' },
                { title: 'Understanding Import Costs for Medical Goods', date: 'Apr 20, 2026', img: '/assets/generated/hero-diagnostics.png' },
              ].map((article) => (
                <div
                  key={article.title}
                  onClick={() => navigate('blog-detail')}
                  className="group cursor-pointer rounded-xl border border-slate-200/80 bg-white p-2.5 transition hover:border-orange hover:shadow-xs"
                >
                  <div className="mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                    <img src={article.img} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                  <h4 className="line-clamp-2 text-[11px] font-bold text-navy group-hover:text-orange">{article.title}</h4>
                  <small className="text-[9px] text-slate-400">{article.date}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Stay Updated & Request Quote CTA */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-orange">Never Miss Deals</span>
              <h3 className="font-heading text-lg font-bold text-navy">Stay Updated &amp; Get Best Deals</h3>
              <p className="mt-1 text-xs text-slate-500">Subscribe for offers, new arrivals &amp; healthcare insights in Nepal.</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setNewsletterSubscribed(true)
                }}
                className="mt-4 flex gap-2"
              >
                <input
                  required
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-orange"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-orange px-4 text-xs font-bold text-white transition hover:bg-orange-hover"
                >
                  {newsletterSubscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </form>
            </div>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <strong className="block text-xs font-bold text-navy">Or Request a Commercial Quote</strong>
              <p className="text-[11px] text-slate-500">Our medical procurement team will get back to you within 1 hour.</p>
              <button
                onClick={() => openQuoteForProduct('Official Commercial Quotation Request')}
                className="mt-3 w-full rounded-lg bg-navy py-2.5 text-xs font-bold text-white transition hover:bg-orange"
              >
                Request a Quote →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer navigate={navigate} />

    </div>
  )
}
