const SESSION_TTL: number = 3600 // 1 hour

export const ironOptions = {
  cookieName: 'siwe',
  password: process.env.SESSION_PASSWORD || '',
  ttl: SESSION_TTL,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: (SESSION_TTL === 0 ? 2147483647 : SESSION_TTL) - 60,
  },
}
