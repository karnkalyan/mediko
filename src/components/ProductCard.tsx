import { useState } from 'react'
import type { Product } from '../types'
import { formatPrice, formatNPR } from '../lib/utils'
import { getRelevantProductImage } from '../lib/productImage'

interface ProductCardProps {
  product: Product
  onClick?: () => void
  onAddToCart?: () => void
  onRentClick?: (product: Product) => void
  onQuoteClick?: (product: Product) => void
  isRentalCatalog?: boolean
}

export default function ProductCard({
  product,
  onClick,
  onAddToCart,
  onRentClick,
  onQuoteClick,
  isRentalCatalog = false,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)

  const isRentalMode = isRentalCatalog || product.type === 'rental'

  const badgeStyles: Record<string, string> = {
    'Best Seller': 'bg-orange-soft text-orange',
    'Premium': 'bg-info-bg text-info',
    'New': 'bg-info-bg text-info',
    'Popular': 'bg-success-bg text-success',
    'Value Pick': 'bg-warning-bg text-warning',
    'Rental': 'bg-purple-100 text-purple-800',
    'Verified Used': 'bg-purple-bg text-purple',
    'Refurbished': 'bg-purple-bg text-purple',
    'Top Rated': 'bg-orange-soft text-orange',
    'Hospital': 'bg-info-bg text-info',
    'Critical Care': 'bg-error-bg text-error',
    'Lab Essential': 'bg-success-bg text-success',
    'Spare Part': 'bg-warning-bg text-warning',
  }

  const badge = isRentalMode
    ? 'Rental Fleet'
    : product.badge || (product.type === 'spare-part' ? 'Spare Part' : product.inStock ? 'In Stock' : 'Out of Stock')
  const badgeClass = badgeStyles[badge] || 'bg-bg-section text-text-muted'

  const handleCardClick = () => {
    const displayProduct = { ...product, image: getRelevantProductImage(product) }
    try {
      localStorage.setItem('mediko_selected_product', JSON.stringify(displayProduct))
    } catch {}

    if (isRentalMode && onRentClick) {
      onRentClick(displayProduct)
    } else if (onClick) {
      onClick()
    }
  }

  const effectiveMonthlyRate = product.rentalMonthly || (product.price ? Math.round(product.price * 0.1) : 8500)
  const effectiveDeposit = product.rentalDeposit || Math.round(effectiveMonthlyRate * 1.5)

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-border rounded-[12px] overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:shadow-[0_8px_24px_rgba(11,45,92,0.12)] hover:-translate-y-0.5 group"
    >
      {/* Image Area */}
      <div className="relative bg-bg-light h-[180px] flex items-center justify-center p-4">
        <img
          src={getRelevantProductImage(product)}
          alt={product.title}
          className="max-h-[148px] max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badge */}
        <span className={`absolute top-2.5 left-2.5 text-[10.5px] font-semibold px-2 py-0.5 rounded ${badgeClass}`}>
          {badge}
        </span>
        {/* Discount */}
        {product.discount && product.discount > 0 && !isRentalMode && (
          <span className="absolute top-2.5 right-9 bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); setWishlisted(!wishlisted) }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center cursor-pointer hover:border-orange transition-colors"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="w-3.5 h-3.5"
            fill={wishlisted ? '#D64545' : 'none'}
            stroke={wishlisted ? '#D64545' : '#94A3B8'}
            strokeWidth="1.75"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        {/* Rental indicator */}
        {isRentalMode && (
          <span className="absolute bottom-2 left-2.5 bg-purple-700 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
            100% Refundable Deposit
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        {/* Seller verification */}
        {product.sellerVerified && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-info font-semibold bg-info-bg px-1.5 py-0.5 rounded flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
              Verified Supplier
            </span>
            {product.warranty && (
              <span className="text-[10px] text-success font-semibold bg-success-bg px-1.5 py-0.5 rounded">
                {product.warranty}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 m-0 text-[13px] font-semibold text-text-dark leading-snug">
          {product.title}
        </h3>

        {/* Brand & Seller */}
        <p className="m-0 text-[11.5px] text-text-light font-medium">
          {product.brand} · <span className="text-text-muted">{product.seller}</span>
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className="w-3 h-3" fill={s <= Math.round(product.rating) ? '#F26A1A' : '#E3EAF2'} stroke="none" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-text-light">({product.reviews})</span>
        </div>

        {/* Condition for used */}
        {product.type === 'used' && product.conditionGrade && !isRentalMode && (
          <div className="flex items-center gap-2 text-[10.5px]">
            <span className="text-purple font-semibold">Grade {product.conditionGrade}</span>
            {product.yearOfManufacture && <span className="text-text-light">Mfg: {product.yearOfManufacture}</span>}
          </div>
        )}

        {/* Pricing Area */}
        {isRentalMode ? (
          <div className="mt-auto pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-black text-purple-700">
                {formatNPR(effectiveMonthlyRate)}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">/month</span>
            </div>
            <p className="m-0 text-[10px] text-slate-400 font-medium">
              Refundable Deposit: {formatNPR(effectiveDeposit)}
            </p>
          </div>
        ) : (
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className={`text-[15px] font-bold ${product.askForPrice ? 'text-orange' : 'text-text-dark'}`}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-text-light line-through">
                  {formatNPR(product.oldPrice)}
                </span>
              )}
            </div>
            {product.rentalMonthly && (
              <p className="m-0 text-[11px] text-purple font-medium">
                Rent from {formatNPR(product.rentalMonthly)}/mo
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        {isRentalMode ? (
          <button
            onClick={e => {
              e.stopPropagation()
              if (onRentClick) onRentClick(product)
              else if (onClick) onClick()
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white border-none rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Book Rental
          </button>
        ) : product.askForPrice ? (
          <button
            onClick={e => {
              e.stopPropagation()
              if (onQuoteClick) {
                onQuoteClick(product)
              } else if (onClick) {
                onClick()
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-navy hover:bg-navy-deep text-white border-none rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
            Get Quote
          </button>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onAddToCart?.() }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange hover:bg-orange-hover text-white border-none rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Cart
          </button>
        )}

        {product.rentalMonthly && !isRentalMode && (
          <button
            onClick={e => {
              e.stopPropagation()
              if (onRentClick) onRentClick(product)
            }}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-purple-100 transition-colors whitespace-nowrap"
          >
            Rent
          </button>
        )}
      </div>
    </div>
  )
}

export type { Product }
