import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Section2 from "./Section2";

const slides = [
  {
    background: "images/hero-1.jpg",
    overlay: "images/hero-2.png",
    priceBadge: "images/price-badge-yellow.png",
    price: "₹299",
    title: "New Yummy! Burger with Onion",
    description: "Savor the delicious taste of our freshly made burger, loaded with caramelized onions and a secret sauce.",
  },
  {
    background: "images/hero-1.jpg",
    overlay: "images/R.png",
    priceBadge: "images/price-badge-yellow.png",
    price: "₹199",
    title: "New Yummy! 2 Piece Broast",
    description: "Enjoy our crispy and juicy 2-piece broast, perfectly seasoned and fried to golden perfection.",
  },
  {
    background: "images/hero-1.jpg",
    overlay: "images/shwarma.webp",
    priceBadge: "images/price-badge-yellow.png",
    price: "₹399",
    title: "Delicious Shawarma Wrap!",
    description: "Experience the authentic taste of our freshly grilled shawarma, wrapped in warm pita with flavorful sauces and fresh veggies.",
  },
];

const Section1 = () => {
  return (<>
    <div className="bg-gray-100 ">
      {/* Section 1: Hero Swiper */}
      <section className="relative">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-[70vh]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-screen">
                <img src={slide.background} alt="Background" className="w-full h-full object-cover" />
                <img
                  src={slide.overlay}
                  alt="Overlay"
                  className="absolute top-70 left-100 transform -translate-x-1/2 -translate-y-1/2 w-110 h-90"
                />
                <img
                  src={slide.priceBadge}
                  alt="Price"
                  className="absolute top-18 left-120 w-35 h-30"
                />
                <div className="absolute top-25 left-130 w-15 h-30">
                  <h1 className="text-xl font-bold mb-4">
                    Only! <span className="text-3xl">{slide.price}</span>
                  </h1>
                </div>
                <div className="absolute top-70 right-10 transform -translate-y-1/2 text-white max-w-md p-6 bg-opacity-50 rounded-lg shadow-lg">
                  <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg">{slide.description}</p>
                  <button className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-all">
                    Order Now
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      
     
<Section2/>
    </div>
    </>
  );
};

export default Section1;
