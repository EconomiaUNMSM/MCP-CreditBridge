'use client';

export default function InstitutionalArchitecture() {
    const steps = [
        { title: 'Inputs', desc: 'Financial, Structural & Integration Data', icon: 'M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z' },
        { title: 'Dimensional Index', desc: 'Agentic Cross-Validation', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { title: 'ML Inference', desc: 'Random Forest Prediction Layer', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { title: 'Explainability', desc: 'SHAP Contribution Analysis', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
        { title: 'Audit Ledger', desc: 'Cognitive Continuity Persistence', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    ];

    return (
        <div className="space-y-12 py-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Logic Flow</h3>
                <p className="text-sm text-slate-500 mt-2">
                    Our architecture combines high-dimensional feature engineering with auditable agentic execution.
                </p>
            </div>

            <div className="relative">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                    {steps.map((step, i) => (
                        <div key={step.title} className="group">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-600">
                                    <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                                    </svg>
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step 0{i + 1}</div>
                                <h4 className="text-sm font-bold text-slate-800 mb-2">{step.title}</h4>
                                <p className="text-[10px] leading-relaxed text-slate-500">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-900 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h4 className="text-lg font-bold mb-4">Hybrid Evaluation Philosophy</h4>
                        <p className="text-sm text-blue-100 leading-relaxed mb-6">
                            We bridge the gap between traditional parametric scoring and complex non-linear ML.
                            The result is a system that remains transparent to regulators while capturing
                            the true structural resilience of unbanked applicants.
                        </p>
                        <div className="flex space-x-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">17+</span>
                                <span className="text-[10px] uppercase text-blue-300 tracking-widest">Indicators</span>
                            </div>
                            <div className="h-10 w-px bg-blue-700"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">3.2k</span>
                                <span className="text-[10px] uppercase text-blue-300 tracking-widest">Audit Logs</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-800/50 rounded-xl p-6 border border-blue-700/50">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Governance Snapshot</h5>
                        <ul className="space-y-3">
                            {[
                                'Non-discriminatory Feature Engineering',
                                'SHAP-based Transparency Standard',
                                'Diagnostic Ledger Immutability',
                                'Human-in-the-loop Final Review'
                            ].map(item => (
                                <li key={item} className="flex items-center space-x-3 text-sm">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
