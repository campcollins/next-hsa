'use client';

import { useState } from 'react';

interface HeaderProps {
    isLoggedIn: boolean;
    onLoginClick?: () => void;
    onLogoutClick?: () => void;
}

export default function Header({ isLoggedIn, onLoginClick, onLogoutClick }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu after navigation
        setIsMobileMenuOpen(false);
    };

    // Pre-login state
    if (!isLoggedIn) {
        return (
            <header className="bg-[#F7F9FA] shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Next HSA</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-12">
                            <button
                                onClick={() => scrollToSection('services')}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                            >
                                Services
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                            >
                                About
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                            >
                                FAQ
                            </button>
                        </nav>

                        {/* Desktop Login Button */}
                        <div className="hidden lg:block">
                            <button
                                onClick={onLoginClick}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                            >
                                Login / Sign Up
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-gray-200 py-4">
                            <nav className="flex flex-col space-y-4">
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="text-left text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium py-2"
                                >
                                    Services
                                </button>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="text-left text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium py-2"
                                >
                                    About
                                </button>
                                <button
                                    onClick={() => scrollToSection('faq')}
                                    className="text-left text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium py-2"
                                >
                                    FAQ
                                </button>
                                <div className="pt-2">
                                    <button
                                        onClick={onLoginClick}
                                        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Login / Sign Up
                                    </button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        );
    }

    // Post-login state
    return (
        <header className="bg-[#0A1C3C] shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-white">Next HSA</h1>
                    </div>

                    {/* Desktop Logout Button */}
                    <div className="hidden lg:block">
                        <button
                            onClick={onLogoutClick}
                            className="bg-white text-[#0A1C3C] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-white/20 py-4">
                        <nav className="flex flex-col space-y-4">
                            <div className="pt-2">
                                <button
                                    onClick={onLogoutClick}
                                    className="w-full bg-white text-[#0A1C3C] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
} 