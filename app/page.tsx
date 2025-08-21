'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, HSAAccount, VirtualCard, Transaction, MedicalExpenseCategory } from '@/lib/types';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import FadeIn from '@/components/FadeIn';

export default function Home() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [account, setAccount] = useState<HSAAccount | null>(null);
    const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<MedicalExpenseCategory[]>([]);
    const [accountSummary, setAccountSummary] = useState<{
        current_balance: number;
        total_deposits: number;
        total_expenses: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSimulatingTransaction, setIsSimulatingTransaction] = useState(false);
    const [isSimulatingDeposit, setIsSimulatingDeposit] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [message, setMessage] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Form states
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [depositForm, setDepositForm] = useState({ amount: '' });
    const [transactionForm, setTransactionForm] = useState({
        amount: '',
        merchant: '',
        category: ''
    });

    const checkAuthToken = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setCurrentUser(user);

                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), 5000)
                );

                await Promise.race([
                    Promise.all([
                        fetchAccount(user.id),
                        fetchVirtualCard(user.id),
                        fetchRecentTransactions(user.id),
                        fetchAccountSummary(user.id)
                    ]),
                    timeoutPromise
                ]);
            } catch (error) {
                console.error('Failed to parse user data or fetch data:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
        setIsInitializing(false);
    }, []);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await fetchCategories();
                await checkAuthToken();
            } catch (error) {
                console.error('Failed to initialize app:', error);
                // Clear any corrupted localStorage data
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                setIsInitializing(false);
            }
        };

        // Add a fallback timeout to ensure the app doesn't hang forever
        const timeoutId = setTimeout(() => {
            console.error('App initialization timeout - forcing initialization to complete');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setIsInitializing(false);
        }, 10000);

        initializeApp().finally(() => {
            clearTimeout(timeoutId);
        });
    }, [checkAuthToken]);

    // Handle dashboard class for scroll behavior and scroll to top on login
    useEffect(() => {
        if (typeof document !== 'undefined') {
            if (currentUser) {
                document.documentElement.classList.add('dashboard-page');
                // Scroll to top when user logs in
                window.scrollTo(0, 0);
            } else {
                document.documentElement.classList.remove('dashboard-page');
            }
        }
    }, [currentUser]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/medical-expenses/categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchAccount = async (userId: string) => {
        try {
            const response = await fetch(`/api/account/balance?userId=${userId}`);
            const data = await response.json();
            if (response.ok) {
                setAccount(data.account);
            }
        } catch (error) {
            console.error('Failed to fetch account:', error);
        }
    };

    const fetchVirtualCard = async (userId: string) => {
        try {
            const response = await fetch(`/api/card/get?userId=${userId}`);
            const data = await response.json();
            if (response.ok && data.card) {
                setVirtualCard(data.card);
            }
        } catch (error) {
            console.error('Failed to fetch virtual card:', error);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerForm)
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));

                setCurrentUser(data.user);
                setMessage('Registration successful! Welcome to Next HSA!');
                await fetchAccount(data.user.id);
                await fetchVirtualCard(data.user.id);
                await fetchRecentTransactions(data.user.id);
                await fetchAccountSummary(data.user.id);
                setRegisterForm({ email: '', password: '', first_name: '', last_name: '' });
                setIsAuthModalOpen(false);
                // Scroll to top after successful registration
                window.scrollTo(0, 0);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm)
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));

                setCurrentUser(data.user);
                setMessage('Login successful!');
                await fetchAccount(data.user.id);
                await fetchVirtualCard(data.user.id);
                await fetchRecentTransactions(data.user.id);
                await fetchAccountSummary(data.user.id);
                setIsAuthModalOpen(false);
                // Scroll to top after successful login
                window.scrollTo(0, 0);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(`/api/account/deposit?userId=${currentUser.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(depositForm.amount) })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Deposit successful! New balance: $${data.deposit.new_balance.toFixed(2)}`);
                setDepositForm({ amount: '' });
                await fetchAccount(currentUser.id);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Deposit failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleIssueCard = async () => {
        if (!currentUser) return;

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(`/api/card/issue?userId=${currentUser.id}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                setVirtualCard(data.card);
                setMessage('Virtual card issued successfully!');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Failed to issue card. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSimulateTransaction = async () => {
        if (!currentUser) return;

        setIsSimulatingTransaction(true);
        setMessage('');

        // Add a realistic delay to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const response = await fetch(`/api/transaction/simulate?userId=${currentUser.id}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                let status = data.transaction.status;
                let balanceText = '';

                if (data.transaction.is_medical_expense) {
                    status = 'APPROVED';
                    balanceText = ` New balance: $${data.transaction.new_balance.toFixed(2)}`;
                } else if (data.transaction.status === 'DECLINED - Insufficient funds') {
                    status = 'DECLINED - Insufficient funds';
                } else {
                    status = 'DECLINED - Non-qualified expense';
                }

                setMessage(`Transaction ${status}!${balanceText}`);
                await fetchAccount(currentUser.id);
                await fetchRecentTransactions(currentUser.id);
                await fetchAccountSummary(currentUser.id);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Transaction simulation failed. Please try again.');
        } finally {
            setIsSimulatingTransaction(false);
        }
    };

    const handleSimulateDeposit = async () => {
        if (!currentUser || !depositForm.amount) return;

        setIsSimulatingDeposit(true);
        setMessage('');

        // Add a realistic delay to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const response = await fetch(`/api/account/deposit/simulate?userId=${currentUser.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: parseFloat(depositForm.amount) })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Deposit completed! Amount: $${data.deposit.amount.toFixed(2)}. New balance: $${data.deposit.new_balance.toFixed(2)}`);
                await fetchAccount(currentUser.id);
                await fetchAccountSummary(currentUser.id);
                await fetchRecentTransactions(currentUser.id);
                setDepositForm({ amount: '' }); // Clear the form
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Deposit simulation failed. Please try again.');
        } finally {
            setIsSimulatingDeposit(false);
        }
    };

    const fetchRecentTransactions = async (userId: string) => {
        try {
            const response = await fetch(`/api/transaction/recent?userId=${userId}`);
            const data = await response.json();
            if (response.ok) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error('Failed to fetch recent transactions:', error);
        }
    };

    const fetchAccountSummary = async (userId: string) => {
        try {
            const response = await fetch(`/api/account/summary?userId=${userId}`);
            const data = await response.json();
            if (response.ok) {
                setAccountSummary(data.summary);
            } else {
                console.error('Failed to fetch account summary:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch account summary:', error);
        }
    };

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');

        // Clear state
        setCurrentUser(null);
        setAccount(null);
        setVirtualCard(null);
        setTransactions([]);
        setMessage('');
    };

    // Show loading screen while initializing
    if (isInitializing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Next HSA...</p>
                </div>
            </div>
        );
    }

    // If user is logged in, show dashboard
    if (currentUser) {
        return (
            <Dashboard
                currentUser={currentUser}
                account={account}
                accountSummary={accountSummary}
                virtualCard={virtualCard}
                transactions={transactions}
                categories={categories}
                isLoading={isLoading}
                isSimulatingTransaction={isSimulatingTransaction}
                isSimulatingDeposit={isSimulatingDeposit}
                message={message}
                loginForm={loginForm}
                registerForm={registerForm}
                depositForm={depositForm}
                transactionForm={transactionForm}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onDeposit={handleDeposit}
                onIssueCard={handleIssueCard}
                onSimulateTransaction={handleSimulateTransaction}
                onSimulateDeposit={handleSimulateDeposit}
                onLogout={handleLogout}
                setLoginForm={setLoginForm}
                setRegisterForm={setRegisterForm}
                setDepositForm={setDepositForm}
                setTransactionForm={setTransactionForm}
                setMessage={setMessage}
            />
        );
    }

    // Marketing page for non-authenticated users
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <Header
                isLoggedIn={false}
                onLoginClick={() => setIsAuthModalOpen(true)}
            />

            {/* Hero Section */}
            <FadeIn>
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Next HSA
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Manage your Health Savings Account with ease
                        </p>
                    </div>
                </section>
            </FadeIn>

            {/* Services Section */}
            <FadeIn delay={200}>
                <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Everything you need to manage your HSA
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Dashboard</h3>
                                <p className="text-gray-600">A clear overview of your HSA balance and activity.</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Virtual Debit Card</h3>
                                <p className="text-gray-600">Instantly issue a virtual card for quick, secure payments.</p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Auto-Filtering Expenses</h3>
                                <p className="text-gray-600">Our smart system automatically validates medical expenses for you.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeIn>

            {/* What is an HSA? Section */}
            <FadeIn delay={400}>
                <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            What is an HSA?
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            A Health Savings Account (HSA) is a tax-advantaged savings account designed to help you pay for qualified medical expenses.
                            Contributions are tax-deductible, earnings grow tax-free, and withdrawals for qualified medical expenses are also tax-free.
                            HSAs are available to individuals enrolled in high-deductible health plans (HDHPs) and offer a powerful way to save for
                            current and future healthcare costs while reducing your tax burden.
                        </p>
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                            Get Started
                        </button>
                    </div>
                </section>
            </FadeIn>

            {/* FAQ Section */}
            <FadeIn delay={600}>
                <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Frequently Asked Questions
                        </h2>
                        <FAQ />
                    </div>
                </section>
            </FadeIn>

            {/* Footer */}
            <Footer isLoggedIn={false} />

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
                loginForm={loginForm}
                registerForm={registerForm}
                setLoginForm={setLoginForm}
                setRegisterForm={setRegisterForm}
                isLoading={isLoading}
                message={message}
                setMessage={setMessage}
            />
        </div>
    );
} 