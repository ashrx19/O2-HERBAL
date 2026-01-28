import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddToCartModal from '../components/AddToCartModal'
import products from '../data/products'

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

export default function ProductDetails() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAddToCart, setShowAddToCart] = useState(false)

  // Find the product by name (URL parameter)
  const product = products.find(p => p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === productId)

  // Get reviews for this product
  const productReviews = reviews.filter(review => review.productId === product?.name)

  // Calculate average rating
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length
    : product?.rating || 0

  // Handle review submission
  const handleReviewSubmit = (review) => {
    setReviews(prev => [...prev, review])
  }

  // Handle review deletion
  const handleReviewDelete = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId))
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <button
              onClick={() => navigate('/products')}
              className="bg-[var(--color-primary)] text-white px-6 py-2 rounded hover:bg-[var(--color-secondary)] transition-colors"
            >
              Back to Products
            </button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Create multiple images for the product (using the same image for demo)
  const productImages = [product.image, product.image, product.image, product.image]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors"
        >
          ← Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === index ? 'border-[var(--color-primary)]' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="heading-font text-3xl text-[var(--color-primary)] mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.category}</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={Math.round(averageRating)} readonly />
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-gray-600">({productReviews.length + product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-[var(--color-primary)]">₹{product.price}</span>
                <span className="text-lg text-gray-400 line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Save 17%</span>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => setShowAddToCart(true)}
                className="w-full bg-[var(--color-primary)] text-white py-3 px-6 rounded-lg hover:bg-[var(--color-secondary)] transition-colors font-semibold mb-8"
              >
                Add to Cart
              </button>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Key Benefits</h2>
              <ul className="grid grid-cols-2 gap-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* How to Use */}
            <div>
              <h2 className="text-xl font-semibold mb-3">How to Use</h2>
              <p className="text-gray-700 leading-relaxed">{product.howToUse}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

          {/* Review Summary */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--color-primary)]">{averageRating.toFixed(1)}</div>
                <StarRating rating={Math.round(averageRating)} readonly />
                <div className="text-sm text-gray-600 mt-1">{productReviews.length + product.reviews} reviews</div>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = [...productReviews, ...Array(product.reviews).fill({rating: product.rating})]
                      .filter(r => Math.floor(r.rating) === stars).length
                    const percentage = productReviews.length + product.reviews > 0
                      ? (count / (productReviews.length + product.reviews)) * 100
                      : 0
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[var(--color-primary)] h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6 mb-8">
            {productReviews.map(review => (
              <Review
                key={review.id}
                review={review}
                onDelete={handleReviewDelete}
              />
            ))}
            {productReviews.length === 0 && (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
            )}
          </div>

          {/* Review Form */}
          <ReviewForm
            productId={product.name}
            onSubmit={handleReviewSubmit}
          />
        </div>
      </main>

      <AddToCartModal product={product} isOpen={showAddToCart} onClose={() => setShowAddToCart(false)} />

      <Footer />
    </div>
  )
}