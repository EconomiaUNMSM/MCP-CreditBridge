'use client';

import { useState } from 'react';

interface StructuralIndicatorsProps {
    formData: any;
    isLocked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function StructuralIndicatorsAccordion({ formData, isLocked, onChange }: StructuralIndicatorsProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 rounded-lg bg-slate-50 overflow-hidden transition-all duration-300">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-slate-100 transition-colors"
            >
                <div>
                    <h3 className="text-sm font-bold text-slate-700">Additional Structural Indicators</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Optional deep-dive structural factors. Defaults used if not modified.
                    </p>
                </div>
                <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <div
                className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                    {/* Housing Stability */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Housing Stability (Months)
                        </label>
                        <input
                            type="number"
                            name="housingStability"
                            value={formData.housingStability || 24} // Default visual
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        />
                    </div>

                    {/* Household Size */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Household Size
                        </label>
                        <input
                            type="number"
                            name="householdSize"
                            value={formData.householdSize || 3}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        />
                    </div>

                    {/* Banking Access */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Banking Access Level
                        </label>
                        <select
                            name="bankingAccess"
                            value={formData.bankingAccess || 'Mobile Wallet'}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="Unbanked">Unbanked</option>
                            <option value="Mobile Wallet">Mobile Wallet Only</option>
                            <option value="Basic Account">Basic Bank Account</option>
                            <option value="Full Banking">Full Banking Services</option>
                        </select>
                    </div>

                    {/* Employment Formality */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Employment Formality
                        </label>
                        <select
                            name="employmentFormality"
                            value={formData.employmentFormality || 'Informal'}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="Informal">Informal / Cash Based</option>
                            <option value="Semi-Formal">Semi-Formal (Contract)</option>
                            <option value="Formal">Formal (Payroll)</option>
                        </select>
                    </div>

                    {/* Education Level */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Education Level
                        </label>
                        <select
                            name="educationLevel"
                            value={formData.educationLevel || 'Secondary'}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="None">None</option>
                            <option value="Primary">Primary</option>
                            <option value="Secondary">Secondary</option>
                            <option value="Technical">Technical / Vocational</option>
                            <option value="University">University</option>
                        </select>
                    </div>

                    {/* Social Support Index */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Social Support Index (0-10)
                        </label>
                        <input
                            type="number"
                            name="socialSupport"
                            min="0"
                            max="10"
                            value={formData.socialSupport || 5}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        />
                    </div>

                    {/* Remittance Dependence */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Remittance Dependence (%)
                        </label>
                        <input
                            type="number"
                            name="remittanceDependence"
                            min="0"
                            max="100"
                            value={formData.remittanceDependence || 0}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        />
                    </div>

                    {/* Legal Status */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Legal Status Stability
                        </label>
                        <select
                            name="legalStatus"
                            value={formData.legalStatus || 'Citizen'}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="Undocumented">Undocumented / In Process</option>
                            <option value="Temporary">Temporary Permit</option>
                            <option value="Permanent">Permanent Resident</option>
                            <option value="Citizen">Citizen</option>
                        </select>
                    </div>

                    {/* Health Coverage */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Health Coverage
                        </label>
                        <select
                            name="healthCoverage"
                            value={formData.healthCoverage || 'Public'}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="None">None</option>
                            <option value="Public">Public (Basic)</option>
                            <option value="Private">Private (Comprehensive)</option>
                        </select>
                    </div>

                    {/* Financial Literacy */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Financial Literacy (Self-Assessed)
                        </label>
                        <select
                            name="financialLiteracy"
                            value={formData.financialLiteracy || 'Basic'}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="None">None</option>
                            <option value="Basic">Basic (Budgeting)</option>
                            <option value="Intermediate">Intermediate (Savings/Credit)</option>
                            <option value="Advanced">Advanced (Investments)</option>
                        </select>
                    </div>

                    {/* Digital Access */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Digital Access
                        </label>
                        <select
                            name="digitalAccess"
                            value={formData.digitalAccess || 'Smartphone Only'}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="None">None</option>
                            <option value="Smartphone Only">Smartphone Only</option>
                            <option value="Computer + Internet">Computer + Internet</option>
                        </select>
                    </div>

                    {/* Community Engagement */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Community Engagement (0-10)
                        </label>
                        <input
                            type="number"
                            name="communityEngagement"
                            min="0"
                            max="10"
                            value={formData.communityEngagement || 5}
                            onChange={onChange}
                            disabled={isLocked}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
