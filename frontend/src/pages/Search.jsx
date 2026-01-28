import { useState, useEffect, useRef } from 'react'
import products from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Search() {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  // 🔥 Auto focus when page loads
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Search Products
      </h1>

      <div className="flex justify-center mb-8">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>
    </div>
  )
}

