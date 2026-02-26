'use client';

import InstitutionalArchitecture from '@/components/InstitutionalArchitecture';
import GovernanceSection from '@/components/GovernanceSection';

export default function InstitutionalPage() {
    return (
        <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white text-slate-900 font-sans">

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-24">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-block px-3 py-1 bg-blue-800/50 border border-blue-700 text-[10px] font-bold text-blue-300 uppercase tracking-[0.3em] rounded-full mb-6">
                        Institutional Framework
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">
                        Structural Intelligence for<br />Inclusive Credit Governance
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        MCP-CreditBridge integrates economic indicators, machine learning, and interpretability
                        frameworks into a transparent, audit-ready evaluation architecture.
                    </p>
                    <div className="flex justify-center space-x-4 mt-10">
                        <a href="/evaluate" className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow text-sm">
                            Start Evaluation
                        </a>
                        <a href="/history" className="px-6 py-3 bg-blue-700/50 text-white font-bold rounded-lg border border-blue-500 hover:bg-blue-600 transition-colors text-sm">
                            View Case Registry
                        </a>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4">

                {/* System Architecture Diagram */}
                <InstitutionalArchitecture />

                {/* Interpretability Layer */}
                <section className="py-16 border-t border-slate-100">
                    <div className="flex items-center space-x-3 mb-12">
                        <span className="h-px flex-1 bg-slate-200"></span>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Interpretability Layer</h3>
                        <span className="h-px flex-1 bg-slate-200"></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-900">Hybrid Index Construction</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                The Inclusion Index is computed through weighted dimensional scoring across
                                Economic Stability, Social Integration, and Structural Resilience. Each dimension
                                is evaluated by a specialized agent with domain-specific validation logic.
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                The final index is not a simple average — it applies confidence-adjusted weighting
                                that accounts for data completeness, cross-agent correlation, and temporal consistency.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-900">SHAP Explainability Standard</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Every evaluation includes local feature importance analysis using SHAP
                                (SHapley Additive exPlanations). This provides per-applicant transparency
                                into how individual characteristics influence the final assessment.
                            </p>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Properties</h5>
                                <ul className="space-y-2 text-xs text-slate-600">
                                    <li className="flex items-center space-x-2">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                        <span>Feature-level contribution quantification</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                        <span>Per-applicant local explanation</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                        <span>Strengthening vs. monitoring factor separation</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                        <span>Risk driver identification for institutional oversight</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Diagnostic Ledger */}
                <section className="py-16 border-t border-slate-100">
                    <div className="flex items-center space-x-3 mb-12">
                        <span className="h-px flex-1 bg-slate-200"></span>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Cognitive Continuity</h3>
                        <span className="h-px flex-1 bg-slate-200"></span>
                    </div>

                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Diagnostic Ledger</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Each evaluation is logged as a structured, immutable event. This ensures auditability,
                            reproducibility, and institutional accountability across the platform lifecycle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Immutable Snapshots', desc: 'Compliance tracking with full model state preservation.' },
                            { title: 'Reproducible Evaluations', desc: 'Feature and model transparency at the moment of assessment.' },
                            { title: 'Longitudinal Analysis', desc: 'Trend monitoring and temporal pattern recognition capabilities.' },
                            { title: 'Third-Party Audit', desc: 'Complete data lineage support for external review processes.' },
                        ].map(item => (
                            <div key={item.title} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">{item.title}</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Governance Section */}
                <GovernanceSection />

                {/* Compliance Disclaimer */}
                <section className="py-16">
                    <div className="bg-slate-100 p-8 rounded-xl border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Compliance & Ethical Use</h2>
                        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                            <p>
                                <span className="font-bold text-slate-900">Not a Final Credit Decision:</span> This system provides structural analysis
                                and risk indicators to support institutional review processes. Final credit decisions require human oversight.
                            </p>
                            <p>
                                <span className="font-bold text-slate-900">Institutional Review Required:</span> All assessments must be validated
                                by qualified personnel within the context of applicable regulations and lending standards.
                            </p>
                            <p>
                                <span className="font-bold text-slate-900">Transparent Methodology:</span> Our hybrid architecture ensures that
                                all evaluations are explainable, auditable, and aligned with responsible AI principles.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
