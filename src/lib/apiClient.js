const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let accessToken = null;
let refreshToken = null;

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
}

export function getAccessToken() {
  if (!accessToken) accessToken = localStorage.getItem("accessToken");
  return accessToken;
}

export function getRefreshToken() {
  if (!refreshToken) refreshToken = localStorage.getItem("refreshToken");
  return refreshToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

async function refreshAccessToken() {
  const rt = getRefreshToken();
  if (!rt) throw new Error("No refresh token");
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Refresh failed");
  setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.accessToken;
}

async function apiClient(endpoint, options = {}) {
  const { body, method = "GET", auth = true } = options;

  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    try {
      const newToken = await refreshAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      clearTokens();
      throw new Error("Session expired");
    }
  }

  const data = await res.json();
  if (!data.success) {
    const err = new Error(data.message || "Request failed");
    err.errors = data.errors || [];
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  return data;
}

export default apiClient;
