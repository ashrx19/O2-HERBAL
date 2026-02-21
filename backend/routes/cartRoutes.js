import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/cart/add
// @desc    Add or update item in cart
// @access  Private
router.post(
  '/add',
  protect,
  [
    body('productId', 'Product ID is required').notEmpty(),
    body('quantity', 'Quantity must be at least 1').isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available`,
        });
      }

      // Find or create cart
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      // Check if product already in cart
      const existingItem = cart.items.find((item) => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          productName: product.name,
          quantity,
          price: product.price,
          image: product.image,
          category: product.category,
        });
      }

      await cart.save();
      await cart.populate('items.product', 'name price stock');

      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        cart,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price stock image category');

    // Create empty cart if doesn't exist
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Filter out the product
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    await cart.populate('items.product', 'name price stock');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/cart/update/:productId
// @desc    Update item quantity in cart
// @access  Private
router.put(
  '/update/:productId',
  protect,
  [body('quantity', 'Quantity must be at least 1').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const userId = req.user._id;

      // Verify product exists and check stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available`,
        });
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const cartItem = cart.items.find((item) => item.product.toString() === productId);
      if (!cartItem) {
        return res.status(404).json({ success: false, message: 'Item not in cart' });
      }

      cartItem.quantity = quantity;

      await cart.save();
      await cart.populate('items.product', 'name price stock');

      res.status(200).json({
        success: true,
        message: 'Cart updated',
        cart,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
