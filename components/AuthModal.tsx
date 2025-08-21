'use client';

import { useState } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (e: React.FormEvent) => Promise<void>;
    onRegister: (e: React.FormEvent) => Promise<void>;
    loginForm: { email: string; password: string };
    registerForm: { email: string; password: string; first_name: string; last_name: string };
    setLoginForm: (form: { email: string; password: string }) => void;
    setRegisterForm: (form: { email: string; password: string; first_name: string; last_name: string }) => void;
    isLoading: boolean;
    message: string;
    setMessage: (message: string) => void;
}

export default function AuthModal({
    isOpen,
    onClose,
    onLogin,
    onRegister,
    loginForm,
    registerForm,
    setLoginForm,
    setRegisterForm,
    isLoading,
    message,
    setMessage
}: AuthModalProps) {
    const [showLogin, setShowLogin] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Next HSA</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex mb-6">
                        <button
                            onClick={() => {
                                setShowLogin(true);
                                setMessage('');
                            }}
                            className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors ${showLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setShowLogin(false);
                                setMessage('');
                            }}
                            className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors ${!showLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Login Form */}
                    {showLogin ? (
                        <form onSubmit={onLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                    ) : (
                        /* Registration Form */
                        <form onSubmit={onRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={registerForm.first_name}
                                        onChange={(e) => setRegisterForm({ ...registerForm, first_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="First name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={registerForm.last_name}
                                        onChange={(e) => setRegisterForm({ ...registerForm, last_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={registerForm.email}
                                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={registerForm.password}
                                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Create a password (min 6 characters)"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
} 