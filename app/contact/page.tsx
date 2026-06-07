'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white placeholder-gray-600 rounded"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white placeholder-gray-600 rounded"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white placeholder-gray-600 rounded h-32"
              placeholder="Your message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
