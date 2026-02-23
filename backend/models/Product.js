import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: 200,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    default: 'Uncategorized',
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: 0,
    default: 0,
  },
  ingredients: [
    {
      type: String,
    },
  ],
  skinType: [
    {
      type: String,
      enum: ['Dry', 'Oily', 'Normal', 'Sensitive', 'Combination'],
    },
  ],
  hairType: [
    {
      type: String,
      enum: ['Dry', 'Oily', 'Normal', 'Curly', 'Straight', 'Wavy'],
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  // Single main image for compatibility with frontend components
  image: {
    type: String,
    default: '',
  },
  // Backwards-compatible count field
  countInStock: {
    type: Number,
    default: 0,
    min: 0,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-calculate average rating
productSchema.pre('save', function (next) {
  if (!this.reviews || this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.numReviews = this.reviews.length;
  }

  // Disable product if stock is 0
  if (this.stock === 0) {
    this.isActive = false;
  }

  // Keep `image` and `countInStock` in sync for compatibility
  if ((!this.image || this.image === '') && Array.isArray(this.images) && this.images.length > 0) {
    this.image = this.images[0];
  }

  if ((this.countInStock === undefined || this.countInStock === null) && this.stock !== undefined) {
    this.countInStock = this.stock;
  } else if (this.countInStock !== undefined) {
    this.stock = this.countInStock;
  }

  next();
});

// Update timestamp
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Product', productSchema);
