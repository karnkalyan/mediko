import { useMemo, useState } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { ENGINEERING_SERVICES } from '../data/content'
import { PRODUCTS } from '../data/products'
import { SUPPLY_PROCESS } from '../lib/constants'
import type { NavProps } from '../types'
import { ArrowRight, CheckCircle2, Wrench } from 'lucide-react'

interface ServicePageProps extends NavProps { serviceType: 'supply' | 'engineering' | 'home-care' }

const SERVICE_CONFIG = {
  supply: {
    eyebrow: 'Institutional medical procurement', title: 'Medical Equipment', accent: 'Supply Service',
    description: 'End-to-end sourcing, quotations, institutional procurement, imports, delivery and commissioning for healthcare projects.',
    image: '/assets/generated/hero-diagnostics.png',
    services: ['Product Sourcing', 'Bulk Procurement', 'Project Supply', 'Import Assistance', 'Delivery & Logistics', 'Installation', 'Commissioning', 'After-sales Support'],
    categories: ['All Equipment', 'Patient Monitoring', 'Diagnostic Equipment', 'ICU Equipment', 'Surgical Equipment', 'Hospital Furniture', 'Lab Equipment'],
  },
  engineering: {
    eyebrow: 'Certified biomedical engineers', title: 'Engineering, Service', accent: '& Maintenance',
    description: 'Professional installation, calibration, repair, preventive care and lifecycle support for medical equipment across all 7 provinces.',
    image: '/assets/generated/hero-engineering.png',
    services: ENGINEERING_SERVICES.map(item => item.title),
    categories: ['All Equipment', 'Patient Monitoring', 'Diagnostic Equipment', 'ICU Equipment', 'Respiratory Care', 'Surgical Equipment', 'Lab Equipment'],
  },
  'home-care': {
    eyebrow: 'Care and support at home', title: 'Home Equipment', accent: 'Support Service',
    description: 'Delivery, setup, usage guidance and after-sales assistance for home-care medical equipment.',
    image: '/assets/generated/hero-homecare.png',
    services: ['Home Delivery', 'Product Setup', 'Usage Guidance', 'Rental Support', 'Preventive Care', 'Spare Parts', 'Exchange Support', 'Helpline'],
    categories: ['All Equipment', 'Respiratory Care', 'Diagnostic Equipment', 'Mobility Aids', 'Home Care'],
  },
} as const

const BRANDS = ['All Brands', 'Mindray', 'Philips', 'Dräger', 'GE Healthcare', 'Siemens Healthineers', 'Omron', 'Yuwell', 'Contec', 'Mediko']

export default function ServicePage({ navigate, cartCount, setCartCount, serviceType }: ServicePageProps) {
  const config = SERVICE_CONFIG[serviceType]
  const [service, setService] = useState(config.services[0] as string)
  const [category, setCategory] = useState('All Equipment')
  const [brand, setBrand] = useState('All Brands')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const openRequestForm = () => {
    setShowRequestForm(true)
    window.setTimeout(() => document.getElementById('service-request-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const products = useMemo(() => PRODUCTS.filter(product => {
    const scope = serviceType === 'home-care' ? product.forHomeCare : product.forHospital
    return scope && (category === 'All Equipment' || product.category === category) && (brand === 'All Brands' || product.brand === brand)
  }).slice(0, 8), [brand, category, serviceType])

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage={serviceType === 'supply' ? 'supply-service' : serviceType === 'engineering' ? 'engineering-service' : 'home-care'} />

      <section className="px-3 pt-4 md:px-6">
        <div className="relative mx-auto min-h-[350px] max-w-[1480px] overflow-hidden rounded-[22px] bg-[#eef4fb]">
          <div className="absolute inset-y-0 right-0 hidden w-[62%] md:block">
            <img src={config.image} alt="" className="h-full w-full object-cover object-[73%_center]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eef4fb] via-[#eef4fb]/20 to-transparent" />
          </div>
          <div className="relative z-10 flex min-h-[350px] max-w-[720px] flex-col justify-center px-7 py-10 md:px-12">
            <span className="w-fit rounded-full bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[.16em] text-orange shadow-sm">
              {config.eyebrow}
            </span>
            <h1 className="my-3 text-3xl font-bold leading-tight text-navy md:text-[42px]">
              {config.title}<br /><span className="text-orange">{config.accent}</span>
            </h1>
            <p className="m-0 max-w-xl text-xs leading-5 text-slate-600 md:text-sm">{config.description}</p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={openRequestForm}
                className="rounded-xl border-0 bg-orange px-5 py-3 text-xs font-bold text-white cursor-pointer hover:bg-orange-hover transition flex items-center gap-2 shadow-sm"
              >
                <span>Book Engineering Visit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('contact')}
                className="rounded-xl border border-navy bg-white px-5 py-3 text-xs font-bold text-navy cursor-pointer hover:bg-slate-50 transition"
              >
                Talk to an Expert
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 py-7 md:px-6">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-orange">Choose a service</span>
            <h2 className="m-0 mt-1 text-xl font-bold text-navy">Services by requirement</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {config.services.map((item, index) => (
              <button
                key={item}
                onClick={() => setService(item)}
                className={`min-h-[108px] rounded-xl border p-3 text-left transition cursor-pointer ${
                  service === item ? 'border-orange bg-orange-soft shadow-card' : 'border-border bg-white hover:border-navy/30'
                }`}
              >
                <span
                  className={`mb-3 grid h-9 w-9 place-items-center rounded-lg text-[10px] font-black ${
                    service === item ? 'bg-orange text-white' : 'bg-bg-light text-navy'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong className="block text-[10px] leading-4 text-navy">{item}</strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fc] px-3 py-8 md:px-6">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-orange">Service compatibility</span>
              <h2 className="m-0 mt-1 text-xl font-bold text-navy">Find service by equipment and brand</h2>
              <p className="m-0 mt-1 text-[10px] text-slate-500">Selected service: <b className="text-navy">{service}</b></p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={category}
                onChange={event => setCategory(event.target.value)}
                className="h-10 rounded-lg border border-border bg-white px-3 text-[10px] font-bold text-navy outline-none cursor-pointer"
              >
                {config.categories.map(item => <option key={item}>{item}</option>)}
              </select>
              <select
                value={brand}
                onChange={event => setBrand(event.target.value)}
                className="h-10 rounded-lg border border-border bg-white px-3 text-[10px] font-bold text-navy outline-none cursor-pointer"
              >
                {BRANDS.map(item => <option key={item}>{item}</option>)}
              </select>
              <button
                onClick={openRequestForm}
                className="h-10 rounded-xl border-0 bg-navy hover:bg-navy-deep px-5 text-xs font-bold text-white cursor-pointer transition shadow-xs flex items-center gap-2"
              >
                <Wrench className="w-3.5 h-3.5 text-orange" />
                <span>Book this service</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3">
            {config.categories.map(item => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-[9px] font-bold cursor-pointer transition ${
                  category === item ? 'border-orange bg-orange text-white' : 'border-border bg-white text-slate-500 hover:border-slate-400'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {products.length ? (
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => {
                    localStorage.setItem('mediko_selected_product', JSON.stringify(product))
                    navigate('product')
                  }}
                  onAddToCart={() => setCartCount?.(cartCount + 1)}
                  onQuoteClick={() => navigate('request-quote')}
                />
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-border bg-white p-10 text-center">
              <h3 className="m-0 text-sm text-navy">No matching equipment listed</h3>
              <p className="mt-1 text-[10px] text-slate-400">Send your brand and model details for a custom service assessment.</p>
              <button
                onClick={openRequestForm}
                className="mt-3 rounded-xl border-0 bg-orange px-5 py-2.5 text-xs font-bold text-white cursor-pointer hover:bg-orange-hover transition shadow-sm"
              >
                Request BMET Assessment
              </button>
            </div>
          )}
        </div>
      </section>

      {serviceType === 'engineering' && (
        <section className="px-3 py-8 md:px-6">
          <div className="mx-auto max-w-[1480px]">
            <div className="mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-orange">Service plans</span>
              <h2 className="m-0 mt-1 text-xl font-bold text-navy">Support for every equipment lifecycle</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['On-demand Service', 'Single visit', 'Diagnosis, repair estimate and service report'],
                ['Preventive Maintenance', 'Scheduled care', 'Routine inspection, cleaning and performance checks'],
                ['Annual Maintenance Contract', 'Complete coverage', 'Priority response, scheduled visits and service history'],
              ].map(([title, label, text], index) => (
                <article key={title} className={`rounded-xl border p-5 ${index === 2 ? 'border-navy bg-navy text-white' : 'border-border bg-white'}`}>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${index === 2 ? 'text-orange' : 'text-slate-400'}`}>{label}</span>
                  <h3 className={`my-2 text-sm font-bold ${index === 2 ? 'text-white' : 'text-navy'}`}>{title}</h3>
                  <p className={`m-0 text-[10px] leading-5 ${index === 2 ? 'text-white/55' : 'text-slate-500'}`}>{text}</p>
                  <button
                    onClick={openRequestForm}
                    className={`mt-4 rounded-lg border px-4 py-2 text-[9px] font-bold cursor-pointer transition flex items-center gap-1.5 ${
                      index === 2 ? 'border-orange bg-orange text-white hover:bg-orange-hover' : 'border-border bg-white text-navy hover:bg-slate-50'
                    }`}
                  >
                    <span>Get service quote</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {serviceType === 'supply' && (
        <section className="px-3 py-8 md:px-6">
          <div className="mx-auto max-w-[1480px]">
            <div className="mb-5">
              <span className="text-[9px] font-black uppercase tracking-widest text-orange">How procurement works</span>
              <h2 className="m-0 mt-1 text-xl font-bold text-navy">From requirement to commissioning</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {SUPPLY_PROCESS.map(step => (
                <div key={step.step} className="rounded-xl border border-border bg-white p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-[9px] font-black text-white">{String(step.step).padStart(2, '0')}</span>
                  <h3 className="mb-1 mt-3 text-[10px] font-bold text-navy">{step.title}</h3>
                  <p className="m-0 text-[9px] leading-4 text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-3 pb-8 md:px-6">
        <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-4 rounded-2xl bg-navy-deep p-7 text-white md:flex-row">
          <div>
            <h2 className="m-0 text-xl font-bold text-white">Have an equipment list or service requirement?</h2>
            <p className="m-0 mt-1 text-xs text-white/55">Share the category, brand, model and quantity. Our team will prepare the right response.</p>
          </div>
          <button
            onClick={openRequestForm}
            className="rounded-xl border-0 bg-orange hover:bg-orange-hover px-6 py-3 text-xs font-bold text-white cursor-pointer transition shadow-sm flex items-center gap-2"
          >
            <span>Book Engineering Visit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {showRequestForm && (
        <section id="service-request-form" className="scroll-mt-24 bg-[#f4f7fa] px-3 py-9 md:px-6">
          <div className="mx-auto max-w-[1100px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            {requestSent ? (
              <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><h2 className="mt-4 text-2xl font-semibold text-navy">Request received</h2><p className="mt-2 text-sm text-slate-500">Our service team will contact you with the next available visit time.</p><button onClick={() => { setRequestSent(false); setShowRequestForm(false) }} className="mt-6 border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">Back to services</button></div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setRequestSent(true) }}>
                <div className="mb-6 border-b border-slate-200 pb-5"><span className="text-sm font-medium text-orange">Service request</span><h2 className="mt-1 text-2xl font-semibold text-navy">Book an engineering visit</h2><p className="mt-2 text-sm text-slate-500">Tell us about the equipment and the support you need. This request is completed on the page, without a popup.</p></div>
                <div className="grid gap-4 md:grid-cols-2"><label className="portal-label">Contact name<input required className="portal-input mt-1 w-full" placeholder="Full name" /></label><label className="portal-label">Phone number<input required className="portal-input mt-1 w-full" placeholder="+977" /></label><label className="portal-label">Hospital or organisation<input required className="portal-input mt-1 w-full" placeholder="Organisation name" /></label><label className="portal-label">Service needed<select defaultValue={service} className="portal-input mt-1 w-full">{config.services.map((item) => <option key={item}>{item}</option>)}</select></label><label className="portal-label">Equipment brand and model<input required className="portal-input mt-1 w-full" placeholder="For example: Patient monitor MEC-1200" /></label><label className="portal-label">Preferred visit date<input type="date" className="portal-input mt-1 w-full" /></label><label className="portal-label md:col-span-2">Problem or request<textarea required className="portal-input mt-1 min-h-28 w-full" placeholder="Describe the issue, location and any urgent requirements." /></label></div>
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5"><button type="button" onClick={() => setShowRequestForm(false)} className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">Cancel</button><button type="submit" className="inline-flex items-center gap-2 border border-orange bg-orange px-5 py-2.5 text-sm font-medium text-white shadow-sm"><Wrench className="h-4 w-4" /> Send service request</button></div>
              </form>
            )}
          </div>
        </section>
      )}

      <Footer navigate={navigate} />
    </div>
  )
}
