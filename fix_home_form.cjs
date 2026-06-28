const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Remove state variables and submit handler
content = content.replace(/  \/\/ Mini contact form states[\s\S]*?const \[formError, setFormError\] = useState\(''\);\n/g, '');
content = content.replace(/  const handleMiniSubmit = async \([\s\S]*?  \};\n/g, '');

// 2. Replace the form with <FastInquiryForm />
const formStart = `            {!formSubmitted ? (`;
const formEnd = `              </div>\n            )}`;
// wait, the form block is quite large, let's replace by block
const contactTeaserRightRegex = /<div className="lg:col-span-7 p-8 sm:p-10" id="contact-teaser-right">[\s\S]*?<\/div>\n\n        <\/div>/g;
content = content.replace(contactTeaserRightRegex, `<div className="lg:col-span-7 p-8 sm:p-10" id="contact-teaser-right">
            <FastInquiryForm />
          </div>

        </div>`);

// 3. Add import
if (!content.includes("FastInquiryForm")) {
  content = content.replace("import TestimonialCard from '../components/TestimonialCard';", "import TestimonialCard from '../components/TestimonialCard';\nimport FastInquiryForm from '../components/FastInquiryForm';\nimport LeadCapturePopup from '../components/LeadCapturePopup';");
}

// 4. Mount LeadCapturePopup at the end of the container
if (!content.includes("<LeadCapturePopup />")) {
  content = content.replace("    </div>\n  );\n}\n", "      <LeadCapturePopup />\n    </div>\n  );\n}\n");
}

fs.writeFileSync('src/pages/Home.tsx', content);
console.log('Updated Home.tsx');
