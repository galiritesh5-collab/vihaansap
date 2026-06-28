import { Coins, Package, TrendingUp, Code, Users2, Shield, Wrench, Cloud, Star, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SAPCourse } from '../types';

interface CourseCardProps {
  course: SAPCourse;
  onInquire: (courseName: string) => void;
  key?: string;
}

export default function CourseCard({ course, onInquire }: CourseCardProps) {
  const navigate = useNavigate();

  // Dynamic icon helper matching SAP corporate branches
  const getIcon = (code: string) => {
    switch (code) {
      case 'FICO':
        return <Coins className="w-6 h-6 text-emerald-600" />;
      case 'MM':
        return <Package className="w-6 h-6 text-sky-600" />;
      case 'SD':
        return <TrendingUp className="w-6 h-6 text-orange-500" />;
      case 'ABAP':
        return <Code className="w-6 h-6 text-indigo-500" />;
      case 'HCM':
        return <Users2 className="w-6 h-6 text-pink-600" />;
      case 'BASIS':
        return <Shield className="w-6 h-6 text-red-500" />;
      case 'PP':
        return <Wrench className="w-6 h-6 text-amber-600" />;
      case 'SF':
        return <Cloud className="w-6 h-6 text-blue-500" />;
      default:
        return <Coins className="w-6 h-6 text-slate-500" />;
    }
  };

  const handleViewDetails = () => {
    // Navigate to /courses page and pass query or hash to auto-expand this syllabus!
    navigate(`/courses?select=${course.id}`);
    
    // Smooth scroll to top when changing context
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      id={`course-card-${course.id}`} 
      className="bg-white rounded-xl shadow-xs border border-slate-100 hover:border-[#277EDC]/40 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden group relative"
    >
      {/* Upper banner section */}
      <div className="p-5 flex-grow space-y-4">
        {/* Header badges & icon wrapper */}
        <div className="flex justify-between items-start gap-2">
          <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-[#1763B6]/5 transition-all duration-300 border border-slate-100 group-hover:border-[#1763B6]/10">
            {getIcon(course.code)}
          </div>
          
          <div className="flex flex-col items-end gap-1.5">
            {course.isLive ? (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Live Class
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Flexible Batch
              </span>
            )}
            <span className="text-[10px] bg-[#1763B6]/10 text-[#1763B6] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {course.level}
            </span>
          </div>
        </div>

        {/* Title & Stats info */}
        <div className="space-y-1.5">
          <h4 className="font-display font-bold text-slate-800 text-base sm:text-lg group-hover:text-[#1763B6] transition-colors leading-tight">
            {course.name}
          </h4>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.duration}
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-0.5 font-semibold text-orange-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              {course.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Short info */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Button action footer */}
      <div className="p-5 pt-0 border-t border-slate-50 bg-slate-50/50 flex gap-2.5 mt-auto">
        <button
          onClick={handleViewDetails}
          className="flex-1 text-center bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1763B6] border border-slate-200 hover:border-slate-300 font-semibold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer pointer-events-auto"
          id={`btn-course-details-${course.id}`}
        >
          <span>Syllabus</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
        {['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'].includes(course.id) ? (
          <button
            disabled
            className="flex-1 text-center bg-slate-200 text-slate-400 font-semibold text-xs py-2.5 rounded-lg cursor-not-allowed"
            id={`btn-course-inquire-${course.id}`}
          >
            Coming Soon
          </button>
        ) : (
          <button
            onClick={() => onInquire(course.name)}
            className="flex-1 text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold text-xs py-2.5 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer pointer-events-auto"
            id={`btn-course-inquire-${course.id}`}
          >
            Inquire Now
          </button>
        )}
      </div>
    </div>
  );
}
