'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockSectorData = [
    { name: 'Agriculture', value: 3400, color: '#2563eb' }, // blue-600
    { name: 'Retail', value: 2800, color: '#3b82f6' },      // blue-500
    { name: 'Services', value: 2100, color: '#60a5fa' },    // blue-400
    { name: 'Tech', value: 1800, color: '#93c5fd' },        // blue-300
    { name: 'Manufacturing', value: 1350, color: '#10b981' }, // emerald-500
    { name: 'Construction', value: 1000, color: '#a7f3d0' }  // emerald-200
];

export default function SectorDistributionChart() {
    return (
        <div className="w-full h-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Evaluations By Sector</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSectorData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis
                            type="number"
                            stroke="#64748b"
                            style={{ fontSize: '10px', fontWeight: 500 }}
                            tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#64748b"
                            style={{ fontSize: '11px', fontWeight: 600 }}
                            width={90}
                            interval={0}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #f1f5f9',
                                borderRadius: '8px',
                                color: '#0f172a',
                                fontSize: '11px',
                                padding: '8px 12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{
                                color: '#0f172a',
                                fontWeight: 600
                            }}
                            formatter={(value: number) => [new Intl.NumberFormat('en-US').format(value), 'Evaluations']}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
                            {mockSectorData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
