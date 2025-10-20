'use client';

import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export interface NavbarProps {
    url: string;
    title: string;
}

export const Navbar: FC<NavbarProps> = ({ url, title }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/habits", label: "Habits" },
        { href: "/calendar", label: "Calendar" },
        { href: "/journaling", label: "Journaling" },
    ];

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden lg:flex bg-indigo-700 p-6 text-white h-screen w-64 fixed left-0 top-0 flex-col items-center justify-start space-y-6">
                <div className="text-center mb-8">
                    <div className="font-bold text-lg">{url}</div>
                    <div className="text-sm">{title}</div>
                </div>

                {/* navigation links*/}
                {navLinks.map((link) => (
                    <Link 
                        key={link.href} 
                        href={link.href} 
                        className="nav-link hover:bg-indigo-600 rounded-md text-center w-full py-3 px-2 transition-colors duration-200"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Mobile Navbar */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <header className="bg-indigo-700 text-white p-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
                    <div className="text-lg font-bold">
                        {url || "Habit Tracker"}
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 hover:bg-indigo-600 rounded-md transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                            onClick={toggleMobileMenu}
                        ></div>
                        <nav className="fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white p-6 transform transition-transform duration-300 ease-in-out z-50 shadow-lg">
                            <div className="text-center mb-8 mt-16">
                                <div className="font-bold text-lg">{url || "Habit Tracker"}</div>
                                <div className="text-sm">{title}</div>
                            </div>

                            <div className="space-y-4">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.href} 
                                        href={link.href} 
                                        className="block nav-link hover:bg-indigo-600 rounded-md text-center w-full py-3 px-2 transition-colors duration-200"
                                        onClick={toggleMobileMenu}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
};