export const API_BASE = "https://glitter-follicle-fiction.ngrok-free.dev";

export const apiFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      "ngrok-skip-browser-warning": "true",
      ...options.headers,
    },
  });
};
