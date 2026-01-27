import { Link } from 'react-router-dom'

// Star Rating Component
function StarRating({ rating, readonly = true }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${
            star <= rating
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function ProductCard({ product, onBuyClick }) {
  // Convert product name to URL-friendly format
  const productId = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div className="block">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start hover:shadow-lg transition-shadow cursor-pointer">
        <Link to={`/products/${productId}`} className="w-full">
          <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded" />
        </Link>
        <Link to={`/products/${productId}`} className="mt-3">
          <h3 className="heading-font text-base text-[var(--color-primary)]">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500">{product.category}</p>
          <div className="flex items-center gap-1">
            <StarRating rating={Math.round(product.rating)} />
            <span className="text-xs text-gray-600">({product.reviews})</span>
          </div>
        </div>

        <div className="mt-3 w-full flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-semibold">₹{product.price}</div>
            <div className="text-xs text-gray-400 line-through">₹{Math.round(product.price * 1.2)}</div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onBuyClick(product)
            }}
            className="bg-[var(--color-primary)] text-white px-3 py-1 rounded text-sm hover:bg-[var(--color-secondary)]"
          >
            BUY
          </button>
        </div>
      </div>
    </div>
  )
}
