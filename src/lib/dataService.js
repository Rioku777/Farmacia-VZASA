
const API_BASE = '/api';

const fetchJSON = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export const login = (username, password) => fetchJSON('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

export const getProducts = () => fetchJSON('/productos');

export const saveProduct = (product) => {
    const method = product.id ? 'PUT' : 'POST';
    const path = product.id ? `/productos/${product.id}` : '/productos';
    return fetchJSON(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
};

export const deleteProduct = (id) => fetchJSON(`/productos/${id}`, { method: 'DELETE' });

export const getClients = () => fetchJSON('/clientes');
export const saveClient = (client) => {
    const method = client.id ? 'PUT' : 'POST';
    const path = client.id ? `/clientes/${client.id}` : '/clientes';
    return fetchJSON(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
    });
};
export const deleteClient = (id) => fetchJSON(`/clientes/${id}`, { method: 'DELETE' });


export const getProviders = () => fetchJSON('/proveedores');
export const saveProvider = (provider) => {
    const method = provider.id ? 'PUT' : 'POST';
    const path = provider.id ? `/proveedores/${provider.id}` : '/proveedores';
    return fetchJSON(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provider)
    });
};
export const deleteProvider = (id) => fetchJSON(`/proveedores/${id}`, { method: 'DELETE' });


export const getInvoices = () => fetchJSON('/facturas');
export const createInvoice = (invoice) => fetchJSON('/facturas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice)
});

export const getConfig = () => fetchJSON('/config');
export const saveConfig = (config) => fetchJSON('/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
});
