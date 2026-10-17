import prisma from '../config/db.js'

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' },
    })
    res.json({ success: true, data: categories })
  } catch (error) {
    next(error)
  }
}
