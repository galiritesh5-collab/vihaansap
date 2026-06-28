import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, HelpCircle, Phone, Mail, MapPin, Sparkles, Package, Cloud, Database,
  Tv, Award, Users, BookOpen, Star, MessageSquare, ChevronLeft, ChevronRight, 
  Send, Server, Globe2, TrendingUp, HandCoins, ArrowUpRight, CheckCircle2, Clock 
} from 'lucide-react';
import { SAP_COURSES, STUDENT_REVIEWS, FAQS } from '../data';
import StatsCounter from '../components/StatsCounter';
import CourseCard from '../components/CourseCard';
import TimelineSection from '../components/TimelineSection';
import FAQAccordion from '../components/FAQAccordion';
import TestimonialCard from '../components/TestimonialCard';
import FastInquiryForm from '../components/FastInquiryForm';
import LeadCapturePopup from '../components/LeadCapturePopup';

interface HomeProps {
  onOpenDemo: () => void;
  onInquireCourse: (courseName: string) => void;
}

export default function Home({ onOpenDemo, onInquireCourse }: HomeProps) {
  const navigate = useNavigate();
  const [reviewIndex, setReviewIndex] = useState(0);


  const nextReview = () => {
    setReviewIndex((prev) => (prev + 1) % STUDENT_REVIEWS.length);
  };

  const prevReview = () => {
    setReviewIndex((prev) => (prev - 1 + STUDENT_REVIEWS.length) % STUDENT_REVIEWS.length);
  };


  return (
    <div id="home-page-container" className="space-y-16 md:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative bg-gradient-to-br from-[#145096] via-[#1763B6] to-[#2075CD] text-white py-16 lg:py-24 overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left" id="hero-left">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white mb-4" id="hero-title">
                Build Your Career with <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  Professional SAP Training
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0" id="hero-subtext">
                Learn industry-focused SAP modules through live online training, practical guidance, real-time scenarios, and expert mentorship. Align your skills directly with corporate demands.
              </p>

              {/* Action items CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2" id="hero-actions">
                <Link
                  to="/courses"
                  className="bg-[#F4A62A] hover:bg-orange-500 active:bg-orange-600 text-slate-900 font-bold px-6 py-3.5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 pointer-events-auto"
                  id="hero-btn-explore"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </Link>
                <button
                  onClick={onOpenDemo}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/25 hover:border-white/45 font-bold px-6 py-3.5 rounded-lg text-sm transition-all cursor-pointer pointer-events-auto flex items-center gap-2"
                  id="hero-btn-demo"
                >
                  Book Free Demo
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4" id="hero-trust-badges">
                <div className="flex items-center gap-2 text-left justify-center sm:justify-start">
                  <div className="p-1.5 bg-white/5 rounded-lg text-orange-400 border border-white/5 shrink-0">
                    <Tv className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 text-[11px] sm:text-xs font-semibold leading-tight">Live Virtual Classes</span>
                </div>
                <div className="flex items-center gap-2 text-left justify-center sm:justify-start">
                  <div className="p-1.5 bg-white/5 rounded-lg text-orange-400 border border-white/5 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 text-[11px] sm:text-xs font-semibold leading-tight">Expert Instructors</span>
                </div>
                <div className="flex items-center gap-2 text-left justify-center sm:justify-start">
                  <div className="p-1.5 bg-white/5 rounded-lg text-orange-400 border border-white/5 shrink-0">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 text-[11px] sm:text-xs font-semibold leading-tight">24/7 Server Access</span>
                </div>
                <div className="flex items-center gap-2 text-left justify-center sm:justify-start">
                  <div className="p-1.5 bg-white/5 rounded-lg text-orange-400 border border-white/5 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300 text-[11px] sm:text-xs font-semibold leading-tight">Career Assistance</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Column - SAP Ecosystem */}
            <div className="lg:col-span-5 relative" id="hero-right">
              {/* Premium Enterprise Ecosystem Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative overflow-hidden group">
                
                {/* Subtle Background Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
                
                {/* 1. Enterprise Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#1763B6] to-[#277EDC] shadow-lg rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-widest ring-4 ring-[#1763B6]/5">SAP</div>
                    <div className="space-y-0.5">
                      <h3 className="font-display font-bold text-slate-800 text-[15px] tracking-tight">Enterprise Ecosystem</h3>
                      <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">S/4HANA Integrated Network</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">System Active</span>
                     </span>
                     <span className="text-[9px] text-slate-400 font-mono tracking-wider">ENV: DEV-800</span>
                  </div>
                </div>

                {/* 2 & 3. Ecosystem Architecture / Grid Layout */}
                <div className="relative z-10 w-full">
                  
                  {/* Central Node representing the core / database */}
                  <div className="flex justify-center mb-6 relative">
                    {/* Connecting line to modules below */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-blue-200 to-transparent hidden sm:block"></div>
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
                      <Database className="w-4 h-4 text-[#1763B6]" />
                      <span className="text-[10px] font-bold text-[#1763B6] tracking-wide">Central Analytics & Data Core</span>
                    </div>
                  </div>

                  {/* Modules Architecture Grid */}
                  <div className="grid grid-cols-2 gap-4 relative">
                    {/* Architecture connection background lines */}
                    <div className="absolute inset-0 pointer-events-none hidden sm:block">
                      <div className="absolute top-[40%] left-[20%] right-[20%] h-px bg-slate-100"></div>
                      <div className="absolute top-[20%] bottom-[20%] left-[50%] w-px bg-slate-100"></div>
                      <div className="absolute top-[40%] left-[50%] w-2 h-2 rounded-full bg-slate-200 -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
                    </div>

                    {/* FICO Module (Finance) */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-8px_rgba(22,59,101,0.15)] hover:border-blue-100 transition-all duration-300 relative group flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50/80 text-[#1763B6] flex items-center justify-center group-hover:bg-[#1763B6] group-hover:text-white transition-colors duration-300">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">FI-CO</span>
                      </div>
                      <div className="mt-auto space-y-1">
                        <h4 className="font-bold text-slate-800 text-[13px] tracking-tight">Finance & Control</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">Ledger, Payables, Assets</p>
                      </div>
                    </div>

                    {/* MM Module (Materials) */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-8px_rgba(244,166,42,0.15)] hover:border-orange-100 transition-all duration-300 relative group flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50/80 text-[#F4A62A] flex items-center justify-center group-hover:bg-[#F4A62A] group-hover:text-white transition-colors duration-300">
                          <Package className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">MM</span>
                      </div>
                      <div className="mt-auto space-y-1">
                        <h4 className="font-bold text-slate-800 text-[13px] tracking-tight">Material Mgmt</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">Procurement & Inventory</p>
                      </div>
                    </div>

                    {/* SD Module (Sales) */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-8px_rgba(16,185,129,0.15)] hover:border-emerald-100 transition-all duration-300 relative group flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                         <div className="w-8 h-8 rounded-lg bg-emerald-50/80 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                          <Send className="w-4 h-4" />
                        </div>
                         <span className="text-[9px] text-slate-400 font-mono tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">SD</span>
                      </div>
                      <div className="mt-auto space-y-1">
                        <h4 className="font-bold text-slate-800 text-[13px] tracking-tight">Sales & Dist</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">Order to Cash Cycle</p>
                      </div>
                    </div>

                    {/* CO Module (Controlling) */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-8px_rgba(168,85,247,0.15)] hover:border-purple-100 transition-all duration-300 relative group flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                         <div className="w-8 h-8 rounded-lg bg-purple-50/80 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                          <Users className="w-4 h-4" />
                        </div>
                         <span className="text-[9px] text-slate-400 font-mono tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">CONTROLLING</span>
                      </div>
                      <div className="mt-auto space-y-1">
                        <h4 className="font-bold text-slate-800 text-[13px] tracking-tight">SAP CO</h4>
                        <p className="text-[10px] text-slate-500 leading-snug">Cost Center & Profitability</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Enterprise Micro Details Footer */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 bg-slate-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 px-6 py-4 sm:px-8 sm:py-5 rounded-b-2xl">
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                       <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                       Enterprise Secured
                     </div>
                     <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0 hidden sm:block"></div>
                     <div className="items-center gap-1.5 text-[10px] text-slate-500 font-medium hidden sm:flex">
                       <Globe2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                       Global Standards
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm shrink-0">
                      <Cloud className="w-3.5 h-3.5 text-[#1763B6]" />
                      <span className="text-[10px] font-bold text-[#1763B6] tracking-wide">Cloud ERP Sync</span>
                   </div>
                </div>
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT IS SAP SECTION */}
      <section id="what-is-sap-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-5 space-y-4" id="what-sap-left">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight leading-tight" id="what-sap-title">
              What is SAP?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed" id="what-sap-p1">
              SAP stands for <strong>Systems, Applications, and Products in Data Processing</strong>. It is the premier global provider of Enterprise Resource Planning (ERP) software that enables organizations of all sizes to manage financial records, logistics operations, supply chains, payroll logistics, customer cycles, and database information in one unified server.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed" id="what-sap-p2">
              Businesses rely on SAP because it connects everything automatically, removing corporate data silos. In consequence, certified professionals with configuration skills are highly valued and sought after globally.
            </p>
            <div className="pt-2">
              <Link 
                to="/courses" 
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1763B6] hover:text-[#277EDC] transition-all hover:translate-x-0.5"
                id="link-explore-modules"
              >
                <span>View standard SAP Modules we teach</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" id="what-sap-right">
            
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex gap-4" id="sap-erp-card">
              <div className="p-3 bg-blue-50 text-[#1763B6] rounded-lg shrink-0 h-11 w-11 flex items-center justify-center">
                <Globe2 className="w-5 h-5 shrink-0 text-[#1763B6]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-semibold text-slate-800 text-sm sm:text-base">Enterprise ERP</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Unified enterprise network bridging business, production, distribution, and global transactions accurately.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex gap-4" id="sap-fortune-card">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-lg shrink-0 h-11 w-11 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 shrink-0 text-orange-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-semibold text-slate-800 text-sm sm:text-base">Used by Global Giants</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Over 90% of Fortune 500 multinationals rely strictly on SAP systems to process corporate information.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex gap-4" id="sap-careers-card">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 h-11 w-11 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 shrink-0 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-semibold text-slate-800 text-sm sm:text-base">Elite Opportunities</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Certified consultants take on key functions as analysts, architects, programmers, or team administrators.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex gap-4" id="sap-salary-card">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-lg shrink-0 h-11 w-11 flex items-center justify-center">
                <HandCoins className="w-5 h-5 shrink-0 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-semibold text-slate-800 text-sm sm:text-base">High Compensation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Due to critical business dependencies, SAP roles are among the highest paid consulting careers within technology ecosystems.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. DEMAND COUNTERS SECTION */}
      <section id="demand-counters-section" className="bg-[#1763B6]/5 py-12 border-y border-[#1763B6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2" id="demand-header">
            <h3 className="font-display font-extrabold text-2xl text-[#1763B6]">
              Global Demand in Numbers
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              We focus strictly on structural expertise, practical mock sandboxes, and career goals to prepare corporate-ready consultants.
            </p>
          </div>

          <StatsCounter />
        </div>
      </section>

      {/* 4. WHY CHOOSE VIHAAN SECTION */}
      <section id="why-choose-vihaan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 md:mb-14">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight">
            Why Choose Sri Vihaan Consulting?
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            We provide a premium, hand-holding training experience tailored to convert absolute beginners into certified technical and functional SAP experts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="why-bento-grid">
          
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#1763B6] mb-4 border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Experienced Trainers</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Learn directly from functional consultants with 15+ years of active configuration experience in multinational organizations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Flexible Timings</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We offer weekends and weekdays batches, making it comfortable for working roles to study and practice without career gaps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 border border-purple-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Real-World Scenario Assignments</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Engage with practical exercises designed using real implementation scenarios on actual SAP sandboxes, reflecting genuine business requirements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 mb-4 border border-indigo-100">
              <Tv className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Session Recordings</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Get lifetime access to high-definition video records of your own cohort classes within hours to support self-guided revisions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 mb-4 border border-pink-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Career Guidance</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Receive one-on-one professional grooming to help you choose modules matching your accounting, logistics or IT background.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 mb-4 border border-red-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Interview Preparation</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Practice with real-time technical questions, configured system troubleshooting, and live mock drills.
            </p>
          </div>

        </div>
      </section>

      {/* 5. SAP COURSES SECTION */}
      <section id="sap-courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight">
              Our Premium SAP Course Offerings
            </h2>
            <p className="text-slate-500 text-sm">
              Explore professional functional and technical modules with live classroom support, robust sandbox systems, and verified curriculums.
            </p>
          </div>
          <div className="shrink-0 text-center md:text-right">
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-lg shadow-xs hover:shadow transition-all pointer-events-auto"
              id="btn-home-all-courses"
            >
              <span>View All 8 Modules</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Displaying first 4 premium modules for homepage clutter-reduction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="home-courses-grid">
          {SAP_COURSES.slice(0, 4).map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onInquire={onInquireCourse} 
            />
          ))}
        </div>
      </section>

      {/* 6. LEARNING PROCESS TIMELINE */}
      <section id="learning-process" className="bg-[#1763B6]/5 py-16 md:py-20 border-y border-[#1763B6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight">
              Our 5-Step Learning Roadmap
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We leverage an organized system to transform business beginners into confident, high-performing corporate SAP consultants.
            </p>
          </div>

          <TimelineSection />

        </div>
      </section>

      {/* 7. DEMO CLASS CTA SECTION */}
      <section id="demo-class-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1763B6] rounded-2xl relative overflow-hidden text-center py-12 px-6 sm:px-12 shadow-xl border border-white/10" id="cta-blue-card">
          {/* Accent decoration rings */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
              Start Your SAP Journey Today
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Don't guess which module fits your background. Attend an interactive free virtual demo session, explore actual sandbox configurations, and plan directly with industry experts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                onClick={onOpenDemo}
                className="bg-[#F4A62A] hover:bg-orange-500 active:bg-orange-600 text-slate-900 font-bold px-6 py-3.5 rounded-lg text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer pointer-events-auto"
                id="cta-btn-demo"
              >
                Book Free Demo Session
              </button>
              <Link
                to="/contact"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 font-bold px-6 py-3.5 rounded-lg text-xs sm:text-sm transition-all pointer-events-auto"
                id="cta-btn-contact"
              >
                Connect With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. STUDENT REVIEWS SECTION */}
      <section id="reviews-slider-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Review text descriptors */}
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left" id="reviews-slider-left">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight leading-tight">
              What Our Satisfied <br /> Students Say
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Read how accounting, IT, and administrative candidates accelerated their career and landed critical roles within multinational enterprises.
            </p>
            
            {/* Slider arrows */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2" id="slider-controls">
              <button
                onClick={prevReview}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white text-slate-600 hover:text-[#1763B6] hover:bg-slate-50 transition-all cursor-pointer pointer-events-auto"
                title="Previous story"
                id="btn-prev-review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold text-slate-400 select-none">
                {reviewIndex + 1} / {STUDENT_REVIEWS.length}
              </span>
              <button
                onClick={nextReview}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white text-slate-600 hover:text-[#1763B6] hover:bg-slate-50 transition-all cursor-pointer pointer-events-auto"
                title="Next story"
                id="btn-next-review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1763B6] hover:text-[#277EDC] transition-colors pointer-events-auto"
                id="btn-reviews-page"
              >
                <span>Read all verified student reviews</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Render Active Review Card */}
          <div className="lg:col-span-7" id="reviews-slider-right">
            <div className="relative" id="active-slider-card">
              {/* Outer background backdrop block */}
              <div className="absolute inset-0 bg-[#1763B6]/5 rounded-2xl transform rotate-2 pointer-events-none"></div>
              
              <div className="relative z-10 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <TestimonialCard review={STUDENT_REVIEWS[reviewIndex]} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. FAQ ACCORDION PREVIEW */}
      <section id="faq-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm">
            Review top quick inquiries raised by our aspiring participants during their onboarding process.
          </p>
        </div>

        {/* Displaying first 4 FAQ list elements */}
        <div className="space-y-4" id="home-faq-wrapper">
          <FAQAccordion items={FAQS.slice(0, 4)} />
        </div>

        <div className="text-center pt-8">
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 bg-transparent hover:bg-slate-100 text-[#1763B6] border border-[#1763B6]/20 hover:border-[#1763B6] font-bold text-xs sm:text-sm px-5 py-3 rounded-lg transition-all pointer-events-auto"
            id="btn-home-faq-all"
          >
            <span>Have more questions? Read full FAQ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. CONTACT PREVIEW SECTION */}
      <section id="contact-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12" id="contact-teaser-card">
          
          {/* Teaser Left: Info Cards */}
          <div className="lg:col-span-5 bg-[#145096] text-white p-8 sm:p-10 flex flex-col justify-between space-y-10 relative">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <h3 className="font-display font-extrabold text-2xl tracking-tight">
                Quick Support Preview
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Connect with our advisors. We normally respond within 2 hours of post submissions during active office hours.
              </p>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm relative z-10" id="preview-contact-details">
              <li className="flex items-center gap-3">
                <Phone className="w-4.5 h-4.5 text-orange-400" />
                <a href="tel:+917075999336" className="text-slate-200 hover:text-white transition-colors pointer-events-auto font-medium">
                  +91 70759 99336
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-orange-400" />
                <a href="mailto:info@srivihaanconsulting.com" className="text-slate-200 hover:text-white transition-colors pointer-events-auto break-all">
                  info@srivihaanconsulting.com
                </a>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-400 relative z-10">
              * By submitting this secure preview form, you acknowledge that our personnel may trace your contact details via WhatsApp to dispatch class schedules.
            </div>
          </div>

          {/* Teaser Right: Mini Contact Form */}
          <div className="lg:col-span-7 p-8 sm:p-10" id="contact-teaser-right">
            <FastInquiryForm />
          </div>

        </div>
      </section>

      <LeadCapturePopup />
    </div>
  );
}
