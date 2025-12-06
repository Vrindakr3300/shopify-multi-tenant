const express = require('express');
const db = require('../config/db');
const { authMiddleware } = require('../config/auth');

const router = express.Router();
router.use(authMiddleware);

/**
 * GET /api/insights/shops/:id/summary
 * -> total customers, orders, revenue
 */
router.get('/shops/:id/summary', async (req, res) => {
  try {
    const shopId = req.params.id;

    const [[cust]] = await db.query(
      'SELECT COUNT(*) AS total_customers FROM customers WHERE shop_id = ?',
      [shopId]
    );

    const [[ord]] = await db.query(
      'SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_price), 0) AS total_revenue FROM orders WHERE shop_id = ?',
      [shopId]
    );

    res.json({
      total_customers: cust.total_customers || 0,
      total_orders: ord.total_orders || 0,
      total_revenue: ord.total_revenue || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/insights/shops/:id/orders-by-date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
router.get('/shops/:id/orders-by-date', async (req, res) => {
  try {
    const shopId = req.params.id;
    const { startDate, endDate } = req.query;

    let sql = `
      SELECT DATE(created_at_utc) AS date,
             COUNT(*) AS order_count,
             COALESCE(SUM(total_price), 0) AS revenue
      FROM orders
      WHERE shop_id = ?
    `;
    const params = [shopId];

    if (startDate) {
      sql += ' AND created_at_utc >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND created_at_utc <= ?';
      params.push(endDate);
    }

    sql += ' GROUP BY DATE(created_at_utc) ORDER BY DATE(created_at_utc)';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
