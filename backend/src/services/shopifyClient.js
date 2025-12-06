const axios = require('axios');

function createShopifyClient(shopDomain, accessToken) {
  const baseURL = `https://${shopDomain}/admin/api/2024-10`;

  const client = axios.create({
    baseURL,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    }
  });

  return {
    async getCustomers(limit = 250) {
      const res = await client.get('/customers.json', { params: { limit } });
      return res.data.customers || [];
    },

    async getOrders(limit = 250, status = 'any') {
      const res = await client.get('/orders.json', { params: { limit, status } });
      return res.data.orders || [];
    },

    async getProducts(limit = 250) {
      const res = await client.get('/products.json', { params: { limit } });
      return res.data.products || [];
    }
  };
}

module.exports = { createShopifyClient };
