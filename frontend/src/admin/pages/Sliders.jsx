import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import useToast from '../hooks/useToast'
import { Toast, EmptyState } from '../components/Common'

export default function Slides() {
  const [slides, setSlides] = useState([])
  const [formData, setFormData] = useState({ title: '', description: '', image: '' })
  const [isEditing, setIsEditing] = useState(null)
  const { toasts, addToast, removeToast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, image: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.image) {
      addToast('Please fill all fields', 'error')
      return
    }

    if (isEditing) {
      setSlides(slides.map((s) => (s.id === isEditing ? { ...formData, id: isEditing } : s)))
      addToast('Slide updated successfully', 'success')
      setIsEditing(null)
    } else {
      setSlides([...slides, { ...formData, id: Date.now() }])
      addToast('Slide added successfully', 'success')
    }

    setFormData({ title: '', description: '', image: '' })
  }

  const handleEdit = (slide) => {
    setFormData(slide)
    setIsEditing(slide.id)
  }

  const handleDelete = (id) => {
    setSlides(slides.filter((s) => s.id !== id))
    addToast('Slide deleted successfully', 'success')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Slides / Carousel</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {isEditing ? 'Edit Slide' : 'Add New Slide'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter slide title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter slide description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-4 w-full h-40 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  {isEditing ? 'Update Slide' : 'Add Slide'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(null)
                      setFormData({ title: '', description: '', image: '' })
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Slides List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Slides ({slides.length})</h2>

            {slides.length === 0 ? (
              <EmptyState message="No slides created yet" />
            ) : (
              <div className="space-y-4">
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-bold text-gray-900">{slide.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{slide.description}</p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="flex-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Toast toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  )
}
