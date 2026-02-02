'use client';

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full sticky top-0 z-50 bg-gray-300">
            {/* Centered container with padding */}
            <div className="max-w-7xl mx-auto flex items-center justify-between h-[70px] px-6">
                {/* Logo */}
                <h1 className="font-mono text-xl">VenueHero</h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6">
                    <Link href="/getStarted" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded bg-blue-600 text-white"
                    >
                        {isOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col items-center gap-4 pb-4 bg-gray-200 px-6">
                    <Link href="/getStarted" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;