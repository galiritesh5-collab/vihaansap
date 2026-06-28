import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, Landmark, 
  HelpCircle, Clock, CheckCircle, Sparkles, Building2, ExternalLink,
  GraduationCap, BookOpen, UserCheck, CheckCircle2, ShieldCheck,
  Briefcase, Award, Users, MonitorPlay, LineChart, FileText, 
  HeartHandshake, Target, UserCircle, ArrowRightLeft, Quote
} from 'lucide-react';

import mentorImage from '../assets/images/mentor_portrait_1782642285950.jpg';

interface StatProps {
  label: string;
  target?: number;
  suffix?: string;
  id: string;
  textOverride?: string;
}

function CounterItem({ label, target, suffix, id, textOverride }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === undefined) return;
    let start = 0;
    const duration = 1500; // ms
    const increment = Math.ceil(target / (duration / 16)); // ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div id={`stat-card-${id}`} className="bg-white rounded-xl shadow-xs border border-slate-100 p-6 text-center transform hover:-translate-y-1 transition-all duration-300">
      <div 
        id={`stat-count-${id}`} 
        className="text-3xl sm:text-4xl font-display font-extrabold text-[#1763B6] tracking-tight mb-1"
      >
        {textOverride ? textOverride : `${count.toLocaleString()}${suffix || ''}`}
      </div>
      <div 
        id={`stat-label-${id}`} 
        className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider"
      >
        {label}
      </div>
    </div>
  );
}

export default function About() {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formModule, setFormModule] = useState('SAP FICO');
  const [formMsg, setFormMsg] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      setFormError('Please fill in Name, Email, and Phone number.');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "5517e9dc-d32d-49db-b800-665bcb388ece";
    if (!accessKey || accessKey.trim() === '') {
      console.error("Missing Web3Forms Access Key.");
      setFormError('Configuration error. Please contact the administrator.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("access_key", accessKey.trim());
      formData.append("subject", "New Corporate Training Inquiry");
      formData.append("from_name", "Sri Vihaan Consulting");
      formData.append("to_email", "info@srivihaanconsulting.com");
      formData.append("Full Name", formName.trim());
      formData.append("Email Address", formEmail.trim());
      formData.append("Phone Number", formPhone.trim());
      formData.append("Preferred SAP Module", formModule);
      formData.append("Message", formMsg.trim());
      formData.append("Date & Time of submission", new Date().toLocaleString());

      console.log("Submitting Corporate Training Inquiry:");
      console.log("Endpoint: https://api.web3forms.com/submit");
      console.log("Payload:", {
        subject: "New Corporate Training Inquiry",
        from_name: "Sri Vihaan Consulting",
        to_email: "info@srivihaanconsulting.com",
        "Full Name": formName.trim(),
        "Email Address": formEmail.trim(),
        "Phone Number": formPhone.trim(),
        "Preferred SAP Module": formModule,
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSuccess(true);
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormMsg('');
      } else {
        if (data.message?.toLowerCase().includes("invalid form id") || data.message?.toLowerCase().includes("access key")) {
          setFormError('Configuration error. Please contact the administrator.');
        } else {
          setFormError('Something went wrong. Please try again later.');
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setFormError('Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="about-page-wrapper" className="space-y-16 md:space-y-24 py-12 md:py-16">
      
      {/* SECTION 1: Page Hero & Philosophy */}
      <div className="space-y-12">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6" id="about-hero">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#1763B6] to-[#277EDC] rounded-2xl flex items-center justify-center text-white shadow-lg ring-8 ring-blue-50 relative">
            <UserCheck className="w-10 h-10" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] tracking-tight">
              About Sri Vihaan Consulting
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              A transparent and practical approach to SAP training. We focus on real industry knowledge, structured learning, and hands-on implementation to help students build successful SAP careers with confidence.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about-philosophy">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#1763B6] rounded-lg border border-blue-100 flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-800 text-lg">Transparency & Integrity</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We operate with a completely honest training approach. There are no gimmicks or misleading claims—just pure, industry-relevant knowledge transfer.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg border border-orange-100 flex items-center justify-center">
                 <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-800 text-lg">Practical Learning</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our curriculum focuses heavily on real-time business cases, simulating exact challenges that SAP consultants face in actual enterprise organizations.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 flex items-center justify-center">
                 <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-800 text-lg">Mentor Support</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Experience a structured learning roadmap backed by continuous mentorship. From digital study materials to real-time guidance, we stand by our students.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 2: Meet Your Mentor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 lg:p-14 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Image Block */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative max-w-[450px] mx-auto w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                <img 
                  src={mentorImage} 
                  alt="Shri Ram Sharma - Mentor" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content Block */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-blue-50 text-[#1763B6] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Industry Expert
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                  Meet Your Mentor
                </h2>
                <p className="text-[#1763B6] font-semibold text-sm sm:text-base">
                  Learn SAP from an Industry Professional
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-800">Shri Ram Sharma</h3>
                <p className="text-slate-500 text-sm font-medium">Certified SAP Consultant & Corporate Trainer</p>
              </div>

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Shri Ram Sharma is a Certified SAP Consultant with over <strong className="text-slate-800 font-semibold">15 years of professional experience</strong> in SAP consulting, implementation, and corporate training.
                </p>
                <p>
                  Throughout his career, he has worked with enterprise SAP environments across multiple business domains, helping organizations improve operational efficiency while gaining extensive real-world implementation expertise.
                </p>
                <p>
                  Driven by a passion for mentoring aspiring professionals, he has successfully trained <strong className="text-slate-800 font-semibold">500+ students</strong>, helping many build rewarding careers in SAP consulting and enterprise solutions.
                </p>
                <p>
                  His teaching philosophy emphasizes practical understanding over memorization. Every topic is explained using real business scenarios, implementation examples, and industry-focused discussions, enabling students to understand how SAP is actually applied inside organizations.
                </p>
                <p>
                  Whether you are a beginner, a recent graduate, a working professional, or planning a career transition, his structured teaching approach makes SAP concepts simple, practical, and easy to apply.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: Experience Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#1763B6] mb-4 border border-blue-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">15+ Years</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Professional SAP Experience
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Certified SAP Consultant</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Industry-recognized SAP consulting expertise.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 mb-4 border border-orange-100">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">500+ Students</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Successfully trained through practical learning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 border border-purple-100">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Real-Time Learning</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Implementation-based teaching using business scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Why Students Learn From Shri Ram Sharma */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight">
            Why Students Learn From Shri Ram Sharma
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 mb-4 border border-indigo-100">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Real Industry Experience</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Learn concepts that are actually used inside organizations rather than only theoretical knowledge.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 mb-4 border border-pink-100">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Practical Case Studies</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Understand SAP through implementation scenarios and business workflows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600 mb-4 border border-cyan-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Personalized Mentorship</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Continuous guidance, doubt support, and career advice throughout your learning journey.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-4 border border-teal-100">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Career-Focused Learning</h4>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Designed for freshers, graduates, career switchers, and working professionals preparing for SAP careers.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Who Can Join */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1763B6] tracking-tight">
            Who Can Join?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 shrink-0 bg-blue-50 text-[#1763B6] rounded-full border border-blue-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-base mb-1">Fresh Graduates</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Start your SAP journey from the fundamentals with structured guidance.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 shrink-0 bg-orange-50 text-orange-500 rounded-full border border-orange-100 flex items-center justify-center">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-base mb-1">Working Professionals</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Upskill or transition into SAP consulting with confidence.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 shrink-0 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-base mb-1">Career Switchers</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Build practical SAP expertise even without prior ERP experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Teaching Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <Quote className="w-12 h-12 mx-auto text-[#1763B6]/40" />
            
            <p className="text-xl sm:text-2xl md:text-3xl text-[#1763B6] font-display font-medium leading-relaxed tracking-tight">
              "The objective is not simply to complete a course, but to help every student understand how SAP works in real business environments and build the confidence to apply that knowledge throughout their career."
            </p>
            
            <div className="pt-2">
              <p className="font-bold text-slate-900 text-lg">Shri Ram Sharma</p>
              <p className="text-sm text-slate-500 font-medium">Mentor & Certified SAP Consultant</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Achievements Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <CounterItem id="ach-exp" label="Years Experience" target={15} suffix="+" />
          <CounterItem id="ach-stu" label="Students Trained" target={500} suffix="+" />
          <CounterItem id="ach-prac" label="Practical Learning" target={100} suffix="%" />
          <CounterItem id="ach-scen" label="Industry Scenarios" textOverride="Real-Time" />
        </div>
      </section>

      {/* SECTION 8: Form (kept exactly as it was) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" id="contact-form-and-maps-split-section">
        <div className="flex flex-col gap-8 items-stretch">
          
          <div className="w-full bg-white rounded-2xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-6" id="contact-left-form-container">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#1763B6] text-sm sm:text-base">
                <MessageSquare className="w-5 h-5" />
                <span>Submit Your Corporate Training Inquiry</span>
              </div>
              <p className="text-xs text-slate-500">
                Are you looking to migrate your career to SAP? Fill out this secure enrollment request. We will reach back to structure a trial schedule.
              </p>
            </div>

            {!formSuccess ? (
              <form onSubmit={handleContactSubmit} className="space-y-4" id="form-contact-full">
                {formError && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 text-center rounded-lg border border-red-100 font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ritesh Gali"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                      id="form-contact-name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. galiritesh5@gmail.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                      id="form-contact-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      WhatsApp Phone
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 text-xs sm:text-sm font-medium text-slate-400">+91</span>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder="7075999336"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg pl-11 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                        id="form-contact-phone"
                      />
                    </div>
                  </div>

                  {/* Module select */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                      Preferred SAP Module
                    </label>
                    <select
                      value={formModule}
                      onChange={(e) => setFormModule(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
                      id="form-contact-module"
                    >
                      <option value="SAP FICO">SAP FICO</option>
                      <option value="SAP MM">SAP MM</option>
                      <option value="SAP SD">SAP SD</option>
                      <option value="SAP ABAP">SAP ABAP</option>
                      <option value="SAP HCM" disabled className="text-slate-400">SAP HCM (Coming Soon)</option>
                      <option value="SAP BASIS" disabled className="text-slate-400">SAP BASIS (Coming Soon)</option>
                      <option value="SAP PP" disabled className="text-slate-400">SAP PP (Coming Soon)</option>
                      <option value="SAP SuccessFactors" disabled className="text-slate-400">SAP SuccessFactors (Coming Soon)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about your academic background or current role..."
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all py-2.5 min-h-[100px]"
                    id="form-contact-message"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-[#1763B6] hover:bg-[#277EDC] text-white font-bold py-3.5 px-6 rounded-lg text-xs sm:text-sm shadow-xs hover:shadow transition-colors flex items-center gap-1.5 cursor-pointer pointer-events-auto"
                    id="btn-contact-submit"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            ) : (
              <div className="py-16 text-center space-y-4" id="contact-success-view">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-100">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-lg">Message Forwarded!</h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Thank you <span className="font-semibold text-slate-800">{formName}</span>. Your training query regarding <strong className="text-slate-800 font-semibold">{formModule}</strong> has been saved.
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  A verification email has been dispatched to <span className="underline">{formEmail}</span>. Our representative will initiate a WhatsApp follow-up guide.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
