import React, { useState } from 'react';
import { useServerAccessConfig } from '../hooks/useServerAccessConfig';
import { useBrandingConfig } from '../hooks/useBrandingConfig';
import { Server, CheckCircle2, ChevronDown, ChevronUp, MessageSquare, Phone, Mail } from 'lucide-react';
import ServerAccessEnquiryForm from '../components/ServerAccessEnquiryForm';

export default function ServerAccess() {
  const { config, loading } = useServerAccessConfig();
  const { config: brandingConfig } = useBrandingConfig();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!config) return <div className="p-12 text-center">Loading Server Configuration...</div>;

  const handleEnquirySuccess = () => {
    alert("Enquiry submitted successfully! We will contact you soon.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1763B6] to-[#0A3D78] text-white py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/30 border border-blue-400/30 rounded-full text-blue-100 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
             <Server className="w-3.5 h-3.5" /> SAP Server Access
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold tracking-tight mb-5 leading-tight">
            {config.hero.title}
          </h1>
          <p className="text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {config.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="#plans" className="inline-flex items-center justify-center px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30">
              View Access Plans
            </a>
            <a href="#contact" className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl backdrop-blur-md transition-all border border-white/20">
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* Server Details */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-xs font-bold text-slate-500 uppercase">Version</p>
               <p className="font-bold text-slate-800 mt-1">{config.serverDetails.version}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-xs font-bold text-slate-500 uppercase">Landscape</p>
               <p className="font-bold text-slate-800 mt-1">{config.serverDetails.landscape}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-xs font-bold text-slate-500 uppercase">Access</p>
               <p className="font-bold text-slate-800 mt-1">{config.serverDetails.accessType}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-xs font-bold text-slate-500 uppercase">Availability</p>
               <p className="font-bold text-slate-800 mt-1">{config.serverDetails.availability}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl col-span-2">
               <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                 <p className="font-bold text-slate-800">{config.serverDetails.status}</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Access Plans — India</h2>
            <p className="text-slate-500 mt-3 text-sm max-w-xl mx-auto">Choose a plan that fits your practice schedule.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {config.indianPricing.sort((a,b) => a.order - b.order).map(plan => (
               <div key={plan.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col text-center">
                 <h3 className="font-bold text-slate-800 text-xl">{plan.duration}</h3>
                 <p className="text-3xl font-extrabold text-[#1763B6] my-4">{plan.price}</p>
                 <p className="text-sm text-slate-500 mb-6 flex-1">{plan.description}</p>
                 <a href="#enquire" className="w-full py-3 bg-[#1763B6] hover:bg-[#145096] text-white font-bold rounded-lg transition-colors">Select Plan</a>
               </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Access Plans — International</h2>
            <p className="text-slate-500 mt-3 text-sm max-w-xl mx-auto">Pricing in USD for international learners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {config.internationalPricing.sort((a,b) => a.order - b.order).map(plan => (
               <div key={plan.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col text-center">
                 <h3 className="font-bold text-slate-800 text-xl">{plan.duration}</h3>
                 <p className="text-3xl font-extrabold text-[#1763B6] my-4">{plan.price}</p>
                 <p className="text-sm text-slate-500 mb-6 flex-1">{plan.description}</p>
                 <a href="#enquire" className="w-full py-3 bg-[#1763B6] hover:bg-[#145096] text-white font-bold rounded-lg transition-colors">Select Plan</a>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight mb-6">Server Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="font-bold text-slate-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight mb-8">How it Works</h2>
            <div className="space-y-6">
              {[
                "Submit Enquiry with required plan",
                "Admin contacts you for verification",
                "Complete Payment via UPI or Bank Transfer",
                "Server Credentials Issued",
                "Start Practicing"
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1763B6] text-white font-bold flex items-center justify-center shrink-0">{idx + 1}</div>
                  <p className="font-semibold text-slate-700 mt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enquire & Payment Details */}
      <section id="enquire" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight mb-6">Request Server Access</h2>
             <ServerAccessEnquiryForm onSuccess={handleEnquirySuccess} />
          </div>
          <div id="contact" className="space-y-8">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
               <h3 className="text-xl font-bold text-slate-800 mb-6">Payment Details</h3>
               <div className="space-y-4">
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500 font-medium">UPI ID</span>
                   <span className="font-bold text-slate-800">{config.paymentDetails.upiId}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500 font-medium">Account Name</span>
                   <span className="font-bold text-slate-800">{config.paymentDetails.accountName}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-2">
                   <span className="text-slate-500 font-medium">Phone</span>
                   <span className="font-bold text-slate-800">{config.paymentDetails.phoneNumber}</span>
                 </div>
               </div>
               <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100 text-sm text-orange-800 font-medium leading-relaxed">
                 {config.paymentDetails.instructions}
                 <br/><br/>
                 {config.paymentDetails.activationNotes}
               </div>
             </div>

             <div className="bg-[#1763B6] p-8 rounded-3xl shadow-sm text-white">
               <h3 className="text-xl font-bold mb-6">Contact Support</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                   <Phone className="w-5 h-5 text-blue-200" />
                   <span className="font-medium">{brandingConfig?.primaryMobile}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <MessageSquare className="w-5 h-5 text-blue-200" />
                   <span className="font-medium">{brandingConfig?.whatsappNumber}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <Mail className="w-5 h-5 text-blue-200" />
                   <span className="font-medium">{brandingConfig?.supportEmail}</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">Server Access FAQ</h2>
          </div>
          <div className="space-y-4">
            {config.faq.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 pr-8">{item.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-5 border-t border-slate-100 text-slate-600 leading-relaxed text-sm bg-white">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
