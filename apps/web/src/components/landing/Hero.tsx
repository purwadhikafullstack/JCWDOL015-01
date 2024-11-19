'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const images = ['/hero1.png', '/hero2.png', '/hero3.png'];
  const [currentImage, setCurrentImage] = useState(0);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="relative w-full h-[800px] bg-gradient-to-b from-blue-500 to-blue-900">
      <div className="absolute inset-0">
        <Image
          src={images[currentImage]}
          alt={`Hero Image ${currentImage + 1}`}
          layout="fill"
          objectFit="cover"
          className="opacity-60 transition-opacity duration-1000"
        />
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Your Next Opportunity Awaits
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Unlock your potential with career opportunities tailored to your skills and aspirations.
        </p>
        <div className="flex gap-4">
          <a
            href="#filter"
            className="px-6 py-3 bg-blue-600 rounded-full text-white font-semibold hover:bg-blue-700 transition"
          >
            Explore Jobs
          </a>
          <a
            href="#discover"
            className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
