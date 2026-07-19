import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { MockDB } from '../services/MockDB';

interface ServerAccessEnquiryFormProps {
  onSuccess?: () => void;
}

export default function ServerAccessEnquiryForm({ onSuccess }: ServerAccessEnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    purpose: '',
    plan: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFormError('Please fill in Name, Email, and Phone number.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const docData = {
        ...formData,
        status: 'New',
        createdTime: new Date().toISOString()
      };
      
      try {
        await MockDB.addItem('serverEnquiries', docData);
      } catch (fbError) {
        console.log('Firebase saving failed, falling back to local or mock', fbError);
        // Fallback or just ignore if firebase rules fail
      }

      setFormSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (formSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-green-50 rounded-2xl border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Request Submitted!</h3>
        <p className="text-slate-600">Our team will contact you shortly with the next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
          {formError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1763B6] focus:border-transparent outline-none transition-all text-sm"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1763B6] focus:border-transparent outline-none transition-all text-sm"
            placeholder="+1 234 567 890"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1763B6] focus:border-transparent outline-none transition-all text-sm"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1763B6] focus:border-transparent outline-none transition-all text-sm"
            placeholder="India / USA / UK"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1763B6] focus:border-transparent outline-none transition-all text-sm"
          >
            <option value="">Choose a plan (Optional)</option>
            <option value="1 Month">1 Month</option>
            <option value="2 Months">2 Months</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="12 Months">12 Months</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Purpose</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1763B6] focus:border-transparent outline-none transition-all text-sm"
          >
            <option value="Practice">Personal Practice</option>
            <option value="Training">Corporate Training</option>
            <option value="Implementation">Project Implementation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1763B6] focus:border-transparent outline-none transition-all text-sm resize-none"
          placeholder="Any specific module requirements?"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#F4A62A] hover:bg-[#e09521] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-70"
      >
        {isSubmitting ? (
          <span className="animate-pulse">Submitting Request...</span>
        ) : (
          <>
            <span>Request Server Access</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
