import React from 'react';
import Section5 from './Section5';
const Section4 = () => { 
  const banners = [
    {
      image: "images/ads-1.jpg",
      text: "GET YOUR FREE CHEESE FRIES",
    },
    {
      image: "images/ads-2.jpg",
      text: "GET YOUR FREE CHEESE BURGER",
    },
  ];

  return (
    <>
    <section className="bg-white py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner, index) => (
          <div
            key={index}
            className="relative bg-[#F8F1E9] rounded-lg shadow-lg overflow-hidden"
          >
            {/* Image */}
            <img
              src={banner.image}
              alt="Promo"
              className="w-full h-[150px] md:h-[250px] object-cover"
            />

            {/* Text Overlay on Right */}
            <div className="absolute inset-0 flex items-center justify-end pr-6  bg-opacity-40 text-black text-right">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{banner.text}</h2>
                <a
                  href="#"
                  className="mt-3 inline-block bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-yellow-500 transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Section5/>
    </>
  );
}

export default Section4;
