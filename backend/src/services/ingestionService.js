const db = require('../config/db');
const { createShopifyClient } = require('./shopifyClient');

async function ingestShopData(shop) {
  const client = createShopifyClient(shop.shop_domain, shop.access_token);

  const [products, customers, orders] = await Promise.all([
    client.getProducts(),
    client.getCustomers(),
    client.getOrders()
  ]);

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    for (const p of products) {
      const variant = (p.variants && p.variants[0]) || {};
      await conn.query(
        `REPLACE INTO products (id, shop_id, title, sku, price, raw_json)
         VALUES (?, ?, ?, ?, ?, JSON_OBJECT())`,
        [
          p.id,
          shop.id,
          p.title || null,
          variant.sku || null,
          variant.price ? Number(variant.price) : 0
        ]
      );
    }

    for (const c of customers) {
      await conn.query(
        `REPLACE INTO customers (id, shop_id, first_name, last_name, email, total_spent, raw_json)
         VALUES (?, ?, ?, ?, ?, ?, JSON_OBJECT())`,
        [
          c.id,
          shop.id,
          c.first_name || null,
          c.last_name || null,
          c.email || null,
          c.total_spent ? Number(c.total_spent) : 0
        ]
      );
    }

    for (const o of orders) {
      const createdAt = o.created_at
        ? o.created_at.replace('T', ' ').replace('Z', '').slice(0, 19)
        : null;

      await conn.query(
        `REPLACE INTO orders (id, shop_id, customer_id, total_price, currency, created_at_utc, raw_json)
         VALUES (?, ?, ?, ?, ?, ?, JSON_OBJECT())`,
        [
          o.id,
          shop.id,
          o.customer && o.customer.id ? o.customer.id : null,
          o.total_price ? Number(o.total_price) : 0,
          o.currency || null,
          createdAt
        ]
      );

      if (Array.isArray(o.line_items)) {
        for (const li of o.line_items) {
          await conn.query(
            `REPLACE INTO order_items (id, order_id, product_id, quantity, price)
             VALUES (?, ?, ?, ?, ?)`,
            [
              li.id,
              o.id,
              li.product_id || null,
              li.quantity || 0,
              li.price ? Number(li.price) : 0
            ]
          );
        }
      }
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error('Ingestion error:', err);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { ingestShopData };
