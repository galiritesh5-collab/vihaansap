import { Star, Quote, Building2 } from 'lucide-react';
import { StudentReview } from '../types';

interface TestimonialCardProps {
  review: StudentReview;
}

export default function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <div 
      id={`testimonial-card-${review.id}`}
      className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 relative h-full"
    >
      {/* Absolute quote background marker */}
      <span className="absolute top-4 right-4 text-slate-100 pointer-events-none" id={`quote-icon-${review.id}`}>
        <Quote className="w-12 h-12 rotate-180 opacity-50" />
      </span>

      <div className="space-y-4 relative z-10">
        {/* Rating stars */}
        <div className="flex gap-0.5" id={`stars-container-${review.id}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < review.rating ? 'text-[#F4A62A] fill-[#F4A62A]' : 'text-slate-200'}`} 
            />
          ))}
        </div>

        {/* Review Paragraph */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
          "{review.text}"
        </p>
      </div>

      {/* User Information header footer */}
      <div className="mt-6 flex items-center gap-3.5 border-t border-slate-50 pt-4" id={`user-info-${review.id}`}>
        <img 
          src={review.avatar} 
          alt={review.name}
          referrerPolicy="no-referrer"
          className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 shadow-sm shrink-0" 
          id={`avatar-${review.id}`}
        />
        <div className="min-w-0">
          <h5 className="font-display font-semibold text-slate-800 text-sm truncate leading-tight">
            {review.name}
          </h5>
          <span className="block text-[10px] text-orange-500 font-bold tracking-wider uppercase">
            {review.module}
          </span>
        </div>
      </div>
    </div>
  );
}
