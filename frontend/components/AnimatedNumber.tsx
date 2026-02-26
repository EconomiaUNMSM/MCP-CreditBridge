'use client';

import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    duration?: number; // ms
    decimals?: number;
    suffix?: string;
    className?: string; // Allow passing external classes
}

export default function AnimatedNumber({
    value,
    duration = 1000,
    decimals = 0,
    suffix = '',
    className = ''
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const startValue = 0; // Always start from 0 for this use case
        const endValue = value;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease-out cubic function for natural feel
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const current = startValue + (endValue - startValue) * easeOut;
            setDisplayValue(current);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);

    }, [value, duration]);

    return (
        <span className={`tabular-nums tracking-tight font-mono notranslate ${className}`} translate="no">
            {displayValue.toFixed(decimals)}
            {suffix}
        </span>
    );
}
