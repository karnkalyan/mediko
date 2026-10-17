import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import type { NavProps } from '../types'

export default function RequestQuotePage({ navigate, cartCount }: NavProps) {
  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="request-quote" />
      <section className="bg-gradient-to-br from-navy to-navy-deep py-14 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">Request a Quotation</h1>
          <p className="text-white/60 text-base">Tell us what you need and we'll provide a competitive quotation within 24 hours</p>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-white border border-border rounded-xl p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Organization Name *</label>
                <input className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors" placeholder="Hospital / Clinic / Institution name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Contact Person *</label>
                <input className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Email *</label>
                <input type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Phone *</label>
                <input className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors" placeholder="+977 98XXXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Enquiry Type *</label>
                <select className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors bg-white cursor-pointer">
                  <option>Product Quotation</option>
                  <option>Rental Enquiry</option>
                  <option>Engineering Service Request</option>
                  <option>B2B / Institutional Supply</option>
                  <option>Used Equipment Enquiry</option>
                  <option>Spare Parts Enquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Location</label>
                <input className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors" placeholder="City, District" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-dark mb-1.5">Product / Equipment Details *</label>
              <textarea className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors resize-none" rows={3} placeholder="List the products/equipment you need with specifications (brand, model, quantity)" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-dark mb-1.5">Additional Requirements</label>
              <textarea className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-orange transition-colors resize-none" rows={3} placeholder="Installation, training, AMC, or any other requirements" />
            </div>
            <button className="bg-orange hover:bg-orange-hover text-white border-none px-8 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
              Submit Enquiry →
            </button>
            <p className="text-xs text-text-light mt-3">We typically respond within 24 business hours.</p>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  )
}
