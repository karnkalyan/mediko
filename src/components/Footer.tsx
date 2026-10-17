import { BRAND, FOOTER_LINKS, MEDICAL_BRANDS } from '../lib/constants'
import type { Page } from '../types'

export default function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer>
      {/* Newsletter */}
      <div className="bg-bg-light border-t border-border py-10 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-navy m-0">Stay Updated with Mediko Bazaar</h3>
            <p className="text-sm text-text-muted mt-1 mb-0">Get the latest products, deals and healthcare news directly to your inbox.</p>
          </div>
          <div className="flex flex-shrink-0 w-full md:w-auto">
            <input
              placeholder="Enter your email address"
              className="flex-1 md:w-[300px] px-4 py-2.5 border border-border-strong border-r-0 rounded-l-lg text-sm outline-none font-sans focus:border-orange transition-colors"
              aria-label="Email for newsletter"
            />
            <button className="bg-orange hover:bg-orange-hover text-white border-none px-6 py-2.5 rounded-r-lg text-sm font-semibold cursor-pointer transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Brands Strip */}
      <div className="bg-white border-t border-border py-6 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-[11px] font-semibold text-text-light uppercase tracking-wider mb-4">Trusted & Authorized Brands</p>
          <div className="flex items-center gap-4 lg:gap-8 flex-wrap">
            {MEDICAL_BRANDS.map(brand => (
              <div key={brand} className="px-4 py-2 border border-border rounded-lg text-sm font-semibold text-text-muted bg-white hover:border-orange hover:text-orange transition-colors cursor-pointer">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-navy-deep py-12 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10 mb-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <img src={BRAND.logo} alt="Mediko Bazaar" className="h-12 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm text-white/50 leading-relaxed mb-5 max-w-[280px]">
                Nepal's trusted medical equipment marketplace for sales, rental, spare parts, engineering service and trading.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <svg className="w-4 h-4 text-orange flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {BRAND.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <svg className="w-4 h-4 text-orange flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                  {BRAND.email}
                </div>
                <div className="flex items-start gap-2 text-sm text-white/50">
                  <svg className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2"/></svg>
                  {BRAND.address}
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
                <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                  {links.map(link => (
                    <li key={link.label}>
                      <button
                        onClick={() => navigate(link.page as Page)}
                        className="text-sm text-white/50 hover:text-orange transition-colors cursor-pointer bg-transparent border-none p-0 text-left"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 m-0">
              © 2026 Mediko Bazaar Pvt. Ltd. All rights reserved. | Reg No: {BRAND.regNo} | VAT: {BRAND.vatNo}
            </p>
            <div className="flex gap-4 text-xs text-white/30">
              <button onClick={() => navigate('privacy')} className="hover:text-orange transition-colors cursor-pointer bg-transparent border-none text-white/30 text-xs" style={{ fontFamily: 'Inter' }}>Privacy Policy</button>
              <button onClick={() => navigate('terms')} className="hover:text-orange transition-colors cursor-pointer bg-transparent border-none text-white/30 text-xs" style={{ fontFamily: 'Inter' }}>Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
