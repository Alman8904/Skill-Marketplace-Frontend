
export const API_BASE_URL = import.meta.env.PROD
  ? "https://skill-marketplace-reputation-based.onrender.com"
  : "";

export const buildUrl = (path) => `${API_BASE_URL}${path}`;