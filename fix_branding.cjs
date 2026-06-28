const fs = require('fs');
const path = require('path');

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
  [/\bVihaan\b/g, 'Sri Vihaan Consulting']
];

processDirectory(path.join(__dirname, 'src'), globalReplacements);
