const express = require('express');
const db = require('../config/db');
const { authMiddleware } = require('../config/auth');
const { ingestShopData } = require('../services/ingestionService');

const router = express.Router();

/**
 * Register a shop (tenant)
 * Body: { name, shop_domain, access_token }
 */
router.post('/shops', authMiddleware, async (req, res) => {
  try {
    const { name, shop_domain, access_token } = req.body;

    if (!shop_domain || !access_token) {
      return res.status(400).json({ error: 'shop_domain and access_token are required' });
    }

    await db.query(
      `INSERT INTO shops (name, shop_domain, access_token)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         access_token = VALUES(access_token)`,
      [name || null, shop_domain, access_token]
    );

    res.json({ message: 'Shop registered/updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * List shops (for UI dropdown)
 */
router.get('/shops', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, shop_domain FROM shops');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Trigger ingestion for a specific shop
 */
router.post('/shops/:id/ingest', authMiddleware, async (req, res) => {
  try {
    const shopId = req.params.id;
    const [rows] = await db.query('SELECT * FROM shops WHERE id = ?', [shopId]);
    const shop = rows[0];
    if (!shop) return res.status(404).json({ error: 'Shop not found' });

    await ingestShopData(shop);
    res.json({ message: 'Ingestion completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ingestion failed' });
  }
});

module.exports = router;
