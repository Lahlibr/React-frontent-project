import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section with Image Swiper */}
      <section className="relative">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-[500px]"
        >
          <SwiperSlide>
          <div className="relative w-full h-140vh">
          <img src="src\assets\home\img\hero-1.jpg" alt="Background" className="w-full h-140vh object-cover" />
          <img 
            src="src\assets\home\img\hero-2.png"
            alt="Overlay" 
            className="absolute top-70 left-100 transform -translate-x-1/2 -translate-y-1/2 w-110 h-90"
          />
          <img src="\Food_Assets\assets\hero\price-badge-yellow.png" alt="Price" className="absolute top-18 left-120 w-35 h-30" />
          <div className="absolute top-25 left-130 w-15 h-30"><h1 className="text-xl font-bold mb-4">Only! <span className="text-3xl">₹299</span></h1></div>
          <div className="absolute top-70 right-10 transform -translate-y-1/2 text-white max-w-md p-6 bg-opacity-50 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">New Yummy! Burger with Onion</h1>
            <p className="text-lg">
              Savor the delicious taste of our freshly made burger, loaded with caramelized onions and a secret sauce.
            </p>
            <button className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-all">
              Order Now
            </button>
          </div>
          </div>
          </SwiperSlide>
          <SwiperSlide>
          <div className="relative w-full h-screen">
          <img src="/Food_Assets/assets/hero/hero-1.jpg" alt="Background" className="w-full h-full object-cover" />
          <img 
            src="src\assets\home\R.png"
            alt="Overlay" 
            className="absolute top-70 left-100 transform -translate-x-1/2 -translate-y-1/2 w-140 h-120"
          /><img src="\Food_Assets\assets\hero\price-badge-yellow.png" alt="Price" className="absolute top-18 left-120 w-35 h-30" />
          <div className="absolute top-25 left-130 w-15 h-30"><h1 className="text-xl font-bold mb-4">Only! <span className="text-3xl">₹199</span></h1></div>
          <div className="absolute top-70 right-10 transform -translate-y-1/2 text-white max-w-md p-6 bg-opacity-50 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">New Yummy! 2 Piece Broast</h1>
            <p className="text-lg">
            Enjoy our crispy and juicy 2-piece broast, perfectly seasoned and fried to golden perfection.
            </p>
            <button className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-all">
              Order Now
            </button>
          </div>
          </div>
          </SwiperSlide>
          <SwiperSlide>
          <div className="relative w-full h-screen">
          <img src="/Food_Assets/assets/hero/hero-1.jpg" alt="Background" className="w-full h-full object-cover" />
          <img 
            src="src\assets\home\fried_chicken_PNG14078.png"
            alt="Overlay" 
            className="absolute top-70 left-100 transform -translate-x-1/2 -translate-y-1/2 w-110 h-90"
          /><img src="\Food_Assets\assets\hero\price-badge-yellow.png" alt="Price" className="absolute top-18 left-120 w-35 h-30" />
          <div className="absolute top-25 left-130 w-15 h-30"><h1 className="text-xl font-bold mb-4">Only! <span className="text-3xl">₹399</span></h1></div>
          <div className="absolute top-70 right-10 transform -translate-y-1/2 text-white max-w-md p-6 bg-opacity-50 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">Delicious Shawarma Wrap!</h1>
            <p className="text-lg">
            Experience the authentic taste of our freshly grilled shawarma, wrapped in warm pita with flavorful sauces and fresh veggies.
            </p>
            <button className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-all">
              Order Now
            </button>
          </div>
          </div>
          </SwiperSlide>
        </Swiper>
      </section>

      

      
      

      {/* Customer Reviews */}
      
    </div>
  );
};

export default Home;
