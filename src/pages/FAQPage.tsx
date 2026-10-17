import { useState } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import type { NavProps } from '../types'

export default function FAQPage({ navigate, cartCount }: NavProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    { q: 'How do I place an order on Mediko Bazaar?', a: 'Browse our product catalog, add items to cart, and proceed to checkout. For high-value equipment, you can request a quotation through our enquiry form. Our team will contact you to finalize the order.' },
    { q: 'Do you provide installation and setup services?', a: 'Yes! We offer professional installation services by certified biomedical engineers. Installation can be added as an add-on service during checkout or requested separately through our engineering service page.' },
    { q: 'What is the rental process for medical equipment?', a: 'Browse our rental catalog, select your equipment, choose your rental duration (daily/weekly/monthly), and submit your rental request. A refundable security deposit is required. Delivery, setup, and pickup are included.' },
    { q: 'How do I verify the quality of used equipment?', a: 'All used equipment on Mediko Bazaar goes through a multi-step verification process: seller verification, document review, technical inspection by certified engineers, condition grading (A/B/C/D), and a detailed inspection report.' },
    { q: 'Do you offer Annual Maintenance Contracts (AMC)?', a: 'Yes, we offer comprehensive AMC packages covering preventive maintenance, calibration, repairs, and emergency support. AMC contracts are customized based on your equipment and requirements.' },
    { q: 'What payment methods do you accept?', a: 'We accept bank transfers, eSewa, Khalti, direct deposits, and cheque payments. For institutional orders, we also support purchase orders with credit terms.' },
    { q: 'Do you deliver across Nepal?', a: 'Yes, we provide nationwide delivery across all 77 districts of Nepal. Delivery timelines vary by location — typically 1-3 days for Kathmandu Valley and 3-7 days for other areas.' },
    { q: 'What is your return and warranty policy?', a: 'All new products come with manufacturer warranty. Returns are accepted within 7 days for unused products in original packaging. Defective products are replaced or repaired under warranty terms.' },
    { q: 'How can I get spare parts for my equipment?', a: 'Browse our spare parts section or contact us with your equipment model and the part you need. We stock OEM and compatible spare parts for all major medical equipment brands.' },
    { q: 'How do I get training on medical equipment?', a: 'We offer scheduled training courses for various medical equipment categories. Browse our training page for upcoming courses and enroll online. We also provide on-site training for institutional clients.' },
  ]

  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="faq" />
      <section className="bg-gradient-to-br from-navy to-navy-deep py-14 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-white/60 text-base">Find answers to common questions about Mediko Bazaar</p>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[800px] mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between bg-white hover:bg-bg-light transition-colors cursor-pointer border-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className="text-sm font-semibold text-navy pr-4">{faq.q}</span>
                <svg className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openIdx === i && (
                <div className="px-5 pb-4 text-sm text-text-body leading-relaxed border-t border-border/50 pt-3 bg-bg-light/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-10 px-4 lg:px-8 bg-bg-section">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-heading text-xl font-bold text-navy mb-3">Still Have Questions?</h2>
          <p className="text-sm text-text-muted mb-5">Our support team is always ready to help you.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('contact')} className="bg-orange hover:bg-orange-hover text-white border-none px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
              Contact Support →
            </button>
            <button onClick={() => navigate('request-quote')} className="bg-white text-navy border border-border-strong px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer hover:border-navy transition-colors">
              Send Enquiry
            </button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  )
}
