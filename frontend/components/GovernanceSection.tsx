'use client';

export default function GovernanceSection() {
    const pillars = [
        {
            title: 'Algorithmic Fairness',
            desc: 'Our models are audited for bias against nationality, gender, or age. We focus on structural indicators and verified behavioral proxies.'
        },
        {
            title: 'Cognitive Continuity',
            desc: 'The Diagnostic Ledger preserves the state of the model at the moment of evaluation, ensuring that every result is reproducible and defensible.'
        },
        {
            title: 'Data Sovereignty',
            desc: 'Applicants maintain visibility over the indicators used for their evaluation, promoting a transparent relationship between institutions and clients.'
        }
    ];

    return (
        <section className="py-20 border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-3 mb-12">
                    <span className="h-px flex-1 bg-slate-200"></span>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Governance Framework</h3>
                    <span className="h-px flex-1 bg-slate-200"></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {pillars.map(p => (
                        <div key={p.title} className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 border-l-2 border-blue-600 pl-4">{p.title}</h4>
                            <p className="text-xs leading-relaxed text-slate-500">
                                {p.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-2xl bg-slate-900 text-center space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-900/50 rounded-full border border-blue-800 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">
                        Institutional Compliance
                    </div>
                    <h4 className="text-xl font-bold text-white">Ready for Regulatory Review</h4>
                    <p className="max-w-xl mx-auto text-sm text-slate-400">
                        MCP-CreditBridge is designed to integrate with existing institutional compliance
                        workflows, providing a high-fidelity audit trail for every inclusion decision.
                    </p>
                </div>
            </div>
        </section>
    );
}
