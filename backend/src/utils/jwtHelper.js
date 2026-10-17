import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'mediko_access_default_secret_2026'
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'mediko_refresh_default_secret_2026'

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
  )
}

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
  )
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET)
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET)
}

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production'

  // Access token cookie (15 mins)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  })

  // Refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth', // Scoped to auth endpoints for extra security
  })
}

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken', { path: '/api/auth' })
}
