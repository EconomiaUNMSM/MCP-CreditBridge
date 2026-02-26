'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
    date: string;
    inclusionIndex: number;
    repaymentOutlook: number;
}

interface HistoryChartProps {
    data: DataPoint[];
}

export default function HistoryChart({ data }: HistoryChartProps) {
    return (
        <div className="w-full h-full pt-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                    />
                    <YAxis
                        stroke="#64748b"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f1f5f9',
                            fontSize: '11px',
                            padding: '8px 12px'
                        }}
                        labelStyle={{ color: '#93c5fd', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px', fontWeight: 500 }}
                        iconType="line"
                    />
                    <Line
                        type="monotone"
                        dataKey="inclusionIndex"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        name="Inclusion Index"
                        dot={{ fill: '#2563eb', r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1200}
                        animationEasing="ease-out"
                    />
                    <Line
                        type="monotone"
                        dataKey="repaymentOutlook"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Repayment Outlook"
                        dot={{ fill: '#94a3b8', r: 3 }}
                        activeDot={{ r: 5 }}
                        animationDuration={1200}
                        animationEasing="ease-out"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
