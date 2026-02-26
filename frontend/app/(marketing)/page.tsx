'use client';

import Link from "next/link";
import { ArrowRight, BrainCircuit, Scale, Network, ShieldCheck, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="font-sans antialiased bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      {/* Image Constraint: Woman on Right. Content MUST be Left. */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-50 overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/heroimage.jpeg"
            alt="Empowering Entrepreneur"
            className="w-full h-full object-cover object-center md:object-right opacity-90"
          />
          {/* Gradient Overlay to ensure text readability on Left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-full md:w-2/3"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 pt-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Live Integration: Banking Network V2</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Potential</span> <br />
              to <span className="text-slate-900">Capital.</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
              We transform structural data into creditworthiness.
              Our AI engine bridges the gap between invisible talent and institutional finance.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login" className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center">
                Access Institutional Portal
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Bank-Grade Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSION / METRICS --- */}
      <section id="mission" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100 group">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">94%</h3>
              <p className="text-slate-500 font-medium">Predictive Accuracy</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100 group">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Network className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">12k+</h3>
              <p className="text-slate-500 font-medium">Profiles Integrated</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100 group">
              <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scale className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">No Bias</h3>
              <p className="text-slate-500 font-medium">Algorithmic Fairness</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPACT STORIES --- */}
      <section id="impact" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Visible Talent, Invisible Risk.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Traditional models see "lack of history". We see "structural stability".
            </p>
          </div>

          {/* Story 1: Maria (Full Width Immersive) */}
          <div className="relative rounded-3xl overflow-hidden mb-24 min-h-[600px] flex items-center group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/history_1.jpeg"
                alt="Maria - Small Business Owner"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Gradient Overlay: Dark on Right (where text is), Transparent on Left (where Maria is) */}
              <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/60 to-transparent w-full md:w-3/4 ml-auto"></div>
            </div>

            {/* Content (Aligned Right) */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
              <div className="max-w-lg text-right">
                <div className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                  Integration Success
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  From Informal <br /> to Investable.
                </h3>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  "I had 5 years of cash-flow history that no bank would look at. CreditBridge digitized my ledger and proved my stability in weeks."
                </p>
                <div className="flex items-center justify-end space-x-4 border-t border-white/10 pt-6">
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">Maria Jimenez</div>
                    <div className="text-slate-400 text-sm">Small Business Owner</div>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-blue-300 text-xl border border-white/20">
                    MJ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story 2: Li Wei (Full Width Immersive) */}
          <div className="relative rounded-3xl overflow-hidden min-h-[600px] flex items-center group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/history_2.jpeg"
                alt="Li Wei - Tech Professional"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Gradient Overlay: Dark on Right (where text is), Transparent on Left (where Li Wei is) */}
              <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/60 to-transparent w-full md:w-3/4 ml-auto"></div>
            </div>

            {/* Content (Aligned Right) */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
              <div className="max-w-lg text-right">
                <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                  Digital Economy
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Border-Agnostic <br /> Skills.
                </h3>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  "My credentials were stuck in my home country. The structural scan validated my professional network and integration speed instantly."
                </p>
                <div className="flex items-center justify-end space-x-4 border-t border-white/10 pt-6">
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">Li Wei</div>
                    <div className="text-slate-400 text-sm">Software Architect</div>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-emerald-300 text-xl border border-white/20">
                    LW
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- NETWORK / CTA --- */}
      <section id="partners" className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/history_3.jpeg"
            alt="Community Network"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Governance at Scale.
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join the network of 40+ financial institutions using Structural Intelligence to reduce risk and expand markets.
          </p>
          <Link href="/login" className="inline-flex py-4 px-12 bg-white text-slate-900 font-bold rounded-full hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            Launch Dashboard
          </Link>
        </div>
      </section>

    </div>
  );
}
