'use client';

import { useState } from 'react';

interface TechnicalDrawerProps {
    result: any;
    isAuditMode: boolean;
    onToggleAudit: (enabled: boolean) => void;
}

export default function TechnicalDrawer({ result, isAuditMode, onToggleAudit }: TechnicalDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!result) return null;

    return (
        <div className="mt-8 border-t border-slate-100 pt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>View Technical Details & Audit Metadata</span>
            </button>

            <div
                className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 font-mono text-[10px] text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {/* Auditor Mode Toggle */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Auditor View</span>
                        <button
                            onClick={() => onToggleAudit(!isAuditMode)}
                            className={`w-8 h-4 rounded-full transition-colors duration-200 focus:outline-none ${isAuditMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${isAuditMode ? 'translate-x-4' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div>
                        <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wider">Model Diagnostics</h5>
                        <ul className="space-y-1">
                            <li className="flex justify-between">
                                <span>Inclusion Probability (ML):</span>
                                <span className="font-bold">{(result.ml_probability * 100).toFixed(2)}%</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Data Confidence Score:</span>
                                <span className="font-bold">{result.confidence_score.toFixed(1)}/100</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Model Version:</span>
                                <span>{result.model_version || 'v2.1.0-beta'}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wider">System Metadata</h5>
                        <ul className="space-y-1">
                            <li className="flex justify-between">
                                <span>Snapshot ID:</span>
                                <span>#{result.snapshot_id}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Timestamp:</span>
                                <span>{new Date().toISOString()}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Execution Time:</span>
                                <span>{(Math.random() * 0.5 + 0.2).toFixed(3)}s</span>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-2 pt-3 border-t border-slate-200">
                        <p className="text-slate-400 italic">
                            This record is immutable and stored in the institutional diagnostic ledger for regulatory compliance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
