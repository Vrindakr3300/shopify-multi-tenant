require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const shopifyRoutes = require('./routes/shopifyRoutes');
const insightsRoutes = require('./routes/insightsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Shopify Multi-tenant Backend Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/insights', insightsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
