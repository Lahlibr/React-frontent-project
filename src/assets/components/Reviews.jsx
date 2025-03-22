import React from 'react'
import { Star } from 'lucide-react'
const Reviews = () => {
  return (
    <div>
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg p-4 rounded-lg">
            <p className="text-gray-600 italic">"The best food delivery service ever! Super fast and delicious!"</p>
            <div className="flex items-center mt-4">
              <Star className="text-yellow-400" />
              <Star className="text-yellow-400" />
              <Star className="text-yellow-400" />
              <Star className="text-yellow-400" />
              <Star className="text-yellow-400" />
              <p className="ml-2 text-sm">- John Doe</p>
            </div>
          </div>

          <div className="bg-white shadow-lg p-4 rounded-lg">
            <p className="text-gray-600 italic">"Great taste and amazing service. Will order again!"</p>
            <div className="flex items-center mt-4">
              <Star className="text-yellow-400" />
              <Star className="text-yellow-400" />
              <Star className="text-yellow-400" />
              <Star className="text-yellow-400" />
              <Star className="text-gray-400" />
              <p className="ml-2 text-sm">- Jane Smith</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Reviews
