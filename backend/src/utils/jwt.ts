import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret')
}
