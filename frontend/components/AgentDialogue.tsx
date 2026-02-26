'use client';

import { useState, useEffect } from 'react';
import { AgentConsensus, AgentMessage } from '@/types/evaluation';
import { MessageSquare, Brain, TrendingUp, Shield, Sparkles } from 'lucide-react';

/* ─── Agent visual config ────────────────────────────── */
const AGENT_CONFIG: Record<string, { icon: React.ReactNode; gradient: string; accentBg: string; accentText: string; borderColor: string; label: string }> = {
    'economic': {
        icon: <TrendingUp className="w-3.5 h-3.5" />,
        gradient: 'from-emerald-500 to-teal-600',
        accentBg: 'bg-emerald-50',
        accentText: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        label: 'Economic',
    },
    'integration': {
        icon: <Brain className="w-3.5 h-3.5" />,
        gradient: 'from-violet-500 to-purple-600',
        accentBg: 'bg-violet-50',
        accentText: 'text-violet-700',
        borderColor: 'border-violet-200',
        label: 'Integration',
    },
    'stability': {
        icon: <Shield className="w-3.5 h-3.5" />,
        gradient: 'from-blue-500 to-indigo-600',
        accentBg: 'bg-blue-50',
        accentText: 'text-blue-700',
        borderColor: 'border-blue-200',
        label: 'Stability',
    },
};

const DEFAULT_CONFIG = {
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    gradient: 'from-slate-500 to-slate-600',
    accentBg: 'bg-slate-50',
    accentText: 'text-slate-700',
    borderColor: 'border-slate-200',
    label: 'Analyst',
};

/**
 * Normalizes any agent name variant to a config key.
 * e.g. "Economic Agent" → "economic", "integration" → "integration"
 */
function resolveAgent(agentName: string) {
    const lower = agentName.toLowerCase().replace(/\s*agent\s*/gi, '').trim();
    return AGENT_CONFIG[lower] || DEFAULT_CONFIG;
}

/** Clean display name — remove redundant "Agent" suffix if present */
function cleanAgentLabel(name: string): string {
    return name.replace(/\s*Agent$/i, '').trim();
}

function getSentimentBadge(sentiment: string) {
    switch (sentiment) {
        case 'positive':
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Favorable</span>;
        case 'warning':
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Caution</span>;
        default:
            return <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">Neutral</span>;
    }
}

/* ─── Component ─────────────────────────────────────── */
interface AgentDialogueProps {
    consensus: AgentConsensus;
}

export default function AgentDialogue({ consensus }: AgentDialogueProps) {
    const [visibleMessages, setVisibleMessages] = useState(0);
    const [showSynthesis, setShowSynthesis] = useState(false);

    useEffect(() => {
        if (!consensus?.dialogue) return;

        const timers: NodeJS.Timeout[] = [];
        consensus.dialogue.forEach((_, i) => {
            timers.push(setTimeout(() => setVisibleMessages(i + 1), 350 * (i + 1)));
        });

        timers.push(
            setTimeout(() => setShowSynthesis(true), 350 * (consensus.dialogue.length + 1))
        );

        return () => timers.forEach(clearTimeout);
    }, [consensus]);

    if (!consensus?.dialogue || consensus.dialogue.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Agent Consensus</h3>
                </div>
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                    {consensus.dialogue.length} Agent{consensus.dialogue.length > 1 ? 's' : ''}
                </span>
            </div>

            {/* Dialogue Area */}
            <div className="p-4 space-y-3">
                {consensus.dialogue.slice(0, visibleMessages).map((msg, i) => {
                    const config = resolveAgent(msg.agent);
                    const isEven = i % 2 === 0;

                    return (
                        <div
                            key={i}
                            className={`flex ${isEven ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div className={`max-w-[88%] flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-start gap-2`}>
                                {/* Agent Avatar */}
                                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-sm ring-2 ring-white`}>
                                    {config.icon}
                                </div>

                                {/* Message Bubble */}
                                <div className={`rounded-2xl px-3.5 py-2.5 ${config.accentBg} border ${config.borderColor} shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${config.accentText}`}>
                                            {cleanAgentLabel(msg.agent)}
                                        </span>
                                        {getSentimentBadge(msg.sentiment)}
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing indicator */}
                {visibleMessages < consensus.dialogue.length && (
                    <div className="flex justify-center py-2">
                        <div className="flex items-center space-x-1 text-slate-400">
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}

                {/* Synthesis */}
                {showSynthesis && consensus.synthesis && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-3.5">
                            <div className="flex items-center space-x-2 mb-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Final Synthesis</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {consensus.synthesis}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
