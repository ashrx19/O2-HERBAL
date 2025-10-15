import { useState, useRef, useEffect } from 'react'

export default function Carousel({ children, autoplay = 0 }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const ref = useRef(null)
  const timeoutRef = useRef(null)
  const totalSlides = Array.isArray(children) ? children.length : 1

  function goToSlide(index, smooth = true) {
    if (!ref.current) return
    const el = ref.current
    el.scrollTo({
      left: index * el.offsetWidth,
      behavior: smooth ? 'smooth' : 'instant'
    })
    setCurrentSlide(index)
  }

  function scrollLeft() {
    const newIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1
    goToSlide(newIndex)
  }

  function scrollRight() {
    const newIndex = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1
    goToSlide(newIndex)
  }

  useEffect(() => {
    if (autoplay > 0) {
      timeoutRef.current = setTimeout(() => {
        // Always move forward
        const nextSlide = (currentSlide + 1) % totalSlides
        if (nextSlide === 0) {
          // When reaching the end, instantly move to start
          goToSlide(0, false)
          // Then immediately start moving to next slide smoothly
          requestAnimationFrame(() => {
            goToSlide(1, true)
          })
        } else {
          goToSlide(nextSlide, true)
        }
      }, autoplay)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [currentSlide, autoplay, totalSlides])

  return (
    <div className="relative overflow-hidden">
      <button 
        onClick={scrollLeft} 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full z-10 hover:bg-white"
      >◀</button>
      <div 
        ref={ref} 
        className="w-full overflow-x-hidden whitespace-nowrap"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
      <button 
        onClick={scrollRight} 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full z-10 hover:bg-white"
      >▶</button>
    </div>
  )
}
