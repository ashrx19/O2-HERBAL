import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto p-6">
        <h1 className="heading-font text-3xl text-[var(--color-primary)]">Contact Us</h1>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div>
            <p>📍 Address: 23/2 Nehru Nagar, Swamy Settipalayam, Coimbatore 641047</p>
            <p className="mt-2">📞 96881 99900 / 99445 58086</p>
            <p className="mt-2">📧 kumart1973@gmail.com</p>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
