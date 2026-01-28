import express from 'express';
import Product from '../models/Product.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .select('-reviews')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products/:id/review
// @access  Private
router.post('/:id/review', async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;

    if (!rating || !comment || !userName) {
      return res.status(400).json({ success: false, message: 'Rating, comment, and name are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user._id,
      userName,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({ success: true, message: 'Review added successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
