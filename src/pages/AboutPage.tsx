import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import { BRAND, WHY_CHOOSE_US } from '../lib/constants'
import { TESTIMONIALS } from '../data/content'
import type { NavProps } from '../types'

export default function AboutPage({ navigate, cartCount }: NavProps) {
  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} currentPage="about" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-deep py-16 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <img src={BRAND.logo} alt="Mediko Bazaar" className="h-16 w-auto mx-auto mb-6 brightness-0 invert" />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-3">About Mediko Bazaar</h1>
          <p className="text-white/60 text-base max-w-[700px] mx-auto">Nepal's trusted medical equipment marketplace — connecting healthcare providers with quality equipment, expert engineering services, and comprehensive support.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy mb-4">Our Mission</h2>
            <p className="text-sm text-text-body leading-relaxed mb-4">To make quality medical equipment accessible to every healthcare provider in Nepal — from large hospitals to small clinics and home care users.</p>
            <p className="text-sm text-text-body leading-relaxed">We provide a complete ecosystem for medical equipment needs: sales, rental, spare parts, engineering services, and training — all in one trusted platform.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '5,000+', label: 'Products Listed' },
              { value: '1,200+', label: 'Happy Customers' },
              { value: '500+', label: 'Equipment Installed' },
              { value: '77', label: 'Districts Served' },
            ].map(stat => (
              <div key={stat.label} className="bg-bg-light border border-border rounded-xl p-5 text-center">
                <p className="m-0 text-2xl font-bold text-orange">{stat.value}</p>
                <p className="m-0 text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 lg:px-8 bg-bg-section">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-heading text-2xl font-bold text-navy text-center mb-8">Why Healthcare Professionals Choose Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WHY_CHOOSE_US.map(item => (
              <div key={item.title} className="bg-white border border-border rounded-xl p-5 text-center hover:shadow-lg transition-all">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="text-sm font-bold text-navy mb-1">{item.title}</h4>
                <p className="text-xs text-text-muted m-0">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-heading text-2xl font-bold text-navy text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.slice(0, 3).map(t => (
              <div key={t.id} className="bg-bg-light border border-border rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4" fill={s <= t.rating ? '#F26A1A' : '#E3EAF2'} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-text-body leading-relaxed mb-4 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-soft flex items-center justify-center text-lg">{t.avatar}</div>
                  <div>
                    <p className="m-0 text-sm font-semibold text-navy">{t.name}</p>
                    <p className="m-0 text-xs text-text-muted">{t.title}, {t.organization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  )
}
