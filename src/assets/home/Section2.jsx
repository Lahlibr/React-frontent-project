import React from 'react'
import { CheckCircle, ShoppingCart, Leaf } from "lucide-react";
const Section2 = () => {
  return (
   
      


    <section className="bg-yellow-500 py-16 px-6 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">
        Why Choose Our Food?
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
        We are committed to delivering high-quality, fresh, and original food to our customers.
        Experience the best taste crafted with love and care.
      </p>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Food Quality */}
        <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
          <CheckCircle size={50} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Premium Quality</h3>
          <p className="text-gray-600 mt-2">
            We use only the finest and freshest ingredients to bring you the highest quality food.
          </p>
        </div>

        {/* Order Food */}
        <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
          <ShoppingCart size={50} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Easy Ordering</h3>
          <p className="text-gray-600 mt-2">
            Order your favorite meals in just a few clicks and get them delivered hot & fresh.
          </p>
        </div>

        {/* Original Food */}
        <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
          <Leaf size={50} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">100% Original</h3>
          <p className="text-gray-600 mt-2">
            Our recipes are crafted with authenticity, giving you the real taste of tradition.
          </p>
        </div>
      </div>
    </section>
  );
};



   

export default Section2
