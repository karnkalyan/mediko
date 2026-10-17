// ============================================================
// Mediko Bazaar — Type Definitions
// ============================================================

export type Page =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'admin'
  | 'vendor'
  | 'customer-auth'
  | 'customer-dashboard'
  | 'seller-dashboard'
  | 'engineer-dashboard'
  | 'engineer-portal'
  // Service pages
  | 'supply-service'
  | 'engineering-service'
  | 'training'
  | 'training-detail'
  | 'home-care'
  // Listing pages
  | 'rental-products'
  | 'rental-detail'
  | 'used-products'
  | 'used-detail'
  | 'spare-parts'
  | 'spare-detail'
  // Info pages
  | 'about'
  | 'contact'
  | 'blog'
  | 'blog-detail'
  | 'faq'
  | 'certificate-verify'
  | 'engineer-directory'
  | 'engineer-profile'
  | 'request-quote'
  | 'product-enquiry'
  | 'b2b-enquiry'
  // Policy pages
  | 'terms'
  | 'privacy'
  | 'rental-policy'
  | 'warranty-policy'
  | 'return-policy'
  | 'used-equipment-policy'
  | 'service-policy'
  // System pages
  | 'support-ticket'
  | 'chat'
  | 'forgot-password'

export interface NavProps {
  navigate: (p: Page) => void
  cartCount: number
  setCartCount?: (n: number) => void
  currentPage?: Page
}

// Product types
export type ProductType = 'new' | 'used' | 'rental' | 'spare-part'
export type ProductCondition = 'New' | 'Used - Grade A' | 'Used - Grade B' | 'Used - Grade C' | 'Refurbished'

export interface Product {
  id: number
  title: string
  brand: string
  model?: string
  sku?: string
  seller: string
  sellerVerified: boolean
  category: string
  subcategory?: string
  type: ProductType
  condition: ProductCondition
  price: number | null
  oldPrice?: number
  askForPrice: boolean
  currency: string
  rating: number
  reviews: number
  image: string
  images?: string[]
  badge?: string
  inStock: boolean
  stockCount?: number
  discount?: number
  warranty?: string
  description?: string
  specifications?: Record<string, string>
  features?: string[]
  // Rental fields
  rentalDaily?: number
  rentalWeekly?: number
  rentalMonthly?: number
  rentalDeposit?: number
  // Used equipment fields
  conditionGrade?: string
  yearOfManufacture?: number
  usageHours?: number
  serviceHistory?: string
  inspectionStatus?: string
  verificationStatus?: string
  // Spare part fields
  compatibleEquipment?: string[]
  partNumber?: string
  isOEM?: boolean
  // Service availability
  installationAvailable?: boolean
  trainingAvailable?: boolean
  engineerSupport?: boolean
  // Home care
  forHomeCare?: boolean
  forHospital?: boolean
}

// Service types
export interface ServiceItem {
  id: number
  title: string
  category: string
  description: string
  icon: string
  features: string[]
  price?: number
  estimatedDuration?: string
}

// Training types
export interface TrainingCourse {
  id: number
  title: string
  equipmentCategory: string
  brand?: string
  trainer: string
  trainerTitle: string
  duration: string
  location: string
  mode: 'Online' | 'Onsite' | 'Hybrid'
  startDate: string
  endDate: string
  seats: number
  seatsAvailable: number
  price: number
  description: string
  topics: string[]
  certification: boolean
  certificateValidity?: string
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
}

export interface Certificate {
  id: string
  participantName: string
  course: string
  issueDate: string
  expiryDate?: string
  trainer: string
  status: 'Valid' | 'Expired' | 'Revoked'
  verificationCode: string
}

// Engineer types
export interface Engineer {
  id: number
  name: string
  title: string
  photo: string
  specializations: string[]
  experience: string
  rating: number
  reviews: number
  serviceArea: string[]
  certifications: string[]
  availability: 'Available' | 'Busy' | 'On Leave'
  completedJobs: number
  verified: boolean
}

// Seller types
export interface Seller {
  id: number
  name: string
  type: 'Authorized Dealer' | 'Distributor' | 'Manufacturer' | 'Reseller' | 'Individual'
  logo?: string
  verified: boolean
  rating: number
  reviews: number
  products: number
  location: string
  joinedDate: string
  description: string
}

// Blog types
export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  category: string
  readTime: string
  tags: string[]
}

// Testimonial types
export interface Testimonial {
  id: number
  name: string
  title: string
  organization: string
  content: string
  rating: number
  avatar: string
}

// Order types
export interface Order {
  id: string
  product: string
  amount: number
  status: string
  date: string
  items: number
}

// Enquiry types
export interface Enquiry {
  id: string
  type: string
  customer: string
  product: string
  status: string
  date: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
}

// Quotation types
export interface Quotation {
  id: string
  customer: string
  amount: number
  status: string
  date: string
  validUntil: string
  items: number
}

// Slider types
export interface HeroSlide {
  id: number
  title: string
  highlightText: string
  description: string
  primaryBtn: { label: string; page: Page }
  secondaryBtn: { label: string; page: Page }
  image: string
  trustPoints: { icon: string; text: string }[]
}
