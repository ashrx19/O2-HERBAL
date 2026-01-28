import { useState, useEffect, useRef } from 'react'

export default function Carousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef(null)
  
  // Create an array with an extra copy of the first slide at the end
  const slides = Array.isArray(children) ? [...children, children[0]] : [children]
  const totalSlides = slides.length - 1 // Exclude the duplicate slide from count

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        if (currentIndex === totalSlides - 1) {
          // At last real slide, transition to clone
          setCurrentIndex(totalSlides)
          setIsTransitioning(true)
          
          // After transition, quickly jump to first slide
          setTimeout(() => {
            containerRef.current.style.transition = 'none'
            setCurrentIndex(0)
            
            // Re-enable transition after jump
            requestAnimationFrame(() => {
              containerRef.current.style.transition = 'transform 500ms ease-out'
              setIsTransitioning(false)
            })
          }, 500)
        } else {
          setCurrentIndex(current => current + 1)
        }
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex, totalSlides, isTransitioning])

  const goToSlide = (index) => {
    if (!isTransitioning) {
      setCurrentIndex(index)
    }
  }

  const nextSlide = () => {
    if (!isTransitioning && currentIndex < totalSlides) {
      goToSlide(currentIndex + 1)
    }
  }

  const prevSlide = () => {
    if (!isTransitioning && currentIndex > 0) {
      goToSlide(currentIndex - 1)
    }
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
        aria-label="Previous slide"
      >
        ◀
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
        aria-label="Next slide"
      >
        ▶
      </button>

      {/* Slides Container */}
      <div 
        ref={containerRef}
        className="w-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0"
            style={{ width: '100%' }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === (currentIndex === totalSlides ? 0 : currentIndex) ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

