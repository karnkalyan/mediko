import { useState, useEffect } from 'react'
import type { Page } from './types'
import Homepage from './pages/Homepage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import AdminDashboard from './pages/AdminDashboard'
import VendorPortal from './pages/VendorPortal'
import CustomerAuthPage from './pages/CustomerAuthPage'
import ServicePage from './pages/ServicePage'
import ContactPage from './pages/ContactPage'
import BlogPage from './pages/BlogPage'
import TrainingPage from './pages/TrainingPage'
import FAQPage from './pages/FAQPage'
import RequestQuotePage from './pages/RequestQuotePage'
import CertificateVerifyPage from './pages/CertificateVerifyPage'
import EngineerDirectoryPage from './pages/EngineerDirectoryPage'
import PolicyPage from './pages/PolicyPage'
import AboutPage from './pages/AboutPage'
import CustomerDashboardPage from './pages/CustomerDashboardPage'
import SpecializedCatalogPage from './pages/SpecializedCatalogPage'
import EngineerPortal from './pages/EngineerPortal'

const VALID_PAGES: Page[] = [
  'home', 'shop', 'product', 'cart', 'checkout', 'order-success',
  'admin', 'vendor', 'customer-auth', 'customer-dashboard', 'seller-dashboard',
  'engineer-dashboard', 'engineer-portal', 'supply-service', 'engineering-service',
  'training', 'training-detail', 'home-care', 'rental-products', 'rental-detail',
  'used-products', 'used-detail', 'spare-parts', 'spare-detail', 'about', 'contact',
  'blog', 'blog-detail', 'faq', 'certificate-verify', 'engineer-directory',
  'engineer-profile', 'request-quote', 'product-enquiry', 'b2b-enquiry', 'terms',
  'privacy', 'rental-policy', 'warranty-policy', 'return-policy',
  'used-equipment-policy', 'service-policy', 'support-ticket', 'chat', 'forgot-password',
]

const getInitialPage = (): Page => {
  const path = window.location.pathname.replace(/^\//, '').toLowerCase()
  if (path && VALID_PAGES.includes(path as Page)) {
    return path as Page
  }
  return 'home'
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage)
  const [cartCount, setCartCount] = useState(3)

  const navigate = (nextPage: Page) => {
    setPage(nextPage)
    window.history.pushState({}, '', nextPage === 'home' ? '/' : `/${nextPage}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPage(getInitialPage())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])


  const props = { navigate, cartCount, setCartCount, currentPage: page }
  const publicPages: Record<string, React.ReactNode | null> = {
    'supply-service': <ServicePage {...props} serviceType="supply" />,
    'engineering-service': <ServicePage {...props} serviceType="engineering" />,
    'home-care': <SpecializedCatalogPage {...props} kind="home" />,
    'rental-products': <SpecializedCatalogPage {...props} kind="rental" />,
    'used-products': <SpecializedCatalogPage {...props} kind="used" />,
    'spare-parts': <ShopPage {...props} filterType="spare-part" />,
    'rental-detail': <ProductDetailPage {...props} />,
    'used-detail': <ProductDetailPage {...props} />,
    'spare-detail': <ProductDetailPage {...props} />,
    about: <AboutPage {...props} />,
    contact: <ContactPage {...props} />,
    blog: <BlogPage {...props} />,
    'blog-detail': <BlogPage {...props} detail />,
    training: <TrainingPage {...props} />,
    'training-detail': <TrainingPage {...props} detail />,
    faq: <FAQPage {...props} />,
    'certificate-verify': <CertificateVerifyPage {...props} />,
    'engineer-directory': <EngineerDirectoryPage {...props} />,
    'engineer-profile': <EngineerDirectoryPage {...props} />,
    'request-quote': <RequestQuotePage {...props} />,
    'product-enquiry': <RequestQuotePage {...props} />,
    'b2b-enquiry': <RequestQuotePage {...props} />,
    terms: <PolicyPage {...props} type="terms" />,
    privacy: <PolicyPage {...props} type="privacy" />,
    'rental-policy': <PolicyPage {...props} type="rental" />,
    'warranty-policy': <PolicyPage {...props} type="warranty" />,
    'return-policy': <PolicyPage {...props} type="return" />,
    'used-equipment-policy': <PolicyPage {...props} type="used-equipment" />,
    'service-policy': <PolicyPage {...props} type="service" />,
  }

  return (
    <>
      {page === 'home' && <Homepage {...props} />}
      {page === 'shop' && <ShopPage {...props} />}
      {page === 'product' && <ProductDetailPage {...props} />}
      {page === 'cart' && <CartPage {...props} />}
      {page === 'checkout' && <CheckoutPage {...props} />}
      {page === 'order-success' && <OrderSuccessPage {...props} />}
      {page === 'admin' && <AdminDashboard {...props} />}
      {(page === 'vendor' || page === 'seller-dashboard') && <VendorPortal {...props} />}
      {(page === 'engineer-portal' || page === 'engineer-dashboard') && <EngineerPortal {...props} />}
      {page === 'customer-auth' && <CustomerAuthPage {...props} />}
      {(page === 'customer-dashboard' || page === 'support-ticket' || page === 'chat') && <CustomerDashboardPage {...props} />}
      {page === 'forgot-password' && <CustomerAuthPage {...props} />}
      {publicPages[page] && publicPages[page]}
    </>
  )
}
