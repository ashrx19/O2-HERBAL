import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { protectedFetch } from '../utils/authUtils'
import { getProducts } from '../services/productApi'

export default function AddToCartModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1)
  const [recommendations, setRecommendations] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([]) // Track products selected in modal
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')

  // Get a new recommendation to replace one that was selected
  const getNewRecommendation = () => {
    const selectedNames = selectedProducts.map(item => item.product.name)
    const availableProducts = allProducts.filter(p => 
      p.category !== product.category && 
      p.name !== product.name &&
      !selectedNames.includes(p.name) &&
      !recommendations.some(rec => rec.name === p.name)
    )
    if (availableProducts.length === 0) return null
    return availableProducts[Math.floor(Math.random() * availableProducts.length)]
  }

  // Get recommended products only when modal opens
  useEffect(() => {
    let mounted = true
    const fetchProducts = async () => {
      try {
        const res = await getProducts()
        if (!mounted) return
        const list = res.data.products || []
        setAllProducts(list)

        if (isOpen) {
          const otherProducts = list.filter(p => p.category !== product.category)
          const randomized = otherProducts.sort(() => Math.random() - 0.5).slice(0, 3)
          setRecommendations(randomized)
          setQuantity(1) // Reset quantity when opening modal
          setSelectedProducts([]) // Reset selected products
        }
      } catch (err) {
        console.error('Failed to load recommendations', err)
      }
    }

    fetchProducts()
    return () => { mounted = false }
  }, [isOpen, product])

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }

    setIsAdding(true)
    setError('')

    try {
      const API_BASE = 'http://localhost:5000/api'
      
      // Add main product to cart via API
      const mainResponse = await protectedFetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id || product.name, // Use _id if available, fallback to name
          quantity: quantity
        })
      })

      if (!mainResponse.ok) {
        const errorData = await mainResponse.json()
        throw new Error(errorData.message || 'Failed to add to cart')
      }

      // Add recommended products to cart
      for (const item of selectedProducts) {
        await protectedFetch(`${API_BASE}/cart/add`, {
          method: 'POST',
          body: JSON.stringify({
            productId: item.product._id || item.product.name,
            quantity: item.quantity
          })
        })
      }

      // Also update local CartContext as fallback
      addToCart(product, quantity)
      selectedProducts.forEach(item => {
        addToCart(item.product, item.quantity)
      })

      setQuantity(1)
      setSelectedProducts([])
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to add to cart')
      console.error('Add to cart error:', err)
    } finally {
      setIsAdding(false)
    }
  }

  // Add recommended product to modal selection (not cart yet)
  const handleAddRecommendation = (rec) => {
    setSelectedProducts(prev => {
      const existing = prev.find(item => item.product.name === rec.name)
      if (existing) {
        return prev.map(item =>
          item.product.name === rec.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product: rec, quantity: 1 }]
    })
    
    // Replace the selected recommendation with a new one
    const newRec = getNewRecommendation()
    if (newRec) {
      setRecommendations(prev => {
        const filtered = prev.filter(r => r.name !== rec.name)
        return [...filtered, newRec]
      })
    }
  }

  // Remove product from modal selection
  const handleRemoveProduct = (productName) => {
    setSelectedProducts(prev => prev.filter(item => item.product.name !== productName))
  }

  // Update quantity of selected product
  const handleUpdateQuantity = (productName, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productName)
    } else {
      setSelectedProducts(prev =>
        prev.map(item =>
          item.product.name === productName
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Add to Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Selected Products Section - Always show with main product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Selected Products</h3>
            <div className="space-y-4">
              {/* Main product */}
              <div className="bg-white p-4 rounded-lg border flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--color-primary)]">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-lg font-bold text-[var(--color-primary)] mt-1">₹{product.price}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="text-gray-300 text-sm">×</span>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected recommended products */}
              {selectedProducts.map(item => (
                <div key={item.product.name} className="bg-white p-4 rounded-lg border flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--color-primary)]">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">{item.product.category}</p>
                    <p className="text-lg font-bold text-[var(--color-primary)] mt-1">₹{item.product.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveProduct(item.product.name)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Remove
                    </button>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.name, item.quantity - 1)}
                        className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.name, item.quantity + 1)}
                        className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : `Add ${quantity + selectedProducts.reduce((sum, item) => sum + item.quantity, 0)} ${quantity + selectedProducts.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'} to Cart`}
          </button>

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">Login Required</h3>
                <p className="text-gray-600 mb-6">Please log in to add items to your cart.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigate('/login')
                      setShowLoginPrompt(false)
                      onClose()
                    }}
                    className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-secondary)] transition-colors"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Continue Shopping Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Recommended Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map(rec => (
                  <div key={rec.name} className="bg-gray-50 p-4 rounded-lg border">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-24 object-cover rounded mb-3"
                    />
                    <h4 className="font-semibold text-sm text-[var(--color-primary)] mb-1">
                      {rec.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{rec.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">₹{rec.price}</span>
                      <button
                        onClick={() => handleAddRecommendation(rec)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
