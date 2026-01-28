import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'O2 Herbal Products - Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        getProfile: 'GET /api/users/me',
      },
      products: {
        getAll: 'GET /api/products',
        getOne: 'GET /api/products/:id',
        addReview: 'POST /api/products/:id/review',
      },
      orders: {
        create: 'POST /api/orders',
        getUserOrders: 'GET /api/orders/user',
        getOrder: 'GET /api/orders/:id',
      },
      admin: {
        getStats: 'GET /api/admin/stats',
        getAllProducts: 'GET /api/admin/products',
        createProduct: 'POST /api/admin/products',
        updateProduct: 'PUT /api/admin/products/:id',
        deleteProduct: 'DELETE /api/admin/products/:id',
        getAllOrders: 'GET /api/admin/orders',
        updateOrder: 'PUT /api/admin/orders/:id',
      },
    },
  });
});

// 404 error handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║   O2 HERBAL PRODUCTS - BACKEND API    ║
    ╠════════════════════════════════════════╣
    ║   ✓ Server running on port ${PORT}     ║
    ║   ✓ Database connected                ║
    ║   ✓ Environment: ${process.env.NODE_ENV}    ║
    ╚════════════════════════════════════════╝
  `);
});
