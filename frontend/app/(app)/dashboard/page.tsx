'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Database, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">

                {/* --- HERO SECTION (Minimalist) --- */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-3">
                            Structural Inclusion Dashboard
                        </h1>
                        <p className="text-lg text-slate-500">
                            Real-time evaluation and longitudinal resilience tracking.
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0 flex flex-col items-end space-y-4">
                        {/* Model Status Badge */}
                        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm animate-in fade-in zoom-in duration-500 delay-150">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">System: Operational</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Model: v1.0 Hybrid</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <Link href="/institutional" className="px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-sm">
                                View Case Registry
                            </Link>
                            <Link href="/evaluate" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all text-sm flex items-center group">
                                Start Evaluation
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* --- SYSTEM SNAPSHOT --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Metric 1 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Database className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">12,450</div>
                        <div className="text-sm font-medium text-slate-500">Total Evaluations</div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">66.7 <span className="text-lg text-slate-400 font-normal">/ 100</span></div>
                        <div className="text-sm font-medium text-slate-500">Average Inclusion Index</div>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">82%</div>
                        <div className="text-sm font-medium text-slate-500">Stable / Improving Profiles</div>
                    </div>
                </div>

                {/* --- RECENT ACTIVITY --- */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 mb-20">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            Recent Activity
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-white">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Applicant Hash</th>
                                    <th className="px-6 py-4 font-semibold">Index</th>
                                    <th className="px-6 py-4 font-semibold">Trend</th>
                                    <th className="px-6 py-4 font-semibold text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-800">APPLICANT-HASH-882</td>
                                    <td className="px-6 py-4 font-semibold text-emerald-600">72.67</td>
                                    <td className="px-6 py-4"><span className="text-emerald-500">↑ Stable</span></td>
                                    <td className="px-6 py-4 text-right tabular-nums">Just now</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-800">APPLICANT-HASH-14A</td>
                                    <td className="px-6 py-4 font-semibold text-amber-600">58.42</td>
                                    <td className="px-6 py-4"><span className="text-slate-400">→ Monitor</span></td>
                                    <td className="px-6 py-4 text-right tabular-nums">12m ago</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-800">APPLICANT-HASH-99B</td>
                                    <td className="px-6 py-4 font-semibold text-blue-600">84.10</td>
                                    <td className="px-6 py-4"><span className="text-blue-500">↑ Strong</span></td>
                                    <td className="px-6 py-4 text-right tabular-nums">1h ago</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-800">APPLICANT-HASH-3F2</td>
                                    <td className="px-6 py-4 font-semibold text-emerald-600">76.33</td>
                                    <td className="px-6 py-4"><span className="text-emerald-500">↑ Stable</span></td>
                                    <td className="px-6 py-4 text-right tabular-nums">3h ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Microcopy */}
                <div className="flex justify-center animate-in fade-in duration-1000 delay-700">
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                        Evaluating <span className="text-slate-500">structure</span>, not just risk.
                    </p>
                </div>

            </main>
        </div>
    );
}
