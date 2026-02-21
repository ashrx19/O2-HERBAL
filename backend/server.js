import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB - don't exit if connection fails
connectDB().catch((err) => {
  console.warn('⚠️  MongoDB connection warning:', err.message);
});

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
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
        sendOTP: 'POST /api/users/send-otp',
        verifyOTP: 'POST /api/users/verify-otp',
        getProfile: 'GET /api/users/me',
      },
      cart: {
        addItem: 'POST /api/cart/add',
        getCart: 'GET /api/cart',
        updateItem: 'PUT /api/cart/update/:productId',
        removeItem: 'DELETE /api/cart/remove/:productId',
        clearCart: 'DELETE /api/cart/clear',
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

const server = app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║   O2 HERBAL PRODUCTS - BACKEND API    ║
    ╠════════════════════════════════════════╣
    ║   ✓ Server running on port ${PORT}     ║
    ║   ✓ Environment: ${process.env.NODE_ENV}    ║
    ║   ℹ Waiting for database...            ║
    ╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
