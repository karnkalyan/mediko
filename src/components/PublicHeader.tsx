import { useState, useRef, useEffect } from 'react'
import type { NavProps } from '../types'
import { BRAND, SEARCH_CATEGORIES } from '../lib/constants'
import { PRODUCTS } from '../data/products'
import {
  Phone,
  Mail,
  MapPin,
  Search,
  ShoppingCart,
  Heart,
  GitCompare,
  User,
  ChevronDown,
  Menu,
  X,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  Wrench,
  Clock,
  ArrowRight,
  Truck,
  Bed,
  Globe,
  Store,
  Building2,
} from 'lucide-react'

export default function PublicHeader({ navigate, cartCount = 0, currentPage = 'home' }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isRentalMenuOpen, setIsRentalMenuOpen] = useState(false)
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false)

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rentalMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const serviceMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMegaEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    setIsMegaMenuOpen(true)
  }
  const handleMegaLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false)
    }, 220)
  }

  const handleRentalEnter = () => {
    if (rentalMenuTimeoutRef.current) clearTimeout(rentalMenuTimeoutRef.current)
    setIsRentalMenuOpen(true)
  }
  const handleRentalLeave = () => {
    rentalMenuTimeoutRef.current = setTimeout(() => {
      setIsRentalMenuOpen(false)
    }, 220)
  }

  const handleServiceEnter = () => {
    if (serviceMenuTimeoutRef.current) clearTimeout(serviceMenuTimeoutRef.current)
    setIsServiceMenuOpen(true)
  }
  const handleServiceLeave = () => {
    serviceMenuTimeoutRef.current = setTimeout(() => {
      setIsServiceMenuOpen(false)
    }, 220)
  }

  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
      if (rentalMenuTimeoutRef.current) clearTimeout(rentalMenuTimeoutRef.current)
      if (serviceMenuTimeoutRef.current) clearTimeout(serviceMenuTimeoutRef.current)
    }
  }, [])

  const submitSearch = () => {
    navigate('shop')
  }

  const [portalMenuOpen, setPortalMenuOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)
  const portalDropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const role = sessionStorage.getItem('mediko_portal_role')
    const name = sessionStorage.getItem('mediko_portal_name')
    setCurrentRole(role)
    setCurrentUserName(name)

    const handleClickOutside = (e: MouseEvent) => {
      if (portalDropdownRef.current && !portalDropdownRef.current.contains(e.target as Node)) {
        setPortalMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [currentPage])

  const selectPortalRole = (role: string, targetPage: any, displayName: string) => {
    sessionStorage.setItem('mediko_portal_role', role)
    sessionStorage.setItem('mediko_portal_name', displayName)
    setCurrentRole(role)
    setCurrentUserName(displayName)
    setPortalMenuOpen(false)
    navigate(targetPage)
  }

  const handleSignOut = () => {
    sessionStorage.removeItem('mediko_portal_role')
    sessionStorage.removeItem('mediko_portal_name')
    setCurrentRole(null)
    setCurrentUserName(null)
    setPortalMenuOpen(false)
    navigate('home')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_4px_25px_rgba(7,27,69,0.08)] border-b border-slate-100">
      {/* 1. TOP UTILITY BAR - CLEAN & MODERN */}
      <div className="bg-[#071B45] text-white">
        <div className="mx-auto flex h-9 max-w-[1480px] items-center justify-between px-4 text-[11px] font-medium lg:px-8">
          <div className="flex items-center gap-5 text-white/80">
            <a
              href={`tel:${BRAND.phone}`}
              className="hidden items-center gap-1.5 hover:text-white transition-colors cursor-pointer sm:flex text-inherit no-underline"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{BRAND.phone}</span>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="hidden items-center gap-1.5 hover:text-white transition-colors cursor-pointer md:flex text-inherit no-underline"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{BRAND.email}</span>
            </a>
            <span className="flex items-center gap-1.5 text-white/90">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{BRAND.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <button
              onClick={() => navigate('faq')}
              className="border-0 bg-transparent text-inherit hover:text-white cursor-pointer transition-colors py-1 text-[11px]"
            >
              Help &amp; Support
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => navigate('customer-dashboard')}
              className="border-0 bg-transparent text-inherit hover:text-white cursor-pointer transition-colors py-1 text-[11px]"
            >
              Track Order
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => navigate('request-quote')}
              className="hidden sm:inline-block border-0 bg-transparent text-slate-200 hover:text-white cursor-pointer transition-colors py-1 text-[11px]"
            >
              Import Landing Cost
            </button>
            <span className="hidden sm:inline text-white/20">|</span>

            {/* PORTAL ACCESS WITH SEAMLESS THEME DROPDOWN */}
            <div className="relative" ref={portalDropdownRef}>
              <button
                type="button"
                onClick={() => setPortalMenuOpen(!portalMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold transition-all border rounded cursor-pointer ${
                  currentRole
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                    : 'bg-white/10 text-white border-white/15 hover:bg-white/20 hover:border-white/30'
                }`}
              >
                <User className="h-3.5 w-3.5 text-slate-300" />
                <span>
                  {currentRole === 'admin'
                    ? 'Super Admin'
                    : currentRole === 'vendor'
                    ? 'Vendor Portal'
                    : currentRole === 'engineer'
                    ? 'Engineer Portal'
                    : currentRole === 'customer'
                    ? 'Hospital / Client'
                    : 'Portals & Login'}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${portalMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {portalMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 rounded-lg bg-white p-2 text-slate-800 shadow-2xl ring-1 ring-black/10 z-[100] border border-slate-200 animate-fade-in">
                  <div className="px-2.5 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {currentRole ? 'Active Session' : 'Direct Portal Switcher'}
                      </span>
                      <span className="block text-xs font-bold text-[#071B45]">
                        {currentUserName || 'Select Role Workspace'}
                      </span>
                    </div>
                    {currentRole && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => selectPortalRole('admin', 'admin', 'Super Admin')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left text-xs transition cursor-pointer ${
                        currentRole === 'admin' ? 'bg-[#071B45] text-white font-bold' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <ShieldCheck className={`h-4 w-4 ${currentRole === 'admin' ? 'text-orange' : 'text-[#0D47A1]'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs leading-none">Super Admin Control Center</div>
                        <span className={`text-[10px] block mt-0.5 ${currentRole === 'admin' ? 'text-white/70' : 'text-slate-400'}`}>
                          Add Products, Brands, Approvals &amp; Pricing
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectPortalRole('vendor', 'vendor', 'MediTech Solutions')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left text-xs transition cursor-pointer ${
                        currentRole === 'vendor' ? 'bg-[#071B45] text-white font-bold' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Store className={`h-4 w-4 ${currentRole === 'vendor' ? 'text-orange' : 'text-emerald-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs leading-none">Vendor Portal</div>
                        <span className={`text-[10px] block mt-0.5 ${currentRole === 'vendor' ? 'text-white/70' : 'text-slate-400'}`}>
                          MediTech Solutions (Listings &amp; Stock)
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectPortalRole('engineer', 'engineer-portal', 'Er. Suman Adhikari')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left text-xs transition cursor-pointer ${
                        currentRole === 'engineer' ? 'bg-[#071B45] text-white font-bold' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Wrench className={`h-4 w-4 ${currentRole === 'engineer' ? 'text-orange' : 'text-blue-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs leading-none">Biomedical Engineer Portal</div>
                        <span className={`text-[10px] block mt-0.5 ${currentRole === 'engineer' ? 'text-white/70' : 'text-slate-400'}`}>
                          Er. Suman Adhikari (Service &amp; Verifications)
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectPortalRole('customer', 'customer-dashboard', 'Ramesh Karki (Bir Hospital)')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left text-xs transition cursor-pointer ${
                        currentRole === 'customer' ? 'bg-[#071B45] text-white font-bold' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Building2 className={`h-4 w-4 ${currentRole === 'customer' ? 'text-orange' : 'text-purple-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs leading-none">Hospital / Customer Portal</div>
                        <span className={`text-[10px] block mt-0.5 ${currentRole === 'customer' ? 'text-white/70' : 'text-slate-400'}`}>
                          Bir Hospital (Orders, Rentals, Invoices)
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setPortalMenuOpen(false)
                        navigate('customer-auth')
                      }}
                      className="text-[#0D47A1] font-semibold hover:underline py-1 px-1 cursor-pointer"
                    >
                      All Login Options
                    </button>
                    {currentRole && (
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-rose-600 font-semibold hover:text-rose-700 py-1 px-1 cursor-pointer flex items-center gap-1"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND & SEARCH HEADER */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center gap-4 px-4 lg:gap-8 lg:px-8">
          {/* Mobile menu toggle */}
          <button
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-[#071B45] hover:border-orange cursor-pointer transition-colors lg:hidden"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mediko Brand Logo */}
          <button
            onClick={() => navigate('home')}
            className="shrink-0 border-0 bg-transparent p-0 cursor-pointer flex items-center group transition"
          >
            <img
              src={BRAND.logo}
              alt="Mediko Bazaar"
              className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </button>

          {/* Search Bar with Category Selector */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch()
            }}
            className="hidden h-11 flex-1 overflow-hidden rounded-xl border border-slate-250 bg-white shadow-xs transition-all focus-within:border-orange focus-within:ring-2 focus-within:ring-orange/15 md:flex"
          >
            <div className="relative border-r border-slate-200 bg-slate-50/80">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-full appearance-none bg-transparent pl-3.5 pr-8 text-xs font-semibold text-[#071B45] outline-none cursor-pointer"
              >
                {SEARCH_CATEGORIES.map((item) => (
                  <option key={item} value={item} className="text-slate-800">
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ICU monitors, oxygen concentrators, hospital beds, ultrasound, spare parts..."
              className="min-w-0 flex-1 border-0 px-4 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="grid w-14 place-items-center border-0 bg-orange text-white cursor-pointer transition-colors hover:bg-orange-hover"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          </form>

          {/* Quick Action Icons */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => navigate('shop')}
              className="hidden xl:flex min-w-[56px] flex-col items-center gap-1 rounded-xl border-0 bg-transparent px-2.5 py-1.5 text-[#071B45] hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <GitCompare className="w-4 h-4 text-slate-600" />
              <span className="text-[10px] font-bold text-slate-600">Compare</span>
            </button>

            <button
              onClick={() => navigate('customer-dashboard')}
              className="hidden lg:flex min-w-[56px] flex-col items-center gap-1 rounded-xl border-0 bg-transparent px-2.5 py-1.5 text-[#071B45] hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Heart className="w-4 h-4 text-slate-600" />
              <span className="text-[10px] font-bold text-slate-600">Wishlist</span>
            </button>

            <button
              onClick={() => navigate('cart')}
              className="relative flex min-w-[60px] flex-col items-center gap-1 rounded-xl border-0 bg-transparent px-2.5 py-1.5 text-[#071B45] hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#071B45]" />
                <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-[18px] place-items-center rounded-full bg-orange px-1 text-[9px] font-extrabold text-white shadow-sm">
                  {cartCount}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-700">Cart</span>
            </button>

            <button
              onClick={() => navigate('customer-auth')}
              className="flex min-w-[60px] flex-col items-center gap-1 rounded-xl border-0 bg-transparent px-2.5 py-1.5 text-[#071B45] hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <User className="w-5 h-5 text-[#071B45]" />
              <span className="text-[10px] font-bold text-slate-700">Account</span>
            </button>

            <button
              onClick={() => navigate('request-quote')}
              className="ml-2 hidden h-10 items-center gap-2 rounded-xl border-0 bg-[#071B45] px-4 text-white transition-all hover:bg-orange hover:shadow-md cursor-pointer sm:flex group"
            >
              <FileText className="w-4 h-4 text-orange group-hover:text-white transition-colors" />
              <div className="text-left">
                <span className="block text-[11px] font-black leading-none">Get a Quote</span>
                <span className="block text-[8px] text-white/70 leading-tight">Fast Response</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION BAR WITH RICH MEGA MENUS */}
      <nav className="relative hidden border-b border-slate-200/80 bg-white lg:block">
        <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between px-8 text-[13px] font-semibold text-[#071B45]">
          <div className="flex items-center h-full space-x-1">
            {/* MEGA MENU 1: "Shop & Categories" */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <button
                onClick={() => navigate('shop')}
                className={`flex h-full items-center gap-1.5 px-4 transition-colors cursor-pointer border-b-2 ${
                  isMegaMenuOpen || currentPage === 'shop'
                    ? 'border-orange text-orange font-bold'
                    : 'border-transparent text-[#071B45] hover:text-orange'
                }`}
              >
                <span>Shop &amp; Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMegaMenuOpen ? 'rotate-180 text-orange' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* RICH MEGA MENU WITH HIGH-RESOLUTION IMAGES */}
              {isMegaMenuOpen && (
                <div
                  className="absolute left-0 top-full w-[1140px] rounded-b-2xl border border-slate-200 border-t-0 bg-white p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                >
                  <div className="grid grid-cols-5 gap-5">
                    {/* Col 1: ICU & Critical Care */}
                    <div className="space-y-3">
                      <div className="relative h-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <img
                          src="/assets/generated/category-monitoring.png"
                          alt="ICU Patient Monitoring"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071B45]/90 via-[#071B45]/30 to-transparent p-2.5 flex items-end">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-orange" />
                            ICU &amp; Critical Care
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        {['Multi-Para Patient Monitors', 'ICU Ventilators & BiPAP', 'Syringe & Infusion Pumps', 'Biphasic Defibrillators', 'Central Nursing Stations'].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                navigate('shop')
                                setIsMegaMenuOpen(false)
                              }}
                              className="text-left hover:text-orange cursor-pointer transition-colors border-0 bg-transparent p-0 block w-full py-0.5"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 2: Radiology & Diagnostics */}
                    <div className="space-y-3">
                      <div className="relative h-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <img
                          src="/assets/generated/category-ultrasound.png"
                          alt="Ultrasound & Diagnostic"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071B45]/90 via-[#071B45]/30 to-transparent p-2.5 flex items-end">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-400" />
                            Radiology &amp; Imaging
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        {['Portable Ultrasound Scanners', '12-Channel ECG Machines', 'Mobile High-Freq X-Ray', 'Hematology Analyzers', 'Biochemistry Systems'].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                navigate('shop')
                                setIsMegaMenuOpen(false)
                              }}
                              className="text-left hover:text-orange cursor-pointer transition-colors border-0 bg-transparent p-0 block w-full py-0.5"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 3: OT & Surgery Suite */}
                    <div className="space-y-3">
                      <div className="relative h-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <img
                          src="/assets/generated/category-surgical.png"
                          alt="OT & Surgical Lights"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071B45]/90 via-[#071B45]/30 to-transparent p-2.5 flex items-end">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                            OT &amp; Surgery Suite
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        {['Electrosurgical Cautery Units', 'LED Surgical Shadowless Lights', 'Electric & Hydraulic OT Tables', 'Hospital Autoclaves 23L-50L', 'Surgical Suction Units'].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                navigate('shop')
                                setIsMegaMenuOpen(false)
                              }}
                              className="text-left hover:text-orange cursor-pointer transition-colors border-0 bg-transparent p-0 block w-full py-0.5"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 4: Hospital Beds & Mobility */}
                    <div className="space-y-3">
                      <div className="relative h-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <img
                          src="/assets/generated/category-furniture.png"
                          alt="Hospital Bed"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071B45]/90 via-[#071B45]/30 to-transparent p-2.5 flex items-end">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-amber-400" />
                            Hospital Furniture
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        {['3-Function Electric ICU Beds', '2-Crank Manual Hospital Beds', 'Crash Carts & Dressing Trolleys', 'Reclining Wheelchairs', 'Anti-Decubitus Air Mattresses'].map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => {
                                navigate('shop')
                                setIsMegaMenuOpen(false)
                              }}
                              className="text-left hover:text-orange cursor-pointer transition-colors border-0 bg-transparent p-0 block w-full py-0.5"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 5: Featured Device of the Month Card */}
                    <div className="rounded-2xl border border-orange/20 bg-gradient-to-b from-orange/5 via-white to-slate-50 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="rounded-md bg-orange px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
                            Featured
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> In Stock
                          </span>
                        </div>
                        <img
                          src="/assets/generated/category-monitoring.png"
                          alt="Mindray MEC-1200"
                          className="h-24 w-full object-contain rounded-lg mb-2.5 bg-white p-1 border border-slate-200"
                        />
                        <h5 className="text-xs font-bold text-[#071B45] leading-snug line-clamp-2">
                          Mindray MEC-1200 ICU Multi-Para Bedside Monitor
                        </h5>
                        <p className="text-[10px] text-slate-500 mt-1">
                          12.1" TFT display, ECG, SpO2, NIBP and dual temperature with an official invoice.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate('product')
                          setIsMegaMenuOpen(false)
                        }}
                        className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#071B45] py-2 text-[11px] font-bold text-white hover:bg-orange transition-colors cursor-pointer"
                      >
                        <span>View Specifications</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Item: Home */}
            <button
              onClick={() => navigate('home')}
              className={`h-full px-3.5 transition-colors cursor-pointer border-b-2 ${
                currentPage === 'home'
                  ? 'border-orange text-orange font-bold'
                  : 'border-transparent text-[#071B45] hover:text-orange'
              }`}
            >
              Home
            </button>

            {/* MEGA MENU 2: "Rentals" with Rich Product Fleet Showcase */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={handleRentalEnter}
              onMouseLeave={handleRentalLeave}
            >
              <button
                onClick={() => navigate('rental-products')}
                className={`flex h-full items-center gap-1.5 px-4 transition-colors cursor-pointer border-b-2 ${
                  currentPage === 'rental-products'
                    ? 'border-orange text-orange font-bold'
                    : 'border-transparent text-[#071B45] hover:text-orange'
                }`}
              >
                <span>Medical Rentals</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isRentalMenuOpen ? 'rotate-180 text-orange' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* RENTAL FLEET MEGA MENU */}
              {isRentalMenuOpen && (
                <div
                  className="absolute left-0 top-full w-[960px] rounded-b-2xl border border-slate-200 border-t-0 bg-white p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseEnter={handleRentalEnter}
                  onMouseLeave={handleRentalLeave}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-100 text-purple-700">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider text-[#071B45]">
                          Hospital &amp; Home Medical Rental Fleets
                        </h4>
                        <p className="text-xs text-slate-500">
                          Flexible daily, weekly &amp; monthly lease contracts with 100% refundable security deposit
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('rental-products')
                        setIsRentalMenuOpen(false)
                      }}
                      className="rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Show All Rental Products ({PRODUCTS.filter(p => p.type === 'rental' || p.rentalMonthly).length}+ Fleets)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-12 gap-5">
                    {/* Rental Categories Column */}
                    <div className="col-span-4 border-r border-slate-100 pr-4 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                        Rental Categories:
                      </span>
                      {[
                        { name: 'Oxygen & Respiratory Care', count: '18 Devices', sub: '5L/10L Concentrators & Tanks' },
                        { name: 'ICU Patient Monitors', count: '12 Systems', sub: 'Multi-Para & Transport Monitors' },
                        { name: 'Hospital Beds & Mattresses', count: '15 Models', sub: '3-Function Electric & 2-Crank' },
                        { name: 'Ventilators, BiPAP & CPAP', count: '8 Units', sub: 'ResMed & Philips DreamStation' },
                        { name: 'Wheelchairs & Patient Mobility', count: '24 Units', sub: 'Chrome Foldable & Reclining' },
                        { name: 'Infusion & Suction Pumps', count: '10 Units', sub: 'Syringe, Volumetric & Portable' },
                      ].map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            navigate('rental-products')
                            setIsRentalMenuOpen(false)
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-purple-50/70 border border-transparent hover:border-purple-200 transition cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs text-[#071B45] group-hover:text-purple-700 font-bold block">
                              {cat.name}
                            </strong>
                            <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-md">
                              {cat.count}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{cat.sub}</span>
                        </button>
                      ))}
                    </div>

                    {/* Featured Rental Equipment Showcase */}
                    <div className="col-span-8">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                        Popular Rental Equipment Ready for Same-Day Dispatch:
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            title: 'Yuwell 8F-5AW 5L',
                            sub: 'Oxygen Concentrator',
                            price: 'Rs. 8,000/mo',
                            deposit: 'Deposit: Rs. 15,000',
                            img: '/assets/generated/category-respiratory.png',
                          },
                          {
                            title: 'Mindray MEC-1200',
                            sub: 'ICU Patient Monitor',
                            price: 'Rs. 14,000/mo',
                            deposit: 'Deposit: Rs. 25,000',
                            img: '/assets/generated/category-monitoring.png',
                          },
                          {
                            title: 'Electric Hospital Bed',
                            sub: '3-Function Remote',
                            price: 'Rs. 12,000/mo',
                            deposit: 'Deposit: Rs. 25,000',
                            img: '/assets/generated/category-furniture.png',
                          },
                        ].map((fleet) => (
                          <div
                            key={fleet.title}
                            onClick={() => {
                              navigate('rental-products')
                              setIsRentalMenuOpen(false)
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 transition-all hover:border-purple-400 hover:bg-white hover:shadow-md cursor-pointer group"
                          >
                            <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-white border border-slate-100">
                              <img
                                src={fleet.img}
                                alt={fleet.title}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                              <span className="absolute bottom-1 right-1 rounded bg-purple-700 px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                                Ready in Stock
                              </span>
                            </div>
                            <h5 className="text-[11px] font-bold text-[#071B45] leading-tight truncate">
                              {fleet.title}
                            </h5>
                            <p className="text-[9px] text-slate-500 truncate">{fleet.sub}</p>
                            <div className="mt-1.5 border-t border-slate-100 pt-1">
                              <span className="block font-mono text-[11px] font-black text-purple-700">
                                {fleet.price}
                              </span>
                              <span className="text-[8px] text-slate-400">{fleet.deposit}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Trust Guarantee Banner */}
                      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-purple-50/80 p-2.5 text-[10px] text-purple-900 border border-purple-200">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>Refund protection</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Truck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>Doorstep Setup</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Wrench className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>24/7 BMET Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Item: Certified Pre-Owned */}
            <button
              onClick={() => navigate('used-products')}
              className={`flex items-center gap-1.5 h-full px-4 transition-colors cursor-pointer border-b-2 ${
                currentPage === 'used-products'
                  ? 'border-orange text-orange font-bold'
                  : 'border-transparent text-[#071B45] hover:text-orange'
              }`}
            >
              <span>Certified Pre-Owned</span>
            </button>

            {/* Standard Nav Item: Spare Parts */}
            <button
              onClick={() => navigate('spare-parts')}
              className={`h-full px-4 transition-colors cursor-pointer border-b-2 ${
                currentPage === 'spare-parts'
                  ? 'border-orange text-orange font-bold'
                  : 'border-transparent text-[#071B45] hover:text-orange'
              }`}
            >
              Spare Parts
            </button>

            {/* MEGA MENU 3: Services & B2B Procurement */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={handleServiceEnter}
              onMouseLeave={handleServiceLeave}
            >
              <button
                onClick={() => navigate('engineering-service')}
                className={`flex h-full items-center gap-1.5 px-4 transition-colors cursor-pointer border-b-2 ${
                  currentPage === 'engineering-service' || currentPage === 'b2b-enquiry'
                    ? 'border-orange text-orange font-bold'
                    : 'border-transparent text-[#071B45] hover:text-orange'
                }`}
              >
                <span>Engineering &amp; B2B Sourcing</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isServiceMenuOpen ? 'rotate-180 text-orange' : 'text-slate-400'
                  }`}
                />
              </button>

              {isServiceMenuOpen && (
                <div
                  className="absolute left-0 top-full w-[640px] rounded-b-2xl border border-slate-200 border-t-0 bg-white p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseEnter={handleServiceEnter}
                  onMouseLeave={handleServiceLeave}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* Engineering Service Column */}
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[#071B45] font-bold text-xs mb-1.5">
                          <Wrench className="w-4 h-4 text-orange" />
                          Biomedical Engineering (BMET)
                        </div>
                        <p className="text-[10px] text-slate-500 mb-3">
                          NHPC certified biomedical engineers for hospitals across all 7 provinces of Nepal.
                        </p>
                        <ul className="space-y-1 text-[11px] text-slate-700 font-medium">
                          <li>• Equipment Calibration &amp; Safety Audit</li>
                          <li>• Annual Maintenance Contracts (AMC/CMC)</li>
                          <li>• Hospital ICU &amp; OT Setup Engineering</li>
                          <li>• Breakdown Emergency Diagnostics</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          navigate('engineering-service')
                          setIsServiceMenuOpen(false)
                        }}
                        className="mt-4 w-full rounded-lg bg-[#071B45] py-2 text-xs font-bold text-white hover:bg-orange transition-colors cursor-pointer text-center"
                      >
                        Book Biomedical Engineer →
                      </button>
                    </div>

                    {/* B2B Import Procurement Column */}
                    <div className="rounded-xl border border-blue-200 p-4 bg-blue-50/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-1.5">
                          <Globe className="w-4 h-4 text-blue-600" />
                          Admin Import Procurement &amp; Sourcing
                        </div>
                        <p className="text-[10px] text-slate-600 mb-3">
                          Mediko Admin acts as your centralized Importer of Record. Request direct purchases from global sellers.
                        </p>
                        <ul className="space-y-1 text-[11px] text-slate-700 font-medium">
                          <li>• Direct Sourcing from Global OEM Sellers</li>
                          <li>• Official Quotation PDF &amp; Proforma Invoice</li>
                          <li>• Bank LC &amp; Customs Cargo Clearance</li>
                          <li>• Transparent Freight &amp; Agent Fees</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          navigate('b2b-enquiry')
                          setIsServiceMenuOpen(false)
                        }}
                        className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer text-center"
                      >
                        Request Import Quotation →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* One login entry detects the account role after sign-in. */}
            <button
              onClick={() => navigate('customer-auth')}
              className={`h-full px-4 transition-colors cursor-pointer border-b-2 ${
                currentPage === 'customer-auth'
                  ? 'border-orange text-orange font-bold'
                  : 'border-transparent text-[#071B45] hover:text-orange'
              }`}
            >
              Portal Login
            </button>
          </div>

          <div className="flex h-full items-center gap-5 text-[13px] font-semibold text-slate-500">
            <button
              onClick={() => navigate('faq')}
              className="border-0 bg-transparent text-inherit hover:text-orange cursor-pointer transition-colors py-1"
            >
              FAQ
            </button>
            <button
              onClick={() => navigate('contact')}
              className="border-0 bg-transparent text-inherit hover:text-orange cursor-pointer transition-colors py-1"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white p-5 shadow-2xl lg:hidden animate-in fade-in slide-in-from-top-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch()
              setMobileOpen(false)
            }}
            className="mb-4 flex h-11 overflow-hidden rounded-xl border border-slate-250"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medical equipment..."
              className="min-w-0 flex-1 border-0 px-3 text-xs outline-none"
            />
            <button className="grid w-12 place-items-center border-0 bg-orange text-white cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => {
                navigate('home')
                setMobileOpen(false)
              }}
              className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('shop')
                setMobileOpen(false)
              }}
              className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 cursor-pointer"
            >
              Shop Catalog
            </button>
            <button
              onClick={() => {
                navigate('rental-products')
                setMobileOpen(false)
              }}
              className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 text-left text-purple-800 cursor-pointer"
            >
              Medical Rentals
            </button>
            <button
              onClick={() => {
                navigate('used-products')
                setMobileOpen(false)
              }}
              className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-left text-emerald-800 cursor-pointer"
            >
              Certified Pre-Owned
            </button>
            <button
              onClick={() => {
                navigate('spare-parts')
                setMobileOpen(false)
              }}
              className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 cursor-pointer"
            >
              Biomedical Spares
            </button>
            <button
              onClick={() => {
                navigate('engineering-service')
                setMobileOpen(false)
              }}
              className="rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 cursor-pointer"
            >
              Engineering Services
            </button>
            <button
              onClick={() => {
                navigate('customer-auth')
                setMobileOpen(false)
              }}
              className="flex items-center gap-2 border border-orange bg-orange px-4 py-3 text-left font-semibold text-white shadow-sm"
            >
              <User className="h-4 w-4" /> Portal Login
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
