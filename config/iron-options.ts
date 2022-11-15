export const ironOptions = {
  cookieName: 'siwe',
  password: process.env.SESSION_PASSWORD || '',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
