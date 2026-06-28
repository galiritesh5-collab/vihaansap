import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Server, Tv, ClipboardCheck, Film, HelpCircle, Briefcase, 
  Sparkles, CheckCircle2, BookmarkCheck, LayoutGrid, Award, ShieldCheck,
  Building2, ArrowRight
} from 'lucide-react';

interface FeatureHighlight {
  title: string;
  desc: string;
  metric: string;
  icon: React.ReactNode;
}

interface WhyVihaanProps {
  onOpenDemo?: () => void;
}

export default function WhyVihaan({ onOpenDemo }: WhyVihaanProps) {
  const highlights: FeatureHighlight[] = [
    {
      title: 'Top-Tier Experienced Consultants',
      desc: 'Our classes are led exclusively by senior SAP specialists with a minimum of 15+ years of enterprise experience executing real configuration changes inside global ERP landscapes.',
      metric: '15+ Yrs Avg',
      icon: <Users className="w-6 h-6 text-blue-600" />
    },
    {
      title: '24/7 Premium Sandbox Servers',
      desc: 'Get individual cloud authorization keys to access clean, high-speed SAP training GUI sandboxes. Practice real configuration settings and execute business procedures on demand.',
      metric: '24/7 Access',
      icon: <Server className="w-6 h-6 text-orange-500" />
    },
    {
      title: 'Interactive Live Virtual cohorts',
      desc: 'No passive video playback. Connect live twice a week to screenshare, configure settings with instructor guidance, review live errors instantly, and work in collaborative chat threads.',
      metric: '100% Interactive',
      icon: <Tv className="w-6 h-6 text-emerald-600" />
    },
    {
      title: 'Comprehensive Configuration Assignments',
      desc: 'Establish company codes, pricing schemas, search helps, or custom tables from scratch. Receive professional feedback and scores from mentors to perfect your skills.',
      metric: '15+ Projects',
      icon: <ClipboardCheck className="w-6 h-6 text-pink-600" />
    },
    {
      title: 'Lifetime Recording Archives',
      desc: 'Missed a weekday slot due to office deadlines? Don’t worry. Every session is immediately recorded in high-definition format and cataloged inside your dynamic online portal indefinitely.',
      metric: 'Lifetime Stream',
      icon: <Film className="w-6 h-6 text-purple-600" />
    },
    {
      title: 'Industry Interview Preparation',
      desc: 'Prepare for technical interviews with scenario-based mock sessions and direct feedback based on real-world industrial implementation methodologies.',
      metric: 'HR Optimized',
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />
    }
  ];

  return (
    <div id="why-vihaan-page" className="space-y-16 py-12 md:py-16">
      
      {/* Page Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4" id="why-page-hero">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1763B6] tracking-tight">
          Why Students Choose Sri Vihaan Consulting
        </h1>
        <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          We strip away theoretical fluff to focus intensely on actual SAP configurations, server practice drills, corporate scenarios, and structured career preparation.
        </p>
      </section>

      {/* Main Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="why-highlights-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              id={`why-highlight-card-${idx}`}
              className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-slate-50 rounded-xl" id={`why-icon-${idx}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] bg-[#1763B6]/5 text-[#1763B6] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.metric}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-slate-505 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 text-[11px] text-[#277EDC] font-semibold flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5" /> Verified Training Standard
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core values block / sandbox details */}
      <section className="bg-[#1763B6] text-white py-14" id="sandbox-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6" id="sandbox-features-left">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">
                Our Cloud SAP Sandbox Server Practice Ecosystem
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Most platforms teach SAP theoretically through slide decks. At Sri Vihaan Consulting, we believe you can only master SAP config by logging directly into a live console to configure parameters yourself.
              </p>
              
              <div className="space-y-3" id="sandbox-checkmarks-list">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <span>Individual system login credentials configured for both SAP GUI and SAP S4/HANA Web Fiori Launchpad.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <span>Pre-populated database tables containing master profiles (vendors, ledgers, plants, billing schedules).</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <span>Transparency & Integrity: We provide a completely honest and ethical learning environment focusing on genuine skill development without any misleading claims.</span>
                </div>
              </div>
            </div>

            {/* Simulated Desktop display */}
            <div className="lg:col-span-6" id="sandbox-features-right">
              <div className="bg-slate-100/50 rounded-xl overflow-hidden border border-slate-200/50 shadow-2xl relative">
                <div className="bg-gradient-to-b from-[#277EDC] to-[#1763B6] text-white px-3 py-2 flex items-center justify-between text-xs font-bold border-b border-[#145096]">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center text-[10px]">V</div>
                    <span>SAP Easy Access</span>
                  </div>
                  <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-white/20"></div>
                     <div className="w-3 h-3 rounded-full bg-white/20"></div>
                     <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  </div>
                </div>

                <div className="bg-[#f0f0f0] p-1.5 flex gap-1 border-b border-[#d0d0d0] text-[#1763B6]">
                  <div className="px-2 py-0.5 hover:bg-white/50 cursor-pointer text-[11px]">Menu</div>
                  <div className="px-2 py-0.5 hover:bg-white/50 cursor-pointer text-[11px]">Edit</div>
                  <div className="px-2 py-0.5 hover:bg-white/50 cursor-pointer text-[11px]">Favorites</div>
                  <div className="px-2 py-0.5 hover:bg-white/50 cursor-pointer text-[11px]">Extras</div>
                  <div className="px-2 py-0.5 hover:bg-white/50 cursor-pointer text-[11px]">System</div>
                  <div className="px-2 py-0.5 hover:bg-white/50 cursor-pointer text-[11px]">Help</div>
                </div>

                <div className="bg-[#e4e4e4] p-1.5 flex justify-between items-center border-b border-[#cccccc]">
                   <div className="flex bg-white border border-[#a0a0a0] rounded-sm overflow-hidden w-48 shadow-inner">
                     <span className="bg-[#1763B6] w-6 flex items-center justify-center text-white text-[10px] shrink-0">▶</span>
                     <input type="text" className="bg-transparent px-2 py-0.5 text-[11px] outline-none w-full font-mono text-slate-700" value="VA01" readOnly />
                   </div>
                   <div className="flex gap-2">
                     <div className="w-6 h-5 bg-white border border-[#a0a0a0] rounded-sm flex items-center justify-center shadow-sm">
                       <span className="text-[10px] text-slate-600 font-bold">↵</span>
                     </div>
                   </div>
                </div>

                <div className="bg-white p-4 h-[200px] overflow-hidden flex gap-4">
                  <div className="w-1/3 border-r border-[#e0e0e0] pr-3">
                     <div className="text-[10px] text-[#1763B6] font-semibold mb-2 flex items-center gap-1">
                        <span>▼</span> Favorites
                     </div>
                     <div className="text-[10px] text-slate-600 pl-3 mb-1 flex items-center gap-1 hover:bg-blue-50 cursor-pointer">
                        <span className="text-yellow-500">★</span> <span>ME21N - Create PO</span>
                     </div>
                     <div className="text-[10px] text-slate-600 pl-3 mb-1 flex items-center gap-1 hover:bg-blue-50 cursor-pointer">
                        <span className="text-yellow-500">★</span> <span>FB50 - G/L Document</span>
                     </div>
                     <div className="text-[10px] text-[#1763B6] font-semibold mb-2 mt-4 flex items-center gap-1">
                        <span>▼</span> SAP Menu
                     </div>
                     <div className="text-[10px] text-slate-600 pl-3 mb-1 flex flex-col gap-1">
                        <span className="flex items-center gap-1"><span>📁</span> Logistics</span>
                        <span className="flex items-center gap-1"><span>📁</span> Accounting</span>
                        <span className="flex items-center gap-1"><span>📁</span> Human Resources</span>
                     </div>
                  </div>
                  <div className="w-2/3 pl-1 flex flex-col justify-center items-center opacity-[0.03]">
                     <div className="w-24 h-24 rounded bg-[#1763B6] flex items-center justify-center text-white text-4xl font-bold mb-2">SAP</div>
                  </div>
                </div>

                <div className="bg-[#e4e4e4] border-t border-[#cccccc] px-3 py-1 flex justify-between items-center text-[9px] text-slate-600">
                  <div className="flex items-center gap-2">
                     <span>System: S4H</span>
                     <span>Client: 800</span>
                     <span>User: STUDENT01</span>
                  </div>
                  <span>OVR</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Placement highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="placement-section">
        <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="placement-card">
          <div className="lg:col-span-7 space-y-4" id="placement-left">
            <div className="p-2 bg-orange-50 rounded-lg inline-block border border-orange-100 mb-1">
              <Building2 className="w-5 h-5 text-[#F4A62A]" />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#1763B6] tracking-tight">
              Placement Guidance & Career Guidance
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Completing configurations is only half the battle. To secure competitive offers, you need effective guidance. We provide specialized post-course career support to help you navigate the industry.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-500" id="placement-details">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
                <span>Industry interview preparation.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
                <span>Career and job search support.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
                <span>Industry awareness discussions.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
                <span>General placement guidance.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4" id="placement-right">
            <h4 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider">Our Success Framework</h4>
            <div className="space-y-3.5 text-xs text-slate-500">
              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-0.5">Career Guidance</span>
                Optimize layout and highlight newly completed sandbox blueprint configurations for hiring ATS systems.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-0.5">Live Mock Interviews</span>
                Simulate real technical panels with configuration walkthroughs and general system design questions.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA bottom block */}
      <section className="text-center" id="why-cta-bottom">
        <div className="max-w-xl mx-auto space-y-4 px-4">
          <h2 className="font-display font-extrabold text-2xl text-[#1763B6]">Take Your First Step To SAP Expertise</h2>
          <p className="text-slate-500 text-sm">Join our Saturday virtual cohort. Take a look at our instruction quality, server parameters, and curriculum paths before making a final choice.</p>
          <div className="pt-2">
            <Link 
              to="/courses" 
              className="inline-flex items-center gap-1.5 bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all pointer-events-auto"
              id="why-btn-explore"
            >
              <span>Explore Course Catalogs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
