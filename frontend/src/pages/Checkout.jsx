import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { protectedFetch } from '../utils/authUtils'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const { isLoggedIn, loading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoggedIn, loading, navigate])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 500 ? 0 : 100
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        setError('Please fill in all required fields')
        setIsProcessing(false)
        return
      }

      // Prepare order data
      const orderItems = cartItems.map(item => ({
        product: item._id || item.name, // Use product ID if available
        quantity: item.quantity,
        price: item.price
      }))

      const orderData = {
        orderItems,
        totalAmount: total,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        notes: `Payment Method: ${formData.paymentMethod}`
      }

      // Send order to backend
      const response = await protectedFetch('http://localhost:5000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to place order')
      }

      const result = await response.json()
      
      setOrderPlaced(true)

      // Clear cart and redirect after 3 seconds
      setTimeout(() => {
        clearCart()
        navigate('/')
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to place order')
      console.error('Order error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-12 px-4">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-2">Thank you for your purchase</p>
            <p className="text-gray-600 mb-6">Order ID: <span className="font-semibold">#ORD{Math.floor(Math.random() * 1000000)}</span></p>
            <p className="text-gray-500">Redirecting to home page...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <h1 className="heading-font text-3xl text-[var(--color-primary)] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6 bg-white p-8 rounded-lg shadow">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] mt-4"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                <textarea
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="font-medium">UPI</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-bold text-white text-lg transition-colors ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Products List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">✓ Free shipping on orders above ₹500</p>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-[var(--color-primary)]">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
