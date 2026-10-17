import prisma from '../config/db.js'

export class ProductService {
  static async getAllProducts(query = {}) {
    const { category, type, search, condition, sort, page = 1, limit = 20 } = query
    const where = { isApproved: true }

    if (category) {
      where.category = { slug: category }
    }

    if (type) {
      const typeUpper = type.toUpperCase().replace(/-/g, '_')
      if (['NEW', 'RENTAL', 'CERTIFIED_PRE_OWNED', 'SPARE_PART', 'CONSUMABLE', 'HOME_CARE'].includes(typeUpper)) {
        where.type = typeUpper
      }
    }

    if (condition) {
      where.condition = { contains: condition }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { sku: { contains: search } },
      ]
    }

    const orderBy = {}
    if (sort === 'price_asc') orderBy.price = 'asc'
    else if (sort === 'price_desc') orderBy.price = 'desc'
    else if (sort === 'rating') orderBy.rating = 'desc'
    else orderBy.id = 'desc'

    const skip = (Number(page) - 1) * Number(limit)
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: Number(limit),
      }),
    ])

    return { total, page: Number(page), limit: Number(limit), products }
  }

  static async getProductBySlugOrId(identifier) {
    const id = Number(identifier)
    const where = isNaN(id) ? { slug: identifier } : { id }
    return prisma.product.findUnique({
      where,
      include: { category: true, seller: true },
    })
  }

  static async getFeaturedProducts() {
    return prisma.product.findMany({
      where: { isApproved: true },
      take: 6,
      orderBy: { id: 'asc' },
      include: { category: true },
    })
  }

  static async getSliderProducts() {
    return prisma.product.findMany({
      where: { isApproved: true },
      take: 8,
      skip: 6,
      include: { category: true },
    })
  }

  static async createProduct(data) {
    return prisma.product.create({ data })
  }

  static async updateProduct(id, data) {
    return prisma.product.update({
      where: { id: Number(id) },
      data,
    })
  }

  static async deleteProduct(id) {
    return prisma.product.delete({
      where: { id: Number(id) },
    })
  }
}
