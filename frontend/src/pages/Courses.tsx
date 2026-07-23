import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Coins, Package, TrendingUp, Code, Users2, Shield, Wrench, Cloud, 
  Search, Star, Clock, Sparkles, Filter, ChevronDown, Check, Send, 
  BookOpen, PlayCircle, Info, BookOpenCheck, HelpCircle, X, CheckCircle, CheckCircle2
} from 'lucide-react';
import { useDB } from '../hooks/useDB';
import { SAPCourse } from '../types';

interface CoursesProps {
  onInquireCourse: (courseName: string) => void;
  inquiryCourseName: string | null;
  onClearInquiry: () => void;
}

export default function Courses({ onInquireCourse, inquiryCourseName, onClearInquiry }: CoursesProps) {
  const location = useLocation();
  const db = useDB();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
      const courseExist = db.courses.find(c => c.id === selectId);
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
  }, [location, db.courses]);

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
  // Only show published courses on the public page
  const filteredCourses = db.courses.filter(course => {
    if (course.status && !['Published', 'Live', 'Upcoming'].includes(course.status)) return false;
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (course.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.features && course.features.some((f: string) => f.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const activeCourses = filteredCourses.filter(c => c.status !== 'Upcoming' && !c.isUpcoming);
  const upcomingCourses = filteredCourses.filter(c => c.status === 'Upcoming' || c.isUpcoming);

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

  // Dynamically calculate categories
  const categories = ['All', ...Array.from(new Set(db.courses.map(c => c.category).filter(Boolean)))];

  const CourseCard: React.FC<{ course: SAPCourse }> = ({ course }) => {
    const isExpanded = expandedSyllabusId === course.id;
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (e: React.MouseEvent, sectionId: string) => {
      e.stopPropagation();
      setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    return (
      <div 
        id={`course-card-${course.id}`}
        className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden flex flex-col ${
          isExpanded 
            ? 'border-[#277EDC]/40 shadow-md ring-2 ring-[#277EDC]/5' 
            : 'border-slate-100 hover:border-slate-200 shadow-xs'
        }`}
      >
        {course.banner && (
          <div className="w-full h-32 sm:h-40 overflow-hidden border-b border-slate-100">
            <img src={course.banner} alt={course.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          <div className="md:col-span-8 space-y-4" id={`course-info-block-${course.id}`}>
            <div className="flex flex-wrap items-center gap-3.5">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
              ) : (
                <div className="p-3 bg-[#1763B6]/5 rounded-xl border border-[#1763B6]/15 shrink-0">
                  {getIcon(course.code)}
                </div>
              )}
              <div className="space-y-0.5">
                <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {course.tag || `SAP ${course.category}`}
                </span>
                <h3 className="font-display font-extrabold text-slate-800 text-lg sm:text-xl">
                  {course.name}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {course.description}
              </p>
              {isExpanded && course.longDescription && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl pt-2 border-t border-slate-50">
                  {course.longDescription}
                </p>
              )}
            </div>

            {/* Course Features */}
            {course.showFeatures !== false && course.features && course.features.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-full p-1 shrink-0">
<Check className="w-3 h-3 text-emerald-600" />
</div>
                      <span className="text-[11px] font-semibold text-slate-700 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            </div>

          <div className="md:col-span-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100 space-y-4 text-xs sm:text-sm" id={`course-meta-block-${course.id}`}>
            {course.showPricing !== false && course.originalFees && (
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-1 mb-4">
                {course.discountedFees && course.discountedFees < course.originalFees && (
                  <span className="text-slate-400 text-xs line-through font-semibold">{course.currency || '₹'}{course.originalFees.toLocaleString()}</span>
                )}
                <span className="font-display font-extrabold text-2xl text-slate-800">{course.currency || '₹'}{course.discountedFees ? course.discountedFees.toLocaleString() : course.originalFees.toLocaleString()}</span>
                {course.emiAvailable && <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">Flexible EMI Available</span>}
              </div>
            )}
            <div className="space-y-2">
              {course.showDuration !== false && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {course.duration}
                  </span>
                </div>
              )}
              {course.showSkillLevel !== false && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Skill Level:</span>
                  <span className="font-semibold text-slate-700 bg-[#1763B6]/10 text-[#1763B6] px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-sans">
                    {course.level}
                  </span>
                </div>
              )}
              {course.sandboxPractice && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Sandbox Practice:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1 text-right max-w-[150px]">
                    <BookOpenCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate" title={course.sandboxPractice}>{course.sandboxPractice}</span>
                  </span>
                </div>
              )}
              {course.showCertification !== false && course.certificationName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Certification:</span>
                  <span className="font-semibold text-slate-700 text-right max-w-[150px] truncate" title={course.certificationName}>
                    {course.certificationName}
                  </span>
                </div>
              )}
              {course.showRating !== false && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Satisfaction Score:</span>
                  <span className="font-bold text-orange-500 flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {Number(course.rating || 0).toFixed(1)} / 5.0
                  </span>
                </div>
              )}
            </div>

            {course.showButtons !== false && (
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => setExpandedSyllabusId(isExpanded ? null : course.id)}
                  className="w-full text-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer pointer-events-auto"
                  id={`btn-toggle-syllabus-${course.id}`}
                >
                  <span>{isExpanded ? 'Hide Syllabus' : (course.buttonExploreText || 'Explore Syllabus')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {course.buttonRegisterDisabled ? (
                  <button
                    disabled
                    className="w-full text-center bg-slate-200 text-slate-400 font-semibold py-2.5 rounded-lg text-xs cursor-not-allowed"
                  >
                    {course.buttonRegisterText || 'Coming Soon'}
                  </button>
                ) : (
                  <button
                    onClick={() => onInquireCourse(course.name)}
                    className="w-full text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-2.5 rounded-lg text-xs shadow-xs hover:shadow transition-colors cursor-pointer pointer-events-auto"
                  >
                    {course.buttonRegisterText || "Book Free Demo"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expanded Detailed Syllabus Section */}
        {isExpanded && (
          <div className="bg-[#1763B6]/5 border-t border-slate-100 p-6 md:p-8 space-y-4" id={`syllabus-drawer-${course.id}`}>
            {course.showSyllabus !== false && (
              <>
                <div className="flex items-center gap-2 text-slate-800 font-display font-semibold text-sm">
                  <BookOpen className="w-5 h-5 text-[#1763B6]" />
                  <span>Syllabus breakdown for configuration cohorts</span>
                </div>
            
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-3">
                {course.modules.map((module, mIdx) => {
                  const isModuleExpanded = expandedSections[`mod-${module.id || String(mIdx)}`];
                  return (
                    <div key={module.id || mIdx} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm transition-all">
                      <div 
                        className="bg-slate-50 hover:bg-slate-100 px-5 py-4 flex justify-between items-center cursor-pointer select-none transition-colors"
                        onClick={(e) => toggleSection(e, `mod-${module.id || String(mIdx)}`)}
                      >
                        <div className="flex-1 pr-4">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <span className="text-[#1763B6] bg-[#1763B6]/10 px-2 py-0.5 rounded text-[11px] font-extrabold uppercase shrink-0">Module {mIdx + 1}</span>
                            {module.name}
                          </h4>
                          {module.description && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{module.description}</p>}
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {(module.topics || []).length} Topics</span>
                            {module.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {module.duration}</span>}
                          </div>
                        </div>
                        <div className={`p-1.5 rounded-full bg-white border border-slate-200 shadow-xs transition-transform duration-300 shrink-0 ${isModuleExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      
                      {isModuleExpanded && module.topics && module.topics.length > 0 && (
                        <div className="px-5 py-4 border-t border-slate-100 bg-white">
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            {module.topics.map((topic, tIdx) => (
                              <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0 transition-colors group-hover:bg-[#1763B6]"></span>
                                <span className="leading-snug">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : course.syllabus ? (
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
            </>
            )}

            {/* Mentor Section */}
            {course.showMentor !== false && (course.mentorName || course.mentorBio) && (
              <div className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-start text-xs shadow-sm mt-6">
                {course.mentorPhoto && (
                  <img src={course.mentorPhoto} alt={course.mentorName} className="w-16 h-16 rounded-full object-cover shrink-0 border border-slate-100" />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">{course.mentorName}</h4>
                  {(course.mentorDesignation || course.mentorExperience) && (
                    <p className="text-[#1763B6] font-semibold">{course.mentorDesignation} {course.mentorExperience && `• ${course.mentorExperience}`}</p>
                  )}
                  {course.mentorBio && <p className="text-slate-500 leading-relaxed mt-1.5">{course.mentorBio}</p>}
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {course.showFAQ !== false && course.faqs && course.faqs.length > 0 && (
              <div className="space-y-3 pt-6 mt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-base">Frequently Asked Questions</h4>
                <div className="space-y-2">
                  {course.faqs.map((faq, idx) => {
                    const isFaqExpanded = expandedSections[`faq-${faq.id || String(idx)}`];
                    return (
                      <div key={faq.id || idx} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm transition-all">
                        <div 
                          className="px-4 py-3 flex justify-between items-center cursor-pointer select-none"
                          onClick={(e) => toggleSection(e, `faq-${faq.id || String(idx)}`)}
                        >
                          <p className="font-semibold text-slate-700 text-xs pr-4">{faq.question}</p>
                          <div className={`shrink-0 transition-transform duration-300 ${isFaqExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                        {isFaqExpanded && (
                          <div className="px-4 pb-4 pt-1 bg-white">
                            <p className="text-slate-500 text-xs leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {course.showReviews !== false && db.reviews && db.reviews.filter(r => r.module === course.name && r.status === 'Approved').length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm">Student Reviews</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {db.reviews.filter(r => r.module === course.name && r.status === 'Approved').map((review) => (
                    <div key={review.id} className="bg-white p-3 rounded-lg border border-slate-100 text-xs flex gap-3">
                      <img src={review.avatar} alt={review.name} className="w-8 h-8 rounded-full bg-slate-100" />
                      <div>
                        <p className="font-bold text-slate-700">{review.name}</p>
                        <div className="flex text-orange-400 my-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-300'}`} />
                          ))}
                        </div>
                        <p className="text-slate-500 italic mt-1 line-clamp-3">"{review.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.showUpcomingBatch !== false && (
              <div className="p-4 bg-white/70 rounded-xl border border-dashed border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <div className="space-y-0.5 text-center sm:text-left flex-1">
                  <span className="font-bold text-slate-700 block">{course.upcomingBatchesTitle || "Need a Custom Batch schedule?"}</span>
                  <p className="text-slate-500 text-[11px]">{course.upcomingBatchesSubtitle || "Tell us your background and we will propose custom timing sessions."}</p>
                  
                  {/* Real-time Dynamic Batches Render */}
                  {db.batches && db.batches.filter(b => b.course === course.name).length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {db.batches.filter(b => b.course === course.name).map((batch: any) => (
                        <div key={batch.id} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-lg">
                          <div>
                            <span className="font-semibold text-slate-700">{batch.name}</span>
                            <span className="ml-2 text-slate-500">{batch.startDate}</span>
                          </div>
                          <span className="text-[#1763B6] bg-[#1763B6]/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{batch.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {course.buttonRegisterDisabled ? (
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
                    Request Callback
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="courses-page-container" className="space-y-12 py-12 md:py-16">
      
      {/* Search and Headers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4" id="courses-header-section">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] tracking-tight">
          Explore Our Premium SAP Courses
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          We configure SAP4HANA environments and let SAP setup you configure candidates gain extensive system configuration experience under real industry settings.
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
              {activeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
          
          {upcomingCourses.length > 0 && (
            <div className="mt-16 space-y-8" id="upcoming-courses-list">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center space-x-2 bg-red-50 border border-red-100 rounded-full px-4 py-1 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Coming Soon</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl text-[#1763B6]">Upcoming Courses</h2>
              </div>
              {upcomingCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
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
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
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
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
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
                        className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg pl-11 pr-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
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
                      className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/10 focus:border-[#1763B6] transition-all"
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
