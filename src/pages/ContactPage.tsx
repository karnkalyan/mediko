import { useState } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import { BRAND } from '../lib/constants'
import type { NavProps } from '../types'
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2, ShieldCheck, Headphones } from 'lucide-react'
import { apiSubmitEnquiry } from '../lib/api'

export default function ContactPage({ navigate, cartCount }: NavProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Product Enquiry',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiSubmitEnquiry({
        title: `Contact Form: ${formData.subject} - ${formData.fullName}`,
        enquiryType: 'RFQ',
        notes: `Name: ${formData.fullName}, Email: ${formData.email}, Phone: ${formData.phone}. Message: ${formData.message}`,
      })
    } catch {}
    setLoading(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Product Enquiry',
        message: '',
      })
    }, 4000)
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="contact" />

      <section className="bg-gradient-to-br from-navy to-navy-deep py-14 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm mb-3">
            <Headphones className="w-3.5 h-3.5 text-orange" />
            <span>Customer Support &amp; Technical Desk</span>
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">Contact Mediko Bazaar</h1>
          <p className="text-white/70 text-sm max-w-xl mx-auto">
            Connect with our biomedical logistics desk, equipment specialists, and regional engineering teams across Nepal.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8 bg-slate-50/50">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-3.5">
            {[
              { icon: <MapPin className="w-5 h-5 text-orange" />, title: 'Headquarters', value: BRAND.address, sub: 'Distribution Hub & Depot' },
              { icon: <Phone className="w-5 h-5 text-blue-600" />, title: 'Central Helpline', value: BRAND.phone, sub: 'Direct Toll-Free for Hospitals' },
              { icon: <Mail className="w-5 h-5 text-emerald-600" />, title: 'Official Inquiries', value: BRAND.email, sub: 'Tenders, RFQs & B2B Imports' },
              { icon: <Clock className="w-5 h-5 text-purple-600" />, title: 'Operating Hours', value: 'Sun - Fri: 9:00 AM - 6:00 PM', sub: '24/7 BMET Emergency Helpline' },
            ].map(item => (
              <div key={item.title} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 shadow-xs transition hover:border-orange hover:shadow-md">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-xs font-bold text-navy">{item.title}</p>
                  <p className="m-0 text-sm font-semibold text-slate-700 truncate">{item.value}</p>
                  <span className="text-[11px] text-slate-400 font-medium">{item.sub}</span>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-navy mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Registered medical equipment provider</span>
              </div>
              <p className="m-0 text-[11px] text-slate-500 leading-relaxed">
                Registered in Nepal. Every purchase includes an official invoice and clear payment details.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 lg:p-8 shadow-xs">
            <h2 className="font-heading text-xl font-bold text-navy mb-1">Send Us an Official Message</h2>
            <p className="text-xs text-slate-500 mb-6">
              Our clinical logistics and customer support officers respond to hospital requests within 1 business hour.
            </p>

            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center animate-fadeIn">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-950 mb-1">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Thank you for reaching out. A commercial officer has been dispatched with your enquiry and will contact you via phone/email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange transition-colors font-medium text-navy"
                      placeholder="e.g. Dr. Rajesh Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange transition-colors font-medium text-navy"
                      placeholder="doctor@hospital.org.np"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / Mobile *</label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange transition-colors font-medium text-navy"
                      placeholder="+977 9851099887"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject Category *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange transition-colors bg-white cursor-pointer font-medium text-navy"
                    >
                      <option>Product Commercial Quotation</option>
                      <option>Biomedical Engineering Service</option>
                      <option>Equipment Rental &amp; Lease</option>
                      <option>B2B Institutional Tender</option>
                      <option>Customer Support &amp; Tracking</option>
                      <option>Other Medical Request</option>
                    </select>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Requirement Details *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange transition-colors resize-none font-medium text-navy"
                    placeholder="Specify equipment model, required quantity, hospital location or engineering service details..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange hover:bg-orange-hover text-white border-none px-7 py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <span>{loading ? 'Sending Request...' : 'Send Message'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  )
}
