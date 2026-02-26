'use client';

import { useState, useEffect } from 'react';
import AnimatedNumber from './AnimatedNumber';
import InfoTooltip from './InfoTooltip';

type ScoreType = 'index' | 'probability';

export default function ScoreCard({
    label,
    value,
    type = 'index',
}: {
    label: string;
    value: number;
    type?: ScoreType;
}) {
    const [barWidth, setBarWidth] = useState(0);

    const tooltipData = type === 'index' ? {
        title: "Inclusion Index",
        content: "Composite structural index (0–100) reflecting economic stability, social integration, and resilience indicators. It summarizes multidimensional inclusion factors and does not represent a final credit approval decision."
    } : {
        title: "Repayment Outlook",
        content: "Machine-learning estimated probability of repayment based on observed structural and behavioral variables. This is a statistical estimate intended to support evaluation, not a guarantee of outcome."
    };

    // Safe value handling
    const safeValue = value ?? 0;

    // Determine normalized value for bar width (0-100)
    const targetPercentage = type === 'probability' ? safeValue * 100 : safeValue;

    useEffect(() => {
        // Trigger animation after mount with a slight delay to ensure the transition happens
        const timer = setTimeout(() => {
            setBarWidth(targetPercentage);
        }, 50);
        return () => clearTimeout(timer);
    }, [targetPercentage]);

    // --- Qualitative Logic (Humanized) ---
    const getStatus = (val: number) => {
        if (type === 'probability') return "Model Estimate";

        if (val >= 70) return "Strong Integration";
        if (val >= 40) return "Growing Stability";
        return "Support Recommended";
    };

    const getStatusColor = (val: number) => {
        if (type === 'probability') return "text-blue-600 font-medium";

        if (val >= 70) return "text-blue-800 font-bold";
        if (val >= 40) return "text-blue-600 font-medium";
        return "text-blue-400 font-normal";
    };

    const subtitle = type === 'index'
        ? "Reflects structural inclusion indicators."
        : "Estimated repayment consistency.";

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow duration-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                {label}
                <InfoTooltip title={tooltipData.title} content={tooltipData.content} />
            </span>

            {/* Score Value */}
            <div className="text-center mb-6 relative z-10 notranslate" translate="no">
                <div className="text-6xl font-bold text-slate-900 tracking-tight">
                    <AnimatedNumber value={value} decimals={1} suffix={type === 'probability' ? '%' : ''} />
                </div>
            </div>

            <div className={`text-sm ${getStatusColor(type === 'index' ? safeValue : 0)} mt-1 mb-1`}>
                {getStatus(type === 'index' ? safeValue : 0)}
            </div>

            <p className="text-[10px] text-slate-400 mb-4 font-light">
                {subtitle}
            </p>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-[1500ms] ease-out bg-blue-600`}
                    style={{ width: `${barWidth}%` }}
                />
            </div>
        </div>
    );
}
