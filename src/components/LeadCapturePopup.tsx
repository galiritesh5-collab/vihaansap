import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FastInquiryForm from './FastInquiryForm';

export default function LeadCapturePopup() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Close on escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    // Auto close after showing success message for a bit
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-colors z-10 cursor-pointer pointer-events-auto"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 sm:p-8">
          <FastInquiryForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
