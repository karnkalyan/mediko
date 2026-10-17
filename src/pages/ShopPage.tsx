import { useState, useMemo, useEffect } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, getLiveProducts } from '../data/products'
import type { NavProps } from '../types'
import {
  Search,
  Grid,
  List,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Filter,
  X,
  Building2,
  Clock,
} from 'lucide-react'

const BRANDS = [
  'Mindray',
  'Philips',
  'GE Healthcare',
  'Siemens',
  'Dräger',
  'Yuwell',
  'Contec',
  'Schiller',
  'Olympus',
  'B. Braun',
  'Mediko',
]

const FILTER_CHIPS = [
  'All Products',
  'B2B Hospital Supplies',
  'On Rent',
  'Certified Used',
  'Spare Parts & Sensors',
  'In Stock',
  'Verified Sellers',
]

const SORT_OPTIONS = [
  'Relevance',
  'Price: Low to High',
  'Price: High to Low',
  'Newest First',
  'Best Rated',
]

interface ShopPageProps extends NavProps {
  filterType?: string
}

export default function ShopPage({
  navigate,
  cartCount,
  setCartCount,
  filterType,
}: ShopPageProps) {
  const [activeChip, setActiveChip] = useState(
    filterType === 'rental'
      ? 'On Rent'
      : filterType === 'used'
      ? 'Certified Used'
      : filterType === 'spare-part'
      ? 'Spare Parts & Sensors'
      : 'All Products'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [brandSearch, setBrandSearch] = useState('')
  const [sortBy, setSortBy] = useState('Relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    brand: true,
    stock: true,
  })

  const [liveProducts, setLiveProducts] = useState(getLiveProducts)

  useEffect(() => {
    const handleSync = () => {
      setLiveProducts(getLiveProducts())
    }
    window.addEventListener('mediko_products_updated', handleSync)
    return () => window.removeEventListener('mediko_products_updated', handleSync)
  }, [])

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    )

  const toggleFilter = (k: string) =>
    setExpandedFilters((prev) => ({ ...prev, [k]: !prev[k] }))

  const clearAllFilters = () => {
    setActiveChip('All Products')
    setSelectedCategory(null)
    setSelectedBrands([])
    setSearchQuery('')
    setPriceMin('')
    setPriceMax('')
  }

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return liveProducts.filter((p) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchBrand = p.brand?.toLowerCase().includes(q)
        const matchModel = p.model?.toLowerCase().includes(q)
        const matchSku = p.sku?.toLowerCase().includes(q)
        if (!matchTitle && !matchBrand && !matchModel && !matchSku) return false
      }

      // 2. Chip filters
      if (activeChip === 'On Rent' && p.type !== 'rental' && !p.rentalDaily) return false
      if (activeChip === 'Certified Used' && p.type !== 'used' && !p.condition?.toLowerCase().includes('used')) return false
      if (activeChip === 'Spare Parts & Sensors' && p.type !== 'spare-part' && p.category !== 'Spare Parts') return false
      if (activeChip === 'B2B Hospital Supplies' && !p.forHospital && !p.askForPrice) return false
      if (activeChip === 'In Stock' && !p.inStock) return false
      if (activeChip === 'Verified Sellers' && !p.sellerVerified) return false

      // 3. Category
      if (selectedCategory && p.category !== selectedCategory) return false

      // 4. Brands
      if (selectedBrands.length > 0 && !selectedBrands.some((b) => p.brand?.toLowerCase() === b.toLowerCase())) {
        return false
      }

      // 5. Price Min / Max
      const numPrice = p.price ?? 0
      if (priceMin && numPrice < Number(priceMin)) return false
      if (priceMax && numPrice > Number(priceMax)) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return (a.price ?? 0) - (b.price ?? 0)
      if (sortBy === 'Price: High to Low') return (b.price ?? 0) - (a.price ?? 0)
      if (sortBy === 'Best Rated') return (b.rating ?? 0) - (a.rating ?? 0)
      return 0
    })
  }, [liveProducts, searchQuery, activeChip, selectedCategory, selectedBrands, priceMin, priceMax, sortBy])

  const visibleBrands = useMemo(() => {
    if (!brandSearch.trim()) return BRANDS
    return BRANDS.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
  }, [brandSearch])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="shop" />

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#071B45] via-[#0D47A1] to-[#0A255C] text-white py-8 px-4 lg:px-8 border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
              <button
                onClick={() => navigate('home')}
                className="hover:text-orange transition-colors cursor-pointer text-white/70 border-0 bg-transparent p-0"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              <span className="text-orange font-semibold">Medical Equipment Catalog</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-extrabold tracking-tight text-white m-0">
              Biomedical Equipment &amp; Supplies Marketplace
            </h1>
            <p className="mt-1.5 text-xs lg:text-sm text-cyan-100/80 max-w-2xl">
              Authentic certified ICU machinery, diagnostic ultrasound, hospital furniture, rental fleets, and spare parts delivered across all 7 provinces of Nepal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: <Truck className="w-4 h-4 text-orange" />, label: 'Nepal-Wide Delivery' },
              { icon: <ShieldCheck className="w-4 h-4 text-cyan-300" />, label: 'DDA / CE Certified' },
              { icon: <RotateCcw className="w-4 h-4 text-emerald-400" />, label: '13% Official VAT Bill' },
              { icon: <CheckCircle2 className="w-4 h-4 text-teal-300" />, label: 'Engineer Supported' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/15 text-xs text-white font-medium shadow-sm"
              >
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Catalog Workspace */}
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-[#071B45] text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            <Filter className="w-3.5 h-3.5 text-orange" />
            <span>Filter Catalog ({filteredProducts.length})</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Sidebar Filter Panel */}
        <aside
          className={`${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto'
              : 'hidden lg:block'
          }`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="font-heading font-bold text-base text-[#071B45]">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* Search Input Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold text-[#071B45] uppercase tracking-wider mb-2">
                Search Catalog
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keyword, model or SKU..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]"
                />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleFilter('categories')}
                className="w-full flex items-center justify-between p-4 bg-white text-left font-bold text-xs uppercase tracking-wider text-[#071B45] border-0 cursor-pointer"
              >
                <span>Medical Categories</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedFilters.categories ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFilters.categories && (
                <div className="p-3 pt-0 border-t border-slate-100 max-h-60 overflow-y-auto space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                      selectedCategory === null
                        ? 'bg-orange-soft text-orange font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Departments</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                      {liveProducts.length}
                    </span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() =>
                        setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                      }
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                        selectedCategory === cat.name
                          ? 'bg-orange-soft text-orange font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleFilter('brand')}
                className="w-full flex items-center justify-between p-4 bg-white text-left font-bold text-xs uppercase tracking-wider text-[#071B45] border-0 cursor-pointer"
              >
                <span>Certified Brands</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedFilters.brand ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFilters.brand && (
                <div className="p-3 pt-0 border-t border-slate-100 space-y-2">
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brands..."
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md outline-none mb-2"
                  />
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {visibleBrands.map((b) => (
                      <label
                        key={b}
                        className="flex items-center gap-2.5 px-2 py-1 rounded text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => toggleBrand(b)}
                          className="h-3.5 w-3.5 rounded text-orange focus:ring-orange accent-orange"
                        />
                        <span className="font-medium">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleFilter('price')}
                className="w-full flex items-center justify-between p-4 bg-white text-left font-bold text-xs uppercase tracking-wider text-[#071B45] border-0 cursor-pointer"
              >
                <span>Price Range (NPR)</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedFilters.price ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFilters.price && (
                <div className="p-4 pt-0 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Min NPR</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-md outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Max NPR</span>
                      <input
                        type="number"
                        placeholder="500,000"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-md outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '< 10k', min: '', max: '10000' },
                      { label: '10k - 50k', min: '10000', max: '50000' },
                      { label: '50k - 200k', min: '50000', max: '200000' },
                      { label: '200k+', min: '200000', max: '' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setPriceMin(preset.min)
                          setPriceMax(preset.max)
                        }}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear All Button */}
            {(selectedCategory || selectedBrands.length > 0 || searchQuery || priceMin || priceMax) && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-rose-500" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </aside>

        {/* Catalog Main Content */}
        <main className="space-y-5">
          {/* Top Bar: Count & View Switcher */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-[#071B45] font-bold">{filteredProducts.length}</strong> equipment matches
              </span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-orange-soft text-orange px-2 py-0.5 rounded-full font-bold">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-[#071B45] cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#071B45] text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#071B45] text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filter Chips (Pills) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_CHIPS.map((chip) => {
              const active = activeChip === chip
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    active
                      ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm shadow-[#0D47A1]/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {chip}
                </button>
              )
            })}
          </div>

          {/* Product Listing */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-slate-800">
                No matching equipment found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                Try adjusting your search criteria, clearing brand filters, or request a custom procurement quote from Mediko Bazaar.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-orange hover:bg-orange-hover text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isRentalCatalog={activeChip === 'On Rent' || product.type === 'rental'}
                  onClick={() => {
                    localStorage.setItem('mediko_selected_product', JSON.stringify(product))
                    navigate('product')
                  }}
                  onAddToCart={() => setCartCount?.(cartCount + 1)}
                  onRentClick={(rentP) => {
                    localStorage.setItem('mediko_selected_product', JSON.stringify(rentP))
                    navigate('rental-detail')
                  }}
                  onQuoteClick={(quoteP) => {
                    localStorage.setItem('mediko_quote_product', JSON.stringify(quoteP))
                    navigate('request-quote')
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center gap-5"
                >
                  <div className="h-28 w-28 shrink-0 bg-slate-50 rounded-lg p-2 flex items-center justify-center border border-slate-100">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange">
                        {p.brand}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{p.category}</span>
                      {p.badge && (
                        <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => {
                        localStorage.setItem('mediko_selected_product', JSON.stringify(p))
                        navigate('product')
                      }}
                      className="font-heading text-sm font-bold text-[#071B45] hover:text-orange transition cursor-pointer truncate"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {p.description ||
                        `Clinical grade biomedical system engineered for hospitals, clinics, and critical health centers in Nepal.`}
                    </p>
                    <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-600 font-medium">
                      <span>Model: <strong className="text-slate-900">{p.model}</strong></span>
                      <span>Warranty: <strong className="text-slate-900">{p.warranty || '2 Years'}</strong></span>
                      <span className="text-emerald-700 font-bold">
                        {p.inStock ? 'In Stock' : 'On Order'}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right sm:border-l sm:border-slate-100 sm:pl-5 space-y-2">
                    {p.askForPrice ? (
                      <div className="text-sm font-extrabold text-[#0D47A1]">Ask For Price</div>
                    ) : (
                      <div>
                        <div className="text-base font-extrabold text-[#071B45]">
                          NPR {p.price?.toLocaleString()}
                        </div>
                        {p.oldPrice && (
                          <div className="text-[11px] text-slate-400 line-through">
                            NPR {p.oldPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          localStorage.setItem('mediko_selected_product', JSON.stringify(p))
                          navigate('product')
                        }}
                        className="px-3 py-1.5 bg-[#071B45] hover:bg-orange text-white text-xs font-bold rounded-lg transition"
                      >
                        View Specs
                      </button>
                      <button
                        onClick={() => setCartCount?.(cartCount + 1)}
                        className="px-3 py-1.5 border border-slate-200 hover:border-orange hover:text-orange text-slate-700 text-xs font-bold rounded-lg transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Catalog Trust Information Footer */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#071B45]">
                  B2B Hospital Procurement
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tax invoice, institutional tender rates, hospital credit terms, and import clearances.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-orange-soft text-orange flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#071B45]">
                  Rental Equipment Fleet
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Flexible daily, weekly, or monthly ICU ventilator and bed rentals with transparent security deposit refund.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#071B45]">
                  Certified Pre-Owned
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  48-point biomedical engineer inspection, calibrated telemetry, and verified hospital resale certificates.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}
