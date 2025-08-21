'use client';

import { User, HSAAccount, VirtualCard, Transaction, MedicalExpenseCategory } from '@/lib/types';
import Header from './Header';
import Footer from './Footer';
import RecentTransactions from './RecentTransactions';
import ComingSoonTooltip from './ComingSoonTooltip';

interface DashboardProps {
    currentUser: User;
    account: HSAAccount | null;
    accountSummary: {
        current_balance: number;
        total_deposits: number;
        total_expenses: number;
    } | null;
    virtualCard: VirtualCard | null;
    transactions: Transaction[];
    categories: MedicalExpenseCategory[];
    isLoading: boolean;
    isSimulatingTransaction: boolean;
    isSimulatingDeposit: boolean;
    message: string;
    loginForm: { email: string; password: string };
    registerForm: { email: string; password: string; first_name: string; last_name: string };
    depositForm: { amount: string };
    transactionForm: { amount: string; merchant: string; category: string };
    onLogin: (e: React.FormEvent) => Promise<void>;
    onRegister: (e: React.FormEvent) => Promise<void>;
    onDeposit: (e: React.FormEvent) => Promise<void>;
    onIssueCard: () => Promise<void>;
    onSimulateTransaction: () => Promise<void>;
    onSimulateDeposit: () => Promise<void>;
    onLogout: () => void;
    setLoginForm: (form: { email: string; password: string }) => void;
    setRegisterForm: (form: { email: string; password: string; first_name: string; last_name: string }) => void;
    setDepositForm: (form: { amount: string }) => void;
    setTransactionForm: (form: { amount: string; merchant: string; category: string }) => void;
    setMessage: (message: string) => void;
}

export default function Dashboard({
    currentUser,
    account,
    accountSummary,
    virtualCard,
    transactions,
    categories,
    isLoading,
    isSimulatingTransaction,
    isSimulatingDeposit,
    message,
    loginForm,
    registerForm,
    depositForm,
    transactionForm,
    onLogin,
    onRegister,
    onDeposit,
    onIssueCard,
    onSimulateTransaction,
    onSimulateDeposit,
    onLogout,
    setLoginForm,
    setRegisterForm,
    setDepositForm,
    setTransactionForm,
    setMessage
}: DashboardProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
            {/* Header */}
            <Header
                isLoggedIn={true}
                onLogoutClick={onLogout}
            />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome back!</h1>
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#1a365d] to-[#2d5a87] rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-900">{currentUser.first_name} {currentUser.last_name}</p>
                                    <p className="text-gray-600">{currentUser.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <ComingSoonTooltip text="Account Information Editing Coming Soon" color="gray" size="md" />
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-not-allowed opacity-50">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-8 p-6 rounded-2xl shadow-lg border ${message.includes('successful') || message.includes('APPROVED') || message.includes('completed') || message.includes('Login successful')
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-3 ${message.includes('successful') || message.includes('APPROVED') || message.includes('completed') || message.includes('Login successful')
                                ? 'bg-green-500'
                                : 'bg-red-500'
                                }`}></div>
                            <p className="font-medium">{message}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Account Overview */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h2>
                        {accountSummary && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-[#1a365d] to-[#2d5a87] rounded-xl p-6 text-white">
                                    <p className="text-sm opacity-90 font-medium mb-2">Current Balance</p>
                                    <p className="text-4xl font-bold">${accountSummary.current_balance.toFixed(2)}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="text-sm text-green-600 font-medium mb-1">Total Deposits</p>
                                        <p className="text-2xl font-bold text-green-700">${accountSummary.total_deposits.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-sm text-red-600 font-medium mb-1">Total Expenses</p>
                                        <p className="text-2xl font-bold text-red-700">${accountSummary.total_expenses.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Virtual Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Virtual Card</h2>
                        {virtualCard ? (
                            <div className="bg-gradient-to-r from-[#1a365d] via-[#2d5a87] to-[#3b6ea0] rounded-xl p-6 text-white shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-sm opacity-75 font-medium mb-1">Card Number</p>
                                        <p className="text-xl font-mono tracking-wider">{virtualCard.card_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm opacity-75 font-medium mb-1">CVV</p>
                                        <p className="text-xl font-mono">{virtualCard.cvv}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm opacity-75 font-medium mb-1">Expires</p>
                                    <p className="text-lg font-semibold">{virtualCard.expiry_date}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 mb-4">No virtual card issued yet</p>
                                <button
                                    onClick={onIssueCard}
                                    disabled={isLoading}
                                    className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
                                >
                                    Issue Virtual Card
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Simulate Expense */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulate Expense</h2>
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                Simulate an expense using our sample data. The system will automatically validate if it&apos;s a qualified medical expense based on the merchant category code (MCC).
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={onSimulateTransaction}
                                    disabled={isSimulatingTransaction || !virtualCard}
                                    className="px-8 py-4 bg-[#1a365d] text-white rounded-xl font-medium hover:bg-[#2d5a87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a365d] disabled:opacity-50 transition-all duration-200 text-lg flex items-center justify-center gap-3"
                                >
                                    {isSimulatingTransaction ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Simulate Expense'
                                    )}
                                </button>
                            </div>
                            {!virtualCard && (
                                <p className="text-sm text-red-600 mt-4 flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    You need to issue a virtual card first to simulate expenses.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Simulate Deposit */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulate Deposit</h2>
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                Simulate a bank deposit with connection verification. The system will check for bank connection and verify account information.
                            </p>
                            <form onSubmit={(e) => { e.preventDefault(); onSimulateDeposit(); }} className="space-y-4">
                                <div className="flex gap-3 justify-center">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="Amount"
                                        value={depositForm.amount}
                                        onChange={(e) => setDepositForm({ amount: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-32"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSimulatingDeposit || !depositForm.amount}
                                        className="px-8 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 transition-all duration-200 text-lg flex items-center justify-center gap-3"
                                    >
                                        {isSimulatingDeposit ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Connecting to bank...
                                            </>
                                        ) : (
                                            'Simulate Deposit'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <RecentTransactions transactions={transactions} />
            </div>

            {/* Footer */}
            <Footer isLoggedIn={true} />
        </div>
    );
} 