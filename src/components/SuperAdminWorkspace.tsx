import { useState, useMemo } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Clock3,
  FileCheck2,
  Wrench,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  Eye,
  Pencil,
  Trash2,
  Download,
  ShieldCheck,
  TrendingUp,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Tag,
  FolderTree,
  Menu,
  X,
  ExternalLink,
  FileSpreadsheet,
  Bell,
  UserRound,
  Users,
  Building2,
  Store,
  Crown,
  Lock,
  Mail,
  Phone,
  CreditCard,
  AlertTriangle,
  Calendar,
  GripVertical,
  Save,
  Upload,
  Receipt,
  GitBranch,
  DollarSign,
} from 'lucide-react'
import type { NavProps, Product } from '../types'
import { BRAND } from '../lib/constants'
import { getLiveProducts, syncLiveProducts } from '../data/products'
import ProductEditorPage from './ProductEditorPage'
import type { ProductFormData } from './ProductFormModal'
import BrandCategoryModal, { type BrandData, type CategoryData } from './BrandCategoryModal'
import LandingCostModal from './LandingCostModal'
import QuotationStudioPage from './QuotationStudioPage'
import OrderDetailsModal, { type DetailedOrder } from './OrderDetailsModal'
import OrderDetailsPage from './OrderDetailsPage'
import VendorKycModal, { type VendorKycProfile } from './VendorKycModal'
import {
  generateTaxInvoicePDF,
  generateQuotationPDF,
  generateProformaInvoicePDF,
  generateRentalSettlementPDF,
  generateCustomerDossierPDF,
  generateBiomedicalCertificatePDF,
} from '../lib/pdfGenerator'

type AdminTab =
  | 'overview'
  | 'products'
  | 'brands'
  | 'categories'
  | 'approvals'
  | 'orders'
  | 'rentals'
  | 'used-verification'
  | 'landing-cost'
  | 'quotations'
  | 'service-jobs'
  | 'vendor-kyc'
  | 'customers'
  | 'sellers'
  | 'admin-users'
  | 'invoices'
  | 'settings'

interface InitialBrand {
  id: string | number
  name: string
  originCountry: string
  isAuthorized: boolean
  distributorName: string
  productCount: number
  logoUrl: string
}

const INITIAL_BRANDS: InitialBrand[] = [
  { id: 'b1', name: 'Mindray', originCountry: 'China / Shenzhen', isAuthorized: true, distributorName: 'Mediko BioTech Pvt. Ltd. (Sole Nepal Partner)', productCount: 18, logoUrl: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=120&auto=format&fit=crop' },
  { id: 'b2', name: 'Philips Healthcare', originCountry: 'Netherlands', isAuthorized: true, distributorName: 'Global Medical Imports Nepal', productCount: 14, logoUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=120&auto=format&fit=crop' },
  { id: 'b3', name: 'GE Healthcare', originCountry: 'USA / Wisconsin', isAuthorized: true, distributorName: 'HealthTech BioMedicals Nepal', productCount: 12, logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&auto=format&fit=crop' },
  { id: 'b4', name: 'Dräger', originCountry: 'Germany / Lübeck', isAuthorized: true, distributorName: 'Swiss Med Nepal Pvt. Ltd.', productCount: 9, logoUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=120&auto=format&fit=crop' },
  { id: 'b5', name: 'Siemens Healthineers', originCountry: 'Germany / Erlangen', isAuthorized: true, distributorName: 'Nepal Precision Imaging Hub', productCount: 8, logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&auto=format&fit=crop' },
  { id: 'b6', name: 'Yuwell', originCountry: 'China / Jiangsu', isAuthorized: true, distributorName: 'MediCare Nepal Direct', productCount: 16, logoUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=120&auto=format&fit=crop' },
  { id: 'b7', name: 'Schiller', originCountry: 'Switzerland / Baar', isAuthorized: true, distributorName: 'Swiss Med Nepal Pvt. Ltd.', productCount: 7, logoUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=120&auto=format&fit=crop' },
  { id: 'b8', name: 'Mediko Care', originCountry: 'Nepal (Domestic Assembly)', isAuthorized: true, distributorName: 'Mediko Bazaar Pvt. Ltd.', productCount: 22, logoUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&auto=format&fit=crop' },
]

interface InitialCategory {
  id: string | number
  name: string
  slug: string
  department: string
  parentId: string | null
  ddaClassification: 'Class A (Low Risk)' | 'Class B (Low-Med)' | 'Class C (Med-High)' | 'Class D (High Risk)'
  productCount: number
}

const INITIAL_CATEGORIES: InitialCategory[] = [
  { id: 'c1', name: 'Patient Monitoring', slug: 'patient-monitoring', department: 'Critical Care & ICU', parentId: null, ddaClassification: 'Class C (Med-High)', productCount: 18 },
  { id: 'c2', name: 'Respiratory Care & Oxygen', slug: 'respiratory-care', department: 'Pulmonology & ICU', parentId: null, ddaClassification: 'Class C (Med-High)', productCount: 15 },
  { id: 'c3', name: 'Diagnostic & Lab Equipment', slug: 'diagnostic-lab', department: 'Pathology & Diagnostics', parentId: null, ddaClassification: 'Class B (Low-Med)', productCount: 21 },
  { id: 'c4', name: 'ICU & Emergency Life Support', slug: 'icu-equipment', department: 'Critical Care & ICU', parentId: null, ddaClassification: 'Class D (High Risk)', productCount: 12 },
  { id: 'c5', name: 'Surgical & OT Workstations', slug: 'surgical-equipment', department: 'Surgery & OT', parentId: null, ddaClassification: 'Class C (Med-High)', productCount: 14 },
  { id: 'c6', name: 'Hospital Furniture & Beds', slug: 'hospital-furniture', department: 'General Hospital Ward', parentId: null, ddaClassification: 'Class A (Low Risk)', productCount: 19 },
  { id: 'c7', name: 'Spare Parts & Sensors', slug: 'spare-parts', department: 'Biomedical Maintenance', parentId: null, ddaClassification: 'Class B (Low-Med)', productCount: 34 },
  { id: 'c8', name: 'Radiology & Imaging', slug: 'radiology-imaging', department: 'Radiology & Scan', parentId: null, ddaClassification: 'Class D (High Risk)', productCount: 8 },
  { id: 'c9', name: 'Bedside Monitors', slug: 'bedside-monitors', department: 'Critical Care & ICU', parentId: 'c1', ddaClassification: 'Class C (Med-High)', productCount: 8 },
  { id: 'c10', name: 'Central Monitoring', slug: 'central-monitoring', department: 'Critical Care & ICU', parentId: 'c1', ddaClassification: 'Class C (Med-High)', productCount: 4 },
  { id: 'c11', name: 'Oxygen Concentrators', slug: 'oxygen-concentrators', department: 'Pulmonology & ICU', parentId: 'c2', ddaClassification: 'Class C (Med-High)', productCount: 6 },
  { id: 'c12', name: 'Ventilators', slug: 'ventilators', department: 'Pulmonology & ICU', parentId: 'c2', ddaClassification: 'Class D (High Risk)', productCount: 5 },
]

interface HospitalCustomer {
  id: string
  name: string
  affiliation: string
  address: string
  person: string
  role: string
  email: string
  phone: string
  pan: string
  dda: string
  bedCapacity: string
  creditLimit: string
  orders: Array<{
    orderNumber: string
    date: string
    items: string
    amount: string
    status: string
  }>
  totalSpent: string
  activeRentalsCount: number
  quotationsCount: number
  status: string
}

const INITIAL_CUSTOMERS: HospitalCustomer[] = [
  {
    id: 'CUST-001',
    name: 'Bir Hospital',
    affiliation: 'National Academy of Medical Sciences (NAMS)',
    address: 'Mahakantipur, Kanti Path, Kathmandu, Nepal',
    person: 'Dr. Ramesh Karki',
    role: 'Head of Biomedical Procurement',
    email: 'procurement@birhospital.gov.np',
    phone: '+977 1-4221119 / +977 985-1117186',
    pan: '301248991',
    dda: 'DDA-HOSP-076/077-89',
    bedCapacity: '460 Beds (Emergency, ICU, Nephrology, General)',
    creditLimit: 'NPR 10,000,000 (Net 30 Days Govt PO)',
    orders: [
      { orderNumber: 'MB-28491', date: '08 Sep 2026', items: 'Mindray MEC-1200 Patient Monitor × 3', amount: 'NPR 855,000', status: 'Delivered' },
      { orderNumber: 'MB-28455', date: '14 Aug 2026', items: 'ICU Ventilator Spare Sensors & Humidifiers', amount: 'NPR 142,000', status: 'Delivered' },
      { orderNumber: 'MB-28390', date: '02 Jul 2026', items: 'Electric ICU Beds 3-Function × 4', amount: 'NPR 260,000', status: 'Delivered' },
    ],
    totalSpent: 'NPR 3,245,500',
    activeRentalsCount: 2,
    quotationsCount: 1,
    status: 'Active',
  },
  {
    id: 'CUST-002',
    name: 'Patan Hospital',
    affiliation: 'Patan Academy of Health Sciences (PAHS)',
    address: 'Lagankhel, Lalitpur, Nepal',
    person: 'Anita Thapa',
    role: 'Chief Equipment & Supply Officer',
    email: 'anita@patanhospital.gov.np',
    phone: '+977 981-4823222',
    pan: '300456123',
    dda: 'DDA-HOSP-075/076-14',
    bedCapacity: '450 Beds',
    creditLimit: 'NPR 8,000,000 (Net 30 Days)',
    orders: [
      { orderNumber: 'MB-28488', date: '06 Sep 2026', items: 'Yuwell Oxygen Concentrator 5L × 2', amount: 'NPR 101,700', status: 'Dispatched' },
      { orderNumber: 'MB-28420', date: '22 Jul 2026', items: 'Schiller AT-102 12-Channel ECG Machine', amount: 'NPR 145,000', status: 'Delivered' },
    ],
    totalSpent: 'NPR 1,840,000',
    activeRentalsCount: 1,
    quotationsCount: 1,
    status: 'Active',
  },
  {
    id: 'CUST-003',
    name: 'Grande International Hospital',
    affiliation: 'Care & Cure Medical Group Nepal',
    address: 'Dhapasi, Kathmandu, Nepal',
    person: 'Biomedical Engineering Unit',
    role: 'Procurement & Maintenance Dept',
    email: 'biomed@grande.com.np',
    phone: '+977 980-1827364',
    pan: '602189445',
    dda: 'DDA-HOSP-078/079-62',
    bedCapacity: '200 Beds (Tertiary Care)',
    creditLimit: 'NPR 5,000,000 (Net 15 Days)',
    orders: [
      { orderNumber: 'MB-28482', date: '04 Sep 2026', items: 'Contec SP750 Infusion Pump × 2', amount: 'NPR 108,480', status: 'Processing' },
    ],
    totalSpent: 'NPR 980,000',
    activeRentalsCount: 1,
    quotationsCount: 0,
    status: 'Active',
  },
  {
    id: 'CUST-004',
    name: 'Teaching Hospital (TUTH)',
    affiliation: 'Tribhuvan University Institute of Medicine',
    address: 'Maharajgunj, Kathmandu, Nepal',
    person: 'Dr. Suresh Poudel',
    role: 'Chief Medical Equipment Division',
    email: 'cme@tuth.edu.np',
    phone: '+977 1-4412121',
    pan: '300456123',
    dda: 'DDA-HOSP-070/071-02',
    bedCapacity: '700 Beds',
    creditLimit: 'NPR 15,000,000 (Govt LC)',
    orders: [
      { orderNumber: 'MB-28501', date: '11 Oct 2026', items: 'Siemens Mobile C-Arm Imaging System', amount: 'NPR 4,800,000', status: 'Processing' },
    ],
    totalSpent: 'NPR 6,400,000',
    activeRentalsCount: 0,
    quotationsCount: 1,
    status: 'Active',
  },
]

export interface AdminOrderRecord {
  id: string
  inv: string
  order: string
  client: string
  pan: string
  items: string
  itemDetails: Array<{
    id: string | number
    title: string
    brand: string
    model?: string
    image?: string
    quantity: number
    unitPriceNpr: number
  }>
  subtotal: number
  vat: number
  shipping: number
  amount: string
  status: 'DELIVERED' | 'DISPATCHED' | 'PROCESSING' | 'PAID_CONFIRMED' | 'REFUND_REQUESTED' | 'REFUNDED' | 'CANCELLED'
  date: string
  contact: string
  address: string
  carrierName: string
  trackingNumber: string
}

const INITIAL_ADMIN_ORDERS: AdminOrderRecord[] = [
  {
    id: 'MB-28491',
    inv: 'MB-INV-2026-1048',
    order: 'MB-28491',
    client: 'Bir Hospital (ICU Ward)',
    pan: '301248991',
    items: 'Mindray MEC-1200 Patient Monitor 12" TFT × 1',
    itemDetails: [
      {
        id: 1,
        title: 'Mindray MEC-1200 Patient Monitor 12" TFT',
        brand: 'Mindray',
        model: 'MEC-1200',
        image: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=400&h=300&fit=crop',
        quantity: 1,
        unitPriceNpr: 285000,
      },
    ],
    subtotal: 285000,
    vat: 37050,
    shipping: 2500,
    amount: 'NPR 324,550',
    status: 'DELIVERED',
    date: '08 Sep 2026',
    contact: 'Dr. Ramesh Karki, +977 985-1117186',
    address: 'ICU Store, Bir Hospital, Mahakantipur, Kathmandu',
    carrierName: 'Mediko Clinical Express Logistics',
    trackingNumber: 'MB-TRK-28491-KTM',
  },
  {
    id: 'MB-28488',
    inv: 'MB-INV-2026-1049',
    order: 'MB-28488',
    client: 'Patan Hospital (Pulmonology)',
    pan: '300456123',
    items: 'Yuwell Oxygen Concentrator 5L × 2',
    itemDetails: [
      {
        id: 2,
        title: 'Yuwell 8F-5AW Oxygen Concentrator 5L',
        brand: 'Yuwell',
        model: '8F-5AW',
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop',
        quantity: 2,
        unitPriceNpr: 45000,
      },
    ],
    subtotal: 90000,
    vat: 11700,
    shipping: 0,
    amount: 'NPR 101,700',
    status: 'DISPATCHED',
    date: '06 Sep 2026',
    contact: 'Anita Thapa, +977 981-4823222',
    address: 'Ward 3, Patan Hospital, Lagankhel, Lalitpur',
    carrierName: 'Nepal Can Move Urgent Cargo',
    trackingNumber: 'NCM-EXP-88912',
  },
  {
    id: 'MB-28482',
    inv: 'MB-INV-2026-1050',
    order: 'MB-28482',
    client: 'Grande International Hospital',
    pan: '602189445',
    items: 'Contec SP750 Infusion Pump × 2',
    itemDetails: [
      {
        id: 3,
        title: 'Contec SP750 Infusion Pump Single Channel',
        brand: 'Contec',
        model: 'SP750',
        image: 'https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=400&h=300&fit=crop',
        quantity: 2,
        unitPriceNpr: 48000,
      },
    ],
    subtotal: 96000,
    vat: 12480,
    shipping: 0,
    amount: 'NPR 108,480',
    status: 'PROCESSING',
    date: '04 Sep 2026',
    contact: 'Procurement Dept, +977 980-1827364',
    address: 'Grande Hospital, Dhapasi, Kathmandu',
    carrierName: 'Sundar Medical Logistics',
    trackingNumber: 'SND-44910-KTM',
  },
  {
    id: 'MB-28501',
    inv: 'MB-INV-2026-1051',
    order: 'MB-28501',
    client: 'Teaching Hospital (TUTH)',
    pan: '300456123',
    items: 'Schiller AT-102 Plus 12-Channel ECG Machine × 1',
    itemDetails: [
      {
        id: 4,
        title: 'Schiller AT-102 Plus 12-Channel ECG Machine',
        brand: 'Schiller',
        model: 'AT-102 Plus',
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=300&fit=crop',
        quantity: 1,
        unitPriceNpr: 145000,
      },
    ],
    subtotal: 145000,
    vat: 18850,
    shipping: 1500,
    amount: 'NPR 165,350',
    status: 'PAID_CONFIRMED',
    date: '11 Oct 2026',
    contact: 'Dr. Suresh Poudel, +977 1-4412121',
    address: 'Cardiology Department, TUTH, Maharajgunj, Kathmandu',
    carrierName: 'Mediko Clinical Express Logistics',
    trackingNumber: 'MB-TRK-28501-TUTH',
  },
]

export interface AdminSeller {
  id: string
  name: string
  type: string
  city: string
  address: string
  pan: string
  ddaLicense: string
  rep: string
  phone: string
  email: string
  listings: number
  revenue: string
  balancePayable: number
  comm: string
  rating: number
  status: 'Verified' | 'Pending Review' | 'Suspended'
  bankAccount: string
  bankName: string
}

const INITIAL_SELLERS: AdminSeller[] = [
  {
    id: 'SEL-01',
    name: 'MediTech Solutions Pvt. Ltd.',
    type: 'Authorized Dealer',
    city: 'New Baneshwar, KTM',
    address: 'Trade Tower Floor 4, Thapathali, Kathmandu',
    pan: '602189441',
    ddaLicense: 'DDA-MED-077/412',
    rep: 'Sunil Shakya',
    phone: '+977 985-1122334',
    email: 'sales@meditech.com.np',
    listings: 46,
    revenue: 'NPR 2,840,000',
    balancePayable: 420000,
    comm: '8%',
    rating: 4.8,
    status: 'Verified',
    bankAccount: '02810012398102',
    bankName: 'Nabil Bank Ltd.',
  },
  {
    id: 'SEL-02',
    name: 'MediCare Nepal Direct',
    type: 'Primary Distributor',
    city: 'Teku, Kathmandu',
    address: 'Teku Medical Plaza Unit 12, Kathmandu',
    pan: '601182390',
    ddaLicense: 'DDA-MED-078/119',
    rep: 'Kiran Thapa',
    phone: '+977 980-1192834',
    email: 'kiran@medicare.com.np',
    listings: 38,
    revenue: 'NPR 1,520,000',
    balancePayable: 185000,
    comm: '10%',
    rating: 4.6,
    status: 'Verified',
    bankAccount: '0100994821034',
    bankName: 'Global IME Bank',
  },
  {
    id: 'SEL-03',
    name: 'Spare Parts Nepal Depot',
    type: 'Biomedical Component Reseller',
    city: 'Patan, Lalitpur',
    address: 'Kumaripati Biomedical Arcade, Lalitpur',
    pan: '603847291',
    ddaLicense: 'DDA-SP-079/014',
    rep: 'Bikash Maharjan',
    phone: '+977 984-1827461',
    email: 'support@spareparts.com.np',
    listings: 29,
    revenue: 'NPR 620,000',
    balancePayable: 74000,
    comm: '12%',
    rating: 4.2,
    status: 'Verified',
    bankAccount: '0039281746201',
    bankName: 'NIC Asia Bank',
  },
]

export interface ServiceTicket {
  id: string
  equip: string
  client: string
  clientPhone: string
  eng: string
  engPhone: string
  task: string
  status: 'Assigned' | 'Scheduled' | 'In Progress' | 'Calibration Passed' | 'Resolved'
  priority: 'Urgent (ICU)' | 'High' | 'Normal'
  date: string
  notes: string
}

const INITIAL_SERVICE_TICKETS: ServiceTicket[] = [
  {
    id: 'SRV-084',
    equip: 'Mindray MEC-1200 Patient Monitor',
    client: 'Bir Hospital (Emergency & ICU Ward)',
    clientPhone: '+977 985-1117186',
    eng: 'Er. Suman Adhikari',
    engPhone: '+977 984-1823490',
    task: 'Sensor Recalibration & Lead Replacement',
    status: 'In Progress',
    priority: 'Urgent (ICU)',
    date: '12 Oct 2026',
    notes: 'SpO2 sensor cable replaced; NIBP cuff pressure calibrated with digital manometer.',
  },
  {
    id: 'SRV-089',
    equip: 'Dräger Savina 300 ICU Ventilator',
    client: 'Teaching Hospital (TUTH)',
    clientPhone: '+977 1-4412121',
    eng: 'Er. Bikash Tamang',
    engPhone: '+977 986-0192837',
    task: '6-Month AMC Preventive Inspection',
    status: 'Scheduled',
    priority: 'Normal',
    date: '10 Oct 2026',
    notes: 'O2 cell replacement kit prepared. Electrical safety verification pending.',
  },
  {
    id: 'SRV-092',
    equip: 'Siemens Mobile C-Arm Fluoroscopy',
    client: 'Patan Hospital (OT 4)',
    clientPhone: '+977 981-4823222',
    eng: 'Er. Suman Adhikari',
    engPhone: '+977 984-1823490',
    task: 'Radiation Dosimetry & Image Intensifier Calibration',
    status: 'Assigned',
    priority: 'High',
    date: '09 Oct 2026',
    notes: 'Scheduled for Saturday morning during OT routine sterilization cycle.',
  },
]

export interface AdminUser {
  id: string
  name: string
  role: string
  email: string
  phone: string
  perm: string
  status: 'Active' | 'Suspended'
}

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'ADM-01',
    name: 'Super Admin',
    role: 'Root Administrator',
    email: 'admin@medikobazaar.com',
    phone: '+977 985-1117186',
    perm: 'All Privileges & Security Controls',
    status: 'Active',
  },
  {
    id: 'ADM-02',
    name: 'Er. Ramesh Bhattarai',
    role: 'Biomedical Verification Officer',
    email: 'bmet@medikobazaar.com',
    phone: '+977 980-2837461',
    perm: 'KYC & CPO 48-Point Verification',
    status: 'Active',
  },
  {
    id: 'ADM-03',
    name: 'Sunita Pradhan',
    role: 'Finance & Invoicing Controller',
    email: 'accounts@medikobazaar.com',
    phone: '+977 984-1182736',
    perm: 'Tax Invoices & Landed Cost LC Engine',
    status: 'Active',
  },
]

// Standardized Mediko Bazaar button styling - small, refined, theme-based
const BTN = {
  primary: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-light text-white rounded text-xs font-normal transition cursor-pointer',
  secondary: 'inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-white hover:bg-bg-section text-text-body rounded text-xs font-normal transition cursor-pointer',
  orange: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange hover:bg-orange-hover text-white rounded text-xs font-normal transition cursor-pointer',
  success: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-success hover:opacity-90 text-white rounded text-xs font-normal transition cursor-pointer',
  danger: 'inline-flex items-center gap-1.5 px-3 py-1.5 border border-error/30 bg-white hover:bg-error-bg text-error rounded text-xs font-normal transition cursor-pointer',
  ghost: 'inline-flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-bg-section text-text-muted hover:text-text-dark rounded text-xs font-normal transition cursor-pointer',
  icon: 'inline-flex items-center justify-center w-7 h-7 hover:bg-bg-section text-text-muted hover:text-text-dark rounded transition cursor-pointer',
}

export default function SuperAdminWorkspace({ navigate }: { navigate: NavProps['navigate'] }) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<{
    key: string
    label: string
    badge?: number
    sectionLabel: string
    top: number
  } | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [headerSearch, setHeaderSearch] = useState('')

  // Product Inspection / Preview state
  const [previewProduct, setPreviewProduct] = useState<any>(null)

  // Products State - syncs live with entire website
  const [productList, setProductList] = useState(getLiveProducts)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isQuotationStudioOpen, setIsQuotationStudioOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<ProductFormData> | null>(null)
  const [productTypeFilter, setProductTypeFilter] = useState<'ALL' | 'NEW' | 'RENTAL' | 'USED' | 'SPARE'>('ALL')
  const [productSearch, setProductSearch] = useState('')

  // Brands & Categories State
  const [brands, setBrands] = useState(INITIAL_BRANDS)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [brandCategoryModalOpen, setBrandCategoryModalOpen] = useState(false)
  const [brandCategoryMode, setBrandCategoryMode] = useState<'brand' | 'category'>('brand')
  const [categoryView, setCategoryView] = useState<'grid' | 'kanban'>('grid')

  // Modals state
  const [landingCostModalOpen, setLandingCostModalOpen] = useState(false)
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<DetailedOrder | null>(null)
  const [selectedVendorKyc, setSelectedVendorKyc] = useState<VendorKycProfile | null>(null)
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState<HospitalCustomer | null>(null)

  // Orders State & Active Detailed Order Page
  const [ordersList, setOrdersList] = useState<AdminOrderRecord[]>(INITIAL_ADMIN_ORDERS)
  const [activeDetailedOrderPage, setActiveDetailedOrderPage] = useState<DetailedOrder | null>(null)

  // Customers State & Add Customer Modal
  const [customersList, setCustomersList] = useState<HospitalCustomer[]>(INITIAL_CUSTOMERS)
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)

  // Sellers State & Modals
  const [sellersList, setSellersList] = useState<AdminSeller[]>(INITIAL_SELLERS)
  const [selectedSellerForModal, setSelectedSellerForModal] = useState<AdminSeller | null>(null)
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false)

  // Service Jobs & Biomedical Engineers
  const [serviceTicketsList, setServiceTicketsList] = useState<ServiceTicket[]>(INITIAL_SERVICE_TICKETS)
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<ServiceTicket | null>(null)
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false)

  // Admin Users State & Add Admin Modal
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>(INITIAL_ADMIN_USERS)
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)

  // Vendor Listing Approvals
  const [approvalsList, setApprovalsList] = useState([
    {
      id: 'APP-101',
      title: 'Siemens Acuson X300 Ultrasound Doppler',
      seller: 'Global Medical Imports Pvt. Ltd.',
      type: 'Pre-Owned Radiology',
      price: 1250000,
      priceFormatted: 'NPR 1,250,000',
      brand: 'Siemens Healthineers',
      category: 'Radiology & Imaging',
      img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop',
    },
    {
      id: 'APP-102',
      title: 'Biphasic Defibrillator DF-2509',
      seller: 'MediTech Solutions Pvt. Ltd.',
      type: 'New ICU Equipment',
      price: 165000,
      priceFormatted: 'NPR 165,000',
      brand: 'Mindray',
      category: 'ICU & Emergency Life Support',
      img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&auto=format&fit=crop',
    },
    {
      id: 'APP-103',
      title: 'Philips HeartStart FRx Automated AED',
      seller: 'Nepal Emergency Devices Pvt. Ltd.',
      type: 'New ICU Equipment',
      price: 210000,
      priceFormatted: 'NPR 210,000',
      brand: 'Philips Healthcare',
      category: 'ICU & Emergency Life Support',
      img: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=600&auto=format&fit=crop',
    },
  ])

  // Vendor KYC Profiles
  const [vendorKycList, setVendorKycList] = useState([
    {
      id: 'V-001',
      name: 'MediTech Solutions Pvt. Ltd.',
      city: 'New Baneshwar, Kathmandu',
      pan: '602189441',
      dda: 'DDA-MED-077/412',
      rep: 'Sunil Shakya',
      status: 'Pending Verification',
    },
    {
      id: 'V-002',
      name: 'MediCare Nepal Direct',
      city: 'Teku, Kathmandu',
      pan: '601182390',
      dda: 'DDA-MED-078/119',
      rep: 'Kiran Thapa',
      status: 'Pending Verification',
    },
  ])

  // 48-Point BMET Verification Inspections
  const [usedInspectionList, setUsedInspectionList] = useState([
    {
      id: 'CPO-8819',
      equip: 'Dräger Savina 300 ICU Ventilator',
      serial: 'DR-SV300-88192',
      seller: 'Patan Hospital Resale Unit',
      hospital: 'Patan Hospital',
      testsPassed: 48,
      status: 'Pending Calibration Audit',
      certified: false,
    },
    {
      id: 'CPO-8822',
      equip: 'Siemens Mobile C-Arm Fluoroscopy',
      serial: 'SIE-CARM-44910',
      seller: 'Bir Hospital Imaging Annex',
      hospital: 'Bir Hospital',
      testsPassed: 48,
      status: 'Pending Calibration Audit',
      certified: false,
    },
  ])

  // Rentals with penalty system
  const [rentalsList, setRentalsList] = useState([
    { id: 'RNT-1048', item: 'Yuwell 8F-10 Dual Flow 10L Oxygen', client: 'Bir Hospital (ICU Ward)', contact: 'Dr. Ramesh Karki, +977 985-1117186', period: '08 Sep – 08 Oct 2026', rent: 'NPR 18,000/month', deposit: 'NPR 25,000', status: 'Active', penaltyDaily: 500, overdueDays: 0, penaltyApplied: false },
    { id: 'RNT-1042', item: 'Electric ICU Hospital Bed 3-Function', client: 'Patan Hospital (Post-Op)', contact: 'Anita Thapa, +977 981-4823222', period: '01 Sep – 01 Dec 2026', rent: 'NPR 36,000/3 months', deposit: 'NPR 45,000', status: 'Active', penaltyDaily: 800, overdueDays: 0, penaltyApplied: false },
    { id: 'RNT-1031', item: 'BiPAP Machine ResMed AirCurve 10', client: 'Grande International Hospital', contact: 'Resp Unit, +977 980-1827364', period: '12 Aug – 12 Sep 2026', rent: 'NPR 12,000/month', deposit: 'NPR 25,000', status: 'Overdue', penaltyDaily: 600, overdueDays: 5, penaltyApplied: false },
  ])

  // Order status update handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: any, trackingNumber?: string) => {
    const updated = ordersList.map((ord) => {
      if (ord.order === orderId || ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          trackingNumber: trackingNumber || ord.trackingNumber,
        }
      }
      return ord
    })
    setOrdersList(updated)
    if (activeDetailedOrderPage && (activeDetailedOrderPage.id === orderId || activeDetailedOrderPage.orderNumber === orderId)) {
      setActiveDetailedOrderPage({
        ...activeDetailedOrderPage,
        status: newStatus,
        trackingNumber: trackingNumber || activeDetailedOrderPage.trackingNumber,
      })
    }
    showToast(`Order #${orderId} consignment status updated to ${newStatus}`)
  }

  // Order refund process handler
  const handleProcessOrderRefund = (orderId: string, refundData: any) => {
    const updated = ordersList.map((ord) => {
      if (ord.order === orderId || ord.id === orderId) {
        return {
          ...ord,
          status: 'REFUNDED' as any,
        }
      }
      return ord
    })
    setOrdersList(updated)
    if (activeDetailedOrderPage) {
      setActiveDetailedOrderPage({
        ...activeDetailedOrderPage,
        status: 'REFUNDED' as any,
        refundDetails: {
          requestedDate: new Date().toLocaleDateString('en-GB'),
          reason: refundData.reason,
          restockingFeeNpr: refundData.restockingFeeNpr,
          netRefundNpr: refundData.netRefundNpr,
          refundStatus: 'APPROVED',
          notes: refundData.notes,
        },
      })
    }
    showToast(`Institutional refund recorded for Order #${orderId}`)
  }

  // Settings tab
  const [settingsTab, setSettingsTab] = useState<'company' | 'vendor' | 'payment' | 'invoice' | 'profile'>('company')

  // Quotation List State
  const [quotationList, setQuotationList] = useState([
    {
      ref: 'MB-QT-2026-089',
      client: 'Bir Hospital Procurement Division',
      pan: '301248991',
      items: 'Mindray MEC-1200 Patient Monitors (× 3)',
      subtotal: 855000,
      vatAmount: 111150,
      amount: 'NPR 966,150',
      status: 'Sent / Tender Review',
      valid: 'Valid till 30 Oct 2026',
      date: '08 Oct 2026',
    },
    {
      ref: 'MB-QT-2026-092',
      client: 'Teaching Hospital (TUTH) Maharajgunj',
      pan: '300456123',
      items: 'Siemens Mobile C-Arm Imaging Fluoroscopy',
      subtotal: 4800000,
      vatAmount: 624000,
      amount: 'NPR 5,424,000',
      status: 'Price Calculated',
      valid: 'Valid till 15 Nov 2026',
      date: '06 Oct 2026',
    },
    {
      ref: 'MB-QT-2026-095',
      client: 'Nepal Red Cross Society',
      pan: '602189445',
      items: 'Emergency Ambulatory Oxygen Cylinders (× 20)',
      subtotal: 440000,
      vatAmount: 57200,
      amount: 'NPR 497,200',
      status: 'Approved by Client',
      valid: 'Accepted',
      date: '02 Oct 2026',
    },
    {
      ref: 'MB-QT-2026-098',
      client: 'Patan Hospital (Pulmonology Ward)',
      pan: '300892114',
      items: 'Yuwell 8F-10 Dual Flow 10L Oxygen Fleet (× 4)',
      subtotal: 320000,
      vatAmount: 41600,
      amount: 'NPR 361,600',
      status: 'Draft',
      valid: 'Valid till 28 Oct 2026',
      date: '10 Oct 2026',
    },
  ])

  // Quick Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle Save from ProductEditorPage - updates BOTH Admin and website immediately
  const handleSaveProduct = (formData: ProductFormData) => {
    const isEditing = !!editingProduct?.id
    let updatedList: any[] = []

    if (isEditing) {
      updatedList = productList.map((item: any) =>
        item.id === editingProduct.id
          ? {
              ...item,
              title: formData.title,
              model: formData.model,
              sku: formData.sku,
              brand: formData.brand,
              category: formData.category,
              price: formData.askForPrice ? null : formData.regularPriceNpr,
              askForPrice: formData.askForPrice,
              condition: formData.condition as any,
              type: formData.type === 'RENTAL' ? 'rental' : formData.type === 'CERTIFIED_PRE_OWNED' ? 'used' : formData.type === 'SPARE_PART' ? 'spare-part' : 'new',
              warranty: formData.warrantyPeriod,
              image: formData.primaryImage,
            }
          : item
      )
      showToast(`Product "${formData.title}" updated across website.`)
    } else {
      const newId = Date.now()
      const newProductItem: any = {
        id: newId,
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        sku: formData.sku,
        category: formData.category,
        type: formData.type === 'RENTAL' ? 'rental' : formData.type === 'CERTIFIED_PRE_OWNED' ? 'used' : formData.type === 'SPARE_PART' ? 'spare-part' : 'new',
        condition: formData.condition,
        price: formData.askForPrice ? null : formData.regularPriceNpr,
        currency: 'NPR',
        askForPrice: formData.askForPrice,
        seller: 'Mediko Verified Depot',
        sellerVerified: true,
        inStock: formData.stockQuantity > 0,
        stockCount: formData.stockQuantity,
        warranty: formData.warrantyPeriod,
        image: formData.primaryImage,
        installationAvailable: formData.installationAvailable,
        engineerSupport: formData.engineerSupport,
        forHospital: true,
        rentalDaily: formData.rentalDailyRateNpr,
        rentalWeekly: formData.rentalWeeklyRateNpr,
        rentalMonthly: formData.rentalMonthlyRateNpr,
        rentalDeposit: formData.rentalSecurityDepositNpr,
      }
      updatedList = [newProductItem, ...productList]
      showToast(`Product "${formData.title}" published to website catalog.`)
    }

    setProductList(updatedList)
    syncLiveProducts(updatedList)
    setIsEditorOpen(false)
    setEditingProduct(null)
  }

  // Handle Delete Product - syncs across website
  const handleDeleteProduct = (p: any) => {
    if (confirm(`Remove "${p.title}" from catalog?`)) {
      const updated = productList.filter((item: any) => item.id !== p.id)
      setProductList(updated)
      syncLiveProducts(updated)
      showToast(`Product "${p.title}" removed.`)
    }
  }

  // Handle Add Brand
  const handleAddBrand = (brandData: BrandData) => {
    const brandEntry: InitialBrand = {
      id: String(brandData.id),
      name: brandData.name,
      originCountry: brandData.originCountry,
      isAuthorized: brandData.isAuthorized,
      distributorName: brandData.distributorName || 'Direct Import / Authorized Nepal Reseller',
      productCount: 0,
      logoUrl: brandData.logoUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&auto=format&fit=crop',
    }
    setBrands([brandEntry, ...brands])
    showToast(`Brand "${brandData.name}" registered.`)
  }

  // Handle Add Category
  const handleAddCategory = (catData: CategoryData) => {
    const catEntry: InitialCategory = {
      id: String(catData.id),
      name: catData.name,
      slug: catData.slug,
      department: catData.department,
      parentId: null,
      ddaClassification: catData.ddaClassification,
      productCount: 0,
    }
    setCategories([catEntry, ...categories])
    showToast(`Category "${catData.name}" registered.`)
  }

  // Navigation sections
  const navSections: Array<{ label: string; items: Array<{ key: AdminTab; label: string; icon: LucideIcon; badge?: number; iconColor: string }> }> = [
    {
      label: 'Commerce',
      items: [
        { key: 'overview', label: 'Overview', icon: LayoutDashboard, iconColor: 'text-sky-400' },
        { key: 'products', label: 'Products', icon: Package, badge: productList.length, iconColor: 'text-emerald-400' },
        { key: 'orders', label: 'Orders', icon: ShoppingCart, badge: ordersList.length, iconColor: 'text-amber-400' },
        { key: 'invoices', label: 'Invoices', icon: Receipt, badge: 3, iconColor: 'text-teal-300' },
        { key: 'quotations', label: 'Quotation Desk', icon: FileSpreadsheet, badge: quotationList.length, iconColor: 'text-indigo-400' },
      ],
    },
    {
      label: 'Catalog',
      items: [
        { key: 'brands', label: 'Brands', icon: Tag, badge: brands.length, iconColor: 'text-blue-400' },
        { key: 'categories', label: 'Categories', icon: FolderTree, badge: categories.length, iconColor: 'text-purple-400' },
        { key: 'approvals', label: 'Approvals', icon: ShieldCheck, badge: approvalsList.length, iconColor: 'text-emerald-300' },
      ],
    },
    {
      label: 'Operations',
      items: [
        { key: 'rentals', label: 'Rentals', icon: Clock3, badge: rentalsList.length, iconColor: 'text-cyan-400' },
        { key: 'used-verification', label: 'Used Equipment', icon: CheckCircle2, badge: usedInspectionList.filter((u) => !u.certified).length, iconColor: 'text-lime-400' },
        { key: 'landing-cost', label: 'Landing Cost', icon: Calculator, iconColor: 'text-pink-400' },
        { key: 'service-jobs', label: 'Service & Engineers', icon: Wrench, badge: serviceTicketsList.length, iconColor: 'text-orange-400' },
      ],
    },
    {
      label: 'People',
      items: [
        { key: 'customers', label: 'Customers', icon: Users, badge: customersList.length, iconColor: 'text-sky-300' },
        { key: 'sellers', label: 'Sellers', icon: Store, badge: sellersList.length, iconColor: 'text-rose-400' },
        { key: 'vendor-kyc', label: 'Vendor KYC', icon: FileCheck2, badge: vendorKycList.filter((v) => v.status === 'Pending Verification').length, iconColor: 'text-amber-300' },
        { key: 'admin-users', label: 'Admin Users', icon: Crown, badge: adminUsersList.length, iconColor: 'text-yellow-400' },
      ],
    },
    {
      label: 'System',
      items: [
        { key: 'settings', label: 'Settings', icon: Settings, iconColor: 'text-slate-300' },
      ],
    },
  ]

  // Filtered Products Table
  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      if (productTypeFilter === 'NEW' && p.type !== 'new') return false
      if (productTypeFilter === 'RENTAL' && p.type !== 'rental' && !p.rentalDaily) return false
      if (productTypeFilter === 'USED' && p.type !== 'used') return false
      if (productTypeFilter === 'SPARE' && p.type !== 'spare-part' && p.category !== 'Spare Parts') return false
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchSku = p.sku?.toLowerCase().includes(q)
        const matchBrand = p.brand?.toLowerCase().includes(q)
        if (!matchTitle && !matchSku && !matchBrand) return false
      }
      return true
    })
  }, [productList, productTypeFilter, productSearch])

  // Category tree helpers
  const rootCategories = categories.filter((c) => !c.parentId)
  const getChildren = (parentId: string | number) => categories.filter((c) => c.parentId === String(parentId))

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-[240px]'
  const contentPadding = sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-[240px]'

  return (
    <div className="min-h-screen bg-bg-light text-text-dark flex" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[999] flex items-center gap-2 bg-navy text-white px-3.5 py-2.5 rounded shadow-lg text-xs animate-slide-up">
          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex ${sidebarWidth} flex-col bg-navy border-r border-white/5 text-white transition-all duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
          <button
            onClick={() => { setIsEditorOpen(false); setIsQuotationStudioOpen(false); navigate('home') }}
            onMouseEnter={(e) => {
              if (sidebarCollapsed) {
                const rect = e.currentTarget.getBoundingClientRect()
                setHoveredNav({
                  key: 'brand-home',
                  label: 'Mediko Bazaar Admin Home',
                  sectionLabel: 'PORTAL',
                  top: rect.top + rect.height / 2,
                })
              }
            }}
            onMouseLeave={() => setHoveredNav(null)}
            className="flex items-center gap-2 border-0 bg-transparent text-left cursor-pointer p-0"
          >
            <div className="h-7 w-7 bg-white rounded p-0.5 flex items-center justify-center shrink-0">
              <img src={BRAND.logo} alt="Mediko Bazaar" className="h-full w-full object-contain" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="block text-xs font-normal text-white leading-tight">Mediko Bazaar</span>
                <span className="block text-[10px] text-slate-400">Super Admin</span>
              </div>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(false)} className="grid h-7 w-7 place-items-center text-white/70 hover:text-white lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav
          onScroll={() => setHoveredNav(null)}
          className="flex-1 overflow-y-auto px-2 py-3 space-y-4"
        >
          {navSections.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <p className="px-2 pb-1 text-[9px] font-normal uppercase tracking-wider text-slate-400">{section.label}</p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ key, label, icon: Icon, badge, iconColor }) => {
                  const active = tab === key && !isEditorOpen && !isQuotationStudioOpen
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setIsEditorOpen(false)
                        setIsQuotationStudioOpen(false)
                        setActiveDetailedOrderPage(null)
                        setTab(key)
                        setMobileMenuOpen(false)
                        setPreviewProduct(null)
                        setHoveredNav(null)
                      }}
                      onMouseEnter={(e) => {
                        if (sidebarCollapsed) {
                          const rect = e.currentTarget.getBoundingClientRect()
                          setHoveredNav({
                            key,
                            label,
                            badge,
                            sectionLabel: section.label,
                            top: rect.top + rect.height / 2,
                          })
                        }
                      }}
                      onMouseLeave={() => setHoveredNav(null)}
                      className={`group flex w-full items-center ${
                        sidebarCollapsed ? 'justify-center px-0 py-2' : 'gap-2 px-2 py-1.5'
                      } rounded text-left text-[11px] font-normal transition cursor-pointer relative ${
                        active
                          ? 'bg-white/12 text-white border-l-2 border-orange pl-1.5 shadow-xs font-medium'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${iconColor}`} />
                      {!sidebarCollapsed && <span className="flex-1 truncate">{label}</span>}
                      {!sidebarCollapsed && badge !== undefined && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${active ? 'bg-white/15 text-white' : 'bg-white/5 text-slate-400'}`}>
                          {badge}
                        </span>
                      )}
                      {sidebarCollapsed && badge !== undefined && (
                        <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-orange ring-1 ring-navy" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:block border-t border-white/10 p-2">
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed)
              setHoveredNav(null)
            }}
            onMouseEnter={(e) => {
              if (sidebarCollapsed) {
                const rect = e.currentTarget.getBoundingClientRect()
                setHoveredNav({
                  key: 'expand-sidebar',
                  label: 'Expand Sidebar',
                  sectionLabel: 'NAVIGATION',
                  top: rect.top + rect.height / 2,
                })
              }
            }}
            onMouseLeave={() => setHoveredNav(null)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded text-[10px] transition cursor-pointer font-normal"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <><ChevronLeft className="w-3.5 h-3.5" /><span>Collapse Sidebar</span></>}
          </button>
        </div>

        {/* User Footer */}
        {sidebarCollapsed ? (
          <div className="border-t border-white/10 p-2 flex flex-col items-center gap-1.5">
            <button
              onClick={() => navigate('home')}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setHoveredNav({
                  key: 'storefront',
                  label: 'Go to Storefront',
                  sectionLabel: 'PORTAL',
                  top: rect.top + rect.height / 2,
                })
              }}
              onMouseLeave={() => setHoveredNav(null)}
              className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer transition"
              title="Storefront"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('mediko_portal_role'); navigate('customer-auth') }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setHoveredNav({
                  key: 'signout',
                  label: 'Sign Out Session',
                  sectionLabel: 'ACCOUNT',
                  top: rect.top + rect.height / 2,
                })
              }}
              onMouseLeave={() => setHoveredNav(null)}
              className="w-8 h-8 flex items-center justify-center rounded bg-error/10 hover:bg-error/20 text-red-300 cursor-pointer transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="border-t border-white/10 p-2.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-navy-light text-white text-[10px] font-normal">SA</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-white font-normal">Super Admin</p>
                <p className="truncate text-[9px] text-slate-400">admin@medikobazaar.com</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => navigate('home')} className="flex-1 flex items-center justify-center gap-1 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-[10px] transition cursor-pointer font-normal">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Storefront</span>
              </button>
              <button
                onClick={() => { sessionStorage.removeItem('mediko_portal_role'); navigate('customer-auth') }}
                className="flex items-center justify-center gap-1 px-2 py-1 bg-error/10 hover:bg-error/20 text-red-300 rounded text-[10px] transition cursor-pointer font-normal"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Collapsed Sidebar Hover Flyout Tooltip */}
      {sidebarCollapsed && hoveredNav && (
        <div
          style={{ top: `${hoveredNav.top}px`, left: '68px' }}
          className="fixed z-[9999] -translate-y-1/2 flex items-center pointer-events-none transition-all duration-150 animate-in fade-in"
        >
          {/* Arrow pointing to icon */}
          <div className="w-0 h-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-navy -mr-[1px] drop-shadow-sm" />

          {/* Tooltip Content Card */}
          <div className="flex items-center gap-2.5 rounded bg-navy border border-white/20 px-3 py-1.5 shadow-2xl text-white backdrop-blur-md whitespace-nowrap">
            <div className="flex flex-col">
              {hoveredNav.sectionLabel && (
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-normal leading-none mb-0.5">
                  {hoveredNav.sectionLabel}
                </span>
              )}
              <span className="text-xs font-normal text-white leading-tight">
                {hoveredNav.label}
              </span>
            </div>
            {hoveredNav.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-orange text-white ml-1">
                {hoveredNav.badge}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden" />
      )}

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 ${contentPadding} flex flex-col min-w-0`}>
        {activeDetailedOrderPage ? (
          <OrderDetailsPage
            order={activeDetailedOrderPage}
            onBack={() => setActiveDetailedOrderPage(null)}
            onUpdateStatus={(orderId, status, tracking) => {
              handleUpdateOrderStatus(orderId, status as any, tracking)
            }}
            onProcessRefund={(orderId, refundData) => {
              handleProcessOrderRefund(orderId, refundData)
            }}
          />
        ) : isEditorOpen ? (
          <ProductEditorPage
            initialData={editingProduct}
            existingBrands={brands.map((b) => b.name)}
            existingCategories={categories.map((c) => c.name)}
            onBack={() => { setIsEditorOpen(false); setEditingProduct(null) }}
            onSave={handleSaveProduct}
            onOpenAddBrand={() => { setBrandCategoryMode('brand'); setBrandCategoryModalOpen(true) }}
            onOpenAddCategory={() => { setBrandCategoryMode('category'); setBrandCategoryModalOpen(true) }}
          />
        ) : isQuotationStudioOpen ? (
          <QuotationStudioPage
            onBack={() => setIsQuotationStudioOpen(false)}
            existingCustomers={customersList}
            existingVendors={sellersList}
            onSaveQuote={(newQuote: any) => {
              if (newQuote?.docNumber) {
                setQuotationList((prev) => [
                  {
                    ref: newQuote.docNumber,
                    client: newQuote.hospitalName || newQuote.customer?.organization || 'Institutional Client',
                    pan: newQuote.clientPan || newQuote.customer?.panVatNumber || '601289123',
                    items: newQuote.items?.map((i: any) => i.description).join(', ') || 'Medical Equipment Package',
                    subtotal: newQuote.subtotal || 250000,
                    vatAmount: newQuote.vatAmount || 32500,
                    amount: `NPR ${(newQuote.grandTotal || 282500).toLocaleString()}`,
                    status: 'Draft / Generated',
                    valid: `Valid till ${newQuote.validUntil || '30 Days'}`,
                    date: newQuote.docDate || new Date().toISOString().split('T')[0],
                  },
                  ...prev,
                ])
              }
              showToast('Quotation saved.')
              setIsQuotationStudioOpen(false)
            }}
          />
        ) : (
          <>
            {/* Top Navbar */}
            <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)} className="grid h-8 w-8 place-items-center rounded border border-border text-text-muted lg:hidden cursor-pointer">
                  <Menu className="w-4 h-4" />
                </button>
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <span>Admin</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-text-dark font-normal">
                    {navSections.flatMap((s) => s.items).find((n) => n.key === tab)?.label || 'Overview'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-section border border-border rounded w-52">
                  <Search className="w-3.5 h-3.5 text-text-light" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    value={headerSearch}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    className="bg-transparent border-0 outline-none text-[11px] text-text-dark w-full placeholder:text-text-light font-normal"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }} className={BTN.icon}>
                    <Bell className="w-4 h-4 text-slate-500" />
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange rounded-full" />
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-9 w-72 bg-white border border-border rounded shadow-lg z-50">
                      <div className="px-3 py-2 border-b border-border text-[11px] font-medium text-text-dark">Notifications</div>
                      {[
                        { text: 'New order MB-28501 from Bir Hospital', time: '5 min ago', icon: ShoppingCart, color: 'text-info' },
                        { text: 'Vendor KYC pending review', time: '1 hour ago', icon: FileCheck2, color: 'text-warning' },
                        { text: 'Rental RNT-1048 return overdue', time: '2 hours ago', icon: AlertTriangle, color: 'text-error' },
                      ].map((n, i) => (
                        <div key={i} className="flex items-start gap-2 px-3 py-2 hover:bg-bg-section text-[11px] cursor-pointer border-b border-border/50 last:border-0 font-normal">
                          <n.icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${n.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-text-body">{n.text}</p>
                            <p className="text-text-light text-[10px]">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="relative">
                  <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }} className="flex items-center gap-1.5 cursor-pointer">
                    <div className="grid h-7 w-7 place-items-center rounded bg-navy-light text-white text-[10px] font-normal">SA</div>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-9 w-52 bg-white border border-border rounded shadow-lg z-50">
                      <div className="px-3 py-2.5 border-b border-border">
                        <p className="text-[11px] font-medium text-text-dark">Super Admin</p>
                        <p className="text-[10px] text-text-muted">admin@medikobazaar.com</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setTab('settings'); setSettingsTab('profile'); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-bg-section text-[11px] text-text-body cursor-pointer text-left font-normal"
                        >
                          <UserRound className="w-3.5 h-3.5 text-info" /> Profile Settings
                        </button>
                        <button
                          onClick={() => { setTab('settings'); setSettingsTab('profile'); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-bg-section text-[11px] text-text-body cursor-pointer text-left font-normal"
                        >
                          <Lock className="w-3.5 h-3.5 text-orange" /> Change Password
                        </button>
                        <button
                          onClick={() => { setTab('settings'); setSettingsTab('company'); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-bg-section text-[11px] text-text-body cursor-pointer text-left font-normal"
                        >
                          <Building2 className="w-3.5 h-3.5 text-purple" /> Company Settings
                        </button>
                      </div>
                      <div className="border-t border-border py-1">
                        <button onClick={() => navigate('home')} className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-bg-section text-[11px] text-text-body cursor-pointer text-left font-normal">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> View Storefront
                        </button>
                        <button
                          onClick={() => { sessionStorage.removeItem('mediko_portal_role'); navigate('customer-auth') }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-error-bg text-[11px] text-error cursor-pointer text-left font-normal"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* TAB CONTENTS */}
            <main className="flex-1 p-4 lg:p-6 space-y-4">
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div className="space-y-4">
                  {/* Top Stats Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Active Catalog', value: `${productList.length} Items`, icon: Package, iconColor: 'text-orange', bg: 'bg-white', change: '+12% this mo' },
                      { label: 'Monthly GMV', value: 'NPR 14.8M', icon: TrendingUp, iconColor: 'text-success', bg: 'bg-white', change: '+18.4% YoY' },
                      { label: 'Orders Processed', value: '248 Units', icon: ShoppingCart, iconColor: 'text-info', bg: 'bg-white', change: '8 pending' },
                      { label: 'Active Quotations', value: '14 B2B Tenders', icon: FileSpreadsheet, iconColor: 'text-purple', bg: 'bg-white', change: 'NPR 28.5M val' },
                    ].map((card, i) => (
                      <div key={i} className={`${card.bg} p-3.5 rounded border border-border shadow-2xs`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-text-muted">{card.label}</span>
                          <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                        </div>
                        <div className="text-base font-normal text-navy mt-1">{card.value}</div>
                        <span className="text-[9px] text-success block mt-0.5">{card.change}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions & Live Health */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white p-4 rounded border border-border space-y-3">
                      <div className="flex items-center justify-between border-b border-border pb-2.5">
                        <h3 className="text-xs font-normal text-navy m-0">Quick Procurement Operations</h3>
                        <span className="text-[10px] text-success flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live Grid Synchronized
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => { setEditingProduct(null); setIsEditorOpen(true) }}
                          className={`${BTN.orange} justify-center w-full`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Product
                        </button>
                        <button
                          onClick={() => setIsQuotationStudioOpen(true)}
                          className={`${BTN.primary} justify-center w-full`}
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" /> Quotation Desk
                        </button>
                        <button
                          onClick={() => setLandingCostModalOpen(true)}
                          className={`${BTN.secondary} justify-center w-full`}
                        >
                          <Calculator className="w-3.5 h-3.5 text-purple" /> Landing Cost
                        </button>
                        <button
                          onClick={() => { setBrandCategoryMode('category'); setBrandCategoryModalOpen(true) }}
                          className={`${BTN.secondary} justify-center w-full`}
                        >
                          <FolderTree className="w-3.5 h-3.5 text-info" /> Add Category
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-border space-y-2.5">
                      <h3 className="text-xs font-normal text-navy m-0">Recent Operational Activity</h3>
                      <div className="space-y-2 text-[11px]">
                        {[
                          { text: 'Order MB-28491 delivered to Bir Hospital', time: '10m ago', icon: ShoppingCart, color: 'text-success' },
                          { text: 'Quotation MB-QT-089 generated for Bir Hospital', time: '45m ago', icon: FileSpreadsheet, color: 'text-info' },
                          { text: 'Rental RNT-1048 overdue penalty logged', time: '2h ago', icon: AlertTriangle, color: 'text-error' },
                        ].map((act, idx) => (
                          <div key={idx} className="flex items-start gap-2 border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
                            <act.icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${act.color}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-text-body truncate">{act.text}</p>
                              <span className="text-[9px] text-text-light">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              {tab === 'products' && !previewProduct && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(['ALL', 'NEW', 'RENTAL', 'USED', 'SPARE'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setProductTypeFilter(filter)}
                          className={`px-2.5 py-1 rounded text-xs transition cursor-pointer font-normal ${
                            productTypeFilter === filter
                              ? 'bg-navy text-white'
                              : 'bg-bg-section text-text-muted hover:text-text-dark border border-border'
                          }`}
                        >
                          {filter === 'ALL' ? 'All Products' : filter === 'SPARE' ? 'Spare Parts' : filter}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-bg-section border border-border rounded w-48">
                        <Search className="w-3.5 h-3.5 text-text-light" />
                        <input
                          type="text"
                          placeholder="Filter catalog..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="bg-transparent border-0 outline-none text-xs text-text-dark w-full font-normal"
                        />
                      </div>
                      <button
                        onClick={() => { setEditingProduct(null); setIsEditorOpen(true) }}
                        className={BTN.orange}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Product
                      </button>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="bg-white rounded border border-border overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-bg-section border-b border-border text-text-muted uppercase tracking-wider text-[10px] font-normal">
                          <th className="py-2.5 px-3">Product</th>
                          <th className="py-2.5 px-3">Brand & Category</th>
                          <th className="py-2.5 px-3">Price / Rate</th>
                          <th className="py-2.5 px-3">Listing Type</th>
                          <th className="py-2.5 px-3">Stock & Warranty</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredProducts.map((p) => {
                          const isRental = p.type === 'rental' || !!p.rentalDaily
                          const isUsed = p.type === 'used'
                          return (
                            <tr key={p.id} className="hover:bg-bg-section/50 transition">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img src={p.image} alt={p.title} className="w-9 h-9 rounded object-cover border border-border shrink-0 bg-white" />
                                  <div className="min-w-0 max-w-[240px]">
                                    <span className="text-text-dark truncate block font-normal">{p.title}</span>
                                    <span className="text-[9px] text-text-light">SKU: {p.sku || `MB-${p.id}`}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="text-text-body block">{p.brand}</span>
                                <span className="text-[9px] text-text-light">{p.category}</span>
                              </td>
                              <td className="py-2.5 px-3 font-normal text-navy">
                                {p.askForPrice ? (
                                  <span className="text-orange text-[10px]">Quote Desk</span>
                                ) : (
                                  `NPR ${p.price?.toLocaleString()}`
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] ${isRental ? 'bg-warning-bg text-amber-700' : isUsed ? 'bg-purple-bg text-purple' : 'bg-success-bg text-success'}`}>
                                  {isRental ? 'Rental' : isUsed ? 'Pre-Owned' : 'New'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="text-[9px] text-success bg-success-bg px-1.5 py-0.5 rounded">{p.warranty || '2 Years'}</span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => setPreviewProduct(p)} className={BTN.icon} title="Inspect Product">
                                    <Eye className="w-3.5 h-3.5 text-info" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingProduct({
                                        id: p.id,
                                        title: p.title,
                                        model: p.model || '',
                                        sku: p.sku || `MB-${p.id}`,
                                        brand: p.brand,
                                        category: p.category,
                                        regularPriceNpr: p.price || 150000,
                                        askForPrice: !!p.askForPrice,
                                        type: p.type === 'rental' ? 'RENTAL' : p.type === 'used' ? 'CERTIFIED_PRE_OWNED' : p.type === 'spare-part' ? 'SPARE_PART' : 'NEW',
                                        condition: p.condition || 'Brand New',
                                        warrantyPeriod: p.warranty || '2 Years',
                                        primaryImage: p.image,
                                        rentalDailyRateNpr: p.rentalDaily,
                                        rentalMonthlyRateNpr: p.rentalMonthly,
                                        rentalSecurityDepositNpr: p.rentalDeposit,
                                      })
                                      setIsEditorOpen(true)
                                    }}
                                    className={BTN.icon}
                                    title="Edit Product"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-orange" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p)}
                                    className={BTN.icon}
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-error" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PRODUCT INSPECTION / PREVIEW (In-Admin Panel) */}
              {tab === 'products' && previewProduct && (
                <div className="space-y-3">
                  <button onClick={() => setPreviewProduct(null)} className={BTN.secondary}>
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Products List
                  </button>
                  <div className="bg-white rounded border border-border p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-bg-section rounded p-6 flex items-center justify-center border border-border">
                        <img src={previewProduct.image} alt={previewProduct.title} className="max-h-64 object-contain" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] text-info bg-info-bg px-1.5 py-0.5 rounded font-normal">{previewProduct.brand}</span>
                          <h2 className="text-base font-normal text-navy mt-1">{previewProduct.title}</h2>
                          <p className="text-[11px] text-text-muted mt-1">SKU: {previewProduct.sku || `MB-${previewProduct.id}`} • Model: {previewProduct.model || 'Standard OEM'}</p>
                        </div>
                        <div className="text-lg text-navy font-normal">
                          {previewProduct.askForPrice ? 'Request for Quote' : `NPR ${previewProduct.price?.toLocaleString()}`}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-bg-section p-2 rounded border border-border">
                            <span className="text-text-muted block text-[10px]">Category</span>
                            <span className="text-text-dark">{previewProduct.category}</span>
                          </div>
                          <div className="bg-bg-section p-2 rounded border border-border">
                            <span className="text-text-muted block text-[10px]">Condition</span>
                            <span className="text-text-dark">{previewProduct.condition}</span>
                          </div>
                          <div className="bg-bg-section p-2 rounded border border-border">
                            <span className="text-text-muted block text-[10px]">Warranty</span>
                            <span className="text-success">{previewProduct.warranty || '2 Years'}</span>
                          </div>
                          <div className="bg-bg-section p-2 rounded border border-border">
                            <span className="text-text-muted block text-[10px]">Stock Status</span>
                            <span className="text-text-dark">{previewProduct.stockCount || 'In Stock'} units</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => {
                              setEditingProduct({
                                id: previewProduct.id,
                                title: previewProduct.title,
                                brand: previewProduct.brand,
                                category: previewProduct.category,
                                primaryImage: previewProduct.image,
                              })
                              setIsEditorOpen(true)
                              setPreviewProduct(null)
                            }}
                            className={BTN.primary}
                          >
                            <Pencil className="w-3 h-3" /> Edit in Admin
                          </button>
                          <button
                            onClick={() => {
                              navigate('product')
                              localStorage.setItem('mediko_selected_product', JSON.stringify(previewProduct))
                            }}
                            className={BTN.secondary}
                          >
                            <ExternalLink className="w-3 h-3 text-slate-400" /> View Storefront Page
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {tab === 'orders' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Hospital Orders & Management</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Complete order lifecycle with IRD-compliant invoicing</p>
                    </div>
                    <button onClick={() => showToast('Sales book exported.')} className={BTN.secondary}>
                      <Download className="w-3.5 h-3.5 text-orange" /> Export Sales Book
                    </button>
                  </div>
                  <div className="bg-white rounded border border-border overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-bg-section border-b border-border text-text-muted uppercase tracking-wider text-[10px] font-normal">
                          <th className="py-2.5 px-3">Invoice / Order</th>
                          <th className="py-2.5 px-3">Client (Hospital)</th>
                          <th className="py-2.5 px-3">Items</th>
                          <th className="py-2.5 px-3">Total</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {ordersList.map((row) => (
                          <tr key={row.inv} className="hover:bg-bg-section/50 transition">
                            <td className="py-2.5 px-3 font-mono text-navy">
                              <div>{row.inv}</div>
                              <span className="text-[9px] text-text-light">Ref: {row.order} • {row.date}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-text-dark block font-normal">{row.client}</span>
                              <span className="text-[9px] text-text-light">PAN: {row.pan}</span>
                              <span className="text-[9px] text-text-light block">{row.contact}</span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted">
                              <div>{row.items}</div>
                              <span className="text-[9px] text-text-light font-mono block">Logistics: {row.carrierName} ({row.trackingNumber})</span>
                            </td>
                            <td className="py-2.5 px-3 font-normal text-navy">{row.amount}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-normal ${
                                  row.status === 'DELIVERED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : row.status === 'DISPATCHED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : row.status === 'REFUNDED'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() =>
                                    setActiveDetailedOrderPage({
                                      id: row.order,
                                      orderNumber: row.order,
                                      date: row.date,
                                      status: row.status,
                                      paymentMethod: 'Bank Wire / ConnectIPS Nepal',
                                      transactionRef: `TXN-${row.order}`,
                                      customer: {
                                        name: row.contact.split(',')[0],
                                        organization: row.client,
                                        phone: row.contact.split(',')[1]?.trim() || '+977 1-4221119',
                                        email: 'procurement@hospital.gov.np',
                                        address: row.address,
                                        city: 'Kathmandu',
                                        panVatNumber: row.pan,
                                      },
                                      items: row.itemDetails,
                                      subtotalNpr: row.subtotal,
                                      vatNpr: row.vat,
                                      shippingNpr: row.shipping,
                                      totalAmountNpr: row.subtotal + row.vat + row.shipping,
                                      carrierName: row.carrierName,
                                      trackingNumber: row.trackingNumber,
                                    })
                                  }
                                  className={BTN.secondary}
                                  title="View order details and consignment status"
                                >
                                  <Eye className="w-3 h-3 text-sky-500" /> Details
                                </button>
                                <button
                                  onClick={async () => {
                                    await generateTaxInvoicePDF({
                                      invoiceNumber: row.inv,
                                      orderNumber: row.order,
                                      issueDate: row.date,
                                      dueDate: row.date,
                                      buyerName: row.client,
                                      buyerOrg: row.client,
                                      buyerAddress: row.address,
                                      buyerPhone: row.contact,
                                      buyerPan: row.pan,
                                      paymentMethod: 'Bank Transfer',
                                      paymentStatus: 'Paid',
                                      items: [{ sn: 1, description: row.items, qty: 1, rate: row.subtotal, amount: row.subtotal }],
                                      subtotal: row.subtotal,
                                      taxableAmount: row.subtotal,
                                      vatAmount: row.vat,
                                      shippingCharge: row.shipping,
                                      grandTotal: row.subtotal + row.vat + row.shipping,
                                    })
                                    showToast(`Invoice downloaded for ${row.inv}`)
                                  }}
                                  className={BTN.primary}
                                >
                                  <Download className="w-3 h-3" /> Invoice
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* INVOICES */}
              {tab === 'invoices' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Invoice Management</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Auto-calculated IRD tax invoices and transaction records</p>
                    </div>
                    <button onClick={() => showToast('All invoices exported.')} className={BTN.secondary}>
                      <Download className="w-3.5 h-3.5 text-info" /> Export All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Total Invoiced', value: 'NPR 5.2M', icon: Receipt, iconColor: 'text-success', iconBg: 'bg-success-bg' },
                      { label: 'Pending Payment', value: 'NPR 820K', icon: Clock3, iconColor: 'text-warning', iconBg: 'bg-warning-bg' },
                      { label: 'This Month', value: '18 Invoices', icon: Calendar, iconColor: 'text-info', iconBg: 'bg-info-bg' },
                    ].map((m, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-border flex items-center gap-3">
                        <span className={`p-2 rounded ${m.iconBg}`}><m.icon className={`w-4 h-4 ${m.iconColor}`} /></span>
                        <div>
                          <span className="text-[10px] text-text-muted block">{m.label}</span>
                          <span className="text-sm font-normal text-navy">{m.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded border border-border overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-bg-section border-b border-border text-text-muted uppercase tracking-wider text-[10px] font-normal">
                          <th className="py-2.5 px-3">Invoice #</th>
                          <th className="py-2.5 px-3">Client</th>
                          <th className="py-2.5 px-3">Taxable & VAT</th>
                          <th className="py-2.5 px-3">Total Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {[
                          { inv: 'MB-INV-2026-1048', client: 'Bir Hospital (ICU Ward)', subtotal: 285000, vat: 37050, total: 324550, date: '08 Sep 2026', status: 'Paid' },
                          { inv: 'MB-INV-2026-1049', client: 'Patan Hospital (Pulmonology)', subtotal: 90000, vat: 11700, total: 101700, date: '06 Sep 2026', status: 'Pending' },
                          { inv: 'MB-INV-2026-1050', client: 'Grande International Hospital', subtotal: 96000, vat: 12480, total: 108480, date: '04 Sep 2026', status: 'Overdue' },
                        ].map((row) => (
                          <tr key={row.inv} className="hover:bg-bg-section/50 transition">
                            <td className="py-2.5 px-3 font-mono text-navy">{row.inv}</td>
                            <td className="py-2.5 px-3 text-text-body">{row.client}</td>
                            <td className="py-2.5 px-3 text-text-muted">
                              <span>NPR {row.subtotal.toLocaleString()}</span>
                              <span className="text-[9px] text-text-light block">+ VAT: NPR {row.vat.toLocaleString()}</span>
                            </td>
                            <td className="py-2.5 px-3 font-normal text-navy">NPR {row.total.toLocaleString()}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] ${row.status === 'Paid' ? 'bg-success-bg text-success' : row.status === 'Pending' ? 'bg-warning-bg text-amber-700' : 'bg-error-bg text-error'}`}>{row.status}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={async () => {
                                  await generateTaxInvoicePDF({
                                    invoiceNumber: row.inv,
                                    issueDate: row.date,
                                    buyerName: row.client,
                                    buyerOrg: row.client,
                                    paymentMethod: 'Bank Wire',
                                    paymentStatus: row.status,
                                    items: [{ sn: 1, description: 'Medical Equipment & Supplies', qty: 1, rate: row.subtotal, amount: row.subtotal }],
                                    subtotal: row.subtotal,
                                    taxableAmount: row.subtotal,
                                    vatAmount: row.vat,
                                    grandTotal: row.total,
                                  })
                                  showToast(`Invoice downloaded for ${row.inv}`)
                                }}
                                className={BTN.primary}
                              >
                                <Download className="w-3 h-3" /> Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* RENTALS & PENALTY SYSTEM */}
              {tab === 'rentals' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Medical Equipment Rental & Penalty System</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Security deposit escrow, automated daily penalty calculation, and return settlements</p>
                    </div>
                    <span className="text-[11px] text-text-body bg-bg-section px-2.5 py-1 rounded border border-border">
                      Escrow Held: <span className="text-success font-normal">NPR 145,000</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {rentalsList.map((rent) => (
                      <div key={rent.id} className="bg-white p-4 rounded border border-border space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                          <span className="text-[11px] font-mono text-orange">{rent.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${rent.status === 'Overdue' ? 'bg-error-bg text-error' : rent.penaltyApplied ? 'bg-purple-bg text-purple' : 'bg-success-bg text-success'}`}>{rent.status}</span>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-normal text-navy m-0">{rent.item}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5">{rent.client}</p>
                          <p className="text-[9px] text-text-light">{rent.contact}</p>
                        </div>
                        <div className="space-y-1 text-[10px] text-text-body bg-bg-section p-2.5 rounded border border-border">
                          <div>Period: <span className="text-text-dark">{rent.period}</span></div>
                          <div>Rate: <span className="text-text-dark">{rent.rent}</span></div>
                          <div>Deposit Held: <span className="text-success">{rent.deposit} (Escrow)</span></div>
                          <div className={rent.overdueDays > 0 ? 'text-error font-medium' : 'text-text-muted'}>
                            Penalty: NPR {rent.penaltyDaily}/day
                            {rent.overdueDays > 0 && <span> • {rent.overdueDays} days = NPR {(rent.overdueDays * rent.penaltyDaily).toLocaleString()}</span>}
                            {rent.penaltyApplied && <span className="text-purple block mt-0.5">✓ Penalty Locked & Deducted from Escrow</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={async () => {
                              await generateRentalSettlementPDF({
                                settlementNumber: `SET-${rent.id}`,
                                bookingNumber: rent.id,
                                customerName: rent.client,
                                customerOrg: rent.client,
                                productTitle: rent.item,
                                startDate: rent.period.split('–')[0].trim(),
                                scheduledEndDate: rent.period.split('–')[1]?.trim() || '30 Days',
                                actualReturnDate: '13 Oct 2026',
                                overdueDays: rent.overdueDays,
                                dailyRate: rent.penaltyDaily,
                                totalRentPaid: 18000,
                                securityDepositHeld: 25000,
                                overduePenaltyDaily: rent.penaltyDaily,
                                totalOverduePenalty: rent.overdueDays * rent.penaltyDaily,
                                damageAssessmentFee: 0,
                                damageReportNote: 'Clinical biomedical check passed. Sensor leads in good condition.',
                                netRefundPayable: 25000 - (rent.overdueDays * rent.penaltyDaily),
                                settlementStatus: rent.overdueDays > 0 ? 'Penalty Deducted' : 'Full Deposit Refund Approved',
                              })
                              showToast(`Settlement PDF generated for ${rent.id}`)
                            }}
                            className={`flex-1 ${BTN.secondary}`}
                          >
                            <Download className="w-3 h-3 text-emerald-600" /> Settlement PDF
                          </button>
                          {rent.overdueDays > 0 && !rent.penaltyApplied && (
                            <button
                              onClick={() => {
                                const penaltyTotal = rent.overdueDays * rent.penaltyDaily
                                setRentalsList(rentalsList.map((r) => r.id === rent.id ? { ...r, penaltyApplied: true, status: 'Penalty Deducted from Escrow' } : r))
                                showToast(`Penalty of NPR ${penaltyTotal.toLocaleString()} debited against escrow for ${rent.id}.`)
                              }}
                              className={BTN.danger}
                            >
                              <AlertTriangle className="w-3 h-3" /> Apply Penalty
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOMERS (With Deep Bir Hospital Dossier Profile) */}
              {tab === 'customers' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Institutional Customers & Hospital Accounts</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Government hospitals, private healthcare groups, and NGO procurement profiles</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAddCustomerOpen(true)}
                        className={BTN.primary}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Customer
                      </button>
                      <button
                        onClick={async () => {
                          const bir = customersList.find((c) => c.id === 'CUST-001') || customersList[0]
                          await generateCustomerDossierPDF({
                            customerName: bir.name,
                            customerOrg: bir.affiliation,
                            customerPan: bir.pan,
                            customerDda: bir.dda,
                            contactPerson: bir.person,
                            contactPhone: bir.phone,
                            contactEmail: bir.email,
                            address: bir.address,
                            bedCapacity: bir.bedCapacity,
                            creditLimit: bir.creditLimit,
                            orders: bir.orders,
                            totalSpent: bir.totalSpent,
                            activeRentalsCount: bir.activeRentalsCount,
                            quotationsCount: bir.quotationsCount,
                          })
                          showToast('Bir Hospital Dossier PDF downloaded.')
                        }}
                        className={BTN.orange}
                      >
                        <Download className="w-3.5 h-3.5" /> Bir Hospital Dossier
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded border border-border overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-bg-section border-b border-border text-text-muted uppercase tracking-wider text-[10px] font-normal">
                          <th className="py-2.5 px-3">Institution / Customer</th>
                          <th className="py-2.5 px-3">Procurement Officer</th>
                          <th className="py-2.5 px-3">PAN & DDA Reg</th>
                          <th className="py-2.5 px-3">Total Orders</th>
                          <th className="py-2.5 px-3">Lifetime Volume</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {customersList.map((c) => (
                          <tr key={c.name} className="hover:bg-bg-section/50 transition">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-info shrink-0" />
                                <div>
                                  <span className="text-text-dark block font-normal">{c.name}</span>
                                  <span className="text-[9px] text-text-light">{c.affiliation}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-text-dark block font-normal">{c.person}</span>
                              <span className="text-[9px] text-text-light block">{c.role}</span>
                              <span className="text-[9px] text-text-light block">{c.phone}</span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-text-muted">
                              <div>{c.pan}</div>
                              <span className="text-[9px] text-text-light block">{c.dda}</span>
                            </td>
                            <td className="py-2.5 px-3 text-navy">{c.orders.length} Orders</td>
                            <td className="py-2.5 px-3 font-normal text-navy">{c.totalSpent}</td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedCustomerForModal(c)}
                                  className={BTN.secondary}
                                >
                                  <Eye className="w-3 h-3 text-info" /> Profile & Dossier
                                </button>
                                <button
                                  onClick={async () => {
                                    await generateCustomerDossierPDF({
                                      customerName: c.name,
                                      customerOrg: c.affiliation,
                                      customerPan: c.pan,
                                      customerDda: c.dda,
                                      contactPerson: c.person,
                                      contactPhone: c.phone,
                                      contactEmail: c.email,
                                      address: c.address,
                                      bedCapacity: c.bedCapacity,
                                      creditLimit: c.creditLimit,
                                      orders: c.orders,
                                      totalSpent: c.totalSpent,
                                      activeRentalsCount: c.activeRentalsCount,
                                      quotationsCount: c.quotationsCount,
                                    })
                                    showToast(`Dossier PDF downloaded for ${c.name}`)
                                  }}
                                  className={BTN.primary}
                                  title="Download Official Statement & Dossier PDF"
                                >
                                  <Download className="w-3 h-3" /> PDF
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CATEGORIES with Parenting & Kanban UI */}
              {tab === 'categories' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Medical Categories & DDA Risk Classification</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Hierarchical category parenting and regulatory risk mapping</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 bg-bg-section p-0.5 rounded text-[10px]">
                        <button
                          onClick={() => setCategoryView('grid')}
                          className={`px-2 py-1 rounded cursor-pointer transition font-normal ${categoryView === 'grid' ? 'bg-white shadow-xs text-navy' : 'text-text-muted'}`}
                        >
                          Tree View
                        </button>
                        <button
                          onClick={() => setCategoryView('kanban')}
                          className={`px-2 py-1 rounded cursor-pointer transition font-normal ${categoryView === 'kanban' ? 'bg-white shadow-xs text-navy' : 'text-text-muted'}`}
                        >
                          DDA Kanban
                        </button>
                      </div>
                      <button
                        onClick={() => { setBrandCategoryMode('category'); setBrandCategoryModalOpen(true) }}
                        className={BTN.primary}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Category
                      </button>
                    </div>
                  </div>

                  {categoryView === 'grid' ? (
                    <div className="space-y-3">
                      {rootCategories.map((c) => {
                        const children = getChildren(c.id)
                        return (
                          <div key={c.id} className="bg-white rounded border border-border">
                            <div className="p-3 flex items-center justify-between border-b border-border">
                              <div className="flex items-center gap-2">
                                <FolderTree className="w-3.5 h-3.5 text-info" />
                                <div>
                                  <h4 className="text-[11px] font-normal text-navy m-0">{c.name}</h4>
                                  <span className="text-[9px] text-text-muted">{c.department} • {c.productCount} products</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[8px] px-1.5 py-0.5 rounded ${c.ddaClassification.includes('Class D') ? 'bg-error-bg text-error' : c.ddaClassification.includes('Class C') ? 'bg-warning-bg text-amber-700' : 'bg-info-bg text-info'}`}>
                                  {c.ddaClassification}
                                </span>
                                <button
                                  onClick={() => { setProductSearch(c.name); setTab('products') }}
                                  className={BTN.ghost}
                                >
                                  View Products
                                </button>
                              </div>
                            </div>
                            {children.length > 0 && (
                              <div className="px-3 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-bg-section/30">
                                {children.map((child) => (
                                  <div key={child.id} className="flex items-center gap-2 p-2 bg-white rounded border border-border/50 text-[10px]">
                                    <GitBranch className="w-3 h-3 text-text-light" />
                                    <div>
                                      <span className="text-text-dark block font-normal">{child.name}</span>
                                      <span className="text-text-light text-[9px]">{child.productCount} items</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    /* Kanban View */
                    <div className="flex gap-3 overflow-x-auto pb-4">
                      {['Class A (Low Risk)', 'Class B (Low-Med)', 'Class C (Med-High)', 'Class D (High Risk)'].map((cls) => {
                        const items = categories.filter((c) => c.ddaClassification === cls)
                        const color = cls.includes('Class D') ? 'border-error/30 bg-error-bg/30' : cls.includes('Class C') ? 'border-warning/30 bg-warning-bg/30' : cls.includes('Class B') ? 'border-info/30 bg-info-bg/30' : 'border-success/30 bg-success-bg/30'
                        return (
                          <div key={cls} className={`min-w-[240px] flex-1 rounded border ${color} p-3`}>
                            <h4 className="text-[10px] font-normal text-text-dark mb-2 uppercase tracking-wider">{cls}</h4>
                            <div className="space-y-2">
                              {items.map((cat) => (
                                <div key={cat.id} className="bg-white p-2.5 rounded border border-border shadow-xs text-[11px]">
                                  <div className="flex items-center gap-1.5">
                                    <GripVertical className="w-3 h-3 text-text-light" />
                                    <span className="text-text-dark font-normal">{cat.name}</span>
                                  </div>
                                  <div className="text-[9px] text-text-muted mt-1 pl-4">{cat.department} • {cat.productCount} items</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* BRANDS */}
              {tab === 'brands' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Authorized Medical Manufacturers & Brands</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">OEM verification, sole distributor agreements, and certificate records</p>
                    </div>
                    <button onClick={() => { setBrandCategoryMode('brand'); setBrandCategoryModalOpen(true) }} className={BTN.primary}>
                      <Plus className="w-3.5 h-3.5" /> Add Brand
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {brands.map((b) => (
                      <div key={b.id} className="bg-white p-3.5 rounded border border-border space-y-2 hover:border-navy/30 transition">
                        <div className="flex items-center justify-between">
                          <img src={b.logoUrl} alt={b.name} className="w-8 h-8 rounded object-cover border border-border" />
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-success-bg text-success">Authorized</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-normal text-navy m-0">{b.name}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5 line-clamp-2">{b.distributorName}</p>
                        </div>
                        <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
                          <span className="text-text-muted">{b.productCount || 10}+ items</span>
                          <button onClick={() => { setProductSearch(b.name); setTab('products') }} className="text-orange hover:underline flex items-center gap-0.5">
                            View <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QUOTATIONS */}
              {tab === 'quotations' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Enterprise B2B Quotation Desk</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Institutional hospital tenders, landed cost assessments, and IRD-ready proformas</p>
                    </div>
                    <button onClick={() => setIsQuotationStudioOpen(true)} className={BTN.orange}>
                      <Plus className="w-3.5 h-3.5" /> Create New Quotation
                    </button>
                  </div>
                  <div className="bg-white rounded border border-border overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-bg-section border-b border-border text-text-muted uppercase tracking-wider text-[10px] font-normal">
                          <th className="py-2.5 px-3">Quote Ref</th>
                          <th className="py-2.5 px-3">Hospital / Buyer</th>
                          <th className="py-2.5 px-3">Equipment</th>
                          <th className="py-2.5 px-3">Total</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">PDF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {quotationList.map((q) => (
                          <tr key={q.ref} className="hover:bg-bg-section/50 transition">
                            <td className="py-2.5 px-3 font-mono text-navy">
                              <div>{q.ref}</div>
                              <span className="text-[9px] text-text-light">{q.date}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-text-dark block font-normal">{q.client}</span>
                              <span className="text-[9px] text-text-light">PAN: {q.pan}</span>
                            </td>
                            <td className="py-2.5 px-3 text-text-muted max-w-[200px] truncate">{q.items}</td>
                            <td className="py-2.5 px-3 font-normal text-navy">{q.amount}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-info-bg text-info">{q.status}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={async () => {
                                    await generateQuotationPDF({
                                      quoteNumber: q.ref,
                                      issueDate: q.date,
                                      validUntil: q.valid.replace('Valid till ', ''),
                                      customerName: q.client,
                                      customerOrg: q.client,
                                      customerPan: q.pan,
                                      deliveryLocation: 'Kathmandu, Nepal',
                                      items: [{ description: q.items, qty: 1, unitPrice: q.subtotal, total: q.subtotal }],
                                      subtotal: q.subtotal,
                                      vatAmount: q.vatAmount,
                                      grandTotal: q.subtotal + q.vatAmount,
                                    })
                                    showToast(`Quotation PDF downloaded for ${q.ref}`)
                                  }}
                                  className={BTN.primary}
                                >
                                  <Download className="w-3 h-3" /> Quote
                                </button>
                                <button
                                  onClick={async () => {
                                    await generateProformaInvoicePDF({
                                      proformaNumber: q.ref.replace('MB-QT', 'MB-PI'),
                                      issueDate: q.date,
                                      dueDate: q.valid.replace('Valid till ', ''),
                                      vendorBuyer: q.client,
                                      vendorPan: q.pan,
                                      targetHospital: q.client,
                                      manufacturer: 'Authorized OEM',
                                      originCountry: 'International',
                                      portDestination: 'Tribhuvan International Airport Cargo',
                                      items: [{ description: q.items, qty: 1, unitPrice: q.subtotal, total: q.subtotal }],
                                      baseEquipmentNpr: q.subtotal,
                                      internationalFreightNpr: 35000,
                                      clearingAgentChargesNpr: 15000,
                                      adminCommissionNpr: 25000,
                                      customsDutyVatNpr: q.vatAmount,
                                      totalPayableNpr: q.subtotal + q.vatAmount,
                                      bankBeneficiary: 'Mediko Bazaar Pvt. Ltd.',
                                      bankAccountNumber: '0100017502910',
                                      bankName: 'Nabil Bank Ltd.',
                                      swiftCode: 'NABILNPKT',
                                      paymentTerms: '100% Advance Wire / LC',
                                    })
                                    showToast(`Proforma Invoice downloaded for ${q.ref}`)
                                  }}
                                  className={BTN.secondary}
                                >
                                  PI
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* LANDING COST & TRADING CALCULATIONS */}
              {tab === 'landing-cost' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Medical Import Landed Cost & Customs Engine</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Automated HS Code duties, bank LC margins, clearing agent fees, and IRD VAT</p>
                    </div>
                    <button onClick={() => setLandingCostModalOpen(true)} className={BTN.orange}>
                      <Calculator className="w-3.5 h-3.5" /> Launch Full Calculator
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border border-border space-y-3">
                      <h4 className="text-xs font-normal text-navy m-0">Nepal Medical Customs Duty Matrix</h4>
                      <div className="space-y-2 text-[11px]">
                        {[
                          { hs: '9018.19 (Diagnostic Monitors)', duty: '1% Concessional', vat: '13% IRD VAT' },
                          { hs: '9019.20 (Oxygen Therapy & Ventilators)', duty: '0% Exemption', vat: '13% IRD VAT' },
                          { hs: '9022.14 (X-Ray & Radiology Scan)', duty: '5% Standard', vat: '13% IRD VAT' },
                          { hs: '9402.90 (Hospital Beds & Furniture)', duty: '10% Basic Duty', vat: '13% IRD VAT' },
                        ].map((item, idx) => (
                          <div key={idx} className="p-2 bg-bg-section rounded border border-border/50">
                            <span className="text-text-dark block font-normal">{item.hs}</span>
                            <span className="text-text-muted text-[10px]">{item.duty} • {item.vat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-2 bg-white p-4 rounded border border-border space-y-3">
                      <h4 className="text-xs font-normal text-navy m-0">Sample Landed Calculation: ICU Ventilator</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2.5 bg-bg-section rounded border border-border">
                          <span className="text-text-muted block text-[10px]">FOB Price (USD)</span>
                          <span className="text-navy font-normal">$6,500</span>
                        </div>
                        <div className="p-2.5 bg-bg-section rounded border border-border">
                          <span className="text-text-muted block text-[10px]">CIF Kathmandu (NPR)</span>
                          <span className="text-navy font-normal">NPR 890,500</span>
                        </div>
                        <div className="p-2.5 bg-bg-section rounded border border-border">
                          <span className="text-text-muted block text-[10px]">Customs + Tax</span>
                          <span className="text-warning font-normal">NPR 115,765</span>
                        </div>
                      </div>
                      <button onClick={() => setLandingCostModalOpen(true)} className={BTN.primary}>
                        Open Calculation Studio
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE & ENGINEERS */}
              {tab === 'service-jobs' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Biomedical Engineers & Service Tickets</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Equipment installation, calibration, breakdown response, and hospital AMCs</p>
                    </div>
                    <button onClick={() => setIsAddTicketOpen(true)} className={BTN.primary}>
                      <Plus className="w-3.5 h-3.5" /> Create Ticket
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {serviceTicketsList.map((job) => (
                      <div key={job.id} className="bg-white p-4 rounded border border-border space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-border">
                          <span className="text-[10px] font-mono text-info">{job.id}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-normal ${
                              job.status === 'Resolved' || job.status === 'Calibration Passed'
                                ? 'bg-success-bg text-success'
                                : job.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-info-bg text-info'
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-normal text-navy m-0">{job.equip}</h4>
                        <p className="text-[10px] text-text-muted">{job.client}</p>
                        <p className="text-[9px] text-text-light">Assigned: {job.eng} • {job.task}</p>
                        <button onClick={() => setSelectedTicketForModal(job)} className={`${BTN.secondary} w-full justify-center mt-2`}>
                          <Eye className="w-3 h-3 text-sky-500" /> View Service Log
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VENDOR KYC & APPROVALS */}
              {tab === 'vendor-kyc' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Vendor & Seller KYC Verification</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Government registration, DDA license, tax clearance, and bank audit</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-warning-bg text-amber-700">
                      {vendorKycList.filter((v) => v.status === 'Pending Verification').length} Pending Review
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vendorKycList.map((v) => (
                      <div key={v.id} className="bg-white p-4 rounded border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-normal text-navy m-0">{v.name}</h4>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded ${
                              v.status.includes('Verified')
                                ? 'bg-success-bg text-success'
                                : v.status.includes('Clarification')
                                ? 'bg-error-bg text-error'
                                : 'bg-warning-bg text-amber-700'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>
                        <div className="text-[10px] space-y-1 text-text-muted">
                          <div>PAN / VAT: <span className="text-text-dark font-mono">{v.pan}</span></div>
                          <div>DDA License: <span className="text-text-dark">{v.dda}</span></div>
                          <div>Address: <span className="text-text-dark">{v.city}</span></div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() =>
                              setSelectedVendorKyc({
                                id: v.id,
                                companyName: v.name,
                                registrationNumber: 'REG-98124/078',
                                panVatNumber: v.pan,
                                city: v.city,
                                address: v.city,
                                contactPerson: v.rep,
                                email: 'vendor@meditech.com.np',
                                phone: '+977 985-1122334',
                                bankDetails: {
                                  accountName: v.name,
                                  accountNumber: '02810012398102',
                                  bankName: 'Nabil Bank Ltd.',
                                  branch: 'New Baneshwar',
                                },
                                kycStatus: 'PENDING',
                                documents: [
                                  {
                                    id: 'doc-1',
                                    title: 'Company Registration Certificate',
                                    code: 'COMPANY_REG',
                                    status: 'VERIFIED',
                                    fileName: 'company_reg_meditech.pdf',
                                  },
                                  {
                                    id: 'doc-2',
                                    title: 'PAN / VAT IRD Registration',
                                    code: 'PAN_VAT',
                                    status: 'VERIFIED',
                                    fileName: 'pan_certificate_602189.pdf',
                                  },
                                  {
                                    id: 'doc-3',
                                    title: 'DDA Medical Device Importer License',
                                    code: 'DDA_LICENSE',
                                    status: 'PENDING_REVIEW',
                                    fileName: 'dda_device_license.pdf',
                                  },
                                  {
                                    id: 'doc-4',
                                    title: 'Tax Clearance Certificate (Last FY)',
                                    code: 'TAX_CLEARANCE',
                                    status: 'VERIFIED',
                                    fileName: 'tax_clearance_fy8081.pdf',
                                  },
                                ],
                              })
                            }
                            className={BTN.primary}
                          >
                            Review KYC Dossier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SELLERS */}
              {tab === 'sellers' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Seller Marketplace Management</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Dealer network, commission rates, and performance ratings</p>
                    </div>
                    <button onClick={() => setIsAddSellerOpen(true)} className={BTN.primary}>
                      <Plus className="w-3.5 h-3.5" /> Invite Seller
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {sellersList.map((s) => (
                      <div key={s.name} className="bg-white p-4 rounded border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-normal text-navy m-0">{s.name}</h4>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-normal ${
                              s.status === 'Verified' ? 'bg-success-bg text-success' : 'bg-warning-bg text-amber-700'
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-muted">{s.type} • {s.city}</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-bg-section p-2 rounded border border-border/50">
                          <div>Listings: <span className="text-navy">{s.listings} items</span></div>
                          <div>Commission: <span className="text-orange">{s.comm}</span></div>
                          <div>Revenue: <span className="text-navy">{s.revenue}</span></div>
                          <div>Rating: <span className="text-amber-600">★ {s.rating}</span></div>
                        </div>
                        <button onClick={() => setSelectedSellerForModal(s)} className={`${BTN.secondary} w-full justify-center`}>
                          <Eye className="w-3 h-3 text-sky-500" /> Seller Profile
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADMIN USERS */}
              {tab === 'admin-users' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Administrator Accounts & Access Control</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Role-based privileges, security logs, and 2FA credentials</p>
                    </div>
                    <button onClick={() => setIsAddAdminOpen(true)} className={BTN.primary}>
                      <Plus className="w-3.5 h-3.5" /> Add Administrator
                    </button>
                  </div>
                  <div className="bg-white rounded border border-border overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-bg-section border-b border-border text-text-muted uppercase tracking-wider text-[10px] font-normal">
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Role</th>
                          <th className="py-2.5 px-3">Email</th>
                          <th className="py-2.5 px-3">Permissions</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {adminUsersList.map((u) => (
                          <tr key={u.email} className="hover:bg-bg-section/50 transition">
                            <td className="py-2.5 px-3 font-normal text-navy">{u.name}</td>
                            <td className="py-2.5 px-3 text-text-body">{u.role}</td>
                            <td className="py-2.5 px-3 text-text-muted">{u.email}</td>
                            <td className="py-2.5 px-3 text-text-dark">{u.perm}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-success-bg text-success">{u.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* APPROVALS */}
              {tab === 'approvals' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">Vendor Listing Approvals</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Validate listings before they appear on the public storefront</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-warning-bg text-amber-700">
                      {approvalsList.length} Submissions Pending
                    </span>
                  </div>
                  {approvalsList.length === 0 ? (
                    <div className="bg-white p-8 rounded border border-border text-center text-xs text-text-muted space-y-1">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                      <p className="font-normal text-navy m-0">All Vendor Listings Verified</p>
                      <p className="text-[10px] text-text-light m-0">No pending vendor submissions in moderation queue.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {approvalsList.map((app) => (
                        <div key={app.id} className="bg-white p-3.5 rounded border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={app.img} alt={app.title} className="w-12 h-12 rounded object-cover border border-border shrink-0" />
                            <div>
                              <span className="text-[9px] font-mono text-text-light">{app.id}</span>
                              <h4 className="text-[11px] font-normal text-navy m-0">{app.title}</h4>
                              <p className="text-[10px] text-text-muted mt-0.5">{app.seller} • {app.type} • {app.priceFormatted}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                const newProd: Product = {
                                  id: Date.now(),
                                  title: app.title,
                                  brand: app.brand,
                                  category: app.category,
                                  price: app.price,
                                  image: app.img,
                                  seller: app.seller,
                                  sellerVerified: true,
                                  askForPrice: false,
                                  currency: 'NPR',
                                  type: app.type.toLowerCase().includes('pre-owned') ? 'used' : 'new',
                                  condition: app.type.toLowerCase().includes('pre-owned') ? 'Refurbished' : 'New',
                                  inStock: true,
                                  rating: 4.8,
                                  reviews: 1,
                                  sku: `MB-${app.id}`,
                                  warranty: '1 Year Full BMET Warranty',
                                }
                                const updated = [newProd, ...productList]
                                setProductList(updated)
                                syncLiveProducts(updated)
                                setApprovalsList(approvalsList.filter((a) => a.id !== app.id))
                                showToast(`Listing ${app.id} approved and published live to website catalog!`)
                              }}
                              className={BTN.primary}
                            >
                              Approve &amp; Publish
                            </button>
                            <button
                              onClick={() => {
                                setApprovalsList(approvalsList.filter((a) => a.id !== app.id))
                                showToast(`Listing ${app.id} rejected.`)
                              }}
                              className={BTN.danger}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* USED VERIFICATION */}
              {tab === 'used-verification' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-navy m-0">48-Point Biomedical Verification</h3>
                      <p className="text-[10px] text-text-muted mt-0.5">Safety, calibration, and electrical leakage inspection</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-success-bg text-success">Certified BMET Protocol</span>
                  </div>
                  <div className="space-y-3">
                    {usedInspectionList.map((insp) => (
                      <div key={insp.id} className="bg-white p-4 rounded border border-border space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                          <span className="text-[11px] font-mono text-orange">{insp.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${insp.certified ? 'bg-success-bg text-success' : 'bg-warning-bg text-amber-700'}`}>
                            {insp.certified ? 'Certified (Pass 48/48)' : 'Pending Calibration Audit'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-normal text-navy m-0">Inspection: {insp.equip}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5">Serial: {insp.serial} • Facility: {insp.hospital} • Seller: {insp.seller}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] bg-bg-section p-3 rounded border border-border/50">
                          <div>✔ 1. Mains Electrical Leakage (&lt;100µA)</div>
                          <div>✔ 2. Ground Resistance (&lt;0.2Ω IEC-60601)</div>
                          <div>✔ 3. Oxygen Flow Sensor Calibration (21-100%)</div>
                          <div>✔ 4. Battery Backup Load Testing (180 mins)</div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={async () => {
                              await generateBiomedicalCertificatePDF({
                                certificateNumber: insp.id,
                                equipmentName: insp.equip,
                                serialNumber: insp.serial,
                                clientHospital: insp.hospital,
                                inspectorName: 'Er. Ramesh Bhattarai (Senior BMET)',
                                inspectionDate: new Date().toLocaleDateString('en-GB'),
                                tests: [
                                  { test: 'Chassis Electrical Leakage Current', standard: 'IEC-60601-1 (<100µA)', result: '38 µA', status: 'PASSED' },
                                  { test: 'Protective Earth Resistance', standard: 'IEC-60601-1 (<0.200 Ω)', result: '0.082 Ω', status: 'PASSED' },
                                  { test: 'Flow Transducer Linearity & Span', standard: 'O2 Sensor Calibration +/- 2%', result: '99.4% SpO2 Span', status: 'PASSED' },
                                  { test: 'High Pressure Relief Valve Cutoff', standard: 'Barometric Limit (<80 mbar)', result: 'Triggered at 78 mbar', status: 'PASSED' },
                                  { test: 'Battery Discharge Stress Test', standard: 'Run time > 120 mins', result: '194 mins continuous', status: 'PASSED' },
                                ],
                              })
                              setUsedInspectionList(usedInspectionList.map(u => u.id === insp.id ? { ...u, certified: true, status: 'Certified & Certificate Issued' } : u))
                              showToast(`Biomedical calibration certificate generated for ${insp.id}`)
                            }}
                            className={BTN.primary}
                          >
                            <Download className="w-3.5 h-3.5 text-teal-300" />
                            {insp.certified ? 'Re-Download Certificate PDF' : 'Issue Calibration Certificate PDF'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {tab === 'settings' && (
                <div className="space-y-3 max-w-4xl">
                  <div className="flex items-center gap-1 bg-bg-section p-0.5 rounded text-[11px] w-fit">
                    {[
                      { key: 'company', label: 'Company', icon: Building2, color: 'text-purple-500' },
                      { key: 'vendor', label: 'Vendor Defaults', icon: Store, color: 'text-emerald-500' },
                      { key: 'payment', label: 'Payment & Tax', icon: CreditCard, color: 'text-amber-500' },
                      { key: 'invoice', label: 'Invoice Config', icon: Receipt, color: 'text-teal-500' },
                      { key: 'profile', label: 'Profile & Password', icon: UserRound, color: 'text-sky-500' },
                    ].map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setSettingsTab(t.key as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer transition font-normal ${
                          settingsTab === t.key
                            ? 'bg-white text-navy shadow-xs border border-border'
                            : 'text-text-muted hover:text-text-dark'
                        }`}
                      >
                        <t.icon className={`w-3.5 h-3.5 shrink-0 ${t.color}`} />
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {settingsTab === 'company' && (
                    <div className="bg-white p-5 rounded border border-border space-y-4">
                      <h3 className="text-xs font-normal text-navy m-0">Company Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        {[
                          { label: 'Company Name', value: 'Mediko Bazaar Pvt. Ltd.' },
                          { label: 'Registration Number', value: '123456/077/078' },
                          { label: 'PAN / VAT Number', value: '600123456' },
                          { label: 'DDA Registration', value: 'DDA-MED-077/078-412' },
                          { label: 'Address', value: 'New Baneshwar-31, Kathmandu, Nepal' },
                          { label: 'Phone', value: '+977 985-1117186' },
                          { label: 'Email', value: 'info@medikobazaar.com' },
                          { label: 'Website', value: 'www.medikobazaar.com' },
                        ].map((f) => (
                          <div key={f.label}>
                            <label className="text-text-muted block mb-1">{f.label}</label>
                            <input type="text" defaultValue={f.value} className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <img src={BRAND.logo} alt="Logo" className="h-8 w-8 rounded border border-border p-0.5 object-contain" />
                          <button className={BTN.ghost}><Upload className="w-3.5 h-3.5" /> Change Logo</button>
                        </div>
                        <button onClick={() => showToast('Company settings saved.')} className={BTN.orange}>
                          <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'vendor' && (
                    <div className="bg-white p-5 rounded border border-border space-y-4">
                      <h3 className="text-xs font-normal text-navy m-0">Vendor Default Settings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        {[
                          { label: 'Default Commission Rate', value: '10%' },
                          { label: 'KYC Required Documents', value: '5 (Reg, PAN, DDA, Tax, Bank)' },
                          { label: 'Listing Approval Required', value: 'Yes (Manual Admin Review)' },
                          { label: 'Max Products Per Vendor', value: '100' },
                          { label: 'Settlement Period', value: '15 Days After Delivery' },
                          { label: 'Return Window', value: '7 Days' },
                        ].map((f) => (
                          <div key={f.label}>
                            <label className="text-text-muted block mb-1">{f.label}</label>
                            <input type="text" defaultValue={f.value} className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-border text-right">
                        <button onClick={() => showToast('Vendor settings saved.')} className={BTN.orange}>
                          <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'payment' && (
                    <div className="bg-white p-5 rounded border border-border space-y-4">
                      <h3 className="text-xs font-normal text-navy m-0">Payment Gateway & Nepal Tax Settings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        {[
                          { label: 'Nepal Tax Rate (VAT)', value: '13%', disabled: true },
                          { label: 'Default Currency', value: 'NPR (Nepalese Rupee)', disabled: true },
                          { label: 'Free Delivery Threshold', value: 'NPR 50,000 (Kathmandu Valley)' },
                          { label: 'Rental Escrow Policy', value: 'Refundable within 48h of return inspection' },
                        ].map((f) => (
                          <div key={f.label}>
                            <label className="text-text-muted block mb-1">{f.label}</label>
                            <input type="text" defaultValue={f.value} disabled={f.disabled} className={`w-full px-2.5 py-1.5 border border-border rounded outline-none text-text-dark font-normal ${f.disabled ? 'bg-bg-section' : 'bg-white focus:border-navy'}`} />
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Supported Gateways: <span className="text-text-dark">eSewa • Khalti • Fonepay • Nabil Bank Swift</span>
                      </div>
                      <div className="pt-3 border-t border-border text-right">
                        <button onClick={() => showToast('Payment settings saved.')} className={BTN.orange}>
                          <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'invoice' && (
                    <div className="bg-white p-5 rounded border border-border space-y-4">
                      <h3 className="text-xs font-normal text-navy m-0">Invoice Configuration</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        {[
                          { label: 'Invoice Prefix', value: 'MB-INV' },
                          { label: 'Quotation Prefix', value: 'MB-QT' },
                          { label: 'Proforma Prefix', value: 'MB-PI' },
                          { label: 'Auto Number Sequence', value: 'Year-Sequential (2026-XXXX)' },
                          { label: 'Default Payment Terms', value: 'Net 30 Days' },
                          { label: 'Footer Note', value: 'Official Mediko Bazaar Document under VAT Act 2052' },
                        ].map((f) => (
                          <div key={f.label}>
                            <label className="text-text-muted block mb-1">{f.label}</label>
                            <input type="text" defaultValue={f.value} className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-border text-right">
                        <button onClick={() => showToast('Invoice settings saved.')} className={BTN.orange}>
                          <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'profile' && (
                    <div className="bg-white p-5 rounded border border-border space-y-5">
                      <div>
                        <h3 className="text-xs font-normal text-navy m-0">Super Admin Profile & Password Management</h3>
                        <p className="text-[10px] text-text-muted mt-0.5">Update administrator credentials, phone verification, and security keys</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <label className="text-text-muted flex items-center gap-1 mb-1"><UserRound className="w-3 h-3 text-info" /> Full Name</label>
                          <input type="text" defaultValue="Super Administrator" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                        </div>
                        <div>
                          <label className="text-text-muted flex items-center gap-1 mb-1"><Mail className="w-3 h-3 text-info" /> Email Address</label>
                          <input type="email" defaultValue="admin@medikobazaar.com" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                        </div>
                        <div>
                          <label className="text-text-muted flex items-center gap-1 mb-1"><Phone className="w-3 h-3 text-info" /> Direct Phone</label>
                          <input type="text" defaultValue="+977 985-1117186" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                        </div>
                        <div>
                          <label className="text-text-muted flex items-center gap-1 mb-1"><Crown className="w-3 h-3 text-orange" /> Role & Privilege Level</label>
                          <input type="text" defaultValue="Super Admin (Root Operations)" disabled className="w-full px-2.5 py-1.5 border border-border rounded outline-none bg-bg-section text-text-muted font-normal" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <h4 className="text-xs font-normal text-navy mb-2 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-orange" /> Change Password
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                          <div>
                            <label className="text-text-muted block mb-1">Current Password</label>
                            <input type="password" placeholder="••••••••••••" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                          </div>
                          <div>
                            <label className="text-text-muted block mb-1">New Password</label>
                            <input type="password" placeholder="••••••••••••" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                          </div>
                          <div>
                            <label className="text-text-muted block mb-1">Confirm New Password</label>
                            <input type="password" placeholder="••••••••••••" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy bg-white text-text-dark font-normal" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 mt-3">
                          <span className="text-[10px] text-text-muted">Password must be at least 8 characters.</span>
                          <button onClick={() => showToast('Admin password updated successfully.')} className={BTN.orange}>
                            <Save className="w-3.5 h-3.5" /> Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </>
        )}
      </div>

      {/* Customer Institutional Details & Dossier Modal */}
      {selectedCustomerForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-info" />
                <div>
                  <h3 className="text-sm font-normal text-navy m-0">{selectedCustomerForModal.name}</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">{selectedCustomerForModal.affiliation}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomerForModal(null)} className={BTN.icon}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 bg-bg-section rounded border border-border">
                <span className="text-text-muted block text-[10px]">PAN / VAT</span>
                <span className="text-navy font-mono">{selectedCustomerForModal.pan}</span>
              </div>
              <div className="p-2.5 bg-bg-section rounded border border-border">
                <span className="text-text-muted block text-[10px]">DDA Hospital License</span>
                <span className="text-navy">{selectedCustomerForModal.dda}</span>
              </div>
              <div className="p-2.5 bg-bg-section rounded border border-border">
                <span className="text-text-muted block text-[10px]">Bed Capacity</span>
                <span className="text-navy">{selectedCustomerForModal.bedCapacity}</span>
              </div>
              <div className="p-2.5 bg-bg-section rounded border border-border">
                <span className="text-text-muted block text-[10px]">Lifetime Spend</span>
                <span className="text-success font-normal">{selectedCustomerForModal.totalSpent}</span>
              </div>
            </div>

            <div className="text-[11px] space-y-1 bg-bg-section p-3 rounded border border-border">
              <div><span className="text-text-muted">Procurement Officer:</span> <span className="text-text-dark font-normal">{selectedCustomerForModal.person} ({selectedCustomerForModal.role})</span></div>
              <div><span className="text-text-muted">Contact:</span> <span className="text-text-dark">{selectedCustomerForModal.phone} • {selectedCustomerForModal.email}</span></div>
              <div><span className="text-text-muted">Delivery Address:</span> <span className="text-text-dark">{selectedCustomerForModal.address}</span></div>
              <div><span className="text-text-muted">Credit Terms:</span> <span className="text-text-dark">{selectedCustomerForModal.creditLimit}</span></div>
            </div>

            <div>
              <h4 className="text-xs font-normal text-navy mb-2">Order History</h4>
              <div className="space-y-1.5 border border-border rounded overflow-hidden">
                {selectedCustomerForModal.orders.map((ord) => (
                  <div key={ord.orderNumber} className="flex items-center justify-between p-2.5 hover:bg-bg-section text-[11px] border-b border-border/50 last:border-0">
                    <div>
                      <span className="text-navy font-mono">{ord.orderNumber}</span>
                      <span className="text-text-muted ml-2">{ord.items}</span>
                      <span className="text-[9px] text-text-light block">{ord.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-navy font-normal block">{ord.amount}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-success-bg text-success">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
              <button
                onClick={async () => {
                  await generateCustomerDossierPDF({
                    customerName: selectedCustomerForModal.name,
                    customerOrg: selectedCustomerForModal.affiliation,
                    customerPan: selectedCustomerForModal.pan,
                    customerDda: selectedCustomerForModal.dda,
                    contactPerson: selectedCustomerForModal.person,
                    contactPhone: selectedCustomerForModal.phone,
                    contactEmail: selectedCustomerForModal.email,
                    address: selectedCustomerForModal.address,
                    bedCapacity: selectedCustomerForModal.bedCapacity,
                    creditLimit: selectedCustomerForModal.creditLimit,
                    orders: selectedCustomerForModal.orders,
                    totalSpent: selectedCustomerForModal.totalSpent,
                    activeRentalsCount: selectedCustomerForModal.activeRentalsCount,
                    quotationsCount: selectedCustomerForModal.quotationsCount,
                  })
                  showToast(`Dossier PDF downloaded for ${selectedCustomerForModal.name}`)
                }}
                className={BTN.primary}
              >
                <Download className="w-3.5 h-3.5" /> Download Official Dossier PDF
              </button>
              <button
                onClick={() => {
                  setSelectedCustomerForModal(null)
                  setIsQuotationStudioOpen(true)
                }}
                className={BTN.orange}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Issue New Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand & Category Modal */}
      <BrandCategoryModal
        isOpen={brandCategoryModalOpen}
        onClose={() => setBrandCategoryModalOpen(false)}
        initialMode={brandCategoryMode}
        onAddBrand={handleAddBrand}
        onAddCategory={handleAddCategory}
      />

      {/* Landing Cost Modal */}
      <LandingCostModal
        isOpen={landingCostModalOpen}
        onClose={() => setLandingCostModalOpen(false)}
      />

      {/* Order Details Modal */}
      {selectedOrderForModal && (
        <OrderDetailsModal
          isOpen={!!selectedOrderForModal}
          onClose={() => setSelectedOrderForModal(null)}
          order={selectedOrderForModal}
        />
      )}

      {/* Vendor KYC Modal */}
      {selectedVendorKyc && (
        <VendorKycModal
          isOpen={!!selectedVendorKyc}
          onClose={() => setSelectedVendorKyc(null)}
          profile={selectedVendorKyc}
          isAdminView={true}
          onApproveKyc={() => {
            setVendorKycList(vendorKycList.map((v) => v.id === selectedVendorKyc.id ? { ...v, status: 'Verified & DDA Certified' } : v))
            showToast(`Vendor "${selectedVendorKyc.companyName}" KYC approved and verified.`)
            setSelectedVendorKyc(null)
          }}
          onRejectKyc={() => {
            setVendorKycList(vendorKycList.map((v) => v.id === selectedVendorKyc.id ? { ...v, status: 'Clarification Required' } : v))
            showToast(`Vendor "${selectedVendorKyc.companyName}" KYC returned for clarification.`)
            setSelectedVendorKyc(null)
          }}
        />
      )}

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-border w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-normal text-navy m-0">Add New Institutional Customer</h3>
              </div>
              <button onClick={() => setIsAddCustomerOpen(false)} className={BTN.icon}><X className="w-4 h-4" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const newCustomer: HospitalCustomer = {
                  id: `CUST-${String(customersList.length + 1).padStart(3, '0')}`,
                  name: formData.get('name') as string,
                  affiliation: (formData.get('affiliation') as string) || 'Healthcare Institution',
                  address: formData.get('address') as string,
                  person: formData.get('person') as string,
                  role: (formData.get('role') as string) || 'Procurement Officer',
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  pan: formData.get('pan') as string,
                  dda: formData.get('dda') as string,
                  bedCapacity: (formData.get('bedCapacity') as string) || '200 Beds',
                  creditLimit: (formData.get('creditLimit') as string) || 'NPR 5,000,000 (Net 30 Days)',
                  orders: [],
                  totalSpent: 'NPR 0',
                  activeRentalsCount: 0,
                  quotationsCount: 0,
                  status: 'Active',
                }
                setCustomersList([newCustomer, ...customersList])
                setIsAddCustomerOpen(false)
                showToast(`Hospital account "${newCustomer.name}" added.`)
              }}
              className="space-y-3 text-[11px]"
            >
              <div>
                <label className="text-text-muted block mb-1">Hospital / Clinic Name *</label>
                <input required name="name" placeholder="e.g. Nepal Mediciti Hospital" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Affiliation / Organization</label>
                  <input name="affiliation" placeholder="e.g. Private Tertiary Care Network" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Bed Capacity</label>
                  <input name="bedCapacity" placeholder="e.g. 350 Beds" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">PAN / VAT Number *</label>
                  <input required name="pan" placeholder="e.g. 601982341" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">DDA Hospital Reg No *</label>
                  <input required name="dda" placeholder="e.g. DDA-HOSP-079/080-88" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Procurement Officer Name *</label>
                  <input required name="person" placeholder="e.g. Dr. Pradeep Sharma" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Role / Designation</label>
                  <input name="role" placeholder="e.g. Head of Biomedical" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Official Phone *</label>
                  <input required name="phone" placeholder="+977 1-4221190" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Official Email *</label>
                  <input required type="email" name="email" placeholder="procurement@mediciti.com.np" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
              </div>
              <div>
                <label className="text-text-muted block mb-1">Delivery Address & District *</label>
                <input required name="address" placeholder="e.g. Bhaisepati, Lalitpur, Nepal" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div>
                <label className="text-text-muted block mb-1">Credit Terms & Limit</label>
                <input name="creditLimit" placeholder="e.g. NPR 10,000,000 (Net 30 Days)" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddCustomerOpen(false)} className={BTN.secondary}>Cancel</button>
                <button type="submit" className={BTN.primary}><Plus className="w-3.5 h-3.5" /> Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seller Details Modal */}
      {selectedSellerForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-border w-full max-w-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-normal text-navy m-0">{selectedSellerForModal.name}</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-success-bg text-success">{selectedSellerForModal.status}</span>
              </div>
              <button onClick={() => setSelectedSellerForModal(null)} className={BTN.icon}><X className="w-4 h-4" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-[11px] bg-bg-section p-3 rounded border border-border">
              <div><span className="text-text-muted">Type:</span> <span className="text-text-dark">{selectedSellerForModal.type}</span></div>
              <div><span className="text-text-muted">City / Depot:</span> <span className="text-text-dark">{selectedSellerForModal.city}</span></div>
              <div><span className="text-text-muted">PAN / VAT:</span> <span className="font-mono text-text-dark">{selectedSellerForModal.pan}</span></div>
              <div><span className="text-text-muted">DDA License:</span> <span className="text-text-dark">{selectedSellerForModal.ddaLicense}</span></div>
              <div><span className="text-text-muted">Representative:</span> <span className="text-text-dark">{selectedSellerForModal.rep} ({selectedSellerForModal.phone})</span></div>
              <div><span className="text-text-muted">Email:</span> <span className="text-text-dark">{selectedSellerForModal.email}</span></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 bg-bg-section rounded border border-border">
                <span className="text-text-muted block text-[10px]">Active Listings</span>
                <span className="text-navy font-normal">{selectedSellerForModal.listings} Products</span>
              </div>
              <div className="p-2.5 bg-bg-section rounded border border-border">
                <span className="text-text-muted block text-[10px]">Lifetime Sales</span>
                <span className="text-navy font-normal">{selectedSellerForModal.revenue}</span>
              </div>
              <div className="p-2.5 bg-bg-section rounded border border-border">
                <span className="text-text-muted block text-[10px]">Unsettled Balance</span>
                <span className="text-orange font-normal">NPR {selectedSellerForModal.balancePayable.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-3 text-[11px]">
              <h4 className="text-xs font-normal text-navy m-0">Commission & Payout Management</h4>
              <div className="flex items-center gap-3">
                <label className="text-text-muted">Marketplace Commission:</label>
                <div className="flex gap-1.5">
                  {['5%', '8%', '10%', '12%', '15%'].map((cRate) => (
                    <button
                      key={cRate}
                      type="button"
                      onClick={() => {
                        const updated = sellersList.map((s) => s.id === selectedSellerForModal.id ? { ...s, comm: cRate } : s)
                        setSellersList(updated)
                        setSelectedSellerForModal({ ...selectedSellerForModal, comm: cRate })
                        showToast(`Commission updated to ${cRate} for ${selectedSellerForModal.name}`)
                      }}
                      className={`px-2 py-1 rounded text-xs transition cursor-pointer ${selectedSellerForModal.comm === cRate ? 'bg-navy text-white' : 'bg-bg-section border border-border text-text-muted'}`}
                    >
                      {cRate}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-bg-section rounded border border-border">
                <div>
                  <span className="text-text-muted block text-[10px]">Bank Beneficiary:</span>
                  <span className="text-text-dark font-mono">{selectedSellerForModal.bankName} • {selectedSellerForModal.bankAccount}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSellerForModal.balancePayable > 0) {
                      const amount = selectedSellerForModal.balancePayable
                      const updated = sellersList.map((s) => s.id === selectedSellerForModal.id ? { ...s, balancePayable: 0 } : s)
                      setSellersList(updated)
                      setSelectedSellerForModal({ ...selectedSellerForModal, balancePayable: 0 })
                      showToast(`Bank wire payout of NPR ${amount.toLocaleString()} settled.`)
                    } else {
                      showToast('No outstanding balance payable.')
                    }
                  }}
                  className={BTN.success}
                >
                  <DollarSign className="w-3.5 h-3.5" /> Process Bank Payout
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-text-muted">Account Status:</span>
                <select
                  value={selectedSellerForModal.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any
                    const updated = sellersList.map((s) => s.id === selectedSellerForModal.id ? { ...s, status: newStatus } : s)
                    setSellersList(updated)
                    setSelectedSellerForModal({ ...selectedSellerForModal, status: newStatus })
                    showToast(`Seller status changed to ${newStatus}`)
                  }}
                  className="px-2 py-1 border border-border rounded bg-white text-text-dark text-xs outline-none"
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <button onClick={() => setSelectedSellerForModal(null)} className={BTN.secondary}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Seller Modal */}
      {isAddSellerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-border w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-normal text-navy m-0">Invite / Register Marketplace Seller</h3>
              </div>
              <button onClick={() => setIsAddSellerOpen(false)} className={BTN.icon}><X className="w-4 h-4" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const newSeller: AdminSeller = {
                  id: `SEL-${String(sellersList.length + 1).padStart(2, '0')}`,
                  name: formData.get('name') as string,
                  type: (formData.get('type') as string) || 'Authorized Dealer',
                  city: (formData.get('city') as string) || 'Kathmandu',
                  address: formData.get('address') as string,
                  pan: formData.get('pan') as string,
                  ddaLicense: formData.get('dda') as string,
                  rep: formData.get('rep') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  listings: 0,
                  revenue: 'NPR 0',
                  balancePayable: 0,
                  comm: (formData.get('comm') as string) || '10%',
                  rating: 5.0,
                  status: 'Verified',
                  bankAccount: (formData.get('bankAccount') as string) || '0100291039120',
                  bankName: (formData.get('bankName') as string) || 'Nabil Bank Ltd.',
                }
                setSellersList([newSeller, ...sellersList])
                setIsAddSellerOpen(false)
                showToast(`Seller account "${newSeller.name}" registered.`)
              }}
              className="space-y-3 text-[11px]"
            >
              <div>
                <label className="text-text-muted block mb-1">Company / Trade Name *</label>
                <input required name="name" placeholder="e.g. Himalayan BioMed Direct Pvt. Ltd." className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Seller Type</label>
                  <select name="type" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white">
                    <option value="Authorized Dealer">Authorized Dealer</option>
                    <option value="Primary Distributor">Primary Distributor</option>
                    <option value="Biomedical Component Reseller">Component Reseller</option>
                    <option value="Hospital Surplus Unit">Hospital Surplus Unit</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Default Commission %</label>
                  <input name="comm" defaultValue="10%" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">PAN / VAT Number *</label>
                  <input required name="pan" placeholder="602189912" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">DDA Importer/Dealer License</label>
                  <input name="dda" placeholder="DDA-MED-079/302" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Representative Name *</label>
                  <input required name="rep" placeholder="e.g. Binod Shrestha" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Phone Number *</label>
                  <input required name="phone" placeholder="+977 985-1192837" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Business Email *</label>
                  <input required type="email" name="email" placeholder="sales@himalayanbiomed.com" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">City / Region *</label>
                  <input required name="city" placeholder="Kathmandu" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
              </div>
              <div>
                <label className="text-text-muted block mb-1">Office / Depot Address</label>
                <input name="address" placeholder="New Baneshwar Trade Center, Level 2" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Settlement Bank Name</label>
                  <input name="bankName" placeholder="Nabil Bank Ltd." className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Bank Account Number</label>
                  <input name="bankAccount" placeholder="02810012398102" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark font-mono" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddSellerOpen(false)} className={BTN.secondary}>Cancel</button>
                <button type="submit" className={BTN.primary}><Plus className="w-3.5 h-3.5" /> Register Seller</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Ticket Modal */}
      {selectedTicketForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-border w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-normal text-navy m-0">Service Job: {selectedTicketForModal.id}</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-info-bg text-info">{selectedTicketForModal.status}</span>
              </div>
              <button onClick={() => setSelectedTicketForModal(null)} className={BTN.icon}><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-2 text-[11px] bg-bg-section p-3 rounded border border-border">
              <div><span className="text-text-muted">Equipment:</span> <span className="text-text-dark font-normal">{selectedTicketForModal.equip}</span></div>
              <div><span className="text-text-muted">Client / Ward:</span> <span className="text-text-dark">{selectedTicketForModal.client} ({selectedTicketForModal.clientPhone})</span></div>
              <div><span className="text-text-muted">Assigned Engineer:</span> <span className="text-text-dark font-normal">{selectedTicketForModal.eng} ({selectedTicketForModal.engPhone})</span></div>
              <div><span className="text-text-muted">Task Description:</span> <span className="text-text-dark">{selectedTicketForModal.task}</span></div>
              <div><span className="text-text-muted">Priority:</span> <span className="text-orange">{selectedTicketForModal.priority}</span> • {selectedTicketForModal.date}</div>
            </div>

            <div className="space-y-2 text-[11px]">
              <label className="text-text-muted block">Biomedical Engineering Notes & Findings:</label>
              <textarea
                rows={3}
                defaultValue={selectedTicketForModal.notes}
                id="ticketNotesInput"
                className="w-full p-2.5 border border-border rounded text-text-dark outline-none focus:border-navy text-xs"
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-text-muted">Status:</span>
                <select
                  id="ticketStatusSelect"
                  defaultValue={selectedTicketForModal.status}
                  className="px-2 py-1 border border-border rounded bg-white text-text-dark text-xs outline-none"
                >
                  <option value="Assigned">Assigned</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Calibration Passed">Calibration Passed</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  const sel = document.getElementById('ticketStatusSelect') as HTMLSelectElement
                  const notes = document.getElementById('ticketNotesInput') as HTMLTextAreaElement
                  const newStatus = (sel?.value as any) || selectedTicketForModal.status
                  const newNotes = notes?.value || selectedTicketForModal.notes
                  const updated = serviceTicketsList.map((t) => t.id === selectedTicketForModal.id ? { ...t, status: newStatus, notes: newNotes } : t)
                  setServiceTicketsList(updated)
                  setSelectedTicketForModal(null)
                  showToast(`Service job ${selectedTicketForModal.id} updated to ${newStatus}`)
                }}
                className={BTN.primary}
              >
                <Save className="w-3.5 h-3.5" /> Save Service Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Service Ticket Modal */}
      {isAddTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-border w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-normal text-navy m-0">Create Biomedical Service Ticket</h3>
              </div>
              <button onClick={() => setIsAddTicketOpen(false)} className={BTN.icon}><X className="w-4 h-4" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const newTicket: ServiceTicket = {
                  id: `SRV-${String(serviceTicketsList.length + 100).padStart(3, '0')}`,
                  equip: formData.get('equip') as string,
                  client: formData.get('client') as string,
                  clientPhone: (formData.get('clientPhone') as string) || '+977 1-4221119',
                  eng: (formData.get('eng') as string) || 'Er. Suman Adhikari',
                  engPhone: '+977 984-1823490',
                  task: formData.get('task') as string,
                  status: 'Assigned',
                  priority: (formData.get('priority') as any) || 'Normal',
                  date: new Date().toLocaleDateString('en-GB'),
                  notes: 'Ticket logged. Engineer dispatched with calibration field toolkit.',
                }
                setServiceTicketsList([newTicket, ...serviceTicketsList])
                setIsAddTicketOpen(false)
                showToast(`Ticket ${newTicket.id} assigned to ${newTicket.eng}.`)
              }}
              className="space-y-3 text-[11px]"
            >
              <div>
                <label className="text-text-muted block mb-1">Equipment Name & Model *</label>
                <input required name="equip" placeholder="e.g. Philips IntelliVue MX40 Patient Monitor" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Client Hospital / Ward *</label>
                  <input required name="client" placeholder="e.g. Bir Hospital (ICU Ward 2)" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Client Contact Phone</label>
                  <input name="clientPhone" placeholder="+977 985-1117186" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-text-muted block mb-1">Assign Biomedical Engineer</label>
                  <select name="eng" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white">
                    <option value="Er. Suman Adhikari">Er. Suman Adhikari (Senior BMET)</option>
                    <option value="Er. Bikash Tamang">Er. Bikash Tamang (Ventilator Specialist)</option>
                    <option value="Er. Pradip Rai">Er. Pradip Rai (Imaging & C-Arm)</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-muted block mb-1">Ticket Priority</label>
                  <select name="priority" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white">
                    <option value="Urgent (ICU)">Urgent (ICU / Emergency)</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-text-muted block mb-1">Task / Fault Description *</label>
                <textarea required rows={2} name="task" placeholder="e.g. SpO2 calibration error, battery not charging..." className="w-full p-2 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddTicketOpen(false)} className={BTN.secondary}>Cancel</button>
                <button type="submit" className={BTN.primary}><Plus className="w-3.5 h-3.5" /> Dispatch Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Administrator Modal */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-border w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-normal text-navy m-0">Add Administrator Account</h3>
              </div>
              <button onClick={() => setIsAddAdminOpen(false)} className={BTN.icon}><X className="w-4 h-4" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const newAdmin: AdminUser = {
                  id: `ADM-${String(adminUsersList.length + 1).padStart(2, '0')}`,
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  email: formData.get('email') as string,
                  phone: (formData.get('phone') as string) || '+977 985-1110000',
                  perm: (formData.get('perm') as string) || 'Standard Admin Permissions',
                  status: 'Active',
                }
                setAdminUsersList([...adminUsersList, newAdmin])
                setIsAddAdminOpen(false)
                showToast(`Administrator account "${newAdmin.name}" created.`)
              }}
              className="space-y-3 text-[11px]"
            >
              <div>
                <label className="text-text-muted block mb-1">Full Name *</label>
                <input required name="name" placeholder="e.g. Er. Anup Kandel" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div>
                <label className="text-text-muted block mb-1">Administrator Role *</label>
                <select name="role" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark bg-white">
                  <option value="Biomedical Verification Officer">Biomedical Verification Officer</option>
                  <option value="Accounts & Invoicing Controller">Accounts & Invoicing Controller</option>
                  <option value="Hospital Procurement Manager">Hospital Procurement Manager</option>
                  <option value="Logistics & Dispatch Manager">Logistics & Dispatch Manager</option>
                </select>
              </div>
              <div>
                <label className="text-text-muted block mb-1">Email Address *</label>
                <input required type="email" name="email" placeholder="anup@medikobazaar.com" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div>
                <label className="text-text-muted block mb-1">Phone Number</label>
                <input name="phone" placeholder="+977 985-1199887" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div>
                <label className="text-text-muted block mb-1">Permissions Scope</label>
                <input name="perm" defaultValue="Catalog, Orders, Service Logs & Invoices" className="w-full px-2.5 py-1.5 border border-border rounded outline-none focus:border-navy text-text-dark" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddAdminOpen(false)} className={BTN.secondary}>Cancel</button>
                <button type="submit" className={BTN.primary}><Plus className="w-3.5 h-3.5" /> Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
