import jwt from 'jsonwebtoken'

const TOKEN_TTL = '8h'
const LOCAL_DEV_JWT_SECRET = 'kfk-local-dev-secret'

export function getJwtSecret(env = process.env) {
  if (env.JWT_SECRET) {
    return env.JWT_SECRET
  }

  if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
    return LOCAL_DEV_JWT_SECRET
  }

  if (env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
    return `kfk-admin-secret:${env.ADMIN_USERNAME}:${env.ADMIN_PASSWORD}`
  }

  throw new Error('JWT_SECRET is not configured')
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
