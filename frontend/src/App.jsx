import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import ChatWidget from './components/ChatWidget'

function App() {
  return (
    <BrowserRouter>
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Home />} />
  <Route path="/products" element={<div className="p-8">Products page (coming soon)</div>} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<div className="p-8">Search (coming soon)</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
