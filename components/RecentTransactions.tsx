'use client';

import { Transaction } from '@/lib/types';
import acceptedMCCs from '@/data/acceptedMCCs.json';

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMCCDescription = (mcc: string) => {
        const mccData = acceptedMCCs.find(item => item.mcc === mcc);
        return mccData ? mccData.description : 'Unapproved Category';
    };

    const getStatusIcon = (transaction: Transaction) => {
        if (transaction.type === 'deposit') {
            return (
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-600">Deposit</span>
                </div>
            );
        } else if (transaction.is_medical_expense) {
            return (
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="ml-2 text-sm font-medium text-green-600">Approved</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <span className="ml-2 text-sm font-medium text-red-600">Declined</span>
                </div>
            );
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-gray-600">No transactions yet. Simulate a transaction to get started!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
            <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-gray-900 truncate">{transaction.merchant}</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    ${transaction.amount.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    {transaction.type === 'deposit'
                                        ? 'Direct Contribution'
                                        : `MCC ${transaction.category} - ${getMCCDescription(transaction.category)}`
                                    }
                                </p>
                                <p className="text-sm text-gray-500">{formatDate(transaction.transaction_date)}</p>
                            </div>
                        </div>
                        <div className="ml-4">
                            {getStatusIcon(transaction)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 