'use client';

import { useState } from 'react';

interface Applicant {
    name: string;
    id: string;
    index: number;
    status: string;
    date: string;
}

const mockApplicants: Applicant[] = [
    { name: "Ana Rodríguez", id: "CB-0012", index: 76.3, status: "Strong Integration", date: "2026-02-02" },
    { name: "Luis Mendoza", id: "CB-0013", index: 48.6, status: "Growing Stability", date: "2026-02-03" },
    { name: "Carla Ortiz", id: "CB-0014", index: 32.1, status: "Support Recommended", date: "2026-02-04" },
    { name: "José Hernández", id: "CB-0015", index: 64.2, status: "Stable Outlook", date: "2026-02-05" },
    { name: "Elena Gómez", id: "CB-0016", index: 91.5, status: "Exceptional Resilience", date: "2026-02-06" },
];

interface CaseRegistryTableProps {
    onSelectApplicant: (applicant: Applicant) => void;
    selectedId?: string;
}

export default function CaseRegistryTable({ onSelectApplicant, selectedId }: CaseRegistryTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = mockApplicants.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700">Evaluated Profiles</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search applicant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none w-48"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
                            <th className="px-6 py-3">Applicant Name</th>
                            <th className="px-6 py-3">Reference ID</th>
                            <th className="px-6 py-3">Inclusion Index</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Evaluation Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map((applicant) => (
                            <tr
                                key={applicant.id}
                                onClick={() => onSelectApplicant(applicant)}
                                className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${selectedId === applicant.id ? 'bg-blue-50' : ''}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-slate-900">{applicant.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-mono text-slate-500">{applicant.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-sm font-bold text-slate-900">{applicant.index}</div>
                                        <div className="w-12 bg-slate-100 rounded-full h-1 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-full rounded-full"
                                                style={{ width: `${applicant.index}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${applicant.index > 70 ? 'bg-emerald-100 text-emerald-700' :
                                            applicant.index > 40 ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>
                                        {applicant.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-slate-500">{applicant.date}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
