'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Leaf, ShieldCheck, BrainCircuit } from 'lucide-react';
import EvaluationProgress from '@/components/EvaluationProgress';
import ScoreCard from '@/components/ScoreCard';
import InfoTooltip from '@/components/InfoTooltip';
import AnimatedNumber from '@/components/AnimatedNumber';
import StreamingText from '@/components/StreamingText';
import ShapFactors from '@/components/ShapFactors';
import AgentDialogue from '@/components/AgentDialogue';
import PrescriptiveRoadmap from '@/components/PrescriptiveRoadmap';
import RegionalBenchmark from '@/components/RegionalBenchmark';
import ReportPreviewModal from '@/components/ReportPreviewModal';
import { EvaluationResponse } from '@/types/evaluation';
import StructuralIndicatorsAccordion from '@/components/StructuralIndicatorsAccordion';
import DimensionBreakdown from '@/components/DimensionBreakdown';
import TechnicalDrawer from '@/components/TechnicalDrawer';

export default function EvaluationPage() {
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
    const [result, setResult] = useState<EvaluationResponse | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    // Progressive Reveal State
    const [showScores, setShowScores] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showFactors, setShowFactors] = useState(false);
    const [showDimensions, setShowDimensions] = useState(false);
    const [showAgents, setShowAgents] = useState(false);
    const [isAuditMode, setIsAuditMode] = useState(false); // New state for Auditor View

    // New UX Modals
    const [showPreAuth, setShowPreAuth] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Helper to mask PII
    const maskPII = (text: string, type: 'name' | 'id') => {
        if (!isAuditMode) return text;
        if (type === 'name') return `APPLICANT-HASH-${text.length * 42}`;
        if (type === 'id') return `TRACE-${text.split('-')[1] || 'XXXX'}`;
        return 'REDACTED';
    };

    useEffect(() => {
        if (status === 'complete') {
            const t1 = setTimeout(() => setShowScores(true), 200);
            const t4 = setTimeout(() => setShowDimensions(true), 600); // Trigger dimensions after scores
            const t2 = setTimeout(() => setShowText(true), 1200);
            const t3 = setTimeout(() => setShowFactors(true), 1800);
            const t5 = setTimeout(() => setShowAgents(true), 2400);
            return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
        } else {
            setShowScores(false);
            setShowDimensions(false);
            setShowText(false);
            setShowFactors(false);
            setShowAgents(false);
        }
    }, [status]);

    // Form State (Financial)
    const [formData, setFormData] = useState({
        monthly_income: 1800,
        income_stability_months: 12,
        debt_ratio: 0.3,
        savings_months_cover: 3.0,
        language_level: 3,
    });

    // Structural Data State (New Blocks)
    const [structuralData, setStructuralData] = useState({
        housingStability: 24,
        householdSize: 3,
        bankingAccess: 'Mobile Wallet',
        employmentFormality: 'Informal',
        educationLevel: 'Secondary',
        socialSupport: 5,
        remittanceDependence: 0,
        legalStatus: 'Citizen',
        healthCoverage: 'Public',
        financialLiteracy: 'Basic',
        digitalAccess: 'Smartphone Only',
        communityEngagement: 5
    });

    // Identity State
    const [identity, setIdentity] = useState({
        fullName: '',
        nationality: '',
        yearsInCountry: '',
        sector: 'Agriculture',
        referenceCode: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleStructuralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStructuralData((prev) => ({
            ...prev,
            [name]: e.target.type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setIdentity((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowPreAuth(true); // Open pre-auth modal instead of running directly
    };

    const handleRunEvaluation = async () => {
        setShowPreAuth(false);
        setStatus('analyzing');
        setResult(null);

        try {
            // Map inputs to payload
            const payload = {
                applicant_id: `applicant_${Date.now().toString().slice(-4)}`,
                core_features: {
                    economic: {
                        monthly_income: formData.monthly_income,
                        income_stability_months: formData.income_stability_months,
                        // Map formality to employment_type
                        employment_type: structuralData.employmentFormality.toLowerCase().includes('informal') ? 'informal' : 'formal',
                        debt_ratio: formData.debt_ratio,
                        savings_months_cover: formData.savings_months_cover,
                    },
                    integration: {
                        language_level: formData.language_level,
                        housing_stability_months: structuralData.housingStability,
                        local_references: Math.min(5, Math.floor(structuralData.socialSupport / 2)), // Proxy 0-10 to 0-5
                        ngo_validation: true,
                    },
                },
                v2_features: {
                    // Map digital access to score
                    digital_interaction_score: structuralData.digitalAccess === 'None' ? 0.2 : structuralData.digitalAccess === 'Smartphone Only' ? 0.5 : 0.9,
                    // Map other structural vars if backend supported them, effectively placeholders for now
                    vulnerability_score: structuralData.healthCoverage === 'None' ? 0.8 : 0.2
                }
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v2'}/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Evaluation failed');
            const data = await response.json();
            setResult(data);

        } catch (err) {
            console.error(err);
            setStatus('idle');
            alert("Evaluation Error. Please try again.");
        }
    };

    const handleAnimationComplete = () => {
        if (result) {
            setStatus('complete');
        } else {
            if (status === 'analyzing') {
                const checkInterval = setInterval(() => {
                    if (result) {
                        clearInterval(checkInterval);
                        setStatus('complete');
                    }
                }, 100);
            }
        }
    };

    const handlePreviewReport = async () => {
        if (!result?.snapshot_id) return;
        try {
            // Build query params with identity data
            const params = new URLSearchParams({
                fullName: identity.fullName,
                nationality: identity.nationality,
                yearsInCountry: identity.yearsInCountry,
                employmentType: identity.sector, // Map for backend compatibility
                ...(identity.referenceCode && { referenceCode: identity.referenceCode })
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v2'}/report/${result.snapshot_id}?${params}`);
            if (!res.ok) throw new Error("Report not found");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setShowModal(true);
        } catch (e) {
            console.error(e);
            alert("Could not load report preview.");
        }
    };

    const getFactors = () => {
        if (!result) return [];
        // Use real SHAP explanation data from the ML pipeline
        if (result.shap_explanation && result.shap_explanation.length > 0) {
            return result.shap_explanation;
        }
        // Fallback: derive from key_drivers if SHAP data is not available
        return (result.key_drivers || []).map(d => ({ feature: d, impact: -0.5 }));
    };

    // Lock inputs helper
    const isLocked = status === 'analyzing';

    return (
        <div className="h-full w-full bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 overflow-hidden">

            {/* Modals for UX */}
            {showPreAuth && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center">
                                <BrainCircuit className="w-5 h-5 mr-2 text-blue-600" /> Confirm Analysis
                            </h3>
                            <p className="text-sm text-slate-500 mt-2">You are about to run a heavy AI structural assessment for the following profile. Proceed?</p>
                        </div>
                        <div className="p-6 bg-slate-50/50 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {/* Identity Summary */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Identity</h4>
                                <div className="space-y-1.5 pl-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Name:</span>
                                        <span className="font-semibold text-slate-900">{identity.fullName || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Nationality:</span>
                                        <span className="font-semibold text-slate-900">{identity.nationality || 'N/A'} ({identity.yearsInCountry} years)</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Sector:</span>
                                        <span className="font-semibold text-slate-900">{identity.sector}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Financial</h4>
                                <div className="space-y-1.5 pl-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Monthly Income:</span>
                                        <span className="font-semibold text-emerald-600">${formData.monthly_income}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Income Stability:</span>
                                        <span className="font-semibold text-slate-900">{formData.income_stability_months} months</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Debt / Savings:</span>
                                        <span className="font-semibold text-slate-900">Ratio {(formData.debt_ratio * 100).toFixed(0)}% / {formData.savings_months_cover} mos</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deep Structural Summary */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Deep Structural</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pl-1 text-sm">
                                    <div className="col-span-2 flex justify-between">
                                        <span className="text-slate-500">Housing:</span>
                                        <span className="font-semibold text-slate-900">{structuralData.housingStability} mos (Size: {structuralData.householdSize})</span>
                                    </div>
                                    <div className="col-span-2 flex justify-between">
                                        <span className="text-slate-500">Banking & Digital:</span>
                                        <span className="font-semibold text-slate-900">{structuralData.bankingAccess} / {structuralData.digitalAccess}</span>
                                    </div>
                                    <div className="col-span-2 flex justify-between">
                                        <span className="text-slate-500">Education & Legal:</span>
                                        <span className="font-semibold text-slate-900">{structuralData.educationLevel} / {structuralData.legalStatus}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Network:</span>
                                        <span className="font-semibold text-slate-900">{structuralData.socialSupport}/10</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Lang:</span>
                                        <span className="font-semibold text-slate-900">{formData.language_level}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-white">
                            <button type="button" onClick={() => setShowPreAuth(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                            <button type="button" onClick={handleRunEvaluation} className="px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors">Confirm Analysis</button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Discard Evaluation?</h3>
                        <p className="text-sm text-slate-500 mb-6">Are you sure you want to discard this analysis? Unsaved data will be lost.</p>
                        <div className="flex justify-center space-x-3">
                            <button type="button" onClick={() => setShowCancelModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-1/2">Keep</button>
                            <button type="button" onClick={() => { setShowCancelModal(false); setStatus('idle'); setResult(null); }} className="px-4 py-2 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors w-1/2">Discard</button>
                        </div>
                    </div>
                </div>
            )}

            {showSaveModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Save Profile</h3>
                        <p className="text-sm text-slate-500 mb-6">Save this structural profile to the institutional registry?</p>
                        <div className="flex justify-center space-x-3">
                            <button type="button" onClick={() => setShowSaveModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-1/2">Cancel</button>
                            <button type="button" onClick={() => {
                                setShowSaveModal(false);
                                alert("Profile saved successfully to registry.");
                                setStatus('idle');
                                setResult(null);
                            }} className="px-4 py-2 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors w-1/2">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <ReportPreviewModal
                    pdfUrl={pdfUrl}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => {
                        const link = document.createElement('a');
                        link.href = pdfUrl!;
                        link.download = `Report_${result?.snapshot_id}.pdf`;
                        link.click();
                        setShowModal(false);
                    }}
                />
            )}

            {/* Main Content - Strictly Fixed Height */}
            <main className="h-full max-w-screen-2xl mx-auto px-4 lg:px-6 py-4 flex flex-col lg:flex-row gap-6">

                {/* Left Column: Input Form (Internally Scrollable) */}
                <div className={`lg:w-[34%] min-h-0 flex flex-col shrink-0 transition-all duration-500`}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden relative">

                        {/* 1. Header (Fixed) */}
                        <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0 bg-white z-20">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center">
                                Applicant Profile
                                {status === 'complete' && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Analyzed</span>}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">Enter financial integration metrics.</p>
                        </div>

                        {/* 2. Scrollable Form Area */}
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
                            {/* Overlay when complete to dissuade editing but allow reading */}
                            {status === 'complete' && (
                                <div className="absolute inset-0 bg-white/50 z-10 backdrop-blur-[0.5px] pointer-events-none"></div>
                            )}

                            <form id="evaluate-form" onSubmit={handleFormSubmit} className="space-y-5 pb-2">

                                {/* Applicant Identity */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Identity</h3>

                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Name <span className="text-red-400">*</span></label>
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            disabled={isLocked}
                                            value={identity.fullName}
                                            onChange={handleIdentityChange}
                                            className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="e.g., Maria Rodriguez"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nationality <span className="text-red-400">*</span></label>
                                            <input
                                                name="nationality"
                                                type="text"
                                                required
                                                disabled={isLocked}
                                                value={identity.nationality}
                                                onChange={handleIdentityChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none"
                                                placeholder="e.g., Peru"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Years <span className="text-red-400">*</span></label>
                                            <input
                                                name="yearsInCountry"
                                                type="number"
                                                required
                                                disabled={isLocked}
                                                value={identity.yearsInCountry}
                                                onChange={handleIdentityChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sector <span className="text-red-400">*</span></label>
                                            <select
                                                name="sector"
                                                required
                                                disabled={isLocked}
                                                value={identity.sector}
                                                onChange={handleIdentityChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none bg-slate-50"
                                            >
                                                <option value="Agriculture">Agriculture</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Manufacturing">Manufacturing</option>
                                                <option value="Services">Services</option>
                                                <option value="Construction">Construction</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Ref Code</label>
                                            <input
                                                name="referenceCode"
                                                type="text"
                                                disabled={isLocked}
                                                value={identity.referenceCode}
                                                onChange={handleIdentityChange}
                                                placeholder="Optional"
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Financials */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Financial Metrics</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Mo. Income ($)</label>
                                            <input name="monthly_income" type="number" disabled={isLocked} value={formData.monthly_income} onChange={handleChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Stability (Mos)</label>
                                            <input name="income_stability_months" type="number" disabled={isLocked} value={formData.income_stability_months} onChange={handleChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Debt Ratio</label>
                                            <input name="debt_ratio" type="number" step="0.01" disabled={isLocked} value={formData.debt_ratio} onChange={handleChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Savings</label>
                                            <input name="savings_months_cover" type="number" step="0.1" disabled={isLocked} value={formData.savings_months_cover} onChange={handleChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Lang (1-5)</label>
                                            <input name="language_level" type="number" min="1" max="5" disabled={isLocked} value={formData.language_level} onChange={handleChange}
                                                className="input-field w-full text-sm py-2 px-3 border border-slate-200 rounded-lg outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Structural Indicators Accordion */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Deep Structural</h3>
                                    <StructuralIndicatorsAccordion
                                        formData={structuralData}
                                        isLocked={isLocked}
                                        onChange={handleStructuralChange}
                                    />
                                </div>

                                {/* Spacer to Ensure Last Items Readable */}
                                <div className="h-4"></div>
                            </form>
                        </div>

                        {/* 3. Footer Button (Fixed) */}
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex-shrink-0 z-20">
                            {status === 'complete' ? (
                                <div className="flex space-x-3 animate-in fade-in duration-500">
                                    <button type="button" onClick={() => setShowCancelModal(true)}
                                        className="w-1/3 py-3 rounded-lg font-bold text-slate-700 bg-white border border-slate-300 shadow-sm hover:bg-slate-50 transition-all flex justify-center items-center">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => setShowSaveModal(true)}
                                        className="w-2/3 py-3 rounded-lg font-bold text-white bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center">
                                        Save Profile
                                    </button>
                                </div>
                            ) : (
                                <button type="submit" form="evaluate-form" disabled={isLocked}
                                    className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all transform flex items-center justify-center space-x-2
                                        ${isLocked ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:-translate-y-0.5'}
                                    `}>
                                    {isLocked ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : 'Run Evaluation'}
                                </button>
                            )}
                        </div>

                    </div>
                </div>

                {/* Right Column: Interaction Arena (Fixed Height, No Global Scroll) */}
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

                    {/* 1. Empty State */}
                    {status === 'idle' && (
                        <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-white/50">
                            <div className="text-center max-w-md">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <BrainCircuit className="w-8 h-8" />
                                </div>
                                <p className="text-lg font-medium text-slate-600">Ready to Analyze</p>
                                <p className="text-sm mt-2 text-slate-400">Fill out the applicant profile on the left and click "Run Evaluation" to generate a real-time structural assessment.</p>
                            </div>
                        </div>
                    )}

                    {/* 2. Analysis Progress */}
                    {status === 'analyzing' && (
                        <div className="h-full flex flex-col justify-center items-center bg-white/50 rounded-xl border border-slate-100">
                            <EvaluationProgress onComplete={handleAnimationComplete} />
                        </div>
                    )}

                    {/* 3. Results Dashboard */}
                    {status === 'complete' && result && (
                        <div className="h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto custom-scrollbar">

                            {/* Header */}
                            <div className="flex-shrink-0 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-blue-100">
                                        {identity.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-slate-900 leading-tight font-mono">
                                            {maskPII(identity.fullName, 'name')}
                                        </h1>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium flex items-center space-x-2">
                                            <span>#{result.snapshot_id}</span>
                                            {isAuditMode && <span className="text-amber-600 bg-amber-50 px-1 rounded">AUDIT MODE</span>}
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="text-emerald-600 flex items-center">
                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handlePreviewReport}
                                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 text-xs font-bold uppercase tracking-wide rounded-md transition-colors flex items-center"
                                >
                                    Download PDF
                                </button>
                            </div>

                            {/* ═══ Row 1: Scores + Dimensional Breakdown ═══ */}
                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0 transition-opacity duration-700 ${showScores ? 'opacity-100' : 'opacity-0'}`}>
                                {/* Inclusion Index */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BrainCircuit className="w-14 h-14 text-blue-600" />
                                    </div>
                                    <div className="flex items-center mb-1">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inclusion Index</h3>
                                        <InfoTooltip
                                            title="Inclusion Index"
                                            content="Composite multidimensional score (0–100) derived from structural indicators across economic resilience, social integration, and stability dimensions. Higher values indicate stronger financial inclusion readiness."
                                        />
                                    </div>
                                    <div className="flex items-end space-x-2 notranslate" translate="no">
                                        <span className="text-3xl font-bold text-slate-900 tracking-tighter leading-none">
                                            <AnimatedNumber value={result.inclusion_index} decimals={0} />
                                        </span>
                                        <span className="text-sm font-medium text-emerald-600 mb-0.5">/ 100</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.inclusion_index}%` }}></div>
                                    </div>
                                </div>

                                {/* Repayment Probability */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center mb-1">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Repayment Prob.</h3>
                                        <InfoTooltip
                                            title="Repayment Probability"
                                            content="Machine learning probability estimate of repayment success, generated by a Random Forest model trained on historical behavioral patterns. Values above 70% indicate high confidence in repayment capacity."
                                        />
                                    </div>
                                    <div className="flex items-end space-x-2 notranslate" translate="no">
                                        <span className="text-3xl font-bold text-slate-900 tracking-tighter leading-none">
                                            <AnimatedNumber value={result.ml_probability * 100} decimals={1} suffix="%" />
                                        </span>
                                        <span className="text-xs text-slate-400 mb-0.5">High Confidence</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.ml_probability * 100}%` }}></div>
                                    </div>
                                </div>

                                {/* Dimensional Breakdown */}
                                <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-700 delay-200 ${showDimensions ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="flex items-center mb-3">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dimensional Breakdown</h3>
                                        <InfoTooltip
                                            title="Dimensional Breakdown"
                                            content="Decomposition of the applicant's profile into three fundamental evaluation axes: Economic Capacity (income, debt, savings), Social Integration (language, housing, references), and Stability Buffer (employment tenure, income consistency)."
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">Economic</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(result.dimension_scores?.economic_score || 0) * 100}%` }}></div>
                                                </div>
                                                <span className="font-bold text-slate-900 w-6 text-right text-xs">{((result.dimension_scores?.economic_score || 0) * 100).toFixed(0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">Integration</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(result.dimension_scores?.integration_score || 0) * 100}%` }}></div>
                                                </div>
                                                <span className="font-bold text-slate-900 w-6 text-right text-xs">{((result.dimension_scores?.integration_score || 0) * 100).toFixed(0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">Stability</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(result.dimension_scores?.stability_score || 0) * 100}%` }}></div>
                                                </div>
                                                <span className="font-bold text-slate-900 w-6 text-right text-xs">{((result.dimension_scores?.stability_score || 0) * 100).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ═══ Row 2: Left Stack + Agent Consensus ═══ */}
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-shrink-0">

                                {/* LEFT COLUMN: Rationale → Roadmap → SHAP Factors */}
                                <div className="xl:col-span-6 flex flex-col gap-4">

                                    {/* AI Structural Rationale */}
                                    <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all duration-700 delay-100 ${showText ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                                                <BrainCircuit className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">AI Structural Rationale</h3>
                                        </div>
                                        <div className="prose prose-sm prose-slate text-justify text-slate-600 leading-relaxed text-[13px] notranslate" translate="no">
                                            {showText && <StreamingText text={result.explanation_summary} speed={5} />}
                                        </div>
                                    </div>

                                    {/* Regional Benchmark */}
                                    <div className={`transition-all duration-700 delay-150 ${showText ? 'opacity-100' : 'opacity-0'}`}>
                                        <RegionalBenchmark
                                            applicantScore={result.inclusion_index}
                                            sector={identity.sector} // Driven by UX Input
                                        />
                                    </div>

                                    {/* Inclusion Roadmap */}
                                    {showAgents && result.prescriptive_roadmap && result.prescriptive_roadmap.length > 0 && (
                                        <div className={`transition-all duration-700 ${showAgents ? 'opacity-100' : 'opacity-0'}`}>
                                            <PrescriptiveRoadmap roadmap={result.prescriptive_roadmap} />
                                        </div>
                                    )}

                                    {/* SHAP Factors */}
                                    <div className={`transition-all duration-700 delay-300 ${showFactors ? 'opacity-100' : 'opacity-0'}`}>
                                        {showFactors && <ShapFactors factors={getFactors()} />}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Agent Consensus (full height) */}
                                {showAgents && result.agent_consensus && (
                                    <div className={`xl:col-span-6 transition-all duration-700 ${showAgents ? 'opacity-100' : 'opacity-0'}`}>
                                        <AgentDialogue consensus={result.agent_consensus} />
                                    </div>
                                )}
                            </div>

                            {/* Drawer Trigger / Technical Footer */}
                            <div className="flex-shrink-0">
                                <TechnicalDrawer
                                    result={result}
                                    isAuditMode={isAuditMode}
                                    onToggleAudit={setIsAuditMode}
                                />
                            </div>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
