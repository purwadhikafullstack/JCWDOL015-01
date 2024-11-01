"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const heroSlides = [
    {
        title: "test",
        description: "test",
        backgroundImage: "url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
    },
    {
        title: "test",
        description: "test",
        backgroundImage: "url(https://images.unsplash.com/photo-1522776203873-e4961ae6e07d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
    }
];

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? heroSlides.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    };

    const handleBulletClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: heroSlides[currentIndex].backgroundImage }}>
            <div className="absolute inset-0 bg-black bg-opacity-25"></div>
            <div className="relative z-10 text-center text-white p-6 pt-12">
                <div className="max-w-md mx-auto">
                    <h1 className="mb-5 pt-12 text-5xl font-extrabold text-white">{heroSlides[currentIndex].title}</h1>
                    <p className="mb-5 text-lg text-white">{heroSlides[currentIndex].description}</p>
                    <button className="btn btn-light py-2 px-4 rounded">
                        <Link href="/search">test</Link>
                    </button>
                </div>
            </div>
            {/* Bullet navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
                        onClick={() => handleBulletClick(index)}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
