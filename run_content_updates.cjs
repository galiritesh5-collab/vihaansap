const fs = require('fs');
const path = require('path');

// 1. Branding replacements
function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  for (const [regex, replacement] of replacements) {
    newContent = newContent.replace(regex, replacement);
  }
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(directory, replacements) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, replacements);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath, replacements);
    }
  }
}

const globalReplacements = [
  [/Vihaan SAP Consultancy/g, 'Sri Vihaan Consulting'],
  [/Vihaan SAP Consulting/g, 'Sri Vihaan Consulting'],
  [/\bVihaan Learning Portal\b/g, 'Sri Vihaan Consulting Learning Portal'],
  [/\bWhy Choose Vihaan SAP\b/g, 'Why Choose Sri Vihaan Consulting'],
  [/\bVihaan SAP\b/g, 'Sri Vihaan Consulting'],
  [/\bVihaan was key\b/g, 'Sri Vihaan Consulting was key'],
  [/\bVihaan\b/g, 'Sri Vihaan Consulting'],
  [/\bGRADUATE\b/g, 'CONSULTANT'],
  [/\bGraduate\b/g, 'Consultant'],
  [/Placement Support/g, 'Placement Guidance'],
  [/Placement Assistance/g, 'Placement Guidance'],
  [/Placement Services/g, 'Placement Guidance'],
  [/Job Placement/g, 'Placement Guidance'],
  [/Our 5-Step Learning Roadmap/g, 'Strategic Placement Preparation'],
  [/We leverage an organized system to transform business beginners into confident, high-performing corporate SAP consultants\./g, 'Optimize your professional profile, attend dummy mock interviews, receive guidance on active corporate job opportunities, and prepare confidently for interviews through structured placement guidance.']
];

processDirectory(path.join(__dirname, 'src'), globalReplacements);

// 2. Edit Reviews.tsx
const reviewsPath = path.join(__dirname, 'src/pages/Reviews.tsx');
let reviewsContent = fs.readFileSync(reviewsPath, 'utf8');

reviewsContent = reviewsContent.replace('Student Reviews & Placement Stories', 'Student Reviews & Success Stories');
reviewsContent = reviewsContent.replace('Our graduates are thriving within critical configuration roles in companies like Accenture, Capgemini, Tata Consultancy Services, and Tech Mahindra. Read their testimonials below.', 'Read their testimonials below.');
reviewsContent = reviewsContent.replace('grid-cols-1 sm:grid-cols-3 gap-4', 'grid-cols-1 sm:grid-cols-2 gap-4');
// Remove the verified placements block
reviewsContent = reviewsContent.replace(/<div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col justify-center items-center">\s*<span className="text-3xl font-display font-extrabold text-\[#1763B6\]">500\+<\/span>\s*<span className="text-emerald-500 font-bold text-xs mt-1">Verified Placements<\/span>\s*<span className="text-\[11px\] font-semibold text-slate-400 mt-2 uppercase tracking-wide">Trained Candidates<\/span>\s*<\/div>/, '');

fs.writeFileSync(reviewsPath, reviewsContent);

// 3. Edit data.ts for designations
const dataPath = path.join(__dirname, 'src/data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// For all other reviews, clear designation. For Pooja Reddy, set to SAP FI Consultant
dataContent = dataContent.replace(/designation: 'Senior Financial Analyst at Accenture'/g, "designation: ''");
dataContent = dataContent.replace(/designation: 'SAP Developer at Tech Mahindra'/g, "designation: ''");
dataContent = dataContent.replace(/designation: 'Logistics Analyst at Capgemini'/g, "designation: ''");
dataContent = dataContent.replace(/designation: 'HRIS Specialist at Infosys'/g, "designation: 'SAP FI Consultant'");

fs.writeFileSync(dataPath, dataContent);

// 4. Edit TestimonialCard.tsx to remove Building2 icon
const cardPath = path.join(__dirname, 'src/components/TestimonialCard.tsx');
let cardContent = fs.readFileSync(cardPath, 'utf8');
cardContent = cardContent.replace(/<Building2 className="w-3 h-3 text-slate-300 shrink-0" \/>/g, '');
fs.writeFileSync(cardPath, cardContent);

// 5. Update DemoModal.tsx / Contact form or whatever has "Thank you for booking a demo session"
const demoModalPath = path.join(__dirname, 'src/components/DemoModal.tsx');
let demoModalContent = fs.readFileSync(demoModalPath, 'utf8');
demoModalContent = demoModalContent.replace(/<p className="text-xs text-slate-400">\s*A calendar invitation with joining details has been sent to <span className="text-slate-500 underline font-medium">{email}<\/span>\. Our representative will contact you on \+91 {phone} via WhatsApp for initial configurations guidance\.\s*<\/p>/, '<p className="text-xs text-slate-400">\n                Thank you for booking a demo session. Our team will contact you shortly regarding the schedule.\n              </p>');
fs.writeFileSync(demoModalPath, demoModalContent);

console.log("Completed specialized content updates.");
