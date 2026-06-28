import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] mb-8 pb-4 border-b border-slate-100">
            Refund Policy
          </h1>
          
          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-800 prose-a:text-[#1763B6]">
            <p>Last updated: June 2026</p>

            <p>At Sri Vihaan Consulting, we strive to ensure our students have a rewarding experience. However, we follow a <strong>Strict No Refund Policy</strong> for all our training programs.</p>

            <h3>Strict No Refund Policy</h3>
            <ul>
              <li>All course fees are non-refundable.</li>
              <li>Once a payment has been successfully made, no refund will be provided under any circumstances.</li>
              <li>Students are requested to carefully review the course details, curriculum, schedules, and attend the free demo session before making payment.</li>
              <li>Enrollment confirms acceptance of this policy.</li>
              <li>Failure to attend classes, personal reasons, schedule conflicts, change of career plans, or dissatisfaction after enrollment do not qualify for a refund.</li>
              <li>Sri Vihaan Consulting reserves the right to refuse refund requests once payment has been completed.</li>
              <li>By purchasing any training program, the student acknowledges and agrees to the No Refund Policy.</li>
            </ul>

            <h3>Contact Us</h3>
            <p>If you have any questions regarding our policy before enrolling, please contact our support team:</p>
            <ul>
              <li>Email: info@srivihaanconsulting.com</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
