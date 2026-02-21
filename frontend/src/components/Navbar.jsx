import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { cartItems } = useCart()
  const { isLoggedIn, userInfo, handleLogout } = useAuth()
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  
  const linkClass = ({ isActive }) =>
    `text-white px-3 py-2 rounded-md text-sm font-medium hover:text-[var(--color-accent)] ${isActive ? 'underline' : ''}`

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleLogoutClick = () => {
    handleLogout()
    setShowUserMenu(false)
    navigate('/')
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
                  className="input shadow-lg focus:border-2 border-gray-300 px-4 py-1 rounded-lg w-56 transition-all focus:w-64 outline-none text-black text-sm"
                  name="search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearch}
                />
                <button
                  onClick={handleSearch}
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                  type="button"
                >
                  <svg
                    className="size-4"
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

            {/* Auth Section - Changes based on login state */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                {/* User Profile Button - Minimal Display */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-[var(--color-accent)] transition-colors"
                >
                  {/* User Icon */}
                  <svg 
                    className="w-6 h-6" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {/* User Name */}
                  <span className="font-semibold text-sm">{userInfo?.name}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* User Info */}
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                          <svg 
                            className="w-6 h-6" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{userInfo?.name}</p>
                          <p className="text-xs text-white text-opacity-90">{userInfo?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-3 text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M3 3a1 1 0 0 0 1 1h12a1 1 0 1 0 0-2H4a1 1 0 0 0-1 1zm0 4.75A.75.75 0 0 1 3.75 7h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 7.75zM3.75 10a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5zM3 14.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75zM10 3a1 1 0 0 0-1 1v10a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm7 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-[var(--color-primary)] px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
