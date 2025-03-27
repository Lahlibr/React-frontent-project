import React from "react";
import Section7 from "./Section7";

const Section6 = () => {
  return (<>
    <section className="bg-yellow-500 text-gray-900 py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
      {/* Left Side - Text and Buttons */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">DOWNLOAD MOBILE APP AND</h2>
        <h1 className="text-4xl md:text-5xl font-bold">SAVE UP TO 20%</h1>
        <p className="text-gray-800 md:text-lg">
          Aliquam a augue suscipit, luctus neque purus ipsum et neque dolor primis libero tempus, blandit varius.
        </p>
        <div className="flex justify-center md:justify-start gap-4 mt-4">
          <img src="/images/appstore.png" alt="App Store" className="w-40 cursor-pointer" />
          <img src="/images/googleplay.png" alt="Google Play" className="w-40 cursor-pointer" />
        </div>
      </div>
      
      {/* Right Side - Mobile UI Mockup & Food Image */}
      <div className="w-full md:w-1/2 relative flex justify-center mt-8 md:mt-0">
        <img src="/images/e-shop.png" alt="Mobile App" className="w-58 md:w-74 z-10" />
       
      </div>
    </section><Section7/></>
  );
};

export default Section6;
