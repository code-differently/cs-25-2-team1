'use client';

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useClerk } from '@clerk/nextjs';

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = ({}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { signOut } = useClerk();

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

    return (
        <>
            {/* Desktop Navbar - Your Original Code */}
            <nav className="hidden lg:flex bg-indigo-700 p-6 text-white h-screen w-64 fixed left-0 top-0 flex-col items-center justify-start space-y-6">
                <div className="text-center mb-8">
                    <div className="font-bold text-lg">Habit Tracker</div>
                    <div className="text-sm">Stay on track</div>
                </div>

                {/* navigation links*/}
                <Link href="/" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                    Dashboard
                </Link>
                <Link href="/habits" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                    Habits
                </Link>
                <Link href="/calendar" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                    Calendar
                </Link>
                <Link href="/journaling" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                    Journaling
                </Link>
                <button
                    onClick={() => signOut()}
                    className="nav-link bg-red-500 hover:bg-red-600 text-white text-center w-full py-2 rounded mt-4"
                >
                    Sign Out
                </button>
            </nav>

            {/* Mobile Navbar - Added Part */}
            <div className="lg:hidden">
                {/* Mobile Header */}
                <header className="bg-indigo-700 text-white p-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
                    <div className="text-lg font-bold">
                        Habit Tracker
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
                                <div className="font-bold text-lg">Habit Tracker</div>
                                <div className="text-sm">Stay on track</div>
                            </div>

                            <div className="space-y-4">
                                <Link 
                                    href="/" 
                                    className="block nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    href="/habits" 
                                    className="block nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    Habits
                                </Link>
                                <Link 
                                    href="/calendar" 
                                    className="block nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    Calendar
                                </Link>
                                <Link 
                                    href="/journaling" 
                                    className="block nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded transition-colors duration-200"
                                    onClick={toggleMobileMenu}
                                >
                                    Journaling
                                </Link>
                                <button
                                    onClick={() => { signOut(); toggleMobileMenu(); }}
                                    className="block nav-link bg-red-500 hover:bg-red-600 text-white text-center w-full py-2 rounded mt-4 transition-colors duration-200"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
}