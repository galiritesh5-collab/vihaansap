import { X, CheckCircle, Calendar, Sparkles, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { SAP_COURSES } from '../data';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedModule, setSelectedModule] = useState('sap-fico');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form Validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!selectedModule) {
      setError('Please select a preferred SAP module.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "5517e9dc-d32d-49db-b800-665bcb388ece";
    if (!accessKey || accessKey.trim() === '') {
      console.error("Missing Web3Forms Access Key.");
      setError('Configuration error. Please contact the administrator.');
      setIsSubmitting(false);
      return;
    }

    try {
      const activeCourseName = SAP_COURSES.find(c => c.id === selectedModule)?.name || selectedModule;
      
      const formData = new FormData();
      formData.append("access_key", accessKey.trim());
      formData.append("subject", "New Book Free Demo Request");
      formData.append("from_name", "Sri Vihaan Consulting");
      formData.append("to_email", "info@srivihaanconsulting.com");
      formData.append("Full Name", name.trim());
      formData.append("Email Address", email.trim());
      formData.append("WhatsApp Number", phone.trim());
      formData.append("Preferred SAP Module", activeCourseName);
      formData.append("Date & Time of submission", new Date().toLocaleString());

      // Debug logging (excluding sensitive keys)
      console.log("Submitting Demo Form Request:");
      console.log("Endpoint:", "https://api.web3forms.com/submit");
      console.log("Payload:", {
        subject: "New Book Free Demo Request",
        from_name: "Sri Vihaan Consulting",
        to_email: "info@srivihaanconsulting.com",
        "Full Name": name.trim(),
        "Email Address": email.trim(),
        "WhatsApp Number": phone.trim(),
        "Preferred SAP Module": activeCourseName,
      });
      console.log("Access key present:", !!accessKey);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      console.log("Response HTTP Status:", response.status);

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data.success) {
        // Success handling
        setSubmitted(true);
      } else {
        if (data.message?.toLowerCase().includes("invalid form id") || data.message?.toLowerCase().includes("access key")) {
          setError('Configuration error. Please contact the administrator.');
        } else {
          setError('Something went wrong. Please try again later.');
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError('Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCourse = SAP_COURSES.find(c => c.id === selectedModule) || SAP_COURSES[0];

  const upcomingModules = ['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'];

  return (
    <div id="demo-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div 
        id="demo-modal-card" 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 modal-anim"
      >
        {/* Modal Header */}
        <div className="bg-[#1763B6] text-white px-6 py-4 flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-lg" id="modal-title">Book a Free Live Demo</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
            id="btn-close-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4" id="form-book-demo">
              <p className="text-sm text-slate-500 mb-2">
                Join our next live instructor-led SAP session. See our training methodology and get sandbox server access guidance.
              </p>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100" id="form-error">
                  {error}
                </div>
              )}

              {/* Name field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all disabled:opacity-50"
                  id="input-demo-name"
                />
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all disabled:opacity-50"
                  id="input-demo-email"
                />
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Contact Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="7075999336"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    disabled={isSubmitting}
                    className="w-full text-sm border border-slate-200 outline-none rounded-lg pl-11 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all disabled:opacity-50"
                    id="input-demo-phone"
                  />
                </div>
              </div>

              {/* Select Module */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred SAP Module
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all disabled:opacity-50"
                  id="select-demo-module"
                >
                  {SAP_COURSES.map((course) => {
                    const isUpcoming = upcomingModules.includes(course.id);
                    return (
                      <option 
                        key={course.id} 
                        value={course.id} 
                        disabled={isUpcoming}
                        className={isUpcoming ? "text-slate-400" : ""}
                      >
                        {course.name}{isUpcoming ? " (Coming Soon)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F4A62A] hover:bg-orange-500 active:bg-orange-600 text-slate-900 font-semibold py-3 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 pointer-events-auto disabled:opacity-70 disabled:cursor-not-allowed"
                  id="btn-submit-demo"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Book Free Session Now'}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4" id="demo-success-view">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-100">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-lg">Demo Request Confirmed!</h4>
                <p className="text-sm text-slate-500">
                  Congratulations, <span className="font-medium text-slate-800">{name}</span>!
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Module:</span>
                  <span className="font-medium text-slate-700 text-right">{activeCourse.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Class Platform:</span>
                  <span className="font-medium text-slate-700">Google Meet (Live)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1 text-orange-600">
                    <Calendar className="w-3.5 h-3.5" /> Next Schedule:
                  </span>
                  <span className="font-semibold text-slate-800 bg-orange-50 px-2 py-0.5 rounded">
                    This Saturday, 7:30 PM
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Thank you for booking a demo session. Our team will contact you shortly regarding the schedule.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  onClose();
                }}
                className="mt-2 bg-[#1763B6] hover:bg-[#277EDC] text-white font-medium px-5 py-2 rounded-lg text-sm transition-all cursor-pointer pointer-events-auto"
                id="btn-demo-modal-ok"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
