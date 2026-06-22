# Shopify Multi-Tenant Data Ingestion & Insights Platform

This project provides a **multi-tenant backend + dashboard** that connects to **Shopify stores**, ingests:
- Customers  
- Orders  
- Products  

…stores them into **MySQL**, and displays **analytics dashboards** including:
- Total customers  
- Total orders  
- Total revenue  
- Orders-by-date chart  

The platform supports **multiple Shopify stores (tenants)** per user.

---

# 🚀 Features

### ✔ Multi-tenant Shopify store registration  
### ✔ Secure JWT authentication  
### ✔ Full Shopify Admin API ingestion  
### ✔ MySQL data warehouse  
### ✔ Insights dashboard (Next.js)  
### ✔ Orders-by-date visualization  
### ✔ Clean modular backend structure  

---

# 🛠 Tech Stack

### **Frontend**
- Next.js (Pages Router)
- React.js
- Chart.js (visual analytics)
- Custom CSS UI

### **Backend**
- Node.js + Express
- JWT Authentication
- Shopify Admin REST API
- MySQL

### **Database**
- MySQL with normalized schema for customers, orders, products, shops, users

---

# 📦 Project Structure
'''
shopify-multi-tenant/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ ├── auth.js
│ │ │ └── db.js
│ │ ├── routes/
│ │ │ ├── authRoutes.js
│ │ │ ├── insightsRoutes.js
│ │ │ └── shopifyRoutes.js
│ │ ├── services/
│ │ │ ├── ingestionService.js
│ │ │ └── shopifyClient.js
│ │ └── index.js
│ ├── package.json
│ └── .env
│
└── frontend/
├── pages/
│ └── index.js
├── styles/
│ └── globals.css
├── package.json
└── next.config.js



---

# ⚙️ Setup Instructions

## **1️⃣ Clone repository**

```bash
git clone <repo-url>
cd shopify-multi-tenant


2️⃣ Backend Setup
Install dependencies
cd backend
npm install

Configure .env

Create a file:

PORT=4000
JWT_SECRET=your_secret_here

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=shopify_multitenant

Start backend
npm run dev


Backend runs at:

http://localhost:4000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Open:

http://localhost:3000

🏗 Architecture Diagram
ASCII Architecture Diagram (GitHub-friendly)
                    +------------------------+
                    |      Shopify Store     |
                    |  (Products, Orders..)  |
                    +-----------+------------+
                                |
                                | Shopify Admin API
                                v
+-------------+       +------------------------+       +----------------------+
|  Frontend   | <---> |        Backend         | <---> |       MySQL DB       |
|  Next.js    |       | Node.js + Express API  |       | (shops, orders, etc) |
+-------------+       +----------+-------------+       +----------+-----------+
      ^                         ^                               |
      |                         | JWT Auth                      |
      |                         +-------------------------------+
      |                                         Data ingestion
      |
+-------------+
| End User    |
| Logs in,    |
| Registers   |
| Shopify     |
| Store       |
+-------------+




🔌 API Endpoints

Base URL:

http://localhost:4000/api

AUTH APIs
POST /auth/register

Registers a new user.

{
  "email": "test@example.com",
  "password": "password123"
}

POST /auth/login

Returns JWT token.

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
}

SHOPIFY STORE APIs
GET /shopify/shops

Returns all shops owned by the user.

POST /shopify/shops

Register or update a Shopify Store.

Payload:

{
  "name": "Shop A",
  "shop_domain": "myshop.myshopify.com",
  "access_token": "shpat_xxxxxxxxx"
}

POST /shopify/shops/:id/ingest

Trigger ingestion of:

Products

Customers

Orders

Response:

{
  "message": "Ingestion completed",
  "customers": 5,
  "orders": 3,
  "products": 10
}

INSIGHTS APIs
GET /insights/shops/:id/summary

Response:

{
  "total_customers": 5,
  "total_orders": 3,
  "total_revenue": 900.50
}

GET /insights/shops/:id/orders-by-date?startDate=&endDate=

Response:

[
  { "date": "2025-12-04", "order_count": 2, "revenue": 450 },
  { "date": "2025-12-05", "order_count": 1, "revenue": 450 }
]

🗂 Database Schema
Users
-----
id (PK)
email
password_hash

Shops
-----
id (PK)
user_id (FK)
name
shop_domain
access_token

Customers
---------
id (PK)
shop_id (FK)
shopify_customer_id
name
email
city
country

Orders
------
id (PK)
shop_id (FK)
shopify_order_id
customer_id (FK)
total_price
order_date

Products
--------
id (PK)
shop_id (FK)
shopify_product_id
title
price

⚠ Known Limitations / Assumptions
❌ No pagination support for large Shopify stores

Shopify returns 250 items per call; current ingestion fetches only the first page.

❌ No webhook sync

Data only updates when user clicks Run Ingestion.

❌ Admin API token must be manually pasted

OAuth app installation flow is not implemented.

❌ Multi-user multi-shop supported, but roles/permissions not implemented

Every user has full access to their own stores.

❌ Not deployed (runs on localhost)

Deployment to Vercel + Render/MySQL could be added.

🎯 Future Improvements

Real-time ingestion via Shopify Webhooks

OAuth App installation flow

Scheduled ingestion (CRON jobs)

Multi-store analytics comparison

Product performance charts

Better error messages and logging
