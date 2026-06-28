const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/VIHAAN SAP/g, 'SRI VIHAAN');
  newContent = newContent.replace(/CONSULTANCY/g, 'CONSULTING');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath}`);
  }
}

const files = [
  'src/pages/StudentDashboard.tsx',
  'src/components/Footer.tsx',
  'src/components/Navbar.tsx'
];

for (const file of files) {
  replaceInFile(path.join(__dirname, file));
}
