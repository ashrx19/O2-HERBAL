import { useRef } from 'react'

export default function ProductCarousel({ children }) {
  const ref = useRef(null)

  function scrollLeft() {
    if (!ref.current) return
    const container = ref.current
    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  function scrollRight() {
    if (!ref.current) return
    const container = ref.current
    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
        aria-label="Previous items"
      >
        ◀
      </button>

      <div 
        ref={ref}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
        aria-label="Next items"
      >
        ▶
      </button>
    </div>
  )
}