import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Coins, Package, TrendingUp, Code, Users2, Shield, Wrench, Cloud, 
  Search, Star, Clock, Sparkles, Filter, ChevronDown, Check, Send, 
  BookOpen, PlayCircle, Info, BookOpenCheck, HelpCircle, X, CheckCircle
} from 'lucide-react';
import { SAP_COURSES } from '../data';
import { SAPCourse } from '../types';

interface CoursesProps {
  onInquireCourse: (courseName: string) => void;
  inquiryCourseName: string | null;
  onClearInquiry: () => void;
}

export default function Courses({ onInquireCourse, inquiryCourseName, onClearInquiry }: CoursesProps) {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Functional' | 'Technical' | 'Cloud'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSyllabusId, setExpandedSyllabusId] = useState<string | null>(null);

  // Inquiry form status inside modal
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Parse path query parameter ?select=sap-fico to highlight and expand syllabus
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectId = params.get('select');
    if (selectId) {
      // Confirm course actually exists in data
      const courseExist = SAP_COURSES.find(c => c.id === selectId);
      if (courseExist) {
        setExpandedSyllabusId(selectId);
        
        // Scroll down slightly to target course card
        setTimeout(() => {
          const el = document.getElementById(`course-card-${selectId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [location]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMsg('');
      setInquirySubmitted(false);
      onClearInquiry();
    }, 2500);
  };

  // Filter courses based on selections
  const filteredCourses = SAP_COURSES.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCourses = filteredCourses.filter(c => !c.isUpcoming);
  const upcomingCourses = filteredCourses.filter(c => c.isUpcoming);

  const getIcon = (code: string) => {
    switch (code) {
      case 'FICO': return <Coins className="w-5 h-5 text-emerald-600" />;
      case 'MM': return <Package className="w-5 h-5 text-sky-600" />;
      case 'SD': return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'ABAP': return <Code className="w-5 h-5 text-indigo-500" />;
      case 'HCM': return <Users2 className="w-5 h-5 text-pink-600" />;
      case 'BASIS': return <Shield className="w-5 h-5 text-red-500" />;
      case 'PP': return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'SF': return <Cloud className="w-5 h-5 text-blue-500" />;
      default: return <Coins className="w-5 h-5 text-slate-500" />;
    }
  };

  const categories: Array<'All' | 'Functional' | 'Technical' | 'Cloud'> = [
    'All', 'Functional', 'Technical', 'Cloud'
  ];

  return (
    <div id="courses-page-container" className="space-y-12 py-12 md:py-16">
      
      {/* Search and Headers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4" id="courses-header-section">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] tracking-tight">
          Explore Our Premium SAP Courses
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          We configure S/4HANA environments and ECC setups so candidates gain extensive system configuration experience under real industry settings.
        </p>

        {/* Filter Toolbar controls */}
        <div className="pt-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between" id="courses-toolbar">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center" id="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer pointer-events-auto ${
                  selectedCategory === cat
                    ? 'bg-[#1763B6] text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
                id={`pill-cat-${cat.toLowerCase()}`}
              >
                {cat} Modules
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs shrink-0" id="search-bar-wrapper">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search FICO, ABAP, MM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-white border border-slate-200 outline-none rounded-lg focus:shadow focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
              id="input-course-search"
            />
          </div>
        </div>
      </section>

      {/* Main Grid courses LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="courses-grid-section">
        {filteredCourses.length > 0 ? (
          <>
          {activeCourses.length > 0 && (
            <div className="space-y-8" id="courses-list-items">
              {activeCourses.map((course) => {
                const isExpanded = expandedSyllabusId === course.id;
              
              return (
                <div 
                  key={course.id}
                  id={`course-card-${course.id}`}
                  className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? 'border-[#277EDC]/40 shadow-md ring-2 ring-[#277EDC]/5' 
                      : 'border-slate-100 hover:border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Upper Flex Card Grid */}
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left details info (Name, rating, descriptors) */}
                    <div className="md:col-span-8 space-y-4" id={`course-info-block-${course.id}`}>
                      <div className="flex flex-wrap items-center gap-3.5">
                        <div className="p-3 bg-[#1763B6]/5 rounded-xl border border-[#1763B6]/15">
                          {getIcon(course.code)}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            SAP {course.category}
                          </span>
                          <h3 className="font-display font-extrabold text-slate-800 text-lg sm:text-xl">
                            {course.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                        {course.description}
                      </p>

                      {/* Course highlights */}
                      {course.fullDetails && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500" id={`highlights-${course.id}`}>
                          {course.fullDetails.map((det, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{det}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Right side stats & action controls */}
                    <div className="md:col-span-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100 space-y-4 text-xs sm:text-sm" id={`course-meta-block-${course.id}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {course.duration}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Skill Level:</span>
                          <span className="font-semibold text-slate-700 bg-[#1763B6]/10 text-[#1763B6] px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-sans">
                            {course.level}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sandbox Practice:</span>
                          <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <BookOpenCheck className="w-3.5 h-3.5" />
                            24/7 Cloud access
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Satisfaction Score:</span>
                          <span className="font-bold text-orange-500 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <button
                          onClick={() => setExpandedSyllabusId(isExpanded ? null : course.id)}
                          className="w-full text-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer pointer-events-auto"
                          id={`btn-toggle-syllabus-${course.id}`}
                        >
                          <span>{isExpanded ? 'Hide Syllabus' : 'Explore Syllabus'}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'].includes(course.id) ? (
                          <button
                            disabled
                            className="w-full text-center bg-slate-200 text-slate-400 font-semibold py-2.5 rounded-lg text-xs cursor-not-allowed"
                            id={`btn-courses-inquire-${course.id}`}
                          >
                            Coming Soon
                          </button>
                        ) : (
                          <button
                            onClick={() => onInquireCourse(course.name)}
                            className="w-full text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-2.5 rounded-lg text-xs shadow-xs hover:shadow transition-colors cursor-pointer pointer-events-auto"
                            id={`btn-courses-inquire-${course.id}`}
                          >
                            Inquire Now
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Expanded Detailed Syllabus Section */}
                  {isExpanded && (
                    <div className="bg-[#1763B6]/5 border-t border-slate-100 p-6 md:p-8 space-y-4" id={`syllabus-drawer-${course.id}`}>
                      <div className="flex items-center gap-2 text-slate-800 font-display font-semibold text-sm">
                        <BookOpen className="w-5 h-5 text-[#1763B6]" />
                        <span>Syllabus breakdown for configuration cohorts</span>
                      </div>
                      
                      {course.syllabus ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id={`syllabus-list-${course.id}`}>
                          {course.syllabus.map((topic, i) => (
                            <div key={i} className="bg-white p-3.5 rounded-lg border border-slate-100 text-xs flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-[#1763B6]/10 text-[#1763B6] font-display font-extrabold text-[10px] flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span className="text-slate-600 font-medium">{topic}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No syllabus breakdown mapped for this specific flexible entry level cohort.</p>
                      )}

                      <div className="p-4 bg-white/70 rounded-xl border border-dashed border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                        <div className="space-y-0.5 text-center sm:text-left">
                          <span className="font-bold text-slate-700 block">Need a Custom Saturday Batch schedule?</span>
                          <p className="text-slate-500 text-[11px]">Tell us your background and we will propose custom timing sessions.</p>
                        </div>
                        {['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'].includes(course.id) ? (
                          <button
                            disabled
                            className="bg-slate-200 text-slate-400 font-bold px-4 py-2 rounded-lg text-xs cursor-not-allowed shrink-0"
                          >
                            Coming Soon
                          </button>
                        ) : (
                          <button
                            onClick={() => onInquireCourse(course.name)}
                            className="bg-[#F4A62A] hover:bg-orange-500 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs shadow-xs hover:shadow transition-all pointer-events-auto shrink-0 cursor-pointer"
                          >
                            Book Saturday Trial Class
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
          )}
          
          {upcomingCourses.length > 0 && (
            <div className="mt-16 space-y-8" id="upcoming-courses-list">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center space-x-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1 mb-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Coming Soon</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl text-[#1763B6]">Upcoming Courses</h2>
              </div>
              {upcomingCourses.map((course) => {
                const isExpanded = expandedSyllabusId === course.id;
              
              return (
                <div 
                  key={course.id}
                  id={`course-card-${course.id}`}
                  className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? 'border-[#277EDC]/40 shadow-md ring-2 ring-[#277EDC]/5' 
                      : 'border-slate-100 hover:border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Upper Flex Card Grid */}
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left details info (Name, rating, descriptors) */}
                    <div className="md:col-span-8 space-y-4" id={`course-info-block-${course.id}`}>
                      <div className="flex flex-wrap items-center gap-3.5">
                        <div className="p-3 bg-[#1763B6]/5 rounded-xl border border-[#1763B6]/15">
                          {getIcon(course.code)}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            SAP {course.category}
                          </span>
                          <h3 className="font-display font-extrabold text-slate-800 text-lg sm:text-xl">
                            {course.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                        {course.description}
                      </p>

                      {/* Course highlights */}
                      {course.fullDetails && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500" id={`highlights-${course.id}`}>
                          {course.fullDetails.map((det, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{det}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Right side stats & action controls */}
                    <div className="md:col-span-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100 space-y-4 text-xs sm:text-sm" id={`course-meta-block-${course.id}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {course.duration}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Skill Level:</span>
                          <span className="font-semibold text-slate-700 bg-[#1763B6]/10 text-[#1763B6] px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-sans">
                            {course.level}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sandbox Practice:</span>
                          <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <BookOpenCheck className="w-3.5 h-3.5" />
                            24/7 Cloud access
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Satisfaction Score:</span>
                          <span className="font-bold text-orange-500 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {course.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        <button
                          onClick={() => setExpandedSyllabusId(isExpanded ? null : course.id)}
                          className="w-full text-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer pointer-events-auto"
                          id={`btn-toggle-syllabus-${course.id}`}
                        >
                          <span>{isExpanded ? 'Hide Syllabus' : 'Explore Syllabus'}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'].includes(course.id) ? (
                          <button
                            disabled
                            className="w-full text-center bg-slate-200 text-slate-400 font-semibold py-2.5 rounded-lg text-xs cursor-not-allowed"
                            id={`btn-courses-inquire-${course.id}`}
                          >
                            Coming Soon
                          </button>
                        ) : (
                          <button
                            onClick={() => onInquireCourse(course.name)}
                            className="w-full text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-2.5 rounded-lg text-xs shadow-xs hover:shadow transition-colors cursor-pointer pointer-events-auto"
                            id={`btn-courses-inquire-${course.id}`}
                          >
                            Inquire Now
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Expanded Detailed Syllabus Section */}
                  {isExpanded && (
                    <div className="bg-[#1763B6]/5 border-t border-slate-100 p-6 md:p-8 space-y-4" id={`syllabus-drawer-${course.id}`}>
                      <div className="flex items-center gap-2 text-slate-800 font-display font-semibold text-sm">
                        <BookOpen className="w-5 h-5 text-[#1763B6]" />
                        <span>Syllabus breakdown for configuration cohorts</span>
                      </div>
                      
                      {course.syllabus ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id={`syllabus-list-${course.id}`}>
                          {course.syllabus.map((topic, i) => (
                            <div key={i} className="bg-white p-3.5 rounded-lg border border-slate-100 text-xs flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-[#1763B6]/10 text-[#1763B6] font-display font-extrabold text-[10px] flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span className="text-slate-600 font-medium">{topic}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No syllabus breakdown mapped for this specific flexible entry level cohort.</p>
                      )}

                      <div className="p-4 bg-white/70 rounded-xl border border-dashed border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                        <div className="space-y-0.5 text-center sm:text-left">
                          <span className="font-bold text-slate-700 block">Need a Custom Saturday Batch schedule?</span>
                          <p className="text-slate-500 text-[11px]">Tell us your background and we will propose custom timing sessions.</p>
                        </div>
                        {['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'].includes(course.id) ? (
                          <button
                            disabled
                            className="bg-slate-200 text-slate-400 font-bold px-4 py-2 rounded-lg text-xs cursor-not-allowed shrink-0"
                          >
                            Coming Soon
                          </button>
                        ) : (
                          <button
                            onClick={() => onInquireCourse(course.name)}
                            className="bg-[#F4A62A] hover:bg-orange-500 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs shadow-xs hover:shadow transition-all pointer-events-auto shrink-0 cursor-pointer"
                          >
                            Book Saturday Trial Class
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          
            </div>
          )}
          </>

        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 space-y-4 max-w-md mx-auto shadow-xs" id="no-search-results">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-700">No Modules Match Your Term</h4>
              <p className="text-xs text-slate-500">We couldn't locate any courses matching "{searchQuery}". Try filtering with the category options above.</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-[#1763B6] hover:bg-[#277EDC] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer pointer-events-auto"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Course Inquiry Modal Dialogue */}
      {inquiryCourseName && (
        <div id="inquiry-popup-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div id="inquiry-popup-card" className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100">
            
            {/* Header */}
            <div className="bg-[#1763B6] text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-orange-400 font-medium" />
                <h3 className="font-semibold text-base sm:text-lg">Inquire Course Module</h3>
              </div>
              <button 
                onClick={onClearInquiry}
                className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer pointer-events-auto"
                aria-label="Close Inquiry popup"
                id="btn-close-inquiry"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Form Body */}
            <div className="p-6">
              {!inquirySubmitted ? (
                <form onSubmit={handleInquirySubmit} className="space-y-4" id="form-course-popup">
                  <p className="text-xs text-slate-500">
                    Register your intent for <strong className="text-slate-800 font-semibold">{inquiryCourseName}</strong>. Our counselors will call you on WhatsApp to map schedules.
                  </p>

                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Satya Prasad"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all py-2.5"
                      id="input-popup-name"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                      Active Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. satya@example.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all py-2.5"
                      id="input-popup-email"
                    />
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                      WhatsApp Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm font-medium">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        placeholder="7075999336"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg pl-11 pr-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all py-2.5"
                        id="input-popup-phone"
                      />
                    </div>
                  </div>

                  {/* Optional message input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                      Professional Background (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. MBA with 2 years general accounting experience..."
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all py-2"
                      id="input-popup-msg"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#1763B6] hover:bg-[#277EDC] text-white font-bold py-3 rounded-lg text-xs sm:text-sm shadow-xs hover:shadow transition-colors block cursor-pointer pointer-events-auto"
                      id="btn-submit-popup-inquiry"
                    >
                      Submit Syllabus Request
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-4" id="popup-success-view">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-100">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-lg">Inquiry Forwarded Successfully!</h4>
                    <p className="text-xs text-slate-500">
                      Thanks, <span className="font-medium text-slate-800">{inquiryName}</span>. Your brochure download request for <span className="font-semibold">{inquiryCourseName}</span> has been parsed.
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    A checklist and system log guide was sent to your email address: <span className="underline">{inquiryEmail}</span>. Our representative will ping you on +91 {inquiryPhone} to guide server setups.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
