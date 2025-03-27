import React from "react";
import Section6 from "./Section6";

const bulletPoints = [
  "Fringilla risus, luctus mauris orci auctor purus euismod pretium purus.",
  "Quaerat sodales sapien euismod purus blandit.",
  "Nemo ipsam egestas volute turpis dolores ut aliquam.",
];

const images = [
  { src: " images/cheesebur.avif", alt: "Main Burger", styles: "w-72 md:w-96 rotate-2" },
  { src: "images/eatingbur.jpg", alt: "Group Eating", styles: "absolute w-40 md:w-56 -rotate-6 -top-10 -left-10" },
  { src: "images/grp-bur.webp", alt: "Cheese Burger", styles: "absolute w-40 md:w-56 rotate-6 -bottom-10 -right-10" },
];

const Section5 = () => (
  <>
  <section className="bg-gray-100 py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-12">
    {/* Left Side - Images */}
    <div className="relative w-full md:w-1/2 flex justify-center">
      <div className="relative">
        {images.map((img, index) => (
          <img key={index} src={img.src} alt={img.alt} className={`rounded-lg shadow-lg transform ${img.styles}`} />
        ))}
      </div>
    </div>

    {/* Right Side - Text Content */}
    <div className="w-full md:w-1/2 text-center md:text-left">
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
        NOTHING BRINGS PEOPLE <br /> TOGETHER LIKE A GOOD BURGER
      </h2>
      <p className="mt-4 text-gray-700 leading-relaxed">
        Semper lacus cursus porta primis ligula risus tempus et sagittis ipsum mauris lectus laoreet purus ipsum tempor enim ipsum porta justo integer.
      </p>
      <ul className="mt-6 space-y-3 text-gray-800">
        {bulletPoints.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-red-500 text-lg mr-2">•</span> {point}
          </li>
        ))}
      </ul>
    </div>
  </section><Section6/></>
);

export default Section5;
