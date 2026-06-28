import React from 'react';
import { UserCheck, Tv, ClipboardSignature, FileCheck2, Briefcase } from 'lucide-react';

interface TimelineStep {
  stepNum: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
}

export default function TimelineSection() {
  const steps: TimelineStep[] = [
    {
      stepNum: '01',
      title: 'Free Strategy Counseling',
      subtitle: 'Enroll & Plan',
      desc: 'Attend a free live demo, evaluate syllabus modules, and schedule your customized online cohort route.',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      stepNum: '02',
      title: 'Engaging Live Classes',
      subtitle: 'Direct Expert Interaction',
      desc: 'Attend active virtual classrooms with Real-Time Industry Experts who screen-share direct SAP desktop walk-throughs.',
      icon: <Tv className="w-5 h-5" />
    },
    {
      stepNum: '03',
      title: 'Real-time Real-World Scenario Based Assignments',
      subtitle: 'Sandbox Server Drills',
      desc: 'Log in to actual high-speed training SAP Servers to practice configurations and complete transactional cases.',
      icon: <ClipboardSignature className="w-5 h-5" />
    },
    {
      stepNum: '04',
      title: 'Syllabus Use Case Mapping',
      subtitle: 'Case Study Reviews',
      desc: 'Formulate structural blueprints matching multinational company procedures to mirror actual industrial operations.',
      icon: <FileCheck2 className="w-5 h-5" />
    },
    {
      stepNum: '05',
      title: 'Placement Guidance',
      subtitle: 'Graduation & Career Support',
      desc: 'Optimize your professional profile, attend dummy mock interviews, and receive updates on active corporate job opportunities.',
      icon: <Briefcase className="w-5 h-5" />
    }
  ];

  return (
    <div id="learning-timeline-wrapper" className="relative">
      
      {/* Desktop connecting line */}
      <div className="hidden lg:block absolute top-[43px] left-10 right-10 h-0.5 bg-slate-200 z-0"></div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10" id="timeline-flow-list">
        {steps.map((step, idx) => (
          <div 
            key={idx} 
            id={`timeline-step-${idx + 1}`} 
            className="flex flex-col items-center text-center group"
          >
            {/* Step Icon Hexagon Button */}
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 text-[#1763B6] group-hover:bg-[#1763B6] group-hover:text-white group-hover:border-[#1763B6] flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 z-10">
                {step.icon}
              </div>
              {/* Numeric indicator label */}
              <span className="absolute -top-2.5 -right-2 bg-orange-400 text-slate-900 font-display font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {step.stepNum}
              </span>
            </div>

            {/* Step description headers */}
            <div className="space-y-1.5 md:px-4">
              <h4 className="font-display font-bold text-[#1763B6] text-sm sm:text-base leading-snug">
                {step.title}
              </h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
