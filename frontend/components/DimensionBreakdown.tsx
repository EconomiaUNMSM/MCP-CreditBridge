'use client';

import { useEffect, useState } from 'react';
import AnimatedNumber from './AnimatedNumber';

interface DimensionBreakdownProps {
    scores: {
        economic: number;
        integration: number;
        stability: number;
    };
    isVisible: boolean;
}

export default function DimensionBreakdown({ scores, isVisible }: DimensionBreakdownProps) {
    const [showCards, setShowCards] = useState([false, false, false]);

    useEffect(() => {
        if (isVisible) {
            const timeouts = [
                setTimeout(() => setShowCards(prev => [true, prev[1], prev[2]]), 100),
                setTimeout(() => setShowCards(prev => [prev[0], true, prev[2]]), 300),
                setTimeout(() => setShowCards(prev => [prev[0], prev[1], true]), 500),
            ];
            return () => timeouts.forEach(clearTimeout);
        } else {
            setShowCards([false, false, false]);
        }
    }, [isVisible]);

    const dimensions = [
        {
            label: 'Economic Stability',
            value: scores.economic * 100,
            color: 'bg-blue-600',
            barColor: 'bg-blue-600',
            description: 'Reflects income consistency and savings buffer.'
        },
        {
            label: 'Social Integration',
            value: scores.integration * 100,
            color: 'bg-indigo-600',
            barColor: 'bg-indigo-600',
            description: 'Community engagement and support network.'
        },
        {
            label: 'Structural Resilience',
            value: scores.stability * 100,
            color: 'bg-cyan-600',
            barColor: 'bg-cyan-600',
            description: 'Long-term housing and legal stability.'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {dimensions.map((dim, index) => (
                <div
                    key={dim.label}
                    className={`bg-white border border-slate-100 rounded-lg p-4 shadow-sm transition-all duration-500 transform ${showCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    <div className="flex justify-between items-end mb-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {dim.label}
                        </h4>
                        <span className={`text-xl font-bold ${dim.color.replace('bg-', 'text-')} notranslate`} translate="no">
                            <AnimatedNumber value={dim.value} duration={1000} />
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${dim.barColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${showCards[index] ? dim.value : 0}%` }}
                        ></div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-tight">
                        {dim.description}
                    </p>
                </div>
            ))}
        </div>
    );
}
