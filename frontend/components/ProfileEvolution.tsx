'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileEvolutionProps {
    applicantName: string;
    baseIndex: number;
}

export default function ProfileEvolution({ applicantName, baseIndex }: ProfileEvolutionProps) {
    const [data, setData] = useState<any[]>([]);
    const [trend, setTrend] = useState<'Stable' | 'Improving' | 'Monitoring Required'>('Stable');

    useEffect(() => {
        // Generate 8-10 points of simulated history
        const points = 8 + Math.floor(Math.random() * 5);
        const history = [];
        let current = baseIndex - (Math.random() * 10 - 5);

        for (let i = 0; i < points; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - (points - i - 1));

            // Random walk with a slight weight towards the baseIndex
            const noise = (Math.random() - 0.45) * 4;
            current = Math.min(100, Math.max(0, current + noise));

            history.push({
                date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                index: parseFloat(current.toFixed(1)),
                ml: parseFloat((current + (Math.random() * 6 - 3)).toFixed(1))
            });
        }

        setData(history);

        // Calculate trend
        const first = history[0].index;
        const last = history[history.length - 1].index;
        const diff = last - first;

        if (diff > 5) setTrend('Improving');
        else if (diff < -5) setTrend('Monitoring Required');
        else setTrend('Stable');

    }, [applicantName, baseIndex]);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-bold text-slate-700">Longitudinal Evolution: {applicantName}</h3>
                    <p className="text-xs text-slate-500 mt-1">Multi-snapshot structural analysis</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center space-x-2 ${trend === 'Improving' ? 'bg-emerald-100 text-emerald-700' :
                        trend === 'Monitoring Required' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${trend === 'Improving' ? 'bg-emerald-500' :
                            trend === 'Monitoring Required' ? 'bg-amber-500' :
                                'bg-slate-400'
                        }`}></span>
                    <span>Trend: {trend}</span>
                </div>
            </div>

            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                color: '#fff',
                                fontSize: '10px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="index"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            dot={{ fill: '#2563eb', r: 3 }}
                            activeDot={{ r: 5 }}
                            animationDuration={1000}
                        />
                        <Line
                            type="monotone"
                            dataKey="ml"
                            stroke="#94a3b8"
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            dot={false}
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baseline Index</p>
                    <p className="text-lg font-bold text-slate-800">{data[0]?.index || '--'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Variance</p>
                    <p className="text-lg font-bold text-slate-800">
                        {data.length > 0 ? (data[data.length - 1].index - data[0].index).toFixed(1) : '--'}
                    </p>
                </div>
            </div>
        </div>
    );
}
