export const API_BASE = "https://rene-hair-backend.onrender.com";

export const apiFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  });
};
