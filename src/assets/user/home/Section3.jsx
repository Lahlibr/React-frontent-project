import React from "react";
import { CheckCircle, ShoppingCart, Leaf } from "lucide-react";

const Section3 = () => {
  return (
    <section className="bg-yellow-500 py-16 px-4 sm:px-6 lg:px-12 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Why Choose Our Food?
      </h2>
      <p className="text-base sm:text-lg text-gray-800 max-w-2xl mx-auto mb-10">
        We are committed to delivering high-quality, fresh, and original food to our customers.
        Experience the best taste crafted with love and care.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Premium Quality */}
        <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
          <CheckCircle size={50} className="text-green-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Premium Quality</h3>
          <p className="text-gray-700 mt-2">
            We use only the finest and freshest ingredients to bring you the highest quality food.
          </p>
        </div>

        {/* Easy Ordering */}
        <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
          <ShoppingCart size={50} className="text-yellow-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Easy Ordering</h3>
          <p className="text-gray-700 mt-2">
            Order your favorite meals in just a few clicks and get them delivered hot & fresh.
          </p>
        </div>

        {/* 100% Original */}
        <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
          <Leaf size={50} className="text-red-500 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">100% Original</h3>
          <p className="text-gray-700 mt-2">
            Our recipes are crafted with authenticity, giving you the real taste of tradition.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section3;
