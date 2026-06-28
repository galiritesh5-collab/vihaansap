import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BLOGS } from '../data/blogs';

export default function Blogs() {
  useEffect(() => {
    document.title = "SAP Insights & Blogs | Sri Vihaan Consulting";
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] tracking-tight">
            SAP Insights & Blogs
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Stay updated with SAP trends, implementation guides, career insights, and SAP S/4HANA best practices.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {BLOGS.map((blog, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row"
            >
              <div className="relative w-full md:w-[35%] h-56 md:h-auto overflow-hidden shrink-0">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1 justify-center">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mb-3">
                  <span className="font-medium text-[#1763B6]">{blog.author}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="font-display font-bold text-slate-800 text-xl md:text-2xl leading-tight mb-4 group-hover:text-[#1763B6] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 flex-1">
                  {blog.preview}
                </p>
                <Link to={`/blogs/${blog.slug}`} className="inline-flex items-center gap-1.5 text-[#F4A62A] hover:text-[#d38b1e] font-semibold text-sm transition-colors mt-auto w-fit">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
