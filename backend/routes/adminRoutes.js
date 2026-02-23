import express from 'express';
import Product from '../models/Product.js';
import Slider from '../models/Slider.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// @route   POST /api/admin/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/products
// @access  Private/Admin
router.post(
  '/products',
  protect,
  admin,
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('category', 'Valid category is required').isIn(['Soap', 'Shampoo', 'Oil', 'Cream', 'Gel']),
    body('price', 'Price must be a positive number').isFloat({ min: 0 }),
    body('stock', 'Stock must be a positive integer').isInt({ min: 0 }),
    body('description', 'Description is required').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, category, price, discountPrice, stock, description, ingredients, skinType, hairType, images, order } =
        req.body;

      const product = new Product({
        name,
        category,
        price,
        discountPrice: discountPrice || 0,
        stock,
        description,
        ingredients: ingredients || [],
        skinType: skinType || [],
        hairType: hairType || [],
        images: images || [],
        order: order || 0,
      });

      await product.save();

      res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   PUT /api/admin/products/:id
// @access  Private/Admin
router.put('/products/:id', protect, admin, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update only provided fields
    const { name, category, price, discountPrice, stock, description, ingredients, skinType, hairType, images, isActive, order } =
      req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (description) product.description = description;
    if (ingredients) product.ingredients = ingredients;
    if (skinType) product.skinType = skinType;
    if (hairType) product.hairType = hairType;
    if (images) product.images = images;
    if (isActive !== undefined) product.isActive = isActive;
    if (order !== undefined) product.order = order;

    await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    res.status(200).json({ success: true, stats: { totalProducts, activeProducts, lowStockProducts } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// SLIDER ROUTES

// @route   POST /api/admin/sliders
// @access  Private/Admin
router.post('/sliders', protect, admin, async (req, res) => {
  try {
    const { title, description, image, order } = req.body;

    if (!title || !description || !image) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, and image' });
    }

    const slider = new Slider({
      title,
      description,
      image,
      order: order || 0,
    });

    await slider.save();

    res.status(201).json({ success: true, message: 'Slider created successfully', slider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/sliders
// @access  Private/Admin
router.get('/sliders', protect, admin, async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 });
    res.status(200).json({ success: true, count: sliders.length, sliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/sliders/:id
// @access  Private/Admin
router.put('/sliders/:id', protect, admin, async (req, res) => {
  try {
    let slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    const { title, description, image, order, isActive } = req.body;

    if (title) slider.title = title;
    if (description) slider.description = description;
    if (image) slider.image = image;
    if (order !== undefined) slider.order = order;
    if (isActive !== undefined) slider.isActive = isActive;
    slider.updatedAt = new Date();

    await slider.save();

    res.status(200).json({ success: true, message: 'Slider updated successfully', slider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/sliders/:id
// @access  Private/Admin
router.delete('/sliders/:id', protect, admin, async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);

    if (!slider) {
      return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    res.status(200).json({ success: true, message: 'Slider deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ORDERS ROUTES

// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
router.put(
  '/orders/:id',
  protect,
  admin,
  [body('orderStatus', 'Valid order status is required').isIn(['Processing', 'Shipped', 'Delivered', 'Cancelled'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { orderStatus, paymentStatus } = req.body;

      let order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      await order.save();

      res.status(200).json({ success: true, message: 'Order updated successfully', order });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
