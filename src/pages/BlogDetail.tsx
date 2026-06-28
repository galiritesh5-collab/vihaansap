import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { BLOGS } from '../data/blogs';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const blog = BLOGS.find(b => b.slug === slug);

  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | Sri Vihaan Consulting`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', blog.preview);

      // Add Open Graph tags
      const addMetaTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      addMetaTag('og:title', blog.title);
      addMetaTag('og:description', blog.preview);
      addMetaTag('og:image', blog.image);
      addMetaTag('og:type', 'article');
    }
  }, [blog]);

  if (!blog) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back button */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-[#1763B6] transition-colors">Home</Link>
            <span>&gt;</span>
            <Link to="/blogs" className="hover:text-[#1763B6] transition-colors">Blogs</Link>
            <span>&gt;</span>
            <span className="text-slate-800 font-medium truncate">{blog.title}</span>
          </div>
          
          <Link to="/blogs" className="inline-flex items-center gap-2 text-[#1763B6] hover:text-[#104e92] font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Hero Image */}
          <div className="w-full h-64 md:h-[400px] relative">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content Wrapper */}
          <div className="p-6 md:p-10 lg:p-12">
            
            {/* Header */}
            <header className="mb-10 border-b border-slate-100 pb-8">
              <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-tight mb-6">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#F4A62A]" />
                  <span className="font-medium text-slate-700">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F4A62A]" />
                  <span>{blog.date}</span>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:text-slate-800 prose-h2:text-[#1763B6] prose-a:text-[#F4A62A] prose-li:marker:text-[#F4A62A]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
          </div>
        </article>
      </div>
    </div>
  );
}
