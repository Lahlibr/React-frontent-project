import React from 'react'
import { CheckCircle, ShoppingCart, Leaf } from "lucide-react";
import Section3 from './Section3';
const Section2 = () => {
  return (<>
    <section className="relative bg-white text-black text-center py-12 px-4">
    {/* Text Content */}
    <div className="relative z-10">
      <h2 className="text-3xl font-bold">
        THE BURGER TASTES BETTER WHEN <br /> YOU EAT IT WITH YOUR FAMILY
      </h2>
      <p className="mt-4 text-lg max-w-[600px] mx-auto">
        There’s nothing better than sharing a delicious meal with your loved ones! 
        Savor the rich flavors of our freshly made burgers, crafted with premium ingredients 
        and served with crispy fries. Enjoy special discounts on family combos and make every 
        meal a memorable one.
      </p>
      <a 
        href="/deals" 
        className="mt-6 inline-block bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all"
      >
        Explore The Menu
      </a>
    </div>
  
    {/* ✅ Move Image Outside the `div` and Position it Correctly */}
    <img
      src="images/about-1.jpg"
      alt="About"
      className="absolute top-24 left-0 w-full h-[40vh]"
    />
  </section>
  <Section3/>
  </>
  );
};



   

export default Section2
