const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, options = {}) {
  const response = await fetch(`${API_ORIGIN}/api${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const body = await response
    .json()
    .catch(() => ({ error: 'Server returned an unexpected response' }));
  if (!response.ok) {
    const error = new Error(body.error || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return body;
}
export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n || 0);
export const number = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(n || 0);
export const shortDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
export const roles = {
  kitchen: 'Institutional kitchen',
  processor: 'Food processing unit',
  ngo: 'NGO & food bank',
  buyer: 'Secondary buyer',
  logistics: 'Logistics partner',
  sponsor: 'Impact sponsor',
  auditor: 'Independent auditor',
  admin: 'Platform administrator',
};



