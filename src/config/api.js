// In development, use empty string (proxy handles it)
// In production, use your deployed backend URL
export const API_BASE_URL = import.meta.env.PROD 
  ? "https://your-backend-url.com"  // Change this for production
  : "";  // Empty for development (uses proxy)

export const buildUrl = (path) => `${API_BASE_URL}${path}`;