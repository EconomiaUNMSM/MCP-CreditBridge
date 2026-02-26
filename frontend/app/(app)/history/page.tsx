'use client';

import { useState } from 'react';
import HistoryChart from '@/components/HistoryChart';
import SectorDistributionChart from '@/components/SectorDistributionChart';
import CaseRegistryTable from '@/components/CaseRegistryTable';
import ProfileEvolution from '@/components/ProfileEvolution';

type DateRange = '6M' | '1Y' | 'YTD';
type HistoryTab = 'registry' | 'performance';

// Mock data generator with smooth, coherent trends
function generateMockData(range: DateRange) {
    const points = range === '6M' ? 12 : range === '1Y' ? 24 : 18;
    const data = [];

    let baseIndex = 65;
    let baseOutlook = 72;

    for (let i = 0; i < points; i++) {
        const monthsAgo = points - i - 1;
        const date = new Date();
        date.setMonth(date.getMonth() - monthsAgo);

        const noise = (Math.sin(i / 2) * 3) + (i * 0.3);
        const inclusionIndex = Math.min(100, Math.max(0, baseIndex + noise));
        const repaymentOutlook = Math.min(100, Math.max(0, baseOutlook + noise * 0.8));

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            inclusionIndex: parseFloat(inclusionIndex.toFixed(1)),
            repaymentOutlook: parseFloat(repaymentOutlook.toFixed(1))
        });
    }

    return data;
}

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState<HistoryTab>('registry');
    const [selectedRange, setSelectedRange] = useState<DateRange>('6M');
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [data, setData] = useState(() => generateMockData('6M'));
    const [selectedApplicant, setSelectedApplicant] = useState<{ name: string; id: string; index: number } | null>(null);

    const handleRangeChange = (range: DateRange) => {
        if (range === selectedRange) return;
        setIsRecalculating(true);
        setSelectedRange(range);
        setTimeout(() => {
            setData(generateMockData(range));
            setIsRecalculating(false);
        }, 600);
    };

    // Computed insights
    const avgIndex = (data.reduce((sum, d) => sum + d.inclusionIndex, 0) / data.length).toFixed(1);
    const trendDiff = data[data.length - 1].inclusionIndex - data[0].inclusionIndex;
    const trendLabel = trendDiff > 1 ? 'Upward' : trendDiff < -1 ? 'Downward' : 'Stable';
    const volatility = (() => {
        const mean = data.reduce((sum, d) => sum + d.inclusionIndex, 0) / data.length;
        const variance = data.reduce((sum, d) => sum + Math.pow(d.inclusionIndex - mean, 2), 0) / data.length;
        return Math.sqrt(variance).toFixed(2);
    })();

    const tabs: { key: HistoryTab; label: string; icon: JSX.Element }[] = [
        {
            key: 'registry',
            label: 'Case Registry',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            key: 'performance',
            label: 'System Performance',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="h-full flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">

            {/* Header + Tabs */}
            <div className="flex-shrink-0 px-6 pt-5 pb-0 max-w-screen-2xl mx-auto w-full">
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Historical Analysis
                        </h1>
                        <p className="text-slate-500 text-xs mt-0.5">
                            Structural resilience and longitudinal inclusion trends.
                        </p>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="flex space-x-1 border-b border-slate-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px
                                ${activeTab === tab.key
                                    ? 'border-blue-600 text-blue-700'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content - Fills Remaining Space */}
            <div className="flex-1 min-h-0 overflow-hidden">

                {/* ─── TAB 1: Case Registry ─── */}
                {activeTab === 'registry' && (
                    <div className="h-full flex flex-col lg:flex-row gap-5 px-6 py-5 max-w-screen-2xl mx-auto">

                        {/* Left: Registry Table (scrollable list) */}
                        <div className="lg:w-[58%] min-h-0 flex flex-col">
                            <div className="h-full overflow-y-auto rounded-xl">
                                <CaseRegistryTable
                                    onSelectApplicant={(a) => setSelectedApplicant({ name: a.name, id: a.id, index: a.index })}
                                    selectedId={selectedApplicant?.id}
                                />
                            </div>
                        </div>

                        {/* Right: Profile Evolution Chart */}
                        <div className="lg:w-[42%] min-h-0 flex flex-col">
                            {selectedApplicant ? (
                                <div className="h-full">
                                    <ProfileEvolution
                                        applicantName={selectedApplicant.name}
                                        baseIndex={selectedApplicant.index}
                                    />
                                </div>
                            ) : (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center h-full p-8">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Individual Insight</h4>
                                    <p className="text-xs text-slate-400 mt-2 max-w-[240px]">
                                        Select an applicant from the registry to simulate longitudinal analysis.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── TAB 2: System Performance ─── */}
                {activeTab === 'performance' && (
                    <div className="h-full flex flex-col gap-5 px-6 py-5 max-w-screen-2xl mx-auto overflow-hidden">

                        {/* Controls Bar */}
                        <div className="flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Aggregate System Performance</h3>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Range:</span>
                                {(['6M', '1Y', 'YTD'] as DateRange[]).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => handleRangeChange(range)}
                                        disabled={isRecalculating}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                            ${selectedRange === range
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                            }
                                            ${isRecalculating ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart Area - Takes Remaining Space divided into two graphs */}
                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Longitudinal Trajectory */}
                            <div className="lg:col-span-2 flex flex-col h-full">
                                {isRecalculating ? (
                                    <div className="w-full h-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                                        <div className="h-full bg-slate-50 rounded"></div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <div className="px-6 pt-5 pb-2 border-b border-slate-100 flex-shrink-0">
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Longitudinal Trajectory</h3>
                                        </div>
                                        <div className="flex-1 min-h-0 relative -mt-6">
                                            <HistoryChart data={data} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sector Distribution Panel */}
                            <div className="lg:col-span-1 h-full">
                                <SectorDistributionChart />
                            </div>
                        </div>

                        {/* Insight Cards */}
                        <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Index</h3>
                                    </div>
                                    <p className="text-2xl font-extrabold text-slate-900">{avgIndex}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Mean structural stability</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${trendDiff > 1 ? 'bg-emerald-500' : trendDiff < -1 ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trend Direction</h3>
                                    </div>
                                    <div className="flex items-baseline space-x-2">
                                        <p className="text-2xl font-extrabold text-slate-900">{trendLabel}</p>
                                        <span className={`text-xs font-bold ${trendDiff > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {(trendDiff > 0 ? '+' : '') + trendDiff.toFixed(1)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Net movement over period</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Observed Volatility</h3>
                                    </div>
                                    <p className="text-2xl font-extrabold text-slate-900">{volatility}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Standard deviation of scores</p>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="flex-shrink-0 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-[10px] text-slate-600 leading-relaxed">
                                <span className="font-bold text-blue-700">Note:</span> This is a simulated historical view for demonstration purposes.
                                In production, data would reflect actual evaluation snapshots stored in the system&apos;s diagnostic ledger.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
