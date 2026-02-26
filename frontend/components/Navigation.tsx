'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, LogOut, X, Eye, Type, Volume2, ShieldAlert } from 'lucide-react';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

    const [showSettings, setShowSettings] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Accessibility States (Mock local state for demo purposes)
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [screenReader, setScreenReader] = useState(false);

    // Optional: apply classes to body if you want them to be functional
    useEffect(() => {
        if (highContrast) document.body.classList.add('contrast-more');
        else document.body.classList.remove('contrast-more');

        if (largeText) document.documentElement.style.fontSize = '110%';
        else document.documentElement.style.fontSize = '100%';

        if (screenReader) document.body.classList.add('screen-reader-active');
        else document.body.classList.remove('screen-reader-active');
    }, [highContrast, largeText, screenReader]);

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        setShowSettings(false);
        // Simple redirect to home/login for demo
        router.push('/');
    };

    const links = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/evaluate', label: 'Evaluate' },
        { href: '/history', label: 'History' },
        { href: '/institutional', label: 'Institutional' },
    ];

    return (
        <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="MCP-CreditBridge Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <span className="font-bold text-xl text-slate-900 tracking-tight">CreditBridge</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex space-x-1">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                        ${isActive
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }
                                    `}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Identity / Settings Trigger */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-inner hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Open Settings"
                    >
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-[10px]">
                            LY
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-slate-700 leading-none">Luis Y.</span>
                            <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">Settings & Profile</span>
                        </div>
                        <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    </button>
                </div>
            </div>

            {/* --- Modals --- */}

            {/* 1. Settings / Accessibility Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                <Settings className="w-5 h-5 mr-2 text-blue-600" /> Platform Settings
                            </h3>
                            <button onClick={() => setShowSettings(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Profile Info */}
                            <div className="flex items-center space-x-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 text-lg">
                                    LY
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Luis Yoplac</h4>
                                    <p className="text-xs text-slate-500">Sr. Loan Officer • Pilot Environment</p>
                                </div>
                            </div>

                            {/* Accessibility Config */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Accessibility Features</h4>

                                {/* High Contrast */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                            <Eye className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">High Contrast Mode</p>
                                            <p className="text-[10px] text-slate-500">Increase visual distinction of UI elements</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                {/* Large Text */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <Type className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Large Text</p>
                                            <p className="text-[10px] text-slate-500">Scale up typography across the platform</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={largeText} onChange={() => setLargeText(!largeText)} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                {/* Screen Reader Opt */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <Volume2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Screen Reader Optimization</p>
                                            <p className="text-[10px] text-slate-500">Enable verbose ARIA descriptions for forms</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={screenReader} onChange={() => setScreenReader(!screenReader)} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Logout Trigger */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="flex items-center px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </button>
                            <button onClick={() => setShowSettings(false)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md rounded-lg transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-sm">
                            <ShieldAlert className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Out?</h3>
                        <p className="text-sm text-slate-500 mb-6">Are you sure you want to securely sign out of your active session? Unsaved progress in the dashboard will be lost.</p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                Yes, Sign Out Securely
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="w-full py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
