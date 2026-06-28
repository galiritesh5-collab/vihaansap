import React from 'react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1763B6] mb-8 pb-4 border-b border-slate-100">
            Disclaimer
          </h1>
          
          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-800 prose-a:text-[#1763B6]">
            <p>Last updated: June 2026</p>

            <h3>Educational Purposes Only</h3>
            <p>The information, courses, and materials provided by Sri Vihaan Consulting are intended strictly for educational and training purposes. Our content is designed to help individuals learn SAP configuration, end-user processes, and related methodologies.</p>

            <h3>Trademark Acknowledgment</h3>
            <p>SAP, SAP S/4HANA, SAP FICO, and other SAP products and services mentioned herein as well as their respective logos are trademarks or registered trademarks of SAP SE (or an SAP affiliate company) in Germany and other countries. Sri Vihaan Consulting is an independent training and consulting provider and is not affiliated with, endorsed by, or sponsored by SAP SE.</p>

            <h3>No Guaranteed Placements</h3>
            <p>While we provide comprehensive training, resume building, interview preparation, and placement guidance, Sri Vihaan Consulting does not guarantee employment upon completion of any course. Training outcomes vary from person to person based on individual effort, prior background, and market conditions.</p>

            <h3>Information Accuracy</h3>
            <p>We strive to provide accurate, up-to-date information in our training materials and on our website. However, enterprise software environments change rapidly. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, or services contained on the website.</p>

            <h3>External Links Disclaimer</h3>
            <p>Through this website, you are able to link to other websites which are not under the control of Sri Vihaan Consulting. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>

            <h3>Contact Information</h3>
            <p>If you have any questions about this Disclaimer, please contact us at:</p>
            <ul>
              <li>Email: info@srivihaanconsulting.com</li>
              <li>Phone: +91 70759 99336</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
