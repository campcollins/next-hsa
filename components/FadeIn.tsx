'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                } ${className}`}
        >
            {children}
        </div>
    );
} 