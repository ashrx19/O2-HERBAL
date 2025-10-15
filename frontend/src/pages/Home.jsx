import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Carousel from '../components/Carousel'
import { Link } from 'react-router-dom'
import aboutImage from '../assets/about.svg'

// Slide image URLs (served from public directory)
const slide1 = '/SLIDES/SLIDE1.png'
const slide2 = '/SLIDES/SLIDE2.png'
const slide3 = '/SLIDES/SLIDE3.png'

const products = [
  // Soaps (sourced from repo-level public images: /SOAP/<filename>)
  { name: 'Aloe Vera Soap', category: 'Herbal Soap', price: 120, image: '/SOAP/aloeverasoap.png' },
  { name: 'Charcoal Detox Soap', category: 'Herbal Soap', price: 140, image: '/SOAP/charcoalsoap.png' },
  { name: 'Deep Cleansing Soap', category: 'Herbal Soap', price: 130, image: '/SOAP/deepcleansing-soap.png' },
  { name: 'Goat Milk Soap', category: 'Herbal Soap', price: 160, image: '/SOAP/goatmilk.png' },
  { name: 'Honey & Milk Soap', category: 'Herbal Soap', price: 150, image: '/SOAP/honeysoap.png' },
  { name: 'Neem & Turmeric Soap', category: 'Herbal Soap', price: 135, image: '/SOAP/neemsoap.png' },
  { name: 'Papaya Exfoliating Soap', category: 'Herbal Soap', price: 130, image: '/SOAP/papaya-soap.png' },
  { name: 'Red Wine Soap', category: 'Herbal Soap', price: 170, image: '/SOAP/redwine-soap.png' },
  { name: 'Rose Scented Soap', category: 'Herbal Soap', price: 140, image: '/SOAP/rosesoap.png' },
  { name: 'Saffron Brightening Soap', category: 'Herbal Soap', price: 190, image: '/SOAP/saffron-soap.png' },
  { name: 'Sandalwood Soap', category: 'Herbal Soap', price: 150, image: '/SOAP/sandal-soap.png' },

  // Other demo products (left as-is, but switched to local placeholders if you add them later)
  { name: 'Aloe Vera Shampoo', category: 'Herbal Shampoo', price: 240, image: '/SAMPOO/aloevera.jpeg.jpg' },
  { name: 'Bhringraj Shampoo', category: 'Herbal Shampoo', price: 260, image: '/SAMPOO/bhringraj.jpeg.jpg' },
  { name: 'Hibiscus Shampoo', category: 'Herbal Shampoo', price: 250, image: '/SAMPOO/hibicus.jpeg.jpg' },
  { name: 'Neem Shampoo', category: 'Herbal Shampoo', price: 230, image: '/SAMPOO/neem.jpeg.jpg' },
  { name: 'Shikakai Shampoo', category: 'Herbal Shampoo', price: 220, image: '/SAMPOO/shikakai.png' },
  { name: 'Coconut Hair Oil', category: 'Hair Oil', price: 200, image: 'https://i.imgur.com/SawQ9uL.jpg' },
  { name: 'Aloe Gel', category: 'Face & Hair Gel', price: 180, image: 'https://i.imgur.com/dBv3z3F.jpg' },
  { name: 'Herbal Moisturizer Cream', category: 'Moisturizer Cream', price: 220, image: 'https://i.imgur.com/zogXHjK.jpg' },
  { name: 'Lip Balm (Rose)', category: 'Lip Balm', price: 100, image: 'https://i.imgur.com/DZtZpQp.jpg' },
  { name: 'Saffron Face Serum', category: 'Face Serum', price: 350, image: 'https://i.imgur.com/7HT4swm.jpg' }
]
export default function Home() {
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
          <Carousel autoplay={3000}>
            {[slide1, slide2, slide3].map((slide, index) => (
              <div key={index} className="inline-block w-full align-top">
                <Link to="/products" className="block w-full">
                  <div className="w-full aspect-[1920/600] relative overflow-hidden">
                    <img 
                      src={slide} 
                      alt={`Slide ${index + 1}`} 
                      className="w-full h-full object-cover" 
                      style={{backgroundColor: index === 0 ? '#d8f3dc' : index === 1 ? '#dff3e0' : '#cfeedd'}}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Product row - Soaps */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h3 className="heading-font text-2xl text-center text-[var(--color-primary)] mb-4">Soaps</h3>
          <Carousel>
            <div className="flex gap-4 px-6">
              {products.filter(p => p.category.toLowerCase().includes('soap')).map((p) => (
                <div key={p.name} className="inline-block min-w-[220px] align-top">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </Carousel>
        </section>

        {/* Shampoos row */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h3 className="heading-font text-2xl text-center text-[var(--color-primary)] mb-4">Shampoos</h3>
          <Carousel>
            <div className="flex gap-4 px-6">
              {products.filter(p => p.category.toLowerCase().includes('shampoo')).map((p) => (
                <div key={p.name} className="inline-block min-w-[220px] align-top">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </Carousel>
        </section>

        {/* About us snippet */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-8 md:flex md:items-center md:gap-8">
            <div className="md:w-1/2">
              <h3 className="heading-font text-3xl text-[var(--color-primary)]">About O2 Herbal Products</h3>
              <p className="mt-4 text-gray-700">O2 Herbal Products is a Coimbatore-based homemade herbal skincare brand offering chemical-free, natural products made from plants and essential oils. We focus on quality, eco-friendliness, and customer satisfaction.</p>
              <Link to="/about" className="inline-block mt-4 text-sm text-[var(--color-primary)] underline">Learn more</Link>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <img src={aboutImage} alt="about" className="w-full rounded" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
