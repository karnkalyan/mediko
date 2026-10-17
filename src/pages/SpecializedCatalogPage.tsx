import { useMemo, useState } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import type { NavProps, Page, Product } from '../types'
import { Search, ArrowRight } from 'lucide-react'

type CatalogKind = 'rental' | 'used' | 'home'

interface Props extends NavProps { kind: CatalogKind }

const CONFIG = {
  rental: {
    eyebrow: 'Flexible medical equipment rental',
    title: 'Rent the care you need,', accent: 'for as long as you need it.',
    description: 'Daily, weekly and monthly plans with refundable deposits, Nepal-wide delivery, installation and responsive support.',
    image: '/assets/generated/hero-homecare.png',
    currentPage: 'rental-products' as Page,
    detailPage: 'rental-detail' as Page,
    categories: ['All Rentals', 'Respiratory Care', 'Mobility Aids', 'Patient Monitoring', 'Home Care'],
    subcategories: ['Oxygen Therapy', 'CPAP & BiPAP', 'Wheelchairs', 'Hospital Beds', 'Patient Monitors'],
    stats: [['100+', 'Rental products'], ['Daily–Monthly', 'Flexible duration'], ['Refundable', 'Security deposit'], ['24/7', 'Rental support']],
    steps: [['01', 'Choose equipment'], ['02', 'Select duration'], ['03', 'Pay deposit'], ['04', 'Delivery & setup'], ['05', 'Pickup & inspection']],
  },
  used: {
    eyebrow: '100% Inspected & Biomedical Verified',
    title: 'Mediko Certified Pre-Owned,', accent: 'confidence built in.',
    description: 'Every pre-owned listing undergoes rigorous 48-point technical inspection, condition grading and document verification before marketplace listing.',
    image: '/assets/generated/hero-diagnostics.png',
    currentPage: 'used-products' as Page,
    detailPage: 'used-detail' as Page,
    categories: ['All Verified', 'Patient Monitoring', 'Diagnostic Equipment', 'Emergency Equipment', 'ICU Equipment'],
    subcategories: ['Grade A', 'Grade B', 'Refurbished', 'With Warranty', 'Recent Models'],
    stats: [['50+', 'Verified products'], ['40-point', 'Technical inspection'], ['A–D', 'Condition grading'], ['Verified', 'Service history']],
    steps: [['01', 'Seller verification'], ['02', 'Document review'], ['03', 'Technical inspection'], ['04', 'Condition grading'], ['05', 'Admin approval']],
  },
  home: {
    eyebrow: 'Healthcare for every home',
    title: 'Trusted home-care products', accent: 'for everyday wellbeing.',
    description: 'Easy-to-use medical equipment for respiratory support, monitoring, mobility and comfortable recovery at home.',
    image: '/assets/generated/hero-homecare.png',
    currentPage: 'home-care' as Page,
    detailPage: 'product' as Page,
    categories: ['All Home Care', 'Diagnostic Equipment', 'Respiratory Care', 'Mobility Aids', 'Home Care'],
    subcategories: ['Blood Pressure', 'Oxygen Therapy', 'Diabetes Care', 'Mobility Support', 'Patient Comfort'],
    stats: [['650+', 'Home-care products'], ['Genuine', 'Brand warranty'], ['Doorstep', 'Nepal-wide delivery'], ['Expert', 'Product guidance']],
    steps: [['01', 'Choose product'], ['02', 'Get guidance'], ['03', 'Secure checkout'], ['04', 'Home delivery'], ['05', 'After-sales care']],
  },
} as const

function getBaseProducts(kind: CatalogKind) {
  if (kind === 'rental') return PRODUCTS.filter(item => item.type === 'rental' || item.rentalMonthly)
  if (kind === 'used') return PRODUCTS.filter(item => item.type === 'used')
  return PRODUCTS.filter(item => item.forHomeCare)
}

function matchesSubcategory(product: Product, value: string) {
  if (value === 'All') return true
  const text = `${product.title} ${product.category} ${product.condition} ${product.conditionGrade || ''}`.toLowerCase()
  const terms: Record<string, string[]> = {
    'Oxygen Therapy': ['oxygen', 'respiratory'], 'CPAP & BiPAP': ['cpap', 'bipap'], Wheelchairs: ['wheelchair'],
    'Hospital Beds': ['bed'], 'Patient Monitors': ['monitor'], 'Grade A': ['grade a', ' a'], 'Grade B': ['grade b', ' b'],
    Refurbished: ['refurbished'], 'With Warranty': ['warranty'], 'Recent Models': ['2021', '2022'],
    'Blood Pressure': ['bp monitor', 'blood pressure'], 'Diabetes Care': ['gluco'], 'Mobility Support': ['walker', 'wheelchair', 'commode'],
    'Patient Comfort': ['mattress', 'bed', 'commode'],
  }
  return (terms[value] || [value.toLowerCase()]).some(term => text.includes(term))
}

export default function SpecializedCatalogPage({ kind, navigate, cartCount, setCartCount }: Props) {
  const config = CONFIG[kind]
  const baseProducts = useMemo(() => getBaseProducts(kind), [kind])
  const brands = useMemo(() => Array.from(new Set(baseProducts.map(item => item.brand))).sort(), [baseProducts])
  const [category, setCategory] = useState(config.categories[0] as string)
  const [subcategory, setSubcategory] = useState('All')
  const [brand, setBrand] = useState('All Brands')
  const [sort, setSort] = useState('Recommended')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const products = useMemo(() => {
    const filtered = baseProducts.filter(product => {
      const categoryMatch = category.startsWith('All') || product.category === category
      const brandMatch = brand === 'All Brands' || product.brand === brand
      const queryMatch = !query || `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase())
      return categoryMatch && brandMatch && matchesSubcategory(product, subcategory) && queryMatch
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'Price: Low to High') return (a.price || a.rentalMonthly || Infinity) - (b.price || b.rentalMonthly || Infinity)
      if (sort === 'Price: High to Low') return (b.price || b.rentalMonthly || 0) - (a.price || a.rentalMonthly || 0)
      if (sort === 'Best Rated') return b.rating - a.rating
      return b.reviews - a.reviews
    })
  }, [baseProducts, brand, category, query, sort, subcategory])

  const openProduct = () => navigate(config.detailPage)
  const resetFilters = () => { setCategory(config.categories[0]); setSubcategory('All'); setBrand('All Brands'); setQuery('') }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage={config.currentPage} />

      <section className="px-3 pt-4 md:px-6">
        <div className={`relative mx-auto min-h-[310px] max-w-[1480px] overflow-hidden rounded-[22px] ${kind === 'used' ? 'bg-[#edf6f2]' : kind === 'rental' ? 'bg-[#eef4fd]' : 'bg-[#fff6ed]'}`}>
          <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block"><img src={config.image} alt="" className="h-full w-full object-cover object-[75%_center]"/><div className={`absolute inset-0 bg-gradient-to-r ${kind === 'used' ? 'from-[#edf6f2]' : kind === 'rental' ? 'from-[#eef4fd]' : 'from-[#fff6ed]'} via-transparent to-transparent`}/></div>
          <div className="relative z-10 flex min-h-[310px] max-w-[700px] flex-col justify-center px-7 py-9 md:px-12">
            <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-[9px] font-black uppercase tracking-[.16em] text-orange shadow-sm">{config.eyebrow}</span>
            <h1 className="my-3 text-3xl font-bold leading-tight text-navy md:text-[40px]">{config.title}<br/><span className="text-orange">{config.accent}</span></h1>
            <p className="m-0 max-w-xl text-xs leading-5 text-slate-600 md:text-sm">{config.description}</p>
            <div className="mt-5 flex gap-3"><button onClick={() => document.getElementById('catalog-results')?.scrollIntoView({behavior:'smooth'})} className="rounded-lg border-0 bg-navy px-5 py-2.5 text-[10px] font-bold text-white cursor-pointer hover:bg-navy-deep transition flex items-center gap-1.5"><span>Browse products</span><ArrowRight className="w-3 h-3" /></button><button onClick={() => navigate('request-quote')} className="rounded-lg border border-orange bg-white px-5 py-2.5 text-[10px] font-bold text-orange cursor-pointer hover:bg-orange/5 transition">Talk to an expert</button></div>
          </div>
        </div>
      </section>

      <section className="px-3 py-3 md:px-6"><div className="mx-auto grid max-w-[1480px] grid-cols-2 overflow-hidden rounded-xl border border-border bg-white md:grid-cols-4">{config.stats.map(([value,label]) => <div key={label} className="border-b border-r border-border p-4 text-center last:border-r-0 md:border-b-0"><strong className="block font-heading text-lg text-navy">{value}</strong><span className="text-[9px] font-bold text-slate-400">{label}</span></div>)}</div></section>

      <section className="px-3 py-6 md:px-6"><div className="mx-auto max-w-[1480px]"><div className="mb-4 flex items-end justify-between"><div><span className="text-[9px] font-black uppercase tracking-widest text-orange">Browse by need</span><h2 className="m-0 mt-1 text-xl font-bold text-navy">Categories & subcategories</h2></div></div><div className="flex gap-2 overflow-x-auto pb-2">{config.categories.map((item,index) => <button key={item} onClick={() => {setCategory(item);setSubcategory('All')}} className={`min-w-[150px] rounded-xl border p-4 text-left transition cursor-pointer ${category === item ? 'border-orange bg-orange-soft' : 'border-border bg-white hover:border-navy/30'}`}><span className={`mb-3 grid h-9 w-9 place-items-center rounded-lg text-sm font-black ${index % 2 ? 'bg-orange text-white' : 'bg-navy text-white'}`}>{String(index + 1).padStart(2,'0')}</span><strong className="block text-[11px] text-navy">{item}</strong><small className="mt-1 block text-[8px] text-slate-400">View matching products</small></button>)}</div><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setSubcategory('All')} className={`rounded-full border px-4 py-2 text-[9px] font-bold cursor-pointer transition ${subcategory === 'All' ? 'border-navy bg-navy text-white' : 'border-border bg-white text-slate-500 hover:border-slate-400'}`}>All subcategories</button>{config.subcategories.map(item => <button key={item} onClick={() => setSubcategory(item)} className={`rounded-full border px-4 py-2 text-[9px] font-bold cursor-pointer transition ${subcategory === item ? 'border-navy bg-navy text-white' : 'border-border bg-white text-slate-500 hover:border-slate-400'}`}>{item}</button>)}</div></div></section>

      <section id="catalog-results" className="bg-[#f7f9fc] px-3 py-7 md:px-6"><div className="mx-auto max-w-[1480px]"><div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center"><div><h2 className="m-0 text-xl font-bold text-navy">{category}</h2><p className="m-0 mt-1 text-[10px] text-slate-500">{products.length} matching products · verified sellers only</p></div><div className="ml-auto flex flex-wrap gap-2"><label className="flex h-9 min-w-[220px] flex-1 items-center rounded-lg border border-border bg-white px-3 text-slate-400 lg:flex-none"><Search className="w-3.5 h-3.5 mr-2 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search this collection" className="min-w-0 flex-1 border-0 bg-transparent text-[10px] outline-none"/></label><button onClick={() => setFiltersOpen(!filtersOpen)} className="rounded-lg border border-border bg-white px-4 text-[10px] font-bold text-navy md:hidden cursor-pointer">Filters</button><select value={sort} onChange={event => setSort(event.target.value)} className="h-9 rounded-lg border border-border bg-white px-3 text-[10px] font-bold text-navy outline-none cursor-pointer"><option>Recommended</option><option>Best Rated</option><option>Price: Low to High</option><option>Price: High to Low</option></select></div></div>

        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <aside className={`${filtersOpen ? 'block' : 'hidden'} h-fit rounded-xl border border-border bg-white p-4 md:block`}><FilterTitle title="Brands"/><label className="mb-3 block"><select value={brand} onChange={event => setBrand(event.target.value)} className="h-9 w-full rounded-lg border border-border bg-white px-2 text-[10px] text-navy outline-none cursor-pointer"><option>All Brands</option>{brands.map(item => <option key={item}>{item}</option>)}</select></label><FilterTitle title="Category"/><div className="space-y-1">{config.categories.map(item => <button key={item} onClick={() => setCategory(item)} className={`w-full rounded-md border-0 px-2 py-2 text-left text-[9px] font-bold cursor-pointer transition ${category === item ? 'bg-orange-soft text-orange' : 'bg-transparent text-slate-500 hover:bg-bg-light'}`}>{item}</button>)}</div><FilterTitle title={kind === 'used' ? 'Condition' : kind === 'rental' ? 'Rental plan' : 'Product benefits'}/><div className="space-y-2">{(kind === 'used' ? ['Grade A verified','Grade B verified','Refurbished','Inspection passed'] : kind === 'rental' ? ['Daily plan','Weekly plan','Monthly plan','Refundable deposit'] : ['In stock','With warranty','Home delivery','Expert setup']).map(item => <label key={item} className="flex items-center gap-2 text-[9px] text-slate-500 cursor-pointer"><input type="checkbox" className="accent-orange"/>{item}</label>)}</div><button onClick={resetFilters} className="mt-5 w-full rounded-lg border border-border bg-white py-2 text-[9px] font-bold text-navy cursor-pointer hover:bg-slate-50 transition">Reset filters</button></aside>
          <div>{products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isRentalCatalog={kind === 'rental'}
                  onClick={() => {
                    localStorage.setItem('mediko_selected_product', JSON.stringify(product))
                    openProduct()
                  }}
                  onAddToCart={() => {
                    if (kind === 'rental') {
                      localStorage.setItem('mediko_selected_product', JSON.stringify(product))
                      openProduct()
                    } else setCartCount?.(cartCount + 1)
                  }}
                  onRentClick={(productToRent) => {
                    localStorage.setItem('mediko_selected_product', JSON.stringify(productToRent))
                    navigate('rental-detail')
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-[320px] place-items-center rounded-xl border border-dashed border-border bg-white text-center">
              <div>
                <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <h3 className="mb-1 text-sm text-navy">No exact matches found</h3>
                <p className="m-0 text-[10px] text-slate-400">Try another brand, category or subcategory.</p>
                <button onClick={resetFilters} className="mt-4 rounded-lg border-0 bg-orange px-4 py-2 text-[9px] font-bold text-white cursor-pointer hover:bg-orange-hover transition">Clear all filters</button>
              </div>
            </div>
          )}</div>
        </div>
      </div></section>

      <section className="px-3 py-8 md:px-6"><div className="mx-auto max-w-[1480px] rounded-2xl border border-border bg-white p-6"><div className="mb-5"><span className="text-[9px] font-black uppercase tracking-widest text-orange">How it works</span><h2 className="m-0 mt-1 text-xl font-bold text-navy">A clear process from selection to support</h2></div><div className="grid grid-cols-2 gap-4 md:grid-cols-5">{config.steps.map(([number,label],index) => <div key={label} className="relative"><span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-[10px] font-black text-white">{number}</span><strong className="mt-3 block text-[10px] text-navy">{label}</strong>{index < config.steps.length - 1 && <ArrowRight className="absolute right-2 top-3 hidden text-slate-300 md:block w-4 h-4" />}</div>)}</div></div></section>

      <section className="px-3 pb-8 md:px-6"><div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-4 rounded-2xl bg-navy-deep p-7 text-white md:flex-row"><div><h2 className="m-0 text-xl font-bold text-white">Need help choosing the right solution?</h2><p className="m-0 mt-1 text-xs text-white/55">Our equipment specialists can guide you by application, budget and brand.</p></div><div className="flex gap-2"><button onClick={() => navigate('contact')} className="rounded-lg border-0 bg-orange px-5 py-2.5 text-[10px] font-bold text-white cursor-pointer hover:bg-orange-hover transition">Talk to an expert</button><button onClick={() => navigate('request-quote')} className="rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-bold text-white cursor-pointer hover:bg-white/20 transition">Request a quote</button></div></div></section>

      <Footer navigate={navigate}/>
    </div>
  )
}

function FilterTitle({ title }: { title: string }) {
  return <h3 className="mb-2 mt-4 border-b border-border pb-2 text-[10px] font-bold text-navy first:mt-0">{title}</h3>
}
