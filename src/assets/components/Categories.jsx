import React from 'react'

const Categories = () => {
  return (
    <div>
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category 1 */}
          <div className="bg-yellow-400 shadow-lg p-4 rounded-lg text-center hover:shadow-xl transition">
            <img src="https://source.unsplash.com/400x300/?burger" alt="Burgers" className="w-full rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Burgers</h3>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View More
            </button>
          </div>

          {/* Category 2 */}
          <div className="bg-white shadow-lg p-4 rounded-lg text-center hover:shadow-xl transition">
            <img src="https://source.unsplash.com/400x300/?pizza" alt="Pizza" className="w-full rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Pizza</h3>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View More
            </button>
          </div>

          {/* Category 3 */}
          <div className="bg-white shadow-lg p-4 rounded-lg text-center hover:shadow-xl transition">
            <img src="https://source.unsplash.com/400x300/?dessert" alt="Desserts" className="w-full rounded-lg" />
            <h3 className="text-xl font-semibold mt-4">Desserts</h3>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View More
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Categories
