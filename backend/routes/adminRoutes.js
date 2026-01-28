import express from 'express';
import Product from '../models/Product.js';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

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
      const { name, category, price, discountPrice, stock, description, ingredients, skinType, hairType, images } =
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
    const { name, category, price, discountPrice, stock, description, ingredients, skinType, hairType, images, isActive } =
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
    const products = await Product.find().sort({ createdAt: -1 });
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

export default router;
