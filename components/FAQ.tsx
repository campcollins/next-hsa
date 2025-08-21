'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What is a Health Savings Account (HSA)?",
        answer: "A Health Savings Account (HSA) is a tax-advantaged savings account designed to help you pay for qualified medical expenses. Contributions are tax-deductible, earnings grow tax-free, and withdrawals for qualified medical expenses are also tax-free."
    },
    {
        question: "Who is eligible for an HSA?",
        answer: "To be eligible for an HSA, you must be enrolled in a high-deductible health plan (HDHP) and not be covered by other health insurance that is not an HDHP. You also cannot be enrolled in Medicare or claimed as a dependent on someone else's tax return."
    },
    {
        question: "What are the contribution limits for HSAs?",
        answer: "For 2024, the contribution limits are $4,150 for individual coverage and $8,300 for family coverage. If you're 55 or older, you can contribute an additional $1,000 as a catch-up contribution."
    },
    {
        question: "What expenses are qualified for HSA withdrawals?",
        answer: "Qualified medical expenses include doctor visits, prescription medications, dental care, vision care, and many other healthcare-related costs. The IRS provides a comprehensive list of qualified expenses in Publication 502."
    },
    {
        question: "Can I use my HSA funds for non-medical expenses?",
        answer: "Yes, but withdrawals for non-medical expenses before age 65 are subject to a 20% penalty plus income taxes. After age 65, you can withdraw funds for any purpose without penalty, but you'll still pay income taxes on non-medical withdrawals."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                        >
                            <span className="font-medium text-gray-900">{item.question}</span>
                            <svg
                                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 