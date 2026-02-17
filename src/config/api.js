
export const API_BASE_URL = import.meta.env.PROD
  ? "https://skill-marketplace-proof-based-freelancing.onrender.com"
  : "";

export const buildUrl = (path) => `${API_BASE_URL}${path}`;