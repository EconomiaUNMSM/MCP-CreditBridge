'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // "Successful" login
        localStorage.setItem('mcp_auth_token', 'simulated_token_123');
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center">
                    {/* Real Logo */}
                    <div className="mx-auto h-20 w-20 flex items-center justify-center mb-6">
                        <img src="/logo.png" alt="MCP-CreditBridge" className="w-full h-full object-contain drop-shadow-md" />
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Institutional Access
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium flex items-center justify-center space-x-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Bank-Grade Security Gateway</span>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">Institutional ID</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                placeholder="officer@bank.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Secure Token</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm pl-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-900 hover:to-slate-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying Credentials...
                                </span>
                            ) : (
                                'Access Dashboard'
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                        <div className="text-xs text-slate-400 flex items-center">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                            System Operational
                        </div>
                        <div className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors">
                            Contact Support
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
