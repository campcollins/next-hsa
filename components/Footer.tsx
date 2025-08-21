'use client';

import ComingSoonTooltip from './ComingSoonTooltip';

interface FooterProps {
    isLoggedIn: boolean;
}

export default function Footer({ isLoggedIn }: FooterProps) {
    // Pre-login state
    if (!isLoggedIn) {
        return (
            <footer className="bg-[#F7F9FA] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-gray-500">
                            © {new Date().getFullYear()} Next HSA. All rights reserved.
                        </div>

                        {/* Links */}
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                                    Terms of Service
                                </span>
                                <ComingSoonTooltip
                                    text="This page is coming soon"
                                    color="gray"
                                    size="sm"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                                    Privacy Policy
                                </span>
                                <ComingSoonTooltip
                                    text="This page is coming soon"
                                    color="gray"
                                    size="sm"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                                    Contact Us
                                </span>
                                <ComingSoonTooltip
                                    text="This page is coming soon"
                                    color="gray"
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    // Post-login state
    return (
        <footer className="bg-[#0A1C3C] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    {/* Copyright */}
                    <div className="text-white">
                        © {new Date().getFullYear()} Next HSA. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
} 