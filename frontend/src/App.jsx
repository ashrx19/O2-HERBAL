import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import ChatWidget from './components/ChatWidget'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import { adminRoutes } from './admin/AdminRoutes'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <ChatWidget />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<div className="p-8">Search (coming soon)</div>} />
              {adminRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1><p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p><a href="/" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Go Home</a></div></div>} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
