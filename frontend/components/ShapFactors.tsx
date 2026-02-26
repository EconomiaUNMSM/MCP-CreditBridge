'use client';

type ShapFeature = {
    feature: string;
    impact: number;
};

export default function ShapFactors({ factors }: { factors: ShapFeature[] }) {
    // Sort by absolute impact
    const sorted = [...factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    const positive = sorted.filter(f => f.impact > 0).slice(0, 5);
    const negative = sorted.filter(f => f.impact < 0).slice(0, 5);

    const formatName = (name: string) => name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            {/* Strengthening Factors */}
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 hover:border-blue-200 transition-colors">
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4 flex items-center">
                    <span className="mr-2 text-lg">↑</span> Strengthening Factors
                </h4>
                <ul className="space-y-3">
                    {/* Separate positive filtering to keep indexes consistent for animation */}
                    {positive.length > 0 ? positive.map((f, i) => (
                        <li
                            key={`pos-${i}`}
                            className="flex items-center text-sm text-blue-900 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
                            style={{ animationDelay: `${i * 150}ms` }}
                        >
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></span>
                            {formatName(f.feature)}
                        </li>
                    )) : (
                        <li className="text-sm text-blue-400 italic font-light">
                            No significant positive drivers
                        </li>
                    )}
                </ul>
            </div>

            {/* Monitoring Factors */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                    <span className="mr-2 text-lg">!</span> Factors Requiring Monitoring
                </h4>
                <ul className="space-y-3">
                    {negative.length > 0 ? negative.map((f, i) => (
                        <li
                            key={`neg-${i}`}
                            className="flex items-center text-sm text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
                            style={{ animationDelay: `${i * 150}ms` }}
                        >
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3 shrink-0"></span>
                            {formatName(f.feature)}
                        </li>
                    )) : (
                        <li className="text-sm text-slate-400 italic font-light">
                            No significant risk drivers
                        </li>
                    )}
                </ul>
            </div>

        </div>
    );
}
