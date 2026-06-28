import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] mb-8 pb-4 border-b border-slate-100">
            Privacy Policy
          </h1>
          
          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-800 prose-a:text-[#1763B6]">
            <p>Last updated: June 2026</p>
            
            <p>At Sri Vihaan Consulting, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, store, and safeguard the data you provide to us through our website, contact forms, and training inquiries.</p>

            <h3>Information We Collect</h3>
            <p>We collect information that you voluntarily provide to us when you interact with our services, specifically through our Book Free Demo form and contact forms:</p>
            <ul>
              <li><strong>Full Name</strong></li>
              <li><strong>Email Address</strong></li>
              <li><strong>WhatsApp Number</strong></li>
              <li><strong>Preferred SAP Module</strong></li>
            </ul>

            <h3>How We Use Your Information</h3>
            <p>Your information is strictly used for the following purposes:</p>
            <ul>
              <li>Demo session scheduling.</li>
              <li>Course enquiries.</li>
              <li>Student communication.</li>
              <li>Training updates.</li>
            </ul>

            <h3>Data Storage and Security</h3>
            <p>We implement robust technical and organizational measures to protect your personal data. Personal information is never sold. Personal information is never shared with third parties for marketing. Information is securely handled.</p>

            <h3>Third-Party Services</h3>
            <p>We may use trusted third-party services such as Web3Forms for processing form submissions. These services are strictly used to facilitate communication and do not have the right to use your personal information for their own marketing purposes.</p>

            <h3>Your User Rights</h3>
            <p>You have the right to request access to, correction of, or deletion of your submitted information. You may also object to the processing of your personal data or request data portability.</p>

            <h3>Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:</p>
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
