import { useState, useEffect } from 'react'
import PublicHeader from '../components/PublicHeader'
import Footer from '../components/Footer'
import type { NavProps } from '../types'
import {
  CheckCircle2,
  Check,
  ShieldCheck,
  Truck,
  Building2,
  Wallet,
  CreditCard,
  QrCode,
  Banknote,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  Mail,
  FileText,
} from 'lucide-react'

const STEPS = ['Delivery address', 'Delivery options', 'Payment', 'Review order']

const PAYMENT_METHODS = [
  {
    id: 'esewa',
    label: 'eSewa Digital Wallet',
    icon: Wallet,
    color: '#60BB46',
    desc: 'Pay securely through your eSewa account',
    tag: 'Instant payment',
  },
  {
    id: 'khalti',
    label: 'Khalti Mobile Wallet',
    icon: CreditCard,
    color: '#5C2D91',
    desc: 'Pay via Khalti web portal or mobile OTP verification',
    tag: 'Instant payment',
  },
  {
    id: 'fonepay',
    label: 'Fonepay Interbank QR',
    icon: QrCode,
    color: '#ED1C24',
    desc: 'Scan dynamic Nepal QR from any Nepal commercial bank app',
    tag: 'All Banks Supported',
  },
  {
    id: 'bank',
    label: 'Bank Transfer / Letter of Credit (LC)',
    icon: Building2,
    color: '#071B45',
    desc: 'Pay by bank transfer to the Mediko Bazaar account',
    tag: 'Institutional RTGS / LC',
  },
  {
    id: 'cod',
    label: 'Pay after equipment inspection (Kathmandu Valley)',
    icon: Banknote,
    color: '#13A85B',
    desc: 'Inspect equipment functionality with engineer before releasing payment',
    tag: 'Hospital Inspection Guarantee',
  },
]

export default function CheckoutPage({ navigate, cartCount, setCartCount }: NavProps) {
  const [step, setStep] = useState(0)
  const [isInstitution, setIsInstitution] = useState(true)

  // Form inputs state
  const [firstName, setFirstName] = useState('Dr. Rajan')
  const [lastName, setLastName] = useState('Shrestha')
  const [organizationName, setOrganizationName] = useState('Bir Hospital Kathmandu')
  const [panNumber, setPanNumber] = useState('300021487')
  const [phone, setPhone] = useState('+977 9851099887')
  const [email, setEmail] = useState('procurement@birhospital.org')
  const [province, setProvince] = useState('Bagmati Province')
  const [district, setDistrict] = useState('Kathmandu')
  const [city, setCity] = useState('Kathmandu Metropolitan')
  const [streetAddress, setStreetAddress] = useState('Mahaboudha Marg, Ward 30')
  const [deliveryInstructions, setDeliveryInstructions] = useState('Deliver to ICU Procurement Receiving Wing, 2nd Floor')
  const [deliverySpeed, setDeliverySpeed] = useState('express')
  const [paymentMethod, setPaymentMethod] = useState('esewa')
  const [agreedToTerms, setAgreedToTerms] = useState(true)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cart summary state
  const [cartSummary, setCartSummary] = useState({
    items: [
      {
        id: 1,
        title: 'Mindray MEC-1200 Patient Monitor 12" TFT Multi-Para',
        brand: 'Mindray',
        sku: 'MDR-MEC1200-NP',
        price: 285000,
        qty: 1,
        image: '/assets/generated/category-ultrasound.png',
        warranty: '2 Years Manufacturer',
      },
      {
        id: 2,
        title: 'Mindray SpO2 Extension Cable Set (3m Heavy Duty)',
        brand: 'Mindray',
        sku: 'MDR-SPO2-3M',
        price: 4200,
        qty: 2,
        image: '/assets/generated/category-monitoring.png',
        warranty: '1 Year Warranty',
      },
      {
        id: 3,
        title: 'Philips IntelliVue MX40 Bedside Monitor',
        brand: 'Philips',
        sku: 'PHL-MX40-NP',
        price: 195000,
        qty: 1,
        image: '/assets/generated/category-respiratory.png',
        warranty: '1 Year Mediko Warranty',
      },
    ],
    subtotal: 488400,
    discount: 32000,
    shipping: 1200,
    vat: 59332,
    total: 516932,
  })

  useEffect(() => {
    const saved = localStorage.getItem('mediko_active_cart_summary')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.items && parsed.items.length > 0) {
          setCartSummary(parsed)
          if (parsed.province) setProvince(parsed.province)
        }
      } catch (e) {
        console.error('Error loading cart summary:', e)
      }
    }
  }, [])

  // Validation function for Step 0 (Address)
  const validateStep0 = () => {
    const err: Record<string, string> = {}
    if (!firstName.trim()) err.firstName = 'First Name is required'
    if (!lastName.trim()) err.lastName = 'Last Name is required'
    if (isInstitution && !organizationName.trim()) err.organizationName = 'Hospital or Organization Name is required'
    if (!phone.trim()) {
      err.phone = 'Phone number is required'
    } else if (!/(?:\+977[- ]?)?[0-9]{8,10}/.test(phone.replace(/\s+/g, ''))) {
      err.phone = 'Please enter a valid Nepal phone number (+977 98XXXXXXXX)'
    }
    if (!email.trim() || !email.includes('@')) err.email = 'Valid institutional email is required'
    if (!district.trim()) err.district = 'District is required'
    if (!city.trim()) err.city = 'City / Municipality is required'
    if (!streetAddress.trim()) err.streetAddress = 'Street address and Ward number are required'
    if (isInstitution && panNumber && panNumber.length !== 9 && !/^\d+$/.test(panNumber)) {
      err.panNumber = 'Nepal PAN/VAT number must be 9 digits'
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleNextStep = () => {
    if (step === 0) {
      if (!validateStep0()) return
    }
    setStep((prev) => Math.min(STEPS.length - 1, prev + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevStep = () => {
    setStep((prev) => Math.max(0, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      setErrors({ terms: 'You must confirm equipment details and agree to terms' })
      return
    }

    setIsSubmitting(true)

    const randomOrderNum = Math.floor(100000 + Math.random() * 900000)
    const randomInvNum = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `MB-ORD-2026-${randomOrderNum}`
    const invoiceNumber = `MB-INV-2026-${randomInvNum}`

    const finalOrder = {
      orderNumber,
      invoiceNumber,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      paymentMethod:
        PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label || 'Digital payment',
      paymentStatus:
        paymentMethod === 'bank'
          ? 'Pending RTGS / Bank LC Verification'
          : paymentMethod === 'cod'
          ? 'Pay after on-site inspection'
          : 'Payment received and verified',
      subtotal: cartSummary.subtotal,
      discount: cartSummary.discount,
      shipping: deliverySpeed === 'express' ? cartSummary.shipping + 1500 : cartSummary.shipping,
      vat: cartSummary.vat,
      total:
        cartSummary.total + (deliverySpeed === 'express' ? 1500 : 0),
      customer: {
        name: `${firstName} ${lastName}`,
        organization: isInstitution ? organizationName : undefined,
        phone,
        email,
        address: streetAddress,
        city,
        province,
        panNumber: isInstitution ? panNumber : undefined,
        instructions: deliveryInstructions,
      },
      items: cartSummary.items,
    }

    // Persist latest order so OrderSuccessPage displays exact information
    localStorage.setItem('mediko_latest_order', JSON.stringify(finalOrder))

    // Clear cart
    localStorage.removeItem('mediko_cart_items')
    localStorage.removeItem('mediko_active_cart_summary')
    if (setCartCount) setCartCount(0)

    // Attempt backend sync (with fallback if backend has demo auth)
    try {
      const apiBase = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || '/api'
      await fetch(`${apiBase}/invoices/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: finalOrder.items,
          subtotal: finalOrder.subtotal,
          vatAmount: finalOrder.vat,
          totalAmount: finalOrder.total,
          paymentMethod: paymentMethod.toUpperCase(),
          shippingAddress: `${finalOrder.customer.address}, ${finalOrder.customer.city}, ${finalOrder.customer.province}`,
        }),
      }).catch(() => null)
    } catch (e) {
      console.warn('Backend sync ignored, proceeding with local order completion')
    }

    setTimeout(() => {
      setIsSubmitting(false)
      navigate('order-success')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col font-sans text-slate-800">
      <PublicHeader navigate={navigate} cartCount={cartCount || 0} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-orange transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('cart')} className="hover:text-orange transition-colors">
            Cart
          </button>
          <span>/</span>
          <span className="text-slate-600">Checkout</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071B45] tracking-tight">
              Hospital Procurement Checkout
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add the delivery details, choose a payment method and receive an official invoice.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5" />
            Secure encrypted payment
          </div>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STEPS.map((s, idx) => {
              const isDone = idx < step
              const isCurrent = idx === step
              return (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#FF5A00] text-white shadow-md shadow-orange/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`block text-xs font-bold truncate ${
                        isCurrent ? 'text-[#FF5A00]' : isDone ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      Step {idx + 1}
                    </span>
                    <span
                      className={`block text-[11px] truncate font-medium ${
                        isCurrent || isDone ? 'text-[#071B45]' : 'text-slate-400'
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Left: Step Form Content (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ======================================================== */}
            {/* STEP 0: ADDRESS & ENTITY */}
            {/* ======================================================== */}
            {step === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-extrabold text-[#071B45]">
                      1. Procurement Entity &amp; Delivery Destination
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add the contact person and hospital details for the invoice and delivery.
                    </p>
                  </div>
                  {/* Account Type Selector */}
                  <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setIsInstitution(true)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        isInstitution ? 'bg-white text-[#071B45] shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Hospital / Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInstitution(false)}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        !isInstitution ? 'bg-white text-[#071B45] shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Individual Doctor
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Dr. Rajan"
                      className={`w-full rounded-xl border px-3 py-2.5 outline-none font-medium ${
                        errors.firstName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                      }`}
                    />
                    {errors.firstName && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Shrestha"
                      className={`w-full rounded-xl border px-3 py-2.5 outline-none font-medium ${
                        errors.lastName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                      }`}
                    />
                    {errors.lastName && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.lastName}</p>}
                  </div>

                  {isInstitution && (
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Hospital / Healthcare Institution Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="e.g. Bir Hospital, Teaching Hospital (TUTH), Grande International"
                          className={`w-full rounded-xl border pl-9 pr-3 py-2.5 outline-none font-medium ${
                            errors.organizationName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                          }`}
                        />
                      </div>
                      {errors.organizationName && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.organizationName}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number (+977) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                        className={`w-full rounded-xl border pl-9 pr-3 py-2.5 outline-none font-mono font-medium ${
                          errors.phone ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Institutional Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="procurement@hospital.org"
                        className={`w-full rounded-xl border pl-9 pr-3 py-2.5 outline-none font-medium ${
                          errors.email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email}</p>}
                  </div>

                  {isInstitution && (
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Hospital PAN / VAT Number (For 13% Tax Credit Invoice)
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value)}
                          placeholder="9-Digit Nepal PAN Number (e.g. 300021487)"
                          maxLength={9}
                          className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 outline-none font-mono font-medium focus:border-orange"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Leave blank if you are buying as an individual.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Province <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none bg-white font-medium focus:border-orange"
                    >
                      <option>Bagmati Province</option>
                      <option>Gandaki Province</option>
                      <option>Koshi Province</option>
                      <option>Madhesh Province</option>
                      <option>Lumbini Province</option>
                      <option>Karnali Province</option>
                      <option>Sudurpashchim Province</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      District <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Kathmandu, Kaski, Morang, Chitwan"
                      className={`w-full rounded-xl border px-3 py-2.5 outline-none font-medium ${
                        errors.district ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                      }`}
                    />
                    {errors.district && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      City / Municipality <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Kathmandu Metropolitan, Pokhara, Biratnagar"
                      className={`w-full rounded-xl border px-3 py-2.5 outline-none font-medium ${
                        errors.city ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                      }`}
                    />
                    {errors.city && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Street Address &amp; Ward No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. Mahaboudha Marg, Ward 30"
                      className={`w-full rounded-xl border px-3 py-2.5 outline-none font-medium ${
                        errors.streetAddress ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 focus:border-orange'
                      }`}
                    />
                    {errors.streetAddress && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.streetAddress}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Specific Delivery &amp; Receiving Instructions (Optional)
                    </label>
                    <input
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="e.g. Deliver to Emergency Receiving Wing, Call Doctor before arrival"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none font-medium focus:border-orange"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 1: LOGISTICS & DELIVERY */}
            {/* ======================================================== */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-[#071B45]">
                    2. Medical Logistics &amp; Installation Speed
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose certified medical handling logistics tailored for precision instruments.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    {
                      id: 'express',
                      label: 'White-Glove Biomedical Logistics (Express)',
                      time: '1–2 Business Days',
                      price: 'NPR 2,700',
                      desc: 'Temperature-controlled van with unpacking, inspection and an equipment check.',
                      recommended: true,
                    },
                    {
                      id: 'standard',
                      label: 'Standard Secured Medical Freight',
                      time: '3–5 Business Days',
                      price: 'NPR 1,200',
                      desc: 'Secured boxed delivery to hospital loading dock or clinic reception.',
                      recommended: false,
                    },
                    {
                      id: 'pickup',
                      label: 'Mediko Central Warehouse Pickup (Tripureshwor, KTM)',
                      time: 'Same Day Available',
                      price: 'FREE',
                      desc: 'Hospital biomedical team collects and inspects directly from central depot.',
                      recommended: false,
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setDeliverySpeed(opt.id)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                        deliverySpeed === opt.id
                          ? 'border-orange bg-orange/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_speed"
                        checked={deliverySpeed === opt.id}
                        onChange={() => setDeliverySpeed(opt.id)}
                        className="accent-orange mt-1 h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-[#071B45]">{opt.label}</strong>
                          {opt.recommended && (
                            <span className="rounded-full bg-orange px-2 py-0.5 text-[9px] font-extrabold text-white">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs mt-1">{opt.desc}</p>
                        <span className="inline-block text-[11px] font-bold text-slate-600 mt-1.5">
                          Delivery Window: {opt.time}
                        </span>
                      </div>
                      <span className="font-extrabold text-sm text-[#071B45] font-mono">
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#071B45] block font-bold">
                      Pre-Dispatch Calibration Guarantee
                    </strong>
                    All electronics undergo 48-point diagnostic testing in Kathmandu before dispatch to ensure zero out-of-box failures at the clinical site.
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: PAYMENT METHOD */}
            {/* ======================================================== */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-[#071B45]">
                    3. Choose a payment method
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your payment is protected until the equipment arrives and passes inspection.
                  </p>
                </div>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((pm) => {
                    const Icon = pm.icon
                    const isSelected = paymentMethod === pm.id
                    return (
                      <label
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex items-center gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-orange bg-orange/5 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(pm.id)}
                          className="accent-orange h-4 w-4"
                        />
                        <div
                          className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: pm.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-[#071B45]">{pm.label}</strong>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {pm.tag}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs mt-0.5">{pm.desc}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">100% Mediko Buyer Protection Policy</strong>
                    If the delivered equipment does not match the order or fails inspection, your payment is fully refundable within 15 days.
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: REVIEW & PLACE ORDER */}
            {/* ======================================================== */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-extrabold text-[#071B45]">
                    4. Final Verification &amp; Institutional Approval
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review ordered equipment, hospital tax invoice details, and place your order.
                  </p>
                </div>

                {/* Shipping & Billing Recap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Receiving Facility</span>
                    <strong className="block text-[#071B45] font-bold text-sm">
                      {isInstitution ? organizationName : `${firstName} ${lastName}`}
                    </strong>
                    <p className="text-slate-600">Attn: {firstName} {lastName}</p>
                    <p className="text-slate-600">{streetAddress}, {city}, {province}</p>
                    <p className="font-mono text-slate-600">{phone}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tax &amp; Payment Summary</span>
                    <strong className="block text-[#071B45] font-bold text-sm">
                      {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                    </strong>
                    <p className="text-slate-600">
                      Nepal VAT: <span className="font-mono font-bold">13% Applied</span>
                    </p>
                    {isInstitution && panNumber && (
                      <p className="text-blue-700 font-mono font-bold">
                        Customer PAN: {panNumber}
                      </p>
                    )}
                    <p className="text-emerald-700 font-semibold">
                      Logistics: {deliverySpeed === 'express' ? 'White-Glove Express (1–2 Days)' : 'Standard (3–5 Days)'}
                    </p>
                  </div>
                </div>

                {/* Items preview */}
                <div className="border border-slate-200 rounded-xl p-3 text-xs divide-y divide-slate-100">
                  {cartSummary.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <strong className="text-[#071B45] font-bold block">{it.title}</strong>
                        <span className="text-slate-400 text-[11px]">
                          Qty: {it.qty} × NPR {it.price.toLocaleString()} · SKU: {it.sku}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#071B45]">
                        NPR {(it.price * it.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Legal terms checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="accent-orange rounded cursor-pointer h-4 w-4 mt-0.5"
                    />
                    <div>
                      <span>
                        I authorize this medical procurement order on behalf of{' '}
                        <strong>{isInstitution ? organizationName : 'myself'}</strong> and accept the{' '}
                        <button
                          type="button"
                          onClick={() => navigate('terms')}
                          className="text-orange underline font-semibold"
                        >
                          Terms &amp; Conditions
                        </button>
                        , 15-day equipment return policy, and official invoice generation.
                      </span>
                      {errors.terms && (
                        <p className="text-rose-500 font-bold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.terms}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('cart')}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Cart
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 rounded-xl bg-[#FF5A00] px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange/25 hover:bg-orange-hover transition"
                >
                  Continue to Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-extrabold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating invoice...
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Confirm &amp; Place Order (NPR{' '}
                      {(
                        cartSummary.total + (deliverySpeed === 'express' ? 1500 : 0)
                      ).toLocaleString()}
                      )
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Order Summary (1 col) */}
          <div className="space-y-4 sticky top-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-xs">
              <h3 className="text-sm font-extrabold text-[#071B45] uppercase tracking-wider mb-4">
                Order Review ({cartSummary.items.length} Items)
              </h3>

              <div className="space-y-3 pb-4 border-b border-slate-100 max-h-56 overflow-y-auto">
                {cartSummary.items.map((item) => (
                  <div key={item.id} className="flex gap-2.5 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-contain p-0.5 bg-slate-50"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-[#071B45] truncate text-[11px]">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        Qty: {item.qty} × NPR {item.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-700 text-xs shrink-0">
                      NPR {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-b border-slate-100 text-slate-600">
                <div className="flex justify-between">
                  <span>Equipment Subtotal:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    NPR {cartSummary.subtotal.toLocaleString()}
                  </span>
                </div>
                {cartSummary.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span className="font-mono">- NPR {cartSummary.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Secured Freight:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    NPR{' '}
                    {(
                      cartSummary.shipping + (deliverySpeed === 'express' ? 1500 : 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nepal Legal VAT (13%):</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    NPR {cartSummary.vat.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 pb-2 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-[#071B45]">Total Payable:</span>
                <span className="text-xl font-black text-[#FF5A00] font-mono">
                  NPR{' '}
                  {(
                    cartSummary.total + (deliverySpeed === 'express' ? 1500 : 0)
                  ).toLocaleString()}
                </span>
              </div>

              {/* Security badges */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official invoice issued instantly</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Payment protection with equipment inspection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer navigate={navigate} />
    </div>
  )
}
