import { useState } from 'react';
import { FAQS } from '../data';
import { FAQItem } from '../types';
import FAQAccordion from '../components/FAQAccordion';
import { Search, HelpCircle, BookOpen, Clock, Briefcase, Sparkles, Filter } from 'lucide-react';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'General' | 'Courses' | 'Schedule' | 'Careers'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter based on selected items
  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesKeyword = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesKeyword;
  });

  const categoriesColors = {
    General: 'bg-blue-50 border-blue-100 text-[#1763B6]',
    Courses: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    Schedule: 'bg-orange-50 border-orange-100 text-orange-700',
    Careers: 'bg-indigo-50 border-indigo-100 text-indigo-700'
  };

  return (
    <div id="faq-page-wrapper" className="space-y-12 py-12 md:py-16">
      
      {/* Header section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4" id="faq-hero">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] tracking-tight">
          Help Desk & Onboarding FAQ
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          Browse comprehensive guidelines regarding weekend batches, sandbox credentials, placement guidance, and target modules.
        </p>

        {/* Search controls inside page */}
        <div className="pt-6 max-w-xl mx-auto relative" id="faq-search-widget">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Type any keywords (e.g. coding, sandbox, timings)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-3 bg-white border border-slate-200 outline-none rounded-lg focus:shadow focus:ring-2 focus:ring-[#1763B6]/15 focus:border-[#1763B6] transition-all"
            id="input-faq-page-search"
          />
        </div>
      </section>

      {/* Categories filter layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="faq-categories-pills-section">
        <div className="flex flex-wrap items-center gap-2 justify-center max-w-xl mx-auto" id="faq-category-pills">
          {(['All', 'General', 'Courses', 'Schedule', 'Careers'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer pointer-events-auto ${
                activeCategory === cat
                  ? 'bg-[#1763B6] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
              }`}
              id={`pill-faq-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Output Render Accordion Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="faq-grid-output">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-6" id="faq-accordion-rendered">
            <FAQAccordion items={filteredFAQs} />
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 shadow-xs max-w-sm mx-auto" id="no-faq-matches">
            <div className="p-3 bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mt-3">No Help Guidelines Mapped</h4>
            <p className="text-xs text-slate-500 mt-1.5">No answers were located corresponding with "{searchTerm}". Reset the filters or submit a query on our contact page.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
              }}
              className="mt-4 bg-[#1763B6] hover:bg-[#277EDC] text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer pointer-events-auto"
            >
              Reset Search Parameters
            </button>
          </div>
        )}
      </section>

      {/* FAQ sidebar tips section */}
      <section className="bg-slate-50/50 border-t border-slate-100 py-12 mt-4" id="faq-trouble-info">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">Still Need Configuration or Syllabus Clarification?</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            We are dedicated to supporting candidate goals. Connect via WhatsApp directly or submit an official query catalog to get in touch with specialized SAP mentors.
          </p>
          <div className="flex justify-center gap-3" id="faq-support-actions">
            <a 
              href="tel:+917075999336" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors pointer-events-auto font-semibold"
            >
              Call support line
            </a>
            <a 
              href="mailto:info@srivihaanconsulting.com" 
              className="inline-flex items-center gap-1.5 text-xs text-[#1763B6] bg-[#1763B6]/5 px-4 py-2.5 rounded-lg hover:bg-[#1763B6]/10 transition-colors pointer-events-auto font-semibold"
            >
              Email counseling desk
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
