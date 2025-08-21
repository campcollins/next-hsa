import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Next HSA - Modern Health Savings Account Management',
    description: 'A comprehensive Health Savings Account (HSA) application that simulates the complete lifecycle of HSA management. Features include account creation, virtual card issuance, transaction processing, and IRS-compliant medical expense validation.',
    keywords: [
        'HSA',
        'Health Savings Account',
        'Medical Expenses',
        'Healthcare Finance',
        'IRS Compliance',
        'Virtual Card',
        'Transaction Processing',
        'Medical Expense Validation',
        'Healthcare Management',
        'Financial Technology'
    ],
    authors: [{ name: 'Next HSA Team' }],
    creator: 'Next HSA',
    publisher: 'Next HSA',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://next-hsa.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Next HSA - Modern Health Savings Account Management',
        description: 'A comprehensive Health Savings Account (HSA) application that simulates the complete lifecycle of HSA management with virtual card issuance and IRS-compliant medical expense validation.',
        url: 'https://next-hsa.com',
        siteName: 'Next HSA',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Next HSA - Health Savings Account Management',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Next HSA - Modern Health Savings Account Management',
        description: 'A comprehensive HSA application with virtual card issuance and IRS-compliant medical expense validation.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        yahoo: 'your-yahoo-verification-code',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
} 