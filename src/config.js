export const API_BASE = "https://glitter-follicle-fiction.ngrok-free.dev";

export const fetchWithNgrok = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "ngrok-skip-browser-warning": "true",
    },
  });
};