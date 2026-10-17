import { useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Paperclip,
  Pencil,
  Plus,
  ReceiptText,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
  UserRound,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import type { NavProps } from '../types'
import { BRAND } from '../lib/constants'
import { generateTaxInvoicePDF } from '../lib/pdfGenerator'

export type PortalRole = 'admin' | 'vendor' | 'customer' | 'engineer'

type NavItem = { key: string; label: string; icon: LucideIcon; badge?: number }
type Message = { id: string; sender: string; role: string; body: string; time: string; mine?: boolean }
type Thread = {
  id: string
  title: string
  subtitle: string
  participant: string
  participantRole: string
  online: boolean
  unread?: number
  messages: Message[]
}

const roleDetails: Record<PortalRole, { title: string; person: string; initials: string; caption: string }> = {
  admin: { title: 'Admin portal', person: 'Super Admin', initials: 'SA', caption: 'Full system access' },
  vendor: { title: 'Vendor portal', person: 'MediTech Solutions', initials: 'MS', caption: 'Verified vendor' },
  customer: { title: 'Customer portal', person: 'Ramesh Karki', initials: 'RK', caption: 'Bir Hospital' },
  engineer: { title: 'Engineer portal', person: 'Suman Adhikari', initials: 'SA', caption: 'Service engineer' },
}

const navByRole: Record<PortalRole, NavItem[]> = {
  admin: [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'orders', label: 'Orders', icon: ShoppingCart, badge: 8 },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'rentals', label: 'Rentals', icon: Clock3, badge: 3 },
    { key: 'documents', label: 'Vendor documents', icon: FileCheck2, badge: 2 },
    { key: 'people', label: 'Customers & vendors', icon: Users },
    { key: 'service', label: 'Service jobs', icon: Wrench, badge: 4 },
    { key: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { key: 'reports', label: 'Reports', icon: Activity },
    { key: 'settings', label: 'Company settings', icon: Settings },
  ],
  vendor: [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingCart, badge: 4 },
    { key: 'rentals', label: 'Rentals', icon: Clock3, badge: 2 },
    { key: 'documents', label: 'Company documents', icon: FileCheck2 },
    { key: 'enquiries', label: 'Customer requests', icon: ClipboardCheck },
    { key: 'payments', label: 'Payments', icon: CircleDollarSign },
    { key: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
    { key: 'settings', label: 'Store settings', icon: Settings },
  ],
  customer: [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'orders', label: 'My orders', icon: ShoppingCart },
    { key: 'rentals', label: 'My rentals', icon: Clock3, badge: 1 },
    { key: 'service', label: 'Service requests', icon: Wrench, badge: 2 },
    { key: 'invoices', label: 'Invoices', icon: ReceiptText },
    { key: 'messages', label: 'Messages', icon: MessageSquare, badge: 1 },
    { key: 'settings', label: 'My profile', icon: UserRound },
  ],
  engineer: [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'service', label: 'Assigned jobs', icon: Wrench, badge: 3 },
    { key: 'schedule', label: 'Schedule', icon: CalendarDays },
    { key: 'reports', label: 'Service reports', icon: FileText },
    { key: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
    { key: 'settings', label: 'My profile', icon: UserRound },
  ],
}

const rentals = [
  {
    id: 'RNT-1048',
    item: 'Oxygen Concentrator 10L',
    model: 'Yuwell 8F-10',
    customer: 'Bir Hospital',
    contact: 'Dr. Ramesh Karki · +977 985-1117186',
    period: '08 Sep – 08 Oct 2026',
    start: '08 Sep 2026',
    end: '08 Oct 2026',
    rent: 'NPR 18,000',
    deposit: 'NPR 25,000',
    status: 'Active',
    delivery: 'Delivered to ICU Store, Bir Hospital, Kathmandu',
    notes: 'Includes humidifier bottle, nasal cannula and backup power cable.',
  },
  {
    id: 'RNT-1042',
    item: 'Electric Hospital Bed',
    model: 'Mediko EB-300',
    customer: 'Patan Hospital',
    contact: 'Anita Thapa · +977 981-4823222',
    period: '01 Sep – 01 Dec 2026',
    start: '01 Sep 2026',
    end: '01 Dec 2026',
    rent: 'NPR 36,000',
    deposit: 'NPR 45,000',
    status: 'Active',
    delivery: 'Ward 3 receiving desk, Patan Hospital, Lalitpur',
    notes: 'Monthly safety check is included. Side rails and remote were checked at delivery.',
  },
  {
    id: 'RNT-1031',
    item: 'BiPAP Machine',
    model: 'ResMed S10',
    customer: 'Grande Hospital',
    contact: 'Respiratory Unit · +977 980-1827364',
    period: '12 Aug – 12 Sep 2026',
    start: '12 Aug 2026',
    end: '12 Sep 2026',
    rent: 'NPR 12,000',
    deposit: 'NPR 25,000',
    status: 'Return due',
    delivery: 'Respiratory Unit, Grande Hospital, Kathmandu',
    notes: 'Return inspection is booked for 12 Sep at 3:00 PM.',
  },
]

const orders = [
  { id: 'MB-28491', customer: 'Bir Hospital', item: 'Patient Monitor MEC-1200', amount: 'NPR 341,500', date: '08 Sep 2026', status: 'Paid' },
  { id: 'MB-28488', customer: 'Patan Hospital', item: 'Oxygen Concentrator × 2', amount: 'NPR 148,400', date: '06 Sep 2026', status: 'Shipped' },
  { id: 'MB-28482', customer: 'Grande Hospital', item: 'Infusion Pump SK-500', amount: 'NPR 92,000', date: '04 Sep 2026', status: 'Preparing' },
  { id: 'MB-28470', customer: 'Nepal Medical College', item: 'ECG Machine AT-102', amount: 'NPR 187,500', date: '01 Sep 2026', status: 'Delivered' },
]

type ManagedProduct = {
  name: string
  sku: string
  stock: number
  price: string
  status: 'Published' | 'Draft'
  active: boolean
  category: string
  brand: string
  description: string
  specifications: string
  images: string[]
}

const products: ManagedProduct[] = [
  { name: 'Patient Monitor MEC-1200', sku: 'MB-PM-001', stock: 12, price: 'NPR 285,000', status: 'Published', active: true, category: 'Patient Monitoring', brand: 'Mindray', description: 'Multi-parameter bedside patient monitor for hospital and clinic use.', specifications: 'Display: 12.1 inch\nParameters: ECG, SpO2, NIBP, temperature\nWarranty: 1 year', images: ['/assets/generated/category-monitoring.png', '/assets/generated/hero-marketplace.png'] },
  { name: 'Oxygen Concentrator 10L', sku: 'MB-RC-014', stock: 8, price: 'NPR 65,000', status: 'Published', active: true, category: 'Respiratory Care', brand: 'Yuwell', description: 'Reliable oxygen concentrator for home and clinical respiratory care.', specifications: 'Flow: 1–10 L/min\nPurity: 93% ± 3%\nPower: 550 W', images: ['/assets/generated/category-respiratory.png'] },
  { name: 'Infusion Pump SK-500', sku: 'MB-IP-009', stock: 3, price: 'NPR 92,000', status: 'Draft', active: false, category: 'Patient Monitoring', brand: 'SK Medical', description: 'Accurate infusion pump with clear alarms and simple operation.', specifications: 'Flow range: 0.1–1200 ml/h\nBattery: 6 hours\nModes: Rate and time', images: ['/assets/generated/category-monitoring.png'] },
  { name: 'Electric Hospital Bed', sku: 'MB-HF-012', stock: 6, price: 'NPR 75,000', status: 'Published', active: true, category: 'Hospital Furniture', brand: 'Mediko Care', description: 'Electric hospital bed with adjustable backrest and safety rails.', specifications: 'Motors: 3\nSafe load: 220 kg\nIncluded: Mattress and side rails', images: ['/assets/generated/category-furniture.png'] },
]

const serviceJobs = [
  { id: 'SRV-084', customer: 'Bir Hospital', equipment: 'Patient Monitor MEC-1200', engineer: 'Suman Adhikari', date: '10 Sep, 10:30 AM', status: 'In progress' },
  { id: 'SRV-089', customer: 'Teaching Hospital', equipment: 'ICU Ventilator Savina 300', engineer: 'Bikash Tamang', date: '11 Sep, 9:00 AM', status: 'Scheduled' },
  { id: 'SRV-092', customer: 'Patan Hospital', equipment: 'Ultrasound Scanner BPU60', engineer: 'Suman Adhikari', date: '12 Sep, 1:00 PM', status: 'Assigned' },
]

const documentList = [
  { id: 'DOC-001', name: 'Company registration', updated: '08 Sep 2026' },
  { id: 'DOC-002', name: 'Tax registration', updated: '08 Sep 2026' },
  { id: 'DOC-003', name: 'Medical supply licence', updated: '08 Sep 2026' },
  { id: 'DOC-004', name: 'Latest tax clearance', updated: '08 Sep 2026' },
  { id: 'DOC-005', name: 'Bank account confirmation', updated: '08 Sep 2026' },
]

const makeThreads = (role: PortalRole): Thread[] => {
  const people = role === 'admin'
    ? [
        ['MediTech Solutions', 'Vendor'],
        ['Ramesh Karki', 'Customer'],
        ['Suman Adhikari', 'Engineer'],
      ]
    : role === 'vendor'
      ? [['Mediko support', 'Admin'], ['Ramesh Karki', 'Customer'], ['Suman Adhikari', 'Engineer']]
      : role === 'customer'
        ? [['Mediko support', 'Admin'], ['MediTech Solutions', 'Vendor'], ['Suman Adhikari', 'Engineer']]
        : [['Mediko support', 'Admin'], ['Ramesh Karki', 'Customer'], ['MediTech Solutions', 'Vendor']]

  return people.map(([name, personRole], index) => ({
    id: `conversation-${role}-${index + 1}`,
    title: index === 0 ? 'Order MB-28491' : index === 1 ? 'Rental RNT-1048' : 'Service SRV-084',
    subtitle: index === 0 ? 'Delivery and invoice' : index === 1 ? 'Rental support' : 'Equipment service',
    participant: name,
    participantRole: personRole,
    online: index !== 1,
    unread: index === 0 ? 2 : undefined,
    messages: [
      { id: `m-${index}-1`, sender: name, role: personRole, body: index === 0 ? 'Hello, the latest update is ready for you.' : 'Could you please confirm the preferred time?', time: '10:12 AM' },
      { id: `m-${index}-2`, sender: 'You', role: roleDetails[role].title, body: index === 0 ? 'Thank you. Please share the delivery details here.' : 'Yes, tomorrow morning works well.', time: '10:16 AM', mine: true },
      { id: `m-${index}-3`, sender: name, role: personRole, body: index === 0 ? 'Delivery is planned for tomorrow between 11:00 AM and 1:00 PM.' : 'Confirmed. I have added it to the schedule.', time: '10:18 AM' },
    ],
  }))
}

function StatusPill({ children }: { children: React.ReactNode }) {
  const text = String(children).toLowerCase()
  const tone = text.includes('active') || text.includes('paid') || text.includes('published') || text.includes('delivered') || text.includes('verified')
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : text.includes('due') || text.includes('low')
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-blue-200 bg-blue-50 text-blue-700'
  return <span className={`inline-flex items-center border px-2 py-1 text-xs font-medium ${tone}`}>{children}</span>
}

function SectionHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="m-0 text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  )
}

function PrimaryButton({ children, onClick, type = 'button' }: { children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit' }) {
  return <button type={type} onClick={onClick} className="inline-flex min-h-10 items-center justify-center gap-2 border border-orange bg-orange px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(242,106,26,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-hover hover:shadow-[0_7px_16px_rgba(242,106,26,0.25)] focus:outline-none focus:ring-2 focus:ring-orange/30 focus:ring-offset-2">{children}</button>
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-10 items-center justify-center gap-2 border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_3px_9px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange-soft hover:text-orange hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange/20 focus:ring-offset-2">{children}</button>
}

function MetricCard({ label, value, note, icon: Icon, tone = 'navy' }: { label: string; value: string; note: string; icon: LucideIcon; tone?: 'navy' | 'orange' | 'green' | 'blue' }) {
  const tones = {
    navy: 'bg-navy text-white',
    orange: 'bg-orange text-white',
    green: 'bg-emerald-600 text-white',
    blue: 'bg-blue-600 text-white',
  }
  return (
    <div className="portal-card flex min-h-36 flex-col justify-between border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className={`grid h-9 w-9 place-items-center ${tones[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <div>
        <strong className="block text-2xl font-semibold text-slate-900">{value}</strong>
        <span className="mt-1 block text-xs text-slate-500">{note}</span>
      </div>
    </div>
  )
}

function Overview({ role, setPage }: { role: PortalRole; setPage: (page: string) => void }) {
  const roleMetrics = {
    admin: [
      ['Orders this month', '128', '18 need attention', ShoppingCart, 'navy'],
      ['Sales this month', 'NPR 8.4M', 'Up 12% from last month', CircleDollarSign, 'green'],
      ['Active rentals', '34', '3 returns due this week', Clock3, 'orange'],
      ['Open service jobs', '16', '4 scheduled today', Wrench, 'blue'],
    ],
    vendor: [
      ['New orders', '14', '4 waiting for confirmation', ShoppingCart, 'navy'],
      ['Available balance', 'NPR 742K', 'Last payment received today', CircleDollarSign, 'green'],
      ['Active rentals', '8', '2 returns due this week', Clock3, 'orange'],
      ['Published products', '46', '3 products are low in stock', Package, 'blue'],
    ],
    customer: [
      ['Active orders', '3', 'One delivery tomorrow', ShoppingCart, 'navy'],
      ['Active rentals', '1', 'Return date: 08 Oct 2026', Clock3, 'orange'],
      ['Service requests', '2', 'One engineer visit today', Wrench, 'blue'],
      ['Unpaid invoices', '1', 'Due in 5 days', ReceiptText, 'green'],
    ],
    engineer: [
      ['Assigned jobs', '6', '3 visits this week', Wrench, 'navy'],
      ['Today’s visits', '2', 'Next visit at 10:30 AM', CalendarDays, 'orange'],
      ['Completed this month', '18', 'All reports submitted', CheckCircle2, 'green'],
      ['Unread messages', '4', 'From customers and support', MessageSquare, 'blue'],
    ],
  } as const

  return (
    <div>
      <SectionHeader title="Overview" description={`A clear view of your ${roleDetails[role].title.toLowerCase()} activity.`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {roleMetrics[role].map(([label, value, note, icon, tone]) => <MetricCard key={label} label={label} value={value} note={note} icon={icon} tone={tone} />)}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="portal-card border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="m-0 text-base font-semibold text-slate-900">Recent activity</h3>
              <p className="mt-1 text-sm text-slate-500">The latest updates that need your attention.</p>
            </div>
            <button onClick={() => setPage(role === 'engineer' ? 'service' : 'orders')} className="text-sm font-medium text-orange">View all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              ['Order MB-28491 is ready for delivery', 'Today, 10:25 AM', Truck],
              ['Rental RNT-1048 payment was received', 'Today, 9:40 AM', Clock3],
              ['Service visit SRV-084 was updated', 'Yesterday, 4:15 PM', Wrench],
              ['New message from Mediko support', 'Yesterday, 2:30 PM', MessageSquare],
            ].map(([title, time, Icon]) => (
              <div key={String(title)} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center bg-slate-100 text-navy"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{String(title)}</p><p className="text-xs text-slate-500">{String(time)}</p></div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        </section>
        <section className="portal-card border border-slate-200 bg-white p-5">
          <h3 className="m-0 text-base font-semibold text-slate-900">Quick actions</h3>
          <p className="mt-1 text-sm text-slate-500">Common tasks for your account.</p>
          <div className="mt-4 grid gap-2">
            <button onClick={() => setPage('messages')} className="flex items-center gap-3 border border-slate-200 bg-white p-3 text-left text-sm font-medium text-slate-700 hover:border-orange"><MessageSquare className="h-4 w-4 text-orange" /> Open messages <ChevronRight className="ml-auto h-4 w-4" /></button>
            <button onClick={() => setPage('rentals')} className="flex items-center gap-3 border border-slate-200 bg-white p-3 text-left text-sm font-medium text-slate-700 hover:border-orange"><Clock3 className="h-4 w-4 text-orange" /> View rental details <ChevronRight className="ml-auto h-4 w-4" /></button>
            <button onClick={() => setPage('settings')} className="flex items-center gap-3 border border-slate-200 bg-white p-3 text-left text-sm font-medium text-slate-700 hover:border-orange"><Settings className="h-4 w-4 text-orange" /> Update account details <ChevronRight className="ml-auto h-4 w-4" /></button>
          </div>
        </section>
      </div>
    </div>
  )
}

function OrdersPage({ role, showToast }: { role: PortalRole; showToast: (message: string) => void }) {
  const [selected, setSelected] = useState<(typeof orders)[number] | null>(null)

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="mb-4 inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-orange hover:text-orange"><ChevronLeft className="h-4 w-4" /> Back to orders</button>
        <section className="portal-card border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader title={`Order ${selected.id}`} description="Review the complete order, customer and delivery information." action={<StatusPill>{selected.status}</StatusPill>} />
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              <div className="border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Product</h3><div className="mt-4 flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center bg-orange-soft text-orange"><Package className="h-5 w-5" /></span><div><p className="font-medium text-slate-900">{selected.item}</p><p className="mt-1 text-sm text-slate-500">Quantity: 1 · Standard delivery</p><p className="mt-3 font-semibold text-navy">{selected.amount}</p></div></div></div>
              <div className="border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Delivery progress</h3><div className="mt-4 grid gap-3 sm:grid-cols-3">{['Order received', 'Payment confirmed', selected.status].map((step) => <div key={step} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {step}</div>)}</div></div>
            </div>
            <aside className="border border-slate-200 bg-slate-50 p-5"><h3 className="text-base font-semibold text-slate-900">Customer and delivery</h3><dl className="mt-4 space-y-4 text-sm"><div><dt className="text-slate-500">Customer</dt><dd className="mt-1 font-medium text-slate-900">{selected.customer}</dd></div><div><dt className="text-slate-500">Order date</dt><dd className="mt-1 font-medium text-slate-900">{selected.date}</dd></div><div><dt className="text-slate-500">Delivery address</dt><dd className="mt-1 text-slate-700">Kathmandu, Nepal</dd></div><div><dt className="text-slate-500">Payment</dt><dd className="mt-1 text-slate-700">Paid by bank transfer</dd></div></dl><div className="mt-6 grid gap-2"><PrimaryButton onClick={() => showToast('Order status updated successfully.')}><Check className="h-4 w-4" /> Update status</PrimaryButton><SecondaryButton onClick={() => showToast('Invoice download prepared.')}><Download className="h-4 w-4" /> Download invoice</SecondaryButton></div></aside>
          </div>
        </section>
      </div>
    )
  }

  return (
    <section className="portal-card border border-slate-200 bg-white p-5">
      <SectionHeader title={role === 'customer' ? 'My orders' : 'Orders'} description="Track orders, payments and delivery in one place." action={<PrimaryButton onClick={() => showToast('Order list exported successfully.')}><Download className="h-4 w-4" /> Export list</PrimaryButton>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="portal-input w-full pl-9" placeholder="Search by order, customer or product" /></label>
        <select className="portal-input sm:w-44"><option>All statuses</option><option>Paid</option><option>Preparing</option><option>Shipped</option><option>Delivered</option></select>
      </div>
      <div className="overflow-x-auto">
        <table className="portal-table min-w-[760px]">
          <thead><tr><th>Order</th>{role !== 'customer' && <th>Customer</th>}<th>Product</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>{orders.map((order) => <tr key={order.id}><td className="font-medium text-navy">{order.id}</td>{role !== 'customer' && <td>{order.customer}</td>}<td>{order.item}</td><td>{order.date}</td><td className="font-medium">{order.amount}</td><td><StatusPill>{order.status}</StatusPill></td><td><button onClick={() => setSelected(order)} className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-orange hover:text-orange"><Eye className="h-4 w-4" /> View details</button></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  )
}

function ProductsPage({ showToast }: { showToast: (message: string) => void }) {
  const [productRows, setProductRows] = useState(products)
  const [editing, setEditing] = useState<ManagedProduct | null>(null)
  const [viewing, setViewing] = useState<ManagedProduct | null>(null)
  const [originalSku, setOriginalSku] = useState<string | null>(null)
  const [deleteSku, setDeleteSku] = useState<string | null>(null)

  const beginEdit = (product?: ManagedProduct) => {
    const next: ManagedProduct = product || { name: '', sku: '', stock: 0, price: 'NPR 0', status: 'Draft', active: true, category: 'Patient Monitoring', brand: '', description: '', specifications: '', images: [] }
    setEditing({ ...next, images: [...next.images] })
    setOriginalSku(product?.sku || null)
    setViewing(null)
  }

  const saveProduct = (event: React.FormEvent) => {
    event.preventDefault()
    if (!editing?.name.trim() || !editing.sku.trim()) {
      showToast('Product name and product code are required.')
      return
    }
    setProductRows((current) => originalSku
      ? current.map((product) => product.sku === originalSku ? editing : product)
      : [editing, ...current])
    showToast(originalSku ? 'Product changes saved.' : 'Product added successfully.')
    setEditing(null)
    setOriginalSku(null)
  }

  const addImages = (files: FileList | null) => {
    if (!files || !editing) return
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))
    setEditing({ ...editing, images: [...editing.images, ...urls].slice(0, 8) })
  }

  const toggleActive = (sku: string) => {
    setProductRows((current) => current.map((product) => product.sku === sku ? { ...product, active: !product.active } : product))
    showToast('Product availability updated.')
  }

  const deleteProduct = (sku: string) => {
    setProductRows((current) => current.filter((product) => product.sku !== sku))
    setDeleteSku(null)
    showToast('Product deleted successfully.')
  }

  if (viewing) {
    return (
      <div>
        <button onClick={() => setViewing(null)} className="mb-4 inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-orange hover:text-orange hover:shadow-md"><ChevronLeft className="h-4 w-4" /> Back to products</button>
        <section className="portal-card border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader title={viewing.name} description={`${viewing.brand} · ${viewing.category}`} action={<div className="flex flex-wrap gap-2"><SecondaryButton onClick={() => beginEdit(viewing)}><Pencil className="h-4 w-4" /> Edit product</SecondaryButton><PrimaryButton onClick={() => toggleActive(viewing.sku)}>{viewing.active ? 'Set inactive' : 'Set active'}</PrimaryButton></div>} />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{viewing.images.map((image, index) => <div key={`${image}-${index}`} className="grid min-h-52 place-items-center border border-slate-200 bg-slate-50 p-4 shadow-sm"><img src={image} alt={`${viewing.name} view ${index + 1}`} className="max-h-48 w-full object-contain" /></div>)}</div>
              <div className="mt-5 border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Product description</h3><p className="mt-3 text-sm leading-7 text-slate-600">{viewing.description || 'No description added.'}</p></div>
              <div className="mt-5 border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Specifications</h3><div className="mt-3 space-y-2">{viewing.specifications.split('\n').filter(Boolean).map((line) => <p key={line} className="border-b border-slate-100 pb-2 text-sm text-slate-600">{line}</p>)}</div></div>
            </div>
            <aside className="h-fit border border-slate-200 bg-slate-50 p-5 shadow-sm"><h3 className="text-base font-semibold text-slate-900">Product information</h3><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-slate-500">Product code</dt><dd className="mt-1 font-medium text-slate-900">{viewing.sku}</dd></div><div><dt className="text-slate-500">Price</dt><dd className="mt-1 font-semibold text-navy">{viewing.price}</dd></div><div><dt className="text-slate-500">Available stock</dt><dd className="mt-1 font-medium text-slate-900">{viewing.stock}</dd></div><div><dt className="text-slate-500">Publishing status</dt><dd className="mt-1"><StatusPill>{viewing.status}</StatusPill></dd></div><div><dt className="text-slate-500">Customer visibility</dt><dd className="mt-1"><StatusPill>{viewing.active ? 'Active' : 'Inactive'}</StatusPill></dd></div></dl></aside>
          </div>
        </section>
      </div>
    )
  }

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="mb-4 inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-orange hover:text-orange hover:shadow-md"><ChevronLeft className="h-4 w-4" /> Back to products</button>
        <form onSubmit={saveProduct} className="portal-card border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader title={originalSku ? 'Edit product' : 'Add product'} description="Add complete customer-ready product information, images and specifications." action={<PrimaryButton type="submit"><Save className="h-4 w-4" /> Save product</PrimaryButton>} />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <section className="border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Basic information</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="portal-label sm:col-span-2">Product name<input autoFocus value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="portal-input mt-1 w-full" placeholder="Enter a clear product name" /></label><label className="portal-label">Product code<input value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} className="portal-input mt-1 w-full" placeholder="MB-PM-001" /></label><label className="portal-label">Brand<input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className="portal-input mt-1 w-full" placeholder="Brand name" /></label><label className="portal-label">Category<select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="portal-input mt-1 w-full"><option>Patient Monitoring</option><option>Diagnostic Imaging</option><option>Respiratory Care</option><option>Laboratory Equipment</option><option>Surgical Equipment</option><option>Hospital Furniture</option><option>Spare Parts</option></select></label><label className="portal-label">Available stock<input type="number" min="0" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="portal-input mt-1 w-full" /></label><label className="portal-label">Selling price<input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="portal-input mt-1 w-full" placeholder="NPR 285,000" /></label><label className="portal-label">Publishing status<select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ManagedProduct['status'] })} className="portal-input mt-1 w-full"><option>Draft</option><option>Published</option></select></label><label className="flex items-center gap-3 border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-orange" /> Active and visible to customers</label></div></section>
              <section className="border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Description and specifications</h3><div className="mt-4 grid gap-4"><label className="portal-label">Product description<textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="portal-input mt-1 min-h-28 w-full" placeholder="Describe the product, included items and warranty." /></label><label className="portal-label">Specifications<textarea value={editing.specifications} onChange={(e) => setEditing({ ...editing, specifications: e.target.value })} className="portal-input mt-1 min-h-36 w-full" placeholder={'Add one specification per line\nDisplay: 12.1 inch\nWarranty: 1 year'} /></label></div></section>
              <section className="border border-slate-200 p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-base font-semibold text-slate-900">Product images</h3><p className="mt-1 text-sm text-slate-500">Add up to 8 clear images. The first image is the main image.</p></div><label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-orange bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(242,106,26,0.2)] hover:-translate-y-0.5 hover:bg-orange-hover hover:shadow-md"><Plus className="h-4 w-4" /> Add images<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImages(e.target.files)} /></label></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{editing.images.map((image, index) => <div key={`${image}-${index}`} className="relative grid min-h-40 place-items-center border border-slate-200 bg-slate-50 p-3"><img src={image} alt={`Product preview ${index + 1}`} className="max-h-36 w-full object-contain" />{index === 0 && <span className="absolute left-2 top-2 bg-navy px-2 py-1 text-[11px] font-medium text-white">Main image</span>}<button type="button" aria-label={`Remove image ${index + 1}`} onClick={() => setEditing({ ...editing, images: editing.images.filter((_, imageIndex) => imageIndex !== index) })} className="absolute right-2 top-2 grid h-8 w-8 place-items-center border border-red-200 bg-white text-red-600 shadow-sm hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>)}{editing.images.length === 0 && <div className="sm:col-span-2 lg:col-span-3 border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">No images added yet.</div>}</div></section>
            </div>
            <aside className="h-fit border border-slate-200 bg-slate-50 p-5 shadow-sm xl:sticky xl:top-24"><Package className="h-8 w-8 text-orange" /><h3 className="mt-4 text-base font-semibold text-slate-900">Product checklist</h3><ul className="mt-3 space-y-3 text-sm text-slate-600"><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Add the product name, brand and category.</li><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Add clear images from several angles.</li><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Include useful specifications and warranty.</li><li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Check price, stock and visibility before saving.</li></ul><div className="mt-6 border-t border-slate-200 pt-5"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current state</p><div className="mt-3 flex flex-wrap gap-2"><StatusPill>{editing.status}</StatusPill><StatusPill>{editing.active ? 'Active' : 'Inactive'}</StatusPill><span className="inline-flex border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600">{editing.images.length} images</span></div></div></aside>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5"><SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton><PrimaryButton type="submit"><Save className="h-4 w-4" /> Save product</PrimaryButton></div>
        </form>
      </div>
    )
  }

  return (
    <section className="portal-card border border-slate-200 bg-white p-5">
      <SectionHeader title="Products" description="Manage product details, images, specifications, stock and customer visibility." action={<PrimaryButton onClick={() => beginEdit()}><Plus className="h-4 w-4" /> Add product</PrimaryButton>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="portal-input w-full pl-9" placeholder="Search products by name, code, brand or category" /></label><select className="portal-input sm:w-48"><option>All categories</option><option>Patient Monitoring</option><option>Respiratory Care</option><option>Hospital Furniture</option></select><select className="portal-input sm:w-40"><option>All products</option><option>Active</option><option>Inactive</option><option>Draft</option></select></div>
      <div className="overflow-x-auto"><table className="portal-table min-w-[1040px]"><thead><tr><th>Product</th><th>Category / brand</th><th>Product code</th><th>Stock</th><th>Price</th><th>Status</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>{productRows.map((product) => <tr key={product.sku}><td><div className="flex items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center border border-slate-200 bg-slate-50 p-1"><img src={product.images[0] || '/assets/generated/category-monitoring.png'} alt="" className="h-full w-full object-contain" /></span><span className="font-medium text-slate-900">{product.name}</span></div></td><td><span className="block text-slate-800">{product.category}</span><span className="text-xs text-slate-500">{product.brand}</span></td><td>{product.sku}</td><td>{product.stock}</td><td className="font-medium">{product.price}</td><td><StatusPill>{product.status}</StatusPill></td><td><button onClick={() => toggleActive(product.sku)} className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold shadow-sm ${product.active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><span className={`h-2 w-2 ${product.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />{product.active ? 'Active' : 'Inactive'}</button></td><td><div className="flex items-center gap-2"><button title="View product" aria-label={`View ${product.name}`} className="grid h-10 w-10 place-items-center border border-blue-200 bg-blue-50 text-blue-700 shadow-sm hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md" onClick={() => setViewing(product)}><Eye className="h-4 w-4" /></button><button title="Edit product" aria-label={`Edit ${product.name}`} className="grid h-10 w-10 place-items-center border border-orange/30 bg-orange-soft text-orange shadow-sm hover:-translate-y-0.5 hover:bg-orange hover:text-white hover:shadow-md" onClick={() => beginEdit(product)}><Pencil className="h-4 w-4" /></button>{deleteSku === product.sku ? <div className="flex items-center gap-1 border border-red-200 bg-red-50 p-1"><button onClick={() => deleteProduct(product.sku)} className="px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">Confirm</button><button onClick={() => setDeleteSku(null)} className="px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white">Cancel</button></div> : <button title="Delete product" aria-label={`Delete ${product.name}`} className="grid h-10 w-10 place-items-center border border-red-200 bg-red-50 text-red-600 shadow-sm hover:-translate-y-0.5 hover:bg-red-600 hover:text-white hover:shadow-md" onClick={() => setDeleteSku(product.sku)}><Trash2 className="h-4 w-4" /></button>}</div></td></tr>)}</tbody></table></div>
    </section>
  )
}

function RentalsPage({ role, showToast }: { role: PortalRole; showToast: (message: string) => void }) {
  const [selected, setSelected] = useState<(typeof rentals)[number] | null>(null)
  const shownRentals = role === 'customer' ? rentals.slice(0, 1) : rentals
  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-orange"><ChevronLeft className="h-4 w-4" /> Back to rentals</button>
        <div className="portal-card border border-slate-200 bg-white p-5">
          <SectionHeader title={`Rental ${selected.id}`} description="Complete rental information, charges and delivery notes." action={<StatusPill>{selected.status}</StatusPill>} />
          <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
            <div className="space-y-5">
              <div className="border border-slate-200 p-5">
                <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center bg-orange-soft text-orange"><Clock3 className="h-6 w-6" /></span><div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Equipment</p><h3 className="mt-1 text-lg font-semibold text-slate-900">{selected.item}</h3><p className="text-sm text-slate-500">Model: {selected.model}</p></div></div>
                <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  <div><dt className="text-xs text-slate-500">Start date</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selected.start}</dd></div>
                  <div><dt className="text-xs text-slate-500">Planned return</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selected.end}</dd></div>
                  <div><dt className="text-xs text-slate-500">Rental charge</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selected.rent}</dd></div>
                  <div><dt className="text-xs text-slate-500">Refundable deposit</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selected.deposit}</dd></div>
                </dl>
              </div>
              <div className="border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Delivery and included items</h3><p className="mt-3 flex gap-2 text-sm text-slate-600"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{selected.delivery}</p><p className="mt-3 text-sm leading-6 text-slate-600">{selected.notes}</p></div>
            </div>
            <div className="space-y-5">
              <div className="border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Customer</h3><p className="mt-3 text-sm font-medium text-slate-900">{selected.customer}</p><p className="mt-1 text-sm text-slate-500">{selected.contact}</p><SecondaryButton onClick={() => showToast('Customer contact details copied.')}><UserRound className="h-4 w-4" /> Contact customer</SecondaryButton></div>
              <div className="border border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">Rental progress</h3><div className="mt-4 space-y-4">{['Booking confirmed', 'Equipment delivered', 'Rental is active', 'Return inspection'].map((step, index) => <div key={step} className="flex gap-3"><span className={`grid h-6 w-6 shrink-0 place-items-center border ${index < 3 ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white text-slate-400'}`}>{index < 3 ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><div><p className="text-sm font-medium text-slate-800">{step}</p><p className="text-xs text-slate-500">{index < 3 ? 'Completed' : `Planned for ${selected.end}`}</p></div></div>)}</div></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <section className="portal-card border border-slate-200 bg-white p-5">
      <SectionHeader title={role === 'customer' ? 'My rentals' : 'Rentals'} description="See equipment, dates, charges, deposits and return details." />
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{shownRentals.map((rental) => <article key={rental.id} className="portal-card border border-slate-200 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-orange">{rental.id}</p><h3 className="mt-1 text-base font-semibold text-slate-900">{rental.item}</h3><p className="mt-1 text-sm text-slate-500">{rental.model}</p></div><StatusPill>{rental.status}</StatusPill></div><div className="my-4 space-y-2 border-y border-slate-100 py-4 text-sm"><p className="flex justify-between gap-3"><span className="text-slate-500">Customer</span><span className="text-right font-medium text-slate-800">{rental.customer}</span></p><p className="flex justify-between gap-3"><span className="text-slate-500">Rental period</span><span className="text-right font-medium text-slate-800">{rental.period}</span></p><p className="flex justify-between gap-3"><span className="text-slate-500">Charge</span><span className="text-right font-medium text-slate-800">{rental.rent}</span></p><p className="flex justify-between gap-3"><span className="text-slate-500">Deposit</span><span className="text-right font-medium text-slate-800">{rental.deposit}</span></p></div><PrimaryButton onClick={() => setSelected(rental)}>View rental details <ChevronRight className="h-4 w-4" /></PrimaryButton></article>)}</div>
    </section>
  )
}

function DocumentsPage({ role, showToast }: { role: PortalRole; showToast: (message: string) => void }) {
  const [selectedDocument, setSelectedDocument] = useState(documentList[0])
  return (
    <div>
      <button className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-orange" onClick={() => showToast('Returned to the vendor list.')}><ChevronLeft className="h-4 w-4" /> Back to registry</button>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-sm font-medium text-orange">Vendor document check / MediTech Solutions Pvt. Ltd.</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">Company verification documents</h2><p className="mt-2 max-w-3xl text-sm text-slate-500">Review the documents provided by this vendor. All five required documents are available and up to date.</p></div>
        <StatusPill>Verified</StatusPill>
      </div>
      <div className="grid gap-5 2xl:grid-cols-[390px_1fr]">
        <aside className="space-y-5">
          <section className="portal-card border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-base font-semibold text-slate-900">Required company documents</h3><span className="text-sm font-medium text-emerald-700">5 of 5</span></div>
            <div className="space-y-2">{documentList.map((doc) => <button key={doc.id} onClick={() => setSelectedDocument(doc)} className={`w-full border p-3 text-left ${selectedDocument.id === doc.id ? 'border-orange bg-orange-soft' : 'border-slate-200 bg-white hover:border-slate-300'}`}><div className="flex items-start gap-3"><FileCheck2 className={`mt-0.5 h-4 w-4 shrink-0 ${selectedDocument.id === doc.id ? 'text-orange' : 'text-emerald-600'}`} /><div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{doc.name}</p><p className="mt-1 text-xs text-slate-500">Verified · Updated {doc.updated}</p></div></div></button>)}</div>
          </section>
          <section className="portal-card border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">Company details</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Registered name</dt><dd className="mt-1 font-medium text-slate-900">MediTech Solutions Pvt. Ltd.</dd></div><div><dt className="text-slate-500">Business tax number</dt><dd className="mt-1 font-medium text-slate-900">601248991</dd></div><div><dt className="text-slate-500">Registration number</dt><dd className="mt-1 font-medium text-slate-900">214589/078/079</dd></div><div><dt className="text-slate-500">Location</dt><dd className="mt-1 font-medium text-slate-900">New Baneshwar, Kathmandu, Nepal</dd></div></dl></section>
        </aside>
        <section className="portal-card border border-slate-200 bg-white p-5">
          <SectionHeader title={selectedDocument.name} description={`Document code: ${selectedDocument.id} · Clear document preview`} action={<SecondaryButton onClick={() => showToast(`${selectedDocument.name} downloaded.`)}><Download className="h-4 w-4" /> Download</SecondaryButton>} />
          <div className="mx-auto max-w-3xl border border-slate-300 bg-white p-8 shadow-sm sm:p-12">
            <div className="flex items-start justify-between gap-5 border-b-2 border-navy pb-6"><img src={BRAND.logo} alt="Mediko Bazaar" className="h-12 w-auto object-contain" /><div className="text-right"><p className="text-sm font-semibold text-navy">{selectedDocument.name}</p><p className="mt-1 text-xs text-slate-500">Reference {selectedDocument.id}</p></div></div>
            <div className="py-10 text-center"><ShieldCheck className="mx-auto h-12 w-12 text-emerald-600" /><h3 className="mt-4 text-xl font-semibold text-slate-900">MediTech Solutions Pvt. Ltd.</h3><p className="mt-2 text-sm text-slate-500">This document has been checked and approved.</p></div>
            <div className="grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-2"><div><p className="text-xs text-slate-500">Issued to</p><p className="mt-1 text-sm font-medium text-slate-900">MediTech Solutions Pvt. Ltd.</p></div><div><p className="text-xs text-slate-500">Issue location</p><p className="mt-1 text-sm font-medium text-slate-900">Kathmandu, Nepal</p></div><div><p className="text-xs text-slate-500">Document number</p><p className="mt-1 text-sm font-medium text-slate-900">{selectedDocument.id}-2026-4891</p></div><div><p className="text-xs text-slate-500">Last checked</p><p className="mt-1 text-sm font-medium text-slate-900">08 Sep 2026</p></div></div>
            <p className="mt-8 text-sm leading-7 text-slate-600">The company details in this document match the information submitted to Mediko Bazaar. The document is clear, current and suitable for vendor account verification.</p>
            <div className="mt-12 flex items-end justify-between gap-5"><div><div className="h-px w-40 bg-slate-400" /><p className="mt-2 text-xs text-slate-500">Authorised signature</p></div><span className="border border-emerald-600 px-3 py-2 text-xs font-semibold text-emerald-700">VERIFIED</span></div>
          </div>
          {role === 'admin' && <div className="mt-5 flex justify-end gap-3"><SecondaryButton onClick={() => showToast('A document update was requested from the vendor.')}>Request update</SecondaryButton><PrimaryButton onClick={() => showToast('Vendor documents approved.')}><CheckCircle2 className="h-4 w-4" /> Approve documents</PrimaryButton></div>}
        </section>
      </div>
    </div>
  )
}

function ChatPage({ role }: { role: PortalRole }) {
  const [threads, setThreads] = useState(() => makeThreads(role))
  const [activeId, setActiveId] = useState(threads[0].id)
  const [message, setMessage] = useState('')
  const [connection, setConnection] = useState<'connecting' | 'live' | 'demo'>('connecting')
  const socketRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const active = threads.find((thread) => thread.id === activeId) || threads[0]

  useEffect(() => {
    const defaultUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:5000/chat`
    const url = import.meta.env.VITE_CHAT_WS_URL || defaultUrl
    let socket: WebSocket | null = null
    try {
      socket = new WebSocket(url)
      socketRef.current = socket
      socket.onopen = () => {
        setConnection('live')
        socket?.send(JSON.stringify({ type: 'join', conversationId: activeId, role, name: roleDetails[role].person }))
      }
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type !== 'message' || !data.message) return
          setThreads((current) => current.map((thread) => thread.id === data.conversationId ? { ...thread, messages: [...thread.messages, data.message] } : thread))
        } catch { /* Ignore invalid messages. */ }
      }
      socket.onerror = () => setConnection('demo')
      socket.onclose = () => setConnection('demo')
    } catch { setConnection('demo') }
    return () => {
      socket?.close()
      socketRef.current = null
    }
  }, [role])

  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify({ type: 'join', conversationId: activeId, role, name: roleDetails[role].person }))
  }, [activeId, role])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active.messages.length])

  const sendMessage = () => {
    const body = message.trim()
    if (!body) return
    const newMessage: Message = { id: `local-${Date.now()}`, sender: 'You', role: roleDetails[role].title, body, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mine: true }
    setThreads((current) => current.map((thread) => thread.id === activeId ? { ...thread, messages: [...thread.messages, newMessage] } : thread))
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify({ type: 'message', conversationId: activeId, message: { ...newMessage, mine: false, sender: roleDetails[role].person } }))
    setMessage('')
  }

  return (
    <div className="portal-card min-h-[680px] overflow-hidden border border-slate-200 bg-white">
      <div className="grid min-h-[680px] lg:grid-cols-[310px_1fr] 2xl:grid-cols-[310px_1fr_260px]">
        <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-4"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-slate-900">Messages</h2><p className="text-xs text-slate-500">All conversations</p></div><span className={`flex items-center gap-1.5 text-xs font-medium ${connection === 'live' ? 'text-emerald-700' : 'text-slate-500'}`}><span className={`h-2 w-2 ${connection === 'live' ? 'bg-emerald-500' : 'bg-slate-400'}`} />{connection === 'live' ? 'Live' : connection === 'connecting' ? 'Connecting' : 'Ready'}</span></div><label className="relative mt-4 block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className="portal-input w-full py-2 pl-9" placeholder="Search conversations" /></label></div>
          <div className="max-h-[230px] overflow-y-auto lg:max-h-[600px]">{threads.map((thread) => <button key={thread.id} onClick={() => setActiveId(thread.id)} className={`w-full border-b border-slate-200 p-4 text-left ${activeId === thread.id ? 'bg-white shadow-[inset_3px_0_0_#F26A1A]' : 'bg-transparent hover:bg-white'}`}><div className="flex gap-3"><span className="relative grid h-10 w-10 shrink-0 place-items-center bg-navy text-sm font-medium text-white">{thread.participant.split(' ').map((name) => name[0]).join('').slice(0, 2)}{thread.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-white bg-emerald-500" />}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-medium text-slate-900">{thread.participant}</p>{thread.unread && <span className="grid h-5 min-w-5 place-items-center bg-orange px-1 text-xs text-white">{thread.unread}</span>}</div><p className="mt-0.5 text-xs text-slate-500">{thread.participantRole} · {thread.title}</p><p className="mt-1 truncate text-xs text-slate-400">{thread.messages.at(-1)?.body}</p></div></div></button>)}</div>
        </aside>
        <section className="flex min-h-[560px] flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center bg-orange-soft text-orange"><MessageSquare className="h-5 w-5" /></span><div><h3 className="text-sm font-semibold text-slate-900">{active.title}</h3><p className="text-xs text-slate-500">{active.participant} · {active.subtitle}</p></div></div><button className="grid h-9 w-9 place-items-center border border-slate-200 text-slate-500"><Bell className="h-4 w-4" /></button></header>
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#F7F9FC] p-5">{active.messages.map((item) => <div key={item.id} className={`flex ${item.mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] border px-4 py-3 ${item.mine ? 'border-navy bg-navy text-white' : 'border-slate-200 bg-white text-slate-800'}`}><div className="mb-1 flex items-center gap-2"><span className={`text-xs font-medium ${item.mine ? 'text-white' : 'text-slate-900'}`}>{item.sender}</span><span className={`text-[11px] ${item.mine ? 'text-white/70' : 'text-slate-400'}`}>{item.role}</span></div><p className="text-sm leading-6">{item.body}</p><p className={`mt-1 text-right text-[11px] ${item.mine ? 'text-white/60' : 'text-slate-400'}`}>{item.time}</p></div></div>)}<div ref={bottomRef} /></div>
          <div className="border-t border-slate-200 bg-white p-4"><div className="flex items-end gap-2"><button className="grid h-10 w-10 shrink-0 place-items-center border border-slate-300 text-slate-500"><Paperclip className="h-4 w-4" /></button><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage() } }} rows={1} className="portal-input min-h-10 flex-1 resize-none" placeholder="Write a message" /><PrimaryButton onClick={sendMessage}><Send className="h-4 w-4" /> Send</PrimaryButton></div><p className="mt-2 text-xs text-slate-400">Messages are shared with the selected customer, vendor, admin or engineer.</p></div>
        </section>
        <aside className="hidden border-l border-slate-200 bg-white p-5 2xl:block"><h3 className="text-sm font-semibold text-slate-900">Conversation details</h3><div className="mt-5 text-center"><span className="mx-auto grid h-14 w-14 place-items-center bg-navy text-base font-medium text-white">{active.participant.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span><p className="mt-3 text-sm font-semibold text-slate-900">{active.participant}</p><p className="text-xs text-slate-500">{active.participantRole}</p></div><dl className="mt-6 space-y-4 border-t border-slate-200 pt-5 text-sm"><div><dt className="text-xs text-slate-500">Topic</dt><dd className="mt-1 font-medium text-slate-800">{active.title}</dd></div><div><dt className="text-xs text-slate-500">Status</dt><dd className="mt-1"><StatusPill>Active</StatusPill></dd></div><div><dt className="text-xs text-slate-500">Shared files</dt><dd className="mt-1 font-medium text-slate-800">2 documents</dd></div></dl></aside>
      </div>
    </div>
  )
}

function ServicePage({ role, showToast }: { role: PortalRole; showToast: (message: string) => void }) {
  return <section className="portal-card border border-slate-200 bg-white p-5"><SectionHeader title={role === 'engineer' ? 'Assigned jobs' : 'Service requests'} description="Track equipment service, visits and assigned engineers." /> <div className="grid gap-4">{serviceJobs.map((job) => <article key={job.id} className="border border-slate-200 p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><span className="text-sm font-medium text-orange">{job.id}</span><StatusPill>{job.status}</StatusPill></div><h3 className="mt-2 text-base font-semibold text-slate-900">{job.equipment}</h3><p className="mt-1 text-sm text-slate-500">{job.customer} · {job.date}</p></div><div className="flex flex-wrap gap-2"><SecondaryButton onClick={() => showToast(`${job.id} details opened.`)}>View job</SecondaryButton><PrimaryButton onClick={() => showToast(`${job.id} has been updated.`)}><CheckCircle2 className="h-4 w-4" /> Update status</PrimaryButton></div></div><div className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">Assigned engineer: <span className="font-medium text-slate-800">{job.engineer}</span></div></article>)}</div></section>
}

function ReportsPage({ role, showToast }: { role: PortalRole; showToast: (message: string) => void }) {
  return <div><SectionHeader title={role === 'engineer' ? 'Service reports' : 'Reports'} description="Clear summaries for sales, rentals and service work." action={<PrimaryButton onClick={() => showToast('Report downloaded.')}><Download className="h-4 w-4" /> Download report</PrimaryButton>} /><div className="grid gap-4 md:grid-cols-3"><MetricCard label="Orders completed" value="94" note="During the selected month" icon={CheckCircle2} /><MetricCard label="Rental use" value="82%" note="Equipment currently in use" icon={Clock3} tone="orange" /><MetricCard label="Service completion" value="96%" note="Finished within planned time" icon={Wrench} tone="green" /></div><section className="portal-card mt-5 border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">Monthly summary</h3><div className="mt-6 grid h-64 grid-cols-6 items-end gap-3 border-b border-slate-200 px-2">{[48, 62, 54, 78, 70, 88].map((height, index) => <div key={index} className="flex h-full flex-col justify-end gap-2"><div className="bg-navy" style={{ height: `${height}%` }} /><span className="pb-2 text-center text-xs text-slate-500">{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][index]}</span></div>)}</div></section></div>
}

function PeoplePage() {
  const people = [['MediTech Solutions', 'Vendor', 'Verified', '46 products'], ['Ramesh Karki', 'Customer', 'Active', 'Bir Hospital'], ['Suman Adhikari', 'Engineer', 'Available', '18 completed jobs'], ['Patan Hospital', 'Customer', 'Active', '12 orders']]
  return <section className="portal-card border border-slate-200 bg-white p-5"><SectionHeader title="Customers and vendors" description="Manage people and companies using the marketplace." /><div className="grid gap-3 sm:grid-cols-2">{people.map(([name, type, status, note]) => <article key={name} className="flex items-center gap-4 border border-slate-200 p-4"><span className="grid h-11 w-11 shrink-0 place-items-center bg-navy text-sm font-medium text-white">{name.split(' ').map((item) => item[0]).join('').slice(0, 2)}</span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-slate-900">{name}</h3><p className="text-xs text-slate-500">{type} · {note}</p></div><StatusPill>{status}</StatusPill></article>)}</div></section>
}

function InvoicesPage({ showToast }: { showToast: (message: string) => void }) {
  const downloadInvoice = async () => {
    await generateTaxInvoicePDF({ invoiceNumber: 'MB-INV-2026-1048', orderNumber: 'MB-28491', issueDate: '08 Sep 2026', dueDate: '18 Sep 2026', buyerName: 'Ramesh Karki', buyerOrg: 'Bir Hospital', buyerAddress: 'Kathmandu, Nepal', buyerPhone: '+977 985-1117186', paymentMethod: 'Bank transfer', paymentStatus: 'Paid', items: [{ sn: 1, description: 'Patient Monitor MEC-1200', qty: 1, rate: 285000, amount: 285000 }], subtotal: 285000, taxableAmount: 285000, vatAmount: 37050, shippingCharge: 2500, grandTotal: 324550 })
    showToast('Official invoice downloaded.')
  }
  return <section className="portal-card border border-slate-200 bg-white p-5"><SectionHeader title="Invoices" description="View and download invoices for your orders and rentals." /><div className="border border-slate-200 p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center bg-orange-soft text-orange"><ReceiptText className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-slate-900">Invoice MB-INV-2026-1048</p><p className="text-xs text-slate-500">Order MB-28491 · 08 Sep 2026 · NPR 324,550</p></div></div><PrimaryButton onClick={downloadInvoice}><Download className="h-4 w-4" /> Download PDF</PrimaryButton></div></div></section>
}

function SettingsPage({ role, showToast }: { role: PortalRole; showToast: (message: string) => void }) {
  const [settings, setSettings] = useState({ company: role === 'vendor' ? 'MediTech Solutions Pvt. Ltd.' : role === 'admin' ? 'Mediko Bazaar Pvt. Ltd.' : roleDetails[role].person, email: role === 'admin' ? 'info@medikobazaar.com' : 'account@medikobazaar.com', phone: '+977 985-1117186', address: 'New Baneshwar, Kathmandu, Nepal', tax: '600123456', orderEmails: true, rentalAlerts: true, serviceAlerts: true, chatAlerts: true, allowQuotes: true, showPrices: true, requireDeposit: true, currency: 'NPR', taxRate: '13', invoicePrefix: 'MB-INV', deliveryFee: '250', serviceBookings: true, rentalProducts: true, usedProducts: true, engineerDirectory: true, liveChat: true, maintenanceNotice: false })
  const update = (key: keyof typeof settings, value: string | boolean) => setSettings((current) => ({ ...current, [key]: value }))
  return (
    <div>
      <SectionHeader title={role === 'admin' ? 'Company settings' : role === 'vendor' ? 'Store settings' : 'Profile settings'} description={role === 'admin' ? 'Update the website, company details, orders, rentals, service and notifications.' : 'Keep your account and contact information up to date.'} action={<PrimaryButton onClick={() => showToast('Settings saved successfully.')}><Check className="h-4 w-4" /> Save changes</PrimaryButton>} />
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <section className="portal-card border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">{role === 'customer' || role === 'engineer' ? 'Contact details' : 'Company information'}</h3><p className="mt-1 text-sm text-slate-500">This information appears on your account and official documents.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="portal-label sm:col-span-2">{role === 'customer' || role === 'engineer' ? 'Full name' : 'Company name'}<input value={settings.company} onChange={(e) => update('company', e.target.value)} className="portal-input mt-1 w-full" /></label><label className="portal-label">Email address<input value={settings.email} onChange={(e) => update('email', e.target.value)} className="portal-input mt-1 w-full" /></label><label className="portal-label">Phone number<input value={settings.phone} onChange={(e) => update('phone', e.target.value)} className="portal-input mt-1 w-full" /></label><label className="portal-label sm:col-span-2">Address<input value={settings.address} onChange={(e) => update('address', e.target.value)} className="portal-input mt-1 w-full" /></label>{(role === 'admin' || role === 'vendor') && <label className="portal-label">Business tax number<input value={settings.tax} onChange={(e) => update('tax', e.target.value)} className="portal-input mt-1 w-full" /></label>}</div></section>
          {(role === 'admin' || role === 'vendor') && <section className="portal-card border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">Website and order options</h3><p className="mt-1 text-sm text-slate-500">Control the main features customers can use.</p><div className="mt-4 divide-y divide-slate-100">{[["allowQuotes", 'Allow quote requests', 'Customers can ask for a price before ordering.'], ['showPrices', 'Show product prices', 'Display prices on product pages.'], ['requireDeposit', 'Require a rental deposit', 'Ask for a refundable deposit before a rental starts.']].map(([key, title, note]) => <label key={key} className="flex cursor-pointer items-center gap-4 py-4"><span className="flex-1"><span className="block text-sm font-medium text-slate-900">{title}</span><span className="mt-1 block text-xs text-slate-500">{note}</span></span><input type="checkbox" checked={Boolean(settings[key as keyof typeof settings])} onChange={(e) => update(key as keyof typeof settings, e.target.checked)} className="h-4 w-4 accent-orange" /></label>)}</div></section>}
          {role === 'admin' && <section className="portal-card border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">Payments and invoices</h3><p className="mt-1 text-sm text-slate-500">Update the values used across checkout, orders and downloadable documents.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="portal-label">Currency<input value={settings.currency} onChange={(e) => update('currency', e.target.value)} className="portal-input mt-1 w-full" /></label><label className="portal-label">Tax rate (%)<input value={settings.taxRate} onChange={(e) => update('taxRate', e.target.value)} className="portal-input mt-1 w-full" /></label><label className="portal-label">Invoice number prefix<input value={settings.invoicePrefix} onChange={(e) => update('invoicePrefix', e.target.value)} className="portal-input mt-1 w-full" /></label><label className="portal-label">Standard delivery fee<input value={settings.deliveryFee} onChange={(e) => update('deliveryFee', e.target.value)} className="portal-input mt-1 w-full" /></label></div></section>}
          {role === 'admin' && <section className="portal-card border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">Website features</h3><p className="mt-1 text-sm text-slate-500">Turn customer-facing services on or off without changing the website code.</p><div className="mt-4 grid gap-x-8 sm:grid-cols-2">{[['serviceBookings', 'Service bookings'], ['rentalProducts', 'Rental products'], ['usedProducts', 'Used products'], ['engineerDirectory', 'Engineer directory'], ['liveChat', 'Live messages'], ['maintenanceNotice', 'Maintenance notice']].map(([key, label]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-3 border-b border-slate-100 py-4 text-sm text-slate-700"><span>{label}</span><input type="checkbox" checked={Boolean(settings[key as keyof typeof settings])} onChange={(e) => update(key as keyof typeof settings, e.target.checked)} className="h-4 w-4 accent-orange" /></label>)}</div></section>}
        </div>
        <aside className="space-y-5">
          <section className="portal-card border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">Notifications</h3><p className="mt-1 text-sm text-slate-500">Choose which updates you receive.</p><div className="mt-4 space-y-4">{[['orderEmails', 'Order updates'], ['rentalAlerts', 'Rental reminders'], ['serviceAlerts', 'Service updates'], ['chatAlerts', 'New messages']].map(([key, label]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-700"><span>{label}</span><input type="checkbox" checked={Boolean(settings[key as keyof typeof settings])} onChange={(e) => update(key as keyof typeof settings, e.target.checked)} className="h-4 w-4 accent-orange" /></label>)}</div></section>
          <section className="portal-card border border-slate-200 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">Account security</h3><p className="mt-2 text-sm leading-6 text-slate-500">Your account is protected. Review access regularly and update your password when needed.</p><div className="mt-4"><SecondaryButton onClick={() => showToast('Password update page opened.')}><ShieldCheck className="h-4 w-4" /> Change password</SecondaryButton></div></section>
        </aside>
      </div>
    </div>
  )
}

function SimplePage({ page, showToast }: { page: string; showToast: (message: string) => void }) {
  const labels: Record<string, [string, string]> = {
    enquiries: ['Customer requests', 'Review product questions and quote requests.'],
    payments: ['Payments', 'Track completed and upcoming payments.'],
    schedule: ['Schedule', 'Plan service visits and keep customers informed.'],
  }
  const rows: Record<string, Array<[string, string, string]>> = {
    enquiries: [['Quote request for ICU monitor', 'Bir Hospital · Received 20 minutes ago', 'New'], ['Availability of oxygen concentrator', 'Ramesh Karki · Received today', 'Replied'], ['Hospital bed bulk order', 'Green City Hospital · Received yesterday', 'In review']],
    payments: [['Payment for order MB-28491', 'NPR 324,550 · Bank transfer', 'Paid'], ['Rental payment MB-R-1048', 'NPR 22,500 · Due 14 Oct 2026', 'Upcoming'], ['Service payment MB-S-887', 'NPR 8,500 · Card payment', 'Paid']],
    schedule: [['ICU monitor maintenance', 'Bir Hospital · Today, 10:30 AM', 'Confirmed'], ['Ventilator inspection', 'Grande Hospital · Tomorrow, 2:00 PM', 'Confirmed'], ['Oxygen system installation', 'Bhaktapur Clinic · 14 Oct, 11:00 AM', 'Needs review']],
  }
  const [title, description] = labels[page] || ['Page', 'Manage information here.']
  const items = rows[page] || []
  return <section className="portal-card border border-slate-200 bg-white p-5"><SectionHeader title={title} description={description} action={<PrimaryButton onClick={() => showToast(`${title} list exported successfully.`)}><Download className="h-4 w-4" /> Export list</PrimaryButton>} /><div className="grid gap-3">{items.map(([name, detail, status]) => <article key={name} className="flex flex-col gap-3 border border-slate-200 p-4 shadow-sm sm:flex-row sm:items-center"><span className="grid h-10 w-10 shrink-0 place-items-center bg-orange-soft text-orange"><ClipboardCheck className="h-4 w-4" /></span><div className="flex-1"><p className="text-sm font-medium text-slate-900">{name}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div><StatusPill>{status}</StatusPill><SecondaryButton onClick={() => showToast(`${name} opened.`)}><Eye className="h-4 w-4" /> View details</SecondaryButton></article>)}</div></section>
}

export default function PortalWorkspace({ role, navigate }: { role: PortalRole; navigate: NavProps['navigate'] }) {
  const [page, setPage] = useState('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const detail = roleDetails[role]
  const navItems = navByRole[role]
  const currentLabel = navItems.find((item) => item.key === page)?.label || 'Overview'
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2800) }
  const signedInRole = sessionStorage.getItem('mediko_portal_role')

  const content = useMemo(() => {
    if (page === 'overview') return <Overview role={role} setPage={setPage} />
    if (page === 'orders') return <OrdersPage role={role} showToast={showToast} />
    if (page === 'products') return <ProductsPage showToast={showToast} />
    if (page === 'rentals') return <RentalsPage role={role} showToast={showToast} />
    if (page === 'documents') return <DocumentsPage role={role} showToast={showToast} />
    if (page === 'people') return <PeoplePage />
    if (page === 'service') return <ServicePage role={role} showToast={showToast} />
    if (page === 'messages') return <ChatPage role={role} />
    if (page === 'reports') return <ReportsPage role={role} showToast={showToast} />
    if (page === 'invoices') return <InvoicesPage showToast={showToast} />
    if (page === 'settings') return <SettingsPage role={role} showToast={showToast} />
    return <SimplePage page={page} showToast={showToast} />
  }, [page, role])

  if (signedInRole !== role) {
    const handleQuickEnter = () => {
      sessionStorage.setItem('mediko_portal_role', role)
      sessionStorage.setItem('mediko_portal_name', detail.person)
      window.location.reload()
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FA] p-5">
        <section className="portal-card w-full max-w-md border border-slate-200 bg-white p-7 text-center shadow-xl rounded-2xl">
          <img src={BRAND.logo} alt="Mediko Bazaar" className="mx-auto h-12 w-auto object-contain" />
          <div className="mx-auto mt-5 h-12 w-12 rounded-full bg-orange-soft flex items-center justify-center text-orange shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-xl font-bold text-slate-900">{detail.title}</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Access credentials for <strong>{detail.person}</strong> ({detail.caption}).
          </p>
          <div className="mt-5 space-y-2">
            <PrimaryButton onClick={handleQuickEnter}>
              <UserRound className="h-4 w-4" /> Continue to {detail.title}
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('customer-auth')}>
              Switch or Sign In to Another Account
            </SecondaryButton>
          </div>
          <button onClick={() => navigate('home')} className="mt-4 text-xs font-semibold text-slate-500 hover:text-orange cursor-pointer border-0 bg-transparent">
            ← Return to Mediko Bazaar Storefront
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="portal-shell min-h-screen bg-[#F4F7FA] text-slate-800">
      {toast && <div className="fixed right-4 top-4 z-[80] flex max-w-sm items-center gap-2 border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg"><CheckCircle2 className="h-4 w-4 shrink-0" />{toast}</div>}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#071B45] text-white transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5"><button onClick={() => navigate('home')} className="flex items-center gap-3 text-left"><img src={BRAND.logo} alt="Mediko Bazaar" className="h-10 w-auto object-contain brightness-0 invert" /><span><span className="block text-sm font-semibold">Mediko Bazaar</span><span className="block text-xs text-white/60">{detail.title}</span></span></button><button onClick={() => setMobileNav(false)} className="grid h-9 w-9 place-items-center text-white lg:hidden"><X className="h-5 w-5" /></button></div>
        <nav className="flex-1 overflow-y-auto px-3 py-5"><p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-white/40">Workspace</p><div className="space-y-1">{navItems.map(({ key, label, icon: Icon, badge }) => <button key={key} onClick={() => { setPage(key); setMobileNav(false) }} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition ${page === key ? 'bg-orange text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}><Icon className="h-4 w-4 shrink-0" /><span className="flex-1">{label}</span>{badge ? <span className={`${page === key ? 'bg-white text-orange' : 'bg-white/10 text-white'} px-1.5 py-0.5 text-xs font-medium`}>{badge}</span> : null}</button>)}</div></nav>
        <div className="border-t border-white/10 p-4"><div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center bg-white/10 text-sm font-medium">{detail.initials}</span><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{sessionStorage.getItem('mediko_portal_name') || detail.person}</p><p className="truncate text-xs text-white/55">{detail.caption}</p></div></div><button onClick={() => { sessionStorage.removeItem('mediko_portal_role'); sessionStorage.removeItem('mediko_portal_name'); navigate('customer-auth') }} className="flex w-full items-center gap-2 border border-white/15 px-3 py-2 text-sm text-white/75 hover:bg-white/10"><LogOut className="h-4 w-4" /> Sign out</button></div>
      </aside>
      {mobileNav && <button aria-label="Close menu" onClick={() => setMobileNav(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />}
      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 xl:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="grid h-10 w-10 place-items-center border border-slate-200 text-slate-600 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-xs text-slate-500">{detail.title}</p><h1 className="text-lg font-semibold text-slate-900">{currentLabel}</h1></div></div><div className="flex items-center gap-2"><button className="relative grid h-10 w-10 place-items-center border border-slate-200 text-slate-600"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-2 w-2 bg-orange" /></button><button onClick={() => navigate('home')} className="hidden min-h-10 items-center gap-2 border border-slate-200 px-3 text-sm font-medium text-slate-700 sm:flex"><Home className="h-4 w-4" /> Main website</button></div></header>
        <main className="w-full p-4 sm:p-6 xl:p-8">{content}</main>
      </div>
    </div>
  )
}
