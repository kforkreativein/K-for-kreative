import jwt from 'jsonwebtoken'

const TOKEN_TTL = '8h'

export function getJwtSecret(env = process.env) {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return env.JWT_SECRET
}

export function createAdminToken({ username, secret }) {
  return jwt.sign({ username, role: 'admin' }, secret, { expiresIn: TOKEN_TTL })
}

export function verifyAdminToken(token, secret) {
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}
