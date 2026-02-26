'use client';

import { useState, useEffect } from 'react';

const STEPS = [
    "Integrating Data Streams...",
    "Analyzing Economic Stability Vectors...",
    "Evaluating Social Integration Metrics...",
    "Running Structural Stability Model v2...",
    "Computing ML Probability & SHAP Values...",
    "Generating Generative AI Explanation...",
    "Finalizing Structured Report..."
];

export default function EvaluationProgress({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < STEPS.length) {
            const timeout = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800); // 800ms per step simulation
            return () => clearTimeout(timeout);
        } else {
            // Small delay on finish
            const timeout = setTimeout(() => {
                onComplete();
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentStep, onComplete]);

    return (
        <div className="w-full bg-slate-50 p-6 rounded-lg border border-slate-200 mt-6 shadow-sm animate-in fade-in duration-500">
            <div className="font-mono text-sm space-y-2">
                {STEPS.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center space-x-3 transition-opacity duration-300 ${index > currentStep ? 'opacity-0' : index === currentStep ? 'opacity-100 text-blue-600 font-bold' : 'opacity-50 text-slate-500'
                            }`}
                    >
                        <span className="text-xs">
                            {index < currentStep ? '✓' : index === currentStep ? '➤' : '○'}
                        </span>
                        <span>{step}</span>
                    </div>
                ))}
                {currentStep === STEPS.length && (
                    <div className="text-green-600 font-bold mt-4 pt-2 border-t border-slate-200 animate-pulse">
                        Analysis Complete. Rendering results...
                    </div>
                )}
            </div>
        </div>
    );
}
