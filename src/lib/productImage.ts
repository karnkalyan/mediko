import type { Product } from '../types'

type ProductImageFields = Pick<Product, 'title' | 'category' | 'type'> & {
  subcategory?: string
}

export function getRelevantProductImage(product: ProductImageFields) {
  const searchText = `${product.title} ${product.category} ${product.subcategory || ''} ${product.type}`.toLowerCase()

  if (/oxygen|cpap|bipap|ventilator|respirat|nebul|concentrator/.test(searchText)) {
    return '/assets/generated/category-respiratory.png'
  }
  if (/bed|wheelchair|stretcher|furniture|mobility|table|trolley/.test(searchText)) {
    return '/assets/generated/category-furniture.png'
  }
  if (/ultrasound|radiology|imaging|x-ray|xray|scanner/.test(searchText)) {
    return '/assets/generated/category-ultrasound.png'
  }
  if (/ecg|ekg|cardiac|cardio|defibrillator/.test(searchText)) {
    return '/assets/generated/category-ecg.png'
  }
  if (/laboratory|pathology|microscope|centrifuge|analy[sz]er|test kit/.test(searchText)) {
    return '/assets/generated/category-lab.png'
  }
  if (/surgical|operation|theatre|anesthesia|instrument|autoclave/.test(searchText)) {
    return '/assets/generated/category-surgical.png'
  }
  if (/spare|battery|cable|sensor|probe|accessor|part/.test(searchText)) {
    return '/assets/generated/category-spares.png'
  }

  return '/assets/generated/category-monitoring.png'
}
