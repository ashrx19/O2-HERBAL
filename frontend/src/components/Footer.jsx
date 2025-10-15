import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-[var(--color-accent)]">Home</Link>
            <Link to="/products" className="hover:text-[var(--color-accent)]">Products</Link>
            <Link to="/about" className="hover:text-[var(--color-accent)]">About Us</Link>
            <Link to="/contact" className="hover:text-[var(--color-accent)]">Contact</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-[var(--color-accent)]">Instagram</a>
          <a href="#" className="hover:text-[var(--color-accent)]">WhatsApp</a>
        </div>
      </div>
      <div className="text-center text-sm py-4 bg-[var(--color-secondary)]">© 2025 O2 Herbal Products. All Rights Reserved.</div>
    </footer>
  )
}
