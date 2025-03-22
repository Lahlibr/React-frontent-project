import React from 'react'

const Section2 = () => {
  return (
    <div>
     <section className="bg-white text-black text-center py-12 px-4">
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
    className="mt-6 inline-block bg-black text-yellow-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all"
  >
    <img src='\img\hero-1.jpg'/>
    View Deals
  </a>
</section>

    </div>
  )
}

export default Section2
