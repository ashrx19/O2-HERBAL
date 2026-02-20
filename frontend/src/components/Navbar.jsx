import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cartItems } = useCart()
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  
  const linkClass = ({ isActive }) =>
    `text-white px-3 py-2 rounded-md text-sm font-medium hover:text-[var(--color-accent)] ${isActive ? 'underline' : ''}`

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-us')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSearch = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      e.preventDefault()
      if (searchInput.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchInput)}`)
        setSearchInput('')
      }
    }
  }

  return (
    <nav className="bg-[var(--color-primary)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white heading-font text-2xl tracking-wider">O2 HERBALS</Link>
            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              <button onClick={scrollToAbout} className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-[var(--color-accent)]">About Us</button>
              <NavLink to="/contact" className={linkClass}>Contact</NavLink>
              
              {/* Search Icon */}
              <div className="relative">
                <input
                  placeholder="Search..."
                  className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none text-black"
                  name="search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearch}
                />
                <button
                  onClick={handleSearch}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                  type="button"
                >
                  <svg
                    className="size-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-white hover:text-[var(--color-accent)] transition-colors">
              {/* cart icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button className="text-white hover:text-[var(--color-accent)]">
              {/* chat icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="flex items-center bg-white text-[var(--color-primary)] px-3 py-1 rounded-full">
              <span className="text-sm mr-2">Hello</span>
              <img src="https://via.placeholder.com/32" alt="avatar" className="w-7 h-7 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
