import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    text: "Etiam sapien sem at sagittis congue augue massa varius sodales sapien undo tempus dolor egestas magna suscipit magna tempus aliquet porta sodales augue suscipit luctus neque",
    name: "Amelie Newlove",
    image: "/images/review-author-1.jpg",
  },
  {
    id: 2,
    text: "A wonderful experience! The food was delicious, and the service was exceptional. I highly recommend this place.",
    name: "John Doe",
    image: "/images/review-author-2.jpg",
  },
  {
    id: 3,
    text: "Absolutely loved the ambiance and the taste of the dishes. Will definitely visit again soon!",
    name: "Sophia Williams",
    image: "/images/review-author-3.jpg",
  },
];

const Section7 = () => {
  return (
    <section
      className="relative h-[70vh] flex items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: `url("/images/broast.avif")`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0  bg-opacity-50"></div>

      <div className="relative z-10 max-w-2xl text-center px-6">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={false}
          pagination={{ clickable: true }}
          loop
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <img
                src={testimonial.image}
                alt="User"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-lg italic">{testimonial.text}</p>
              <h3 className="mt-4 font-semibold">{testimonial.name}</h3>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Section7;
