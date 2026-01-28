import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Carousel from '../components/Carousel'
import ProductCarousel from '../components/ProductCarousel'
import AddToCartModal from '../components/AddToCartModal'
import { Link } from 'react-router-dom'
import aboutImage from '../assets/about.svg'
import products from '../data/products'

// Slide image URLs (served from public directory)
const slide1 = '/SLIDES/SLIDE1.png'
const slide2 = '/SLIDES/SLIDE2.png'
const slide3 = '/SLIDES/SLIDE3.png'
export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAddToCart, setShowAddToCart] = useState(false)

  const handleBuyClick = (product) => {
    setSelectedProduct(product)
    setShowAddToCart(true)
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Welcome message directly below navbar */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="heading-font text-3xl md:text-4xl text-[var(--color-primary)]">Welcome to O2 Herbal Products – Nature’s Touch for Glowing Skin 🌿</h1>
          </div>
        </section>

        {/* Hero slideshow (images only) */}
        <section className="w-full">
          <Carousel>
            {[slide1, slide2, slide3].map((slide, index) => (
              <Link key={index} to="/products" className="block w-full">
                <div className="w-full aspect-[1920/600] relative">
                  <img 
                    src={slide} 
                    alt={`Slide ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    style={{backgroundColor: index === 0 ? '#d8f3dc' : index === 1 ? '#dff3e0' : '#cfeedd'}}
                  />
                </div>
              </Link>
            ))}
          </Carousel>
        </section>

        {/* Product row - Soaps */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h3 className="heading-font text-2xl text-center text-[var(--color-primary)] mb-4">Soaps</h3>
          <ProductCarousel>
            <div className="flex gap-4 px-6">
              {products.filter(p => p.category.toLowerCase().includes('soap')).map((p) => (
                <div key={p.name} className="flex-shrink-0 w-full sm:w-1/3 lg:w-1/5 min-w-[220px]">
                  <ProductCard product={p} onBuyClick={handleBuyClick} />
                </div>
              ))}
            </div>
          </ProductCarousel>
        </section>

        {/* Shampoos row */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h3 className="heading-font text-2xl text-center text-[var(--color-primary)] mb-4">Shampoos</h3>
          <ProductCarousel>
            <div className="flex gap-4 px-6">
              {products.filter(p => p.category.toLowerCase().includes('shampoo')).map((p) => (
                <div key={p.name} className="flex-shrink-0 w-full sm:w-1/3 lg:w-1/5 min-w-[220px]">
                  <ProductCard product={p} onBuyClick={handleBuyClick} />
                </div>
              ))}
            </div>
          </ProductCarousel>
        </section>
        {/* Removed About section - moved to footer */}
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
