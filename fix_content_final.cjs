const fs = require('fs');
const path = require('path');

// 1. StatsCounter.tsx
const statsPath = path.join(__dirname, 'src/components/StatsCounter.tsx');
let statsContent = fs.readFileSync(statsPath, 'utf8');
statsContent = statsContent.replace(
  /{ id: 'experience', label: 'Avg Instructor Experience', target: 15, suffix: '\+ Yrs' }/,
  "{ id: 'experience', label: 'Years Experience', target: 15, suffix: '+' }"
);
fs.writeFileSync(statsPath, statsContent);
console.log('Updated StatsCounter.tsx');

// 2. Home.tsx
const homePath = path.join(__dirname, 'src/pages/Home.tsx');
let homeContent = fs.readFileSync(homePath, 'utf8');
// Change grid from lg:grid-cols-4 to lg:grid-cols-3
homeContent = homeContent.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="why-bento-grid"',
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="why-bento-grid"'
);
// Remove the specific card
const cardRegex = /\s*<div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">\s*<div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 mb-4 border border-orange-100">\s*<Server className="w-5 h-5" \/>\s*<\/div>\s*<h4 className="font-display font-bold text-slate-800 text-base mb-1.5">Real-Time Scenarios<\/h4>\s*<p className="text-xs sm:text-sm text-slate-500 leading-relaxed">\s*Practice configurations mapped to actual business blueprints, custom reports, and enterprise logistics situations\.\s*<\/p>\s*<\/div>/;
homeContent = homeContent.replace(cardRegex, '');
fs.writeFileSync(homePath, homeContent);
console.log('Updated Home.tsx');

// 3. data.ts
const dataPath = path.join(__dirname, 'src/data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');
// We want to remove Pooja Reddy completely.
// Since it's a JS array, we can use a regex to match the object.
const poojaRegex = /\s*\{\s*id: 'rev-4',\s*name: 'Pooja Reddy',[\s\S]*?designation: ''\s*\}(,?)/;
dataContent = dataContent.replace(poojaRegex, '');
fs.writeFileSync(dataPath, dataContent);
console.log('Updated data.ts');
