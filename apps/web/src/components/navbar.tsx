'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-blue-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <p className="text-2xl font-bold">OntoEmployee</p>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        <Link href="/subscriptions">
                            <p className="hover:text-blue-200">Subscriptions</p>
                        </Link>
                        <Link href="/review">
                            <p className="hover:text-blue-200">Review</p>
                        </Link>
                        <Link href="/assessment">
                            <p className="hover:text-blue-200">Assessment</p>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-blue-600">
                    <div className="flex flex-col space-y-2 px-4 py-2">
                        <Link href="/subscriptions">
                            <p className="hover:text-blue-300">Subscriptions</p>
                        </Link>
                        <Link href="/review">
                            <p className="hover:text-blue-300">Review</p>
                        </Link>
                        <Link href="/assessment">
                            <p className="hover:text-blue-300">Assessment</p>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
