// For development, use Next.js proxy to avoid CORS issues
// For production, use the direct API URL
export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://defibot-2.onrender.com';
