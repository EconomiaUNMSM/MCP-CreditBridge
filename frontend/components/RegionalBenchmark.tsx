'use client';

import { TrendingUp, Users, Info } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface RegionalBenchmarkProps {
    applicantScore: number;
    sector: string;
}

export default function RegionalBenchmark({ applicantScore, sector }: RegionalBenchmarkProps) {
    // Mock sector averages based on sector name (simple hash-like logic for consistency)
    const getSectorAvg = (s: string) => {
        const hash = s.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 55 + (hash % 20); // Average between 55 and 75
    };

    const avgScore = getSectorAvg(sector);
    const delta = applicantScore - avgScore;
    const isPositive = delta >= 0;
    const percentage = Math.abs((delta / avgScore) * 100).toFixed(0);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="p-1 bg-violet-50 rounded-md text-violet-600">
                        <Users className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Sector Benchmark</h3>
                </div>
                <InfoTooltip
                    title="Regional Sector Benchmark"
                    content={`Comparison of the applicant's Inclusion Index against the average for the ${sector} sector in this region. This context helps evaluate relative performance beyond absolute scores.`}
                />
            </div>

            <div className="flex items-end justify-between mb-2">
                <div>
                    <div className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                        {isPositive ? '+' : '-'}{percentage}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        vs {sector} Avg ({avgScore})
                    </div>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    <TrendingUp className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} />
                    {isPositive ? 'Above Avg' : 'Below Avg'}
                </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="relative h-6 bg-slate-100 rounded-full mt-2 overflow-hidden flex items-center">
                {/* Center Marker (Average) */}
                <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-slate-300 z-10"></div>

                {/* Applicant Marker (Relative position) */}
                {/* Mapping: Center is Avg. Max deviation visualized is +/- 40 points */}
                <div
                    className={`absolute h-4 w-4 rounded-full border-2 border-white shadow-sm z-20 transition-all duration-1000 ease-out ${isPositive ? 'bg-blue-600' : 'bg-amber-500'}`}
                    style={{
                        left: `clamp(10%, ${50 + (delta * 1.5)}%, 90%)`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                ></div>

                {/* Range Labels */}
                <div className="absolute left-2 text-[8px] font-bold text-slate-400">Low</div>
                <div className="absolute right-2 text-[8px] font-bold text-slate-400">Top</div>
            </div>

            <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-mono">
                <span>Avg</span>
                <span>Applicant</span>
            </div>
        </div>
    );
}
