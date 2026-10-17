// ============================================================
// Mediko Bazaar — Centralized Constants
// ============================================================

// Brand Information
export const BRAND = {
  name: 'Mediko Bazaar',
  tagline: 'Equip. Empower. Care.',
  address: 'New Baneshwar-31, Kathmandu, Nepal',
  phone: '+977 985-1117186',
  email: 'info@medikobazaar.com',
  website: 'www.medikobazaar.com',
  regNo: '123456/077/078',
  vatNo: '600123456',
  logo: new URL('../../main-logo.png', import.meta.url).href,
} as const

// Color palette for programmatic usage
export const COLORS = {
  navy: '#0B2D5C',
  navyDeep: '#06244B',
  orange: '#F26A1A',
  orangeHover: '#E05A0A',
  orangeSoft: '#FFF3EA',
  bgLight: '#F4F8FC',
  textDark: '#15233B',
  textMuted: '#64748B',
  border: '#E3EAF2',
  success: '#1FA66A',
  warning: '#F6A723',
  error: '#D64545',
} as const

// Navigation structure
export const MAIN_NAV = [
  { label: 'Home', page: 'home' as const },
  { label: 'Supply Service', page: 'supply-service' as const },
  { label: 'Engineering Service', page: 'engineering-service' as const },
  { label: 'Training & Certificate', page: 'training' as const },
  { label: 'Equipment for Home', page: 'home-care' as const },
  { label: 'Rental Products', page: 'rental-products' as const, badge: 'New' },
  { label: 'Used Products', page: 'used-products' as const },
  { label: 'Spare Parts', page: 'spare-parts' as const },
  { label: 'Contact', page: 'contact' as const },
]

export const SEARCH_CATEGORIES = [
  'All Categories',
  'Products',
  'Rentals',
  'Used Equipment',
  'Spare Parts',
  'Services',
] as const

// Footer link structure
export const FOOTER_LINKS = {
  'Products': [
    { label: 'Patient Monitoring', page: 'shop' },
    { label: 'Diagnostic Equipment', page: 'shop' },
    { label: 'Respiratory Care', page: 'shop' },
    { label: 'Surgical Equipment', page: 'shop' },
    { label: 'Hospital Furniture', page: 'shop' },
    { label: 'Lab Equipment', page: 'shop' },
    { label: 'Emergency Equipment', page: 'shop' },
  ],
  'Services': [
    { label: 'Supply Service', page: 'supply-service' },
    { label: 'Engineering Service', page: 'engineering-service' },
    { label: 'Equipment Rental', page: 'rental-products' },
    { label: 'Training & Certification', page: 'training' },
    { label: 'Used Equipment', page: 'used-products' },
    { label: 'Spare Parts', page: 'spare-parts' },
    { label: 'B2B Institutional Supply', page: 'supply-service' },
  ],
  'Support': [
    { label: 'Help Center', page: 'faq' },
    { label: 'Track Request', page: 'customer-dashboard' },
    { label: 'Request a Quote', page: 'request-quote' },
    { label: 'Product Enquiry', page: 'request-quote' },
    { label: 'Warranty Claims', page: 'customer-dashboard' },
    { label: 'Contact Support', page: 'contact' },
  ],
  'Policies': [
    { label: 'Terms & Conditions', page: 'terms' },
    { label: 'Privacy Policy', page: 'privacy' },
    { label: 'Rental Policy', page: 'rental-policy' },
    { label: 'Warranty Policy', page: 'warranty-policy' },
    { label: 'Return & Refund Policy', page: 'return-policy' },
    { label: 'Used Equipment Policy', page: 'used-equipment-policy' },
    { label: 'Service Policy', page: 'service-policy' },
  ],
} as const

// Medical brands
export const MEDICAL_BRANDS = [
  'Philips', 'Mindray', 'Dräger', 'Omron', 'Yuwell',
  'BPL', 'Welch Allyn', 'GE Healthcare', 'Siemens Healthineers',
  'Contec', 'Rossmax',
]

// Product categories
export const PRODUCT_CATEGORIES = [
  { name: 'Patient Care', icon: 'heart-pulse', count: 342, slug: 'patient-care' },
  { name: 'Home Care', icon: 'home', count: 186, slug: 'home-care' },
  { name: 'Diagnostic Equipment', icon: 'stethoscope', count: 456, slug: 'diagnostic' },
  { name: 'Respiratory Care', icon: 'wind', count: 248, slug: 'respiratory' },
  { name: 'Hospital Furniture', icon: 'bed', count: 189, slug: 'furniture' },
  { name: 'Surgical Instruments', icon: 'scissors', count: 312, slug: 'surgical' },
  { name: 'Lab Equipment', icon: 'flask-conical', count: 278, slug: 'lab' },
  { name: 'Emergency & First Aid', icon: 'truck', count: 154, slug: 'emergency' },
]

// Service types
export const SERVICE_TYPES = [
  'Installation',
  'Repair',
  'Preventive Maintenance',
  'Calibration',
  'Inspection',
  'AMC (Annual Maintenance Contract)',
  'Equipment Relocation',
  'Commissioning',
  'Site Planning',
  'Technical Consultation',
  'Emergency Service',
  'User Training',
] as const

// Status enums
export const ORDER_STATUS = [
  'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled', 'Returned',
] as const

export const PRODUCT_APPROVAL_STATUS = [
  'Draft', 'Submitted', 'Content Review', 'Technical Review', 'Document Review',
  'Pricing Review', 'Compliance Review', 'Approved', 'Changes Requested',
  'Rejected', 'Published', 'Suspended',
] as const

export const RENTAL_STATUS = [
  'Available', 'Reserved', 'Booked', 'Active', 'Extended', 'Returned', 'Inspecting', 'Closed',
] as const

export const USED_EQUIPMENT_STATUS = [
  'Draft', 'Submitted', 'Documents Pending', 'Inspection Required',
  'Inspection Scheduled', 'Under Technical Review', 'Approved',
  'Rejected', 'Published', 'Sold', 'Archived',
] as const

export const SERVICE_REQUEST_STATUS = [
  'Submitted', 'Under Review', 'Engineer Assigned', 'Accepted',
  'Site Visit Scheduled', 'Diagnosis', 'Estimate Submitted',
  'Customer Approval', 'Work Started', 'Parts Requested',
  'Work Completed', 'Customer Confirmation', 'Invoiced',
  'Payment Received', 'Report Submitted', 'Feedback', 'Closed',
] as const

export const ENQUIRY_STATUS = [
  'New', 'Assigned', 'In Progress', 'Quoted', 'Follow Up', 'Converted', 'Closed', 'Cancelled',
] as const

export const QUOTATION_STATUS = [
  'Draft', 'Sent', 'Viewed', 'Negotiation', 'Revised',
  'Accepted', 'Rejected', 'Expired', 'Converted',
] as const

// Condition grades for used equipment
export const CONDITION_GRADES = [
  { grade: 'A', label: 'Excellent', description: 'Like new, minimal signs of use', color: '#1FA66A' },
  { grade: 'B', label: 'Good', description: 'Normal wear, fully functional', color: '#2563EB' },
  { grade: 'C', label: 'Fair', description: 'Visible wear, functional with minor issues', color: '#F6A723' },
  { grade: 'D', label: 'Refurbished', description: 'Professionally refurbished and tested', color: '#7C3AED' },
] as const

// Demo accounts
export const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'admin@medikobazaar.com', password: 'Admin@123', icon: 'shield', color: '#D64545' },
  { role: 'Customer', email: 'customer@example.com', password: 'Customer@123', icon: 'user', color: '#0B2D5C' },
  { role: 'Seller', email: 'seller@example.com', password: 'Seller@123', icon: 'store', color: '#F26A1A' },
  { role: 'Engineer', email: 'engineer@example.com', password: 'Engineer@123', icon: 'wrench', color: '#1FA66A' },
  { role: 'Support', email: 'support@medikobazaar.com', password: 'Support@123', icon: 'headphones', color: '#2563EB' },
  { role: 'Trainer', email: 'trainer@example.com', password: 'Trainer@123', icon: 'book-open', color: '#7C3AED' },
] as const

// Supply process steps
export const SUPPLY_PROCESS = [
  { step: 1, title: 'Send Requirement', desc: 'Submit your equipment needs and specifications' },
  { step: 2, title: 'Technical Review', desc: 'Our experts review your requirements thoroughly' },
  { step: 3, title: 'Product Sourcing', desc: 'We source the best products from trusted brands' },
  { step: 4, title: 'Quotation', desc: 'Receive a detailed quotation with pricing' },
  { step: 5, title: 'Approval', desc: 'Review and approve the quotation' },
  { step: 6, title: 'Delivery', desc: 'Secure delivery to your location' },
  { step: 7, title: 'Installation', desc: 'Professional installation by certified engineers' },
  { step: 8, title: 'After-Sales Support', desc: 'Ongoing maintenance and support' },
] as const

// Why choose us
export const WHY_CHOOSE_US = [
  { title: 'Genuine Products', desc: '100% authentic medical equipment from authorized distributors', icon: 'check' },
  { title: 'Transparent Pricing', desc: 'No hidden charges with clear, upfront pricing in NPR', icon: 'credit-card' },
  { title: 'Qualified Engineers', desc: 'Certified biomedical engineers for installation and repair', icon: 'wrench' },
  { title: 'Verified Used Equipment', desc: 'Inspected and certified pre-owned medical equipment', icon: 'search' },
  { title: 'Flexible Rental', desc: 'Short-term and long-term rental plans for every need', icon: 'clock' },
  { title: 'Reliable Spare Parts', desc: 'Genuine spare parts for all major brands', icon: 'settings' },
  { title: 'Institutional Supply', desc: 'B2B bulk supply for hospitals, clinics and NGOs', icon: 'building' },
  { title: 'Nepal-Wide Support', desc: 'Service coverage across all 77 districts of Nepal', icon: 'map-pin' },
] as const
