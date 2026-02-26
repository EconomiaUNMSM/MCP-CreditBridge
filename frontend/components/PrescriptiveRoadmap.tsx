'use client';

import { useState, useEffect } from 'react';
import { PrescriptiveAction } from '@/types/evaluation';
import { Rocket, ArrowUpRight, Clock, Zap, ChevronRight } from 'lucide-react';

interface PrescriptiveRoadmapProps {
    roadmap: PrescriptiveAction[];
}

function getImpactBadge(impact: string) {
    switch (impact.toLowerCase()) {
        case 'high':
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" />High</span>;
        case 'medium':
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 inline-flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" />Medium</span>;
        default:
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 inline-flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />Low</span>;
    }
}

function getEffortBadge(effort: string) {
    switch (effort.toLowerCase()) {
        case 'low':
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700">Easy</span>;
        case 'medium':
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">Moderate</span>;
        default:
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Complex</span>;
    }
}

export default function PrescriptiveRoadmap({ roadmap }: PrescriptiveRoadmapProps) {
    const [visibleSteps, setVisibleSteps] = useState(0);
    const sorted = [...roadmap].sort((a, b) => a.priority - b.priority);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        sorted.forEach((_, i) => {
            timers.push(setTimeout(() => setVisibleSteps(i + 1), 200 * (i + 1)));
        });
        return () => timers.forEach(clearTimeout);
    }, [roadmap]);

    if (!roadmap || roadmap.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center space-x-2">
                    <div className="p-1 bg-amber-50 rounded-md text-amber-600">
                        <Rocket className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Inclusion Roadmap</h3>
                </div>
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                    {roadmap.length} Action{roadmap.length > 1 ? 's' : ''}
                </span>
            </div>

            {/* Compact Steps List */}
            <div className="divide-y divide-slate-50">
                {sorted.slice(0, visibleSteps).map((step, i) => (
                    <div
                        key={i}
                        className="group px-4 py-3 hover:bg-slate-50/50 transition-colors duration-150 animate-in fade-in slide-in-from-bottom-1 cursor-default"
                    >
                        <div className="flex items-start gap-2.5">
                            {/* Priority Badge */}
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm mt-0.5">
                                {step.priority}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-0.5">
                                    <h4 className="text-[13px] font-semibold text-slate-800 truncate">
                                        {step.title}
                                    </h4>
                                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-1.5">
                                    {step.description}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    {getImpactBadge(step.impact)}
                                    {getEffortBadge(step.effort)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
