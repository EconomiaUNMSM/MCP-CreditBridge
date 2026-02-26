export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen font-sans antialiased text-slate-900 bg-white">
            {/* Marketing Header - Different from App Navigation */}
            <header className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo.png"
                                alt="MCP-CreditBridge Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="font-bold text-xl text-slate-900 tracking-tight">CreditBridge</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#mission" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Integration Mission</a>
                            <a href="#impact" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Impact Stories</a>
                            <a href="#partners" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Network</a>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <a href="/login" className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md">
                                Institutional Login
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {children}
            </main>
            <footer className="bg-slate-50 py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-400 text-sm">© 2026 MCP-CreditBridge. Built for the Hackathon.</p>
                </div>
            </footer>
        </div>
    );
}
