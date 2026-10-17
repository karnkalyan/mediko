import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import { BRAND } from '../lib/constants'
import type { NavProps } from '../types'

interface PolicyPageProps extends NavProps {
  type: 'terms' | 'privacy' | 'rental' | 'warranty' | 'return' | 'used-equipment' | 'service'
}

const POLICIES: Record<string, { title: string; content: string[] }> = {
  terms: { title: 'Terms & Conditions', content: [
    'Welcome to Mediko Bazaar. By accessing and using our platform, you agree to be bound by these Terms and Conditions.',
    '1. Eligibility: Users must be at least 18 years old and authorized to procure medical equipment for their organization or personal use.',
    '2. Product Listings: All products listed on Mediko Bazaar are subject to availability. Prices are displayed in Nepalese Rupees (NPR) and may change without prior notice.',
    '3. Order Placement: Orders placed through the platform constitute an offer to purchase. Mediko Bazaar reserves the right to accept or reject any order.',
    '4. Payment: Payment must be made through approved payment methods. All transactions are processed in NPR.',
    '5. Delivery: Delivery timelines are estimates. Mediko Bazaar is not liable for delays caused by force majeure events.',
    '6. Cancellation: Orders may be cancelled before dispatch. Cancellation charges may apply based on order status.',
    '7. Intellectual Property: All content on Mediko Bazaar, including logos, images, and text, is the property of Mediko Bazaar Pvt. Ltd.',
    '8. Limitation of Liability: Mediko Bazaar\'s liability is limited to the purchase price of the product in question.',
    '9. Governing Law: These terms are governed by the laws of Nepal. Disputes shall be resolved in the courts of Kathmandu.',
  ]},
  privacy: { title: 'Privacy Policy', content: [
    'Mediko Bazaar is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.',
    '1. Information Collection: We collect personal information (name, email, phone, address) when you register, place orders, or contact us.',
    '2. Use of Information: Your information is used for order processing, customer service, and improving our services.',
    '3. Data Protection: We implement industry-standard security measures to protect your personal data.',
    '4. Third-Party Sharing: We do not sell your personal information. We may share it with delivery partners and payment processors as needed.',
    '5. Cookies: Our website uses cookies to enhance your browsing experience and analyze site usage.',
    '6. Your Rights: You can request access, correction, or deletion of your personal data by contacting us.',
    '7. Contact: For privacy-related queries, email us at privacy@medikobazaar.com.',
  ]},
  rental: { title: 'Rental Policy', content: [
    'Mediko Bazaar offers flexible medical equipment rental services. Please review our rental terms carefully.',
    '1. Rental Duration: Equipment can be rented on daily, weekly, or monthly basis. Minimum rental period is 1 day.',
    '2. Security Deposit: A refundable security deposit is required before equipment delivery. Deposit amounts vary by equipment.',
    '3. Delivery & Setup: Delivery and basic setup are included in the rental price within Kathmandu Valley. Additional charges apply for other locations.',
    '4. Maintenance: Basic maintenance is included during the rental period. Report any issues immediately to our support team.',
    '5. Return: Equipment must be returned in good working condition. Inspection is done at the time of return.',
    '6. Extension: Rental periods can be extended by contacting us at least 24 hours before the end of the current rental period.',
    '7. Damage: The renter is responsible for any damage beyond normal wear and tear. Repair costs will be deducted from the security deposit.',
    '8. Cancellation: Rentals cancelled more than 24 hours before delivery are fully refundable.',
  ]},
  warranty: { title: 'Warranty Policy', content: [
    'All products sold on Mediko Bazaar come with manufacturer warranty unless otherwise stated.',
    '1. Warranty Coverage: Warranty covers manufacturing defects and component failures under normal use conditions.',
    '2. Warranty Period: Varies by product (typically 1-3 years). Check the product page for specific warranty information.',
    '3. Warranty Claims: To file a warranty claim, contact our support team with your order number and a description of the issue.',
    '4. Exclusions: Warranty does not cover damage caused by misuse, unauthorized modifications, power surges, or natural disasters.',
    '5. Resolution: Warranty claims are resolved through repair, replacement, or refund at Mediko Bazaar\'s discretion.',
  ]},
  return: { title: 'Return & Refund Policy', content: [
    'We want you to be satisfied with your purchase. Please review our return policy.',
    '1. Return Window: Returns are accepted within 7 days of delivery for unused products in original packaging.',
    '2. Non-Returnable: Custom-configured equipment, sterilized products, and opened consumables cannot be returned.',
    '3. Return Process: Contact our support team to initiate a return. We\'ll arrange for pickup within 2-3 business days.',
    '4. Refund: Refunds are processed within 7-10 business days after the returned product is inspected and approved.',
    '5. Shipping Costs: Return shipping costs are borne by the customer unless the return is due to our error.',
  ]},
  'used-equipment': { title: 'Used Equipment Policy', content: [
    'Mediko Bazaar ensures quality and transparency in all used equipment transactions.',
    '1. Verification: All used equipment undergoes a multi-step verification process before listing.',
    '2. Condition Grading: Equipment is graded A (Excellent), B (Good), C (Fair), or D (Refurbished).',
    '3. Inspection: Professional inspection is conducted by certified biomedical engineers.',
    '4. Documentation: All available documentation (service records, calibration certificates) is provided.',
    '5. Warranty: Used equipment comes with a minimum 3-month warranty from Mediko Bazaar.',
    '6. Seller Verification: All sellers of used equipment must be verified and approved by Mediko Bazaar.',
  ]},
  service: { title: 'Service Policy', content: [
    'Mediko Bazaar provides professional engineering and technical services for medical equipment.',
    '1. Service Coverage: We provide services across Nepal through our network of certified engineers.',
    '2. Response Time: Emergency services: within 4 hours (Kathmandu Valley). Standard services: 24-48 hours.',
    '3. Service Warranty: All repair and maintenance work comes with a minimum 30-day service warranty.',
    '4. Pricing: Service charges are transparently communicated before work begins. Quotations are valid for 15 days.',
    '5. AMC: Annual Maintenance Contracts include scheduled visits, priority support, and discounted repairs.',
  ]},
}

export default function PolicyPage({ navigate, cartCount, type }: PolicyPageProps) {
  const policy = POLICIES[type] || POLICIES.terms

  return (
    <div className="bg-white min-h-screen">
      <PublicHeader navigate={navigate} cartCount={cartCount} />
      <section className="bg-gradient-to-br from-navy to-navy-deep py-14 px-4 lg:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">{policy.title}</h1>
          <p className="text-white/60 text-sm">Last updated: July 2026</p>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border border-border rounded-xl p-6 lg:p-8">
            {policy.content.map((para, i) => (
              <p key={i} className={`text-sm leading-relaxed ${i === 0 ? 'text-text-dark font-medium mb-4' : 'text-text-body mb-3'}`}>
                {para}
              </p>
            ))}
            <div className="border-t border-border mt-6 pt-4">
              <p className="text-xs text-text-light m-0">
                For questions about this policy, contact us at {BRAND.email} or call {BRAND.phone}.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer navigate={navigate} />
    </div>
  )
}
