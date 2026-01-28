import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import AddToCartModal from '../components/AddToCartModal'
import products from '../data/products'

// Sample products data (same as Home.jsx)
// products are imported from src/data/products

// Star Rating Component
function StarRating({ rating, onRatingChange, readonly = false }) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-lg ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
        >
          <span className={`${
            star <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}>
            ★
          </span>
        </button>
      ))}
    </div>
  )
}

// Review Component
function Review({ review, onDelete }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">{review.name}</span>
          <StarRating rating={review.rating} readonly />
        </div>
        <button
          onClick={() => onDelete(review.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      <p className="text-gray-700">{review.comment}</p>
      <span className="text-sm text-gray-500 mt-2 block">
        {new Date(review.date).toLocaleDateString()}
      </span>
    </div>
  )
}

// Review Form Component
function ReviewForm({ productId, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0 || !name.trim() || !comment.trim()) return

    onSubmit({
      id: Date.now(),
      productId,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString()
    })

    // Reset form
    setRating(0)
    setName('')
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--color-primary)]"
          rows="4"
          placeholder="Share your experience with this product..."
          required
        />
      </div>

      <button
        type="submit"
        className="bg-[var(--color-primary)] text-white px-6 py-2 rounded hover:bg-[var(--color-secondary)] transition-colors"
      >
        Submit Review
      </button>
    </form>
  )
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [reviews, setReviews] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAddToCart, setShowAddToCart] = useState(false)

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))]

  const handleBuyClick = (product) => {
    setSelectedProduct(product)
    setShowAddToCart(true)
  }

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  // Get reviews for a specific product
  const getProductReviews = (productId) => {
    return reviews.filter(review => review.productId === productId)
  }

  // Calculate average rating for a product
  const getAverageRating = (productId) => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / productReviews.length
  }

  // Handle new review submission
  const handleReviewSubmit = (review) => {
    setReviews(prev => [...prev, review])
  }

  // Handle review deletion
  const handleReviewDelete = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto p-6">
        <h1 className="heading-font text-3xl text-[var(--color-primary)] mb-8">Our Products</h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <div key={product.name}>
              <ProductCard product={product} onBuyClick={handleBuyClick} />
            </div>
          ))}
        </div>
      </main>

      {/* Add to Cart Modal */}
      {selectedProduct && (
        <AddToCartModal
          isOpen={showAddToCart}
          onClose={() => {
            setShowAddToCart(false)
            setSelectedProduct(null)
          }}
          product={selectedProduct}
        />
      )}

      <Footer />
    </div>
  )
}