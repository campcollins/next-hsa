'use client';

interface ComingSoonTooltipProps {
    text?: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function ComingSoonTooltip({
    text = 'Coming Soon',
    color = 'gray',
    size = 'md',
    className = ''
}: ComingSoonTooltipProps) {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6'
    };

    const colorClasses = {
        blue: 'text-blue-600',
        gray: 'text-gray-400',
        green: 'text-green-600'
    };

    return (
        <div className={`relative group ${className}`}>
            <svg
                className={`${sizeClasses[size]} ${colorClasses[color as keyof typeof colorClasses]} cursor-help`}
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {text}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
        </div>
    );
} 