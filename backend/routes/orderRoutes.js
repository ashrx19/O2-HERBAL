import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/orders
// @access  Private
router.post(
  '/',
  protect,
  [
    body('orderItems', 'Order items are required').isArray().notEmpty(),
    body('totalAmount', 'Total amount is required').isFloat({ min: 0 }),
    body('shippingAddress', 'Shipping address is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { orderItems, totalAmount, shippingAddress, notes } = req.body;

      // Validate and reduce stock
      for (let item of orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
          return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          });
        }

        // Reduce stock
        product.stock -= item.quantity;
        await product.save();
      }

      const order = new Order({
        user: req.user._id,
        orderItems,
        totalAmount,
        shippingAddress,
        notes,
      });

      await order.save();
      await order.populate('orderItems.product', 'name price');

      res.status(201).json({ success: true, message: 'Order created successfully', order });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   GET /api/orders/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price image');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user owns the order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/admin/orders', protect, admin, async (req, res) => {
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
  '/admin/orders/:id',
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
