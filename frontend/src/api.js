const API_URL = 'https://localbizsite.onrender.com/api';

const api = {
  businesses: {
    list: () => fetch(`${API_URL}/businesses`).then(r => r.json()),
    get: (id) => fetch(`${API_URL}/businesses/${id}`).then(r => r.json()),
  },
  health: () => fetch(`${API_URL}/health`).then(r => r.json()),
};

export default api;
