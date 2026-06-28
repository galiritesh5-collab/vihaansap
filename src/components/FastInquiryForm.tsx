import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface FastInquiryFormProps {
  onSuccess?: () => void;
}

export default function FastInquiryForm({ onSuccess }: FastInquiryFormProps) {
  // Mini contact form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactModule, setContactModule] = useState('SAP FICO');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleMiniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setFormError('Please fill in Name, Email, and Phone number.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "5517e9dc-d32d-49db-b800-665bcb388ece";
    if (!accessKey || accessKey.trim() === '') {
      console.error("Missing Web3Forms Access Key.");
      setFormError('Configuration error. Please contact the administrator.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("access_key", accessKey.trim());
      formData.append("subject", "New Quick Support Preview Request");
      formData.append("from_name", "Sri Vihaan Consulting");
      formData.append("to_email", "info@srivihaanconsulting.com");
      formData.append("Full Name", contactName.trim());
      formData.append("Email Address", contactEmail.trim());
      formData.append("Phone Number", contactPhone.trim());
      formData.append("Selected SAP Module", contactModule);
      formData.append("Message", contactMessage.trim());
      formData.append("Date & Time of submission", new Date().toLocaleString());

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        if (data.message?.toLowerCase().includes("invalid form id") || data.message?.toLowerCase().includes("access key")) {
          setFormError('Configuration error. Please contact the administrator.');
        } else {
          setFormError('Something went wrong. Please try again later.');
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setFormError('Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {!formSubmitted ? (
        <form onSubmit={handleMiniSubmit} className="space-y-4" id="form-home-teaser">
          <h4 className="font-display font-bold text-slate-800 text-lg">
            Submit a Fast Inquiry
          </h4>
          <p className="text-xs text-slate-500">
            Fill in your academic or professional interest and get strategic guidance regarding sandbox server configurations.
          </p>
          {formError && (
            <div className="text-xs text-red-600 bg-red-50 p-2 text-center rounded-lg border border-red-100 font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Anand"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all"
                id="input-teaser-name"
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. anand@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all"
                id="input-teaser-email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                Phone (WhatsApp)
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="e.g. 7075999336"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all"
                id="input-teaser-phone"
              />
            </div>

            {/* Module Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
                Target Module
              </label>
              <select
                value={contactModule}
                onChange={(e) => setContactModule(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all"
                id="select-teaser-module"
              >
                <option value="SAP FICO">SAP FICO</option>
                <option value="SAP MM">SAP MM</option>
                <option value="SAP SD">SAP SD</option>
                <option value="SAP ABAP">SAP ABAP</option>
                <option value="SAP HCM" disabled className="text-slate-400">SAP HCM (Coming Soon)</option>
                <option value="SAP BASIS" disabled className="text-slate-400">SAP BASIS (Coming Soon)</option>
                <option value="SAP PP" disabled className="text-slate-400">SAP PP (Coming Soon)</option>
                <option value="SAP SuccessFactors" disabled className="text-slate-400">SAP SuccessFactors (Coming Soon)</option>
              </select>
            </div>
          </div>

          {/* Message text area */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">
              Your Message (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Describe your background context..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-200 outline-none rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6] transition-all min-h-[60px]"
              id="input-teaser-message"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-3 rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer pointer-events-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              id="btn-teaser-submit"
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </form>
      ) : (
        <div className="py-12 text-center space-y-4" id="teaser-success-card">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-lg">Inquiry Forwarded!</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Thank you <span className="font-semibold text-slate-800">{contactName}</span>. Your request for SAP training details regarding <span className="font-semibold text-[#1763B6]">{contactModule}</span> has been dispatched to our support advisors.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            An introduction catalog is already processing to your address: <span className="underline">{contactEmail}</span>.
          </p>
        </div>
      )}
    </div>
  );
}
