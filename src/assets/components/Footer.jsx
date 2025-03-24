import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-100 text-black py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Location */}
        <div>
          <h3 className="font-bold text-lg">LOCATION</h3>
          <p className="text-gray-600 mt-2">
            5505 Waterford District Dr, <br />
            Miami, FL 33126 <br />
            United States
          </p>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="font-bold text-lg">WORKING HOURS</h3>
          <p className="text-gray-600 mt-2">
            Mon-Fri: 9:00AM - 10:00PM <br />
            Saturday: 10:00AM - 8:30PM <br />
            Sunday: 12:00PM - 5:00PM
          </p>
        </div>

        {/* Order Now */}
        <div>
          <h3 className="font-bold text-lg">ORDER NOW</h3>
          <p className="text-gray-600 mt-2">Quick and Easy Ordering</p>
          <p className="text-red-500 text-xl font-bold mt-1">999-888-7777</p>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 flex justify-center gap-6 text-gray-700 text-2xl">
        <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
        <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
        <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
        <a href="#" className="hover:text-red-500"><FaYoutube /></a>
      </div>
    </footer>
  );
};

export default Footer
