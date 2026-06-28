import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="faq-accordion-list" className="space-y-3.5 max-w-3xl mx-auto">
      {items.map((item) => {
        const isOpen = openId === item.id;
        
        return (
          <div
            key={item.id}
            id={`faq-item-${item.id}`}
            className={`border rounded-xl transition-all duration-300 overflow-hidden bg-white ${
              isOpen 
                ? 'border-[#277EDC]/40 shadow-sm' 
                : 'border-slate-100 hover:border-slate-200 shadow-xs'
            }`}
          >
            {/* Header Trigger */}
            <button
              onClick={() => toggleAccordion(item.id)}
              className="w-full text-left px-5 py-4 sm:py-5 flex items-start gap-3.5 justify-between focus:outline-none select-none cursor-pointer pointer-events-auto"
              id={`faq-trigger-${item.id}`}
              aria-expanded={isOpen}
            >
              <div className="flex gap-2.5 items-start">
                <HelpCircle className="w-5 h-5 text-[#277EDC] shrink-0 mt-0.5" />
                <span className="font-display font-semibold text-slate-800 text-sm sm:text-base leading-tight">
                  {item.question}
                </span>
              </div>
              <div className="shrink-0 mt-0.5">
                <div className={`p-1 rounded-lg transition-all ${isOpen ? 'bg-[#1763B6]/5' : ''}`}>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#1763B6]' : ''
                    }`}
                  />
                </div>
              </div>
            </button>

            {/* Content Drawer */}
            <div
              id={`faq-content-${item.id}`}
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100 border-t border-slate-50' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 py-4 bg-slate-50/50 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
