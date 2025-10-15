export default function ContactForm() {
  return (
    <form className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="w-full border px-3 py-2 rounded" placeholder="Your name" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full border px-3 py-2 rounded" placeholder="you@example.com" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea className="w-full border px-3 py-2 rounded" rows="4" placeholder="Your message" />
      </div>
      <div className="text-right">
        <button type="submit" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:bg-[var(--color-secondary)]">Send Message</button>
      </div>
    </form>
  )
}
