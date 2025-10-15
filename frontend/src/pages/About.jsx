import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto p-6">
        <h1 className="heading-font text-3xl text-[var(--color-primary)]">About O2 Herbal Products</h1>
        <p className="mt-4 text-gray-700">O2 Herbal Products is a Coimbatore-based homemade herbal skincare brand offering chemical-free, natural products made from plants and essential oils. We focus on quality, eco-friendliness, and customer satisfaction.</p>
        <img src="https://via.placeholder.com/800x300?text=Herbs+and+Skincare" alt="herbs" className="mt-6 rounded-lg shadow" />
      </main>
      <Footer />
    </div>
  )
}
