import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart()

  // Calculate discount based on subtotal
  const subtotal = getTotalPrice()
  const getDiscount = () => {
    if (subtotal >= 2000) return 200
    if (subtotal >= 1500) return 150
    if (subtotal >= 1000) return 100
    if (subtotal >= 500) return 50
    return 0
  }
  const discount = getDiscount()
  const finalTotal = subtotal - discount

  // Discount tiers for visual display
  const discountTiers = [
    { label: 'Free Shipping', amount: 0, threshold: 0 },
    { label: 'SAVE50', amount: 50, threshold: 500 },
    { label: 'SAVE100', amount: 100, threshold: 1000 },
    { label: 'SAVE150', amount: 150, threshold: 1500 },
    { label: 'SAVE200', amount: 200, threshold: 2000 }
  ]

  // Calculate progress percentage
  const maxThreshold = 2000
  const progressPercentage = Math.min((subtotal / maxThreshold) * 100, 100)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <h1 className="heading-font text-3xl text-[var(--color-primary)] mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-600 mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.name} className="bg-white rounded-lg shadow p-6 flex gap-6">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                  
                  <div className="flex-1">
                    <h3 className="heading-font text-lg text-[var(--color-primary)] mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                    <div className="text-lg font-bold text-[var(--color-primary)]">₹{item.price}</div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.name, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        min="1"
                      />
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-xl font-bold text-[var(--color-primary)]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Discount Tiers & Order Summary */}
            <div className="h-fit sticky top-24 space-y-6">
              {/* Discount Tiers Progress */}
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h3 className="font-semibold text-gray-800 mb-4">Unlock Discounts</h3>
                
                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className="relative h-8">
                    {/* Background line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2"></div>
                    
                    {/* Progress line */}
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-green-500 transform -translate-y-1/2 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>

                    {/* Milestone points */}
                    <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between">
                      {discountTiers.map((tier, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            subtotal >= tier.threshold 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {subtotal >= tier.threshold ? '✓' : '•'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tier Labels and Amounts */}
                  <div className="flex justify-between text-xs pt-2">
                    {discountTiers.map((tier, idx) => (
                      <div key={idx} className="text-center">
                        <div className={`font-semibold ${subtotal >= tier.threshold ? 'text-green-600' : 'text-gray-500'}`}>
                          {tier.label}
                        </div>
                        <div className="text-gray-600">₹{tier.threshold}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Discount Info */}
                {discount > 0 && (
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">You're saving ₹{discount}!</span>
                    </p>
                  </div>
                )}
                {subtotal < 500 && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Add ₹{500 - subtotal} more to get ₹50 discount
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg shadow p-6 space-y-6">
                <h2 className="text-xl font-bold text-[var(--color-primary)]">Order Summary</h2>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-semibold text-green-600">−₹{discount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-lg font-bold text-[var(--color-primary)]">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
