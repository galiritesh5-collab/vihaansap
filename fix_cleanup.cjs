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

const replacements = [
  [/Candidate \(In Placement Guidance & Guidance\)/g, 'Candidate (In Placement Guidance)'],
  [/No Guaranteed Placement Guidance/g, 'No Guaranteed Placements'],
  [/placement procedures/g, 'placement guidance'],
  [/accelerated their placement/g, 'accelerated their career'],
  [/placement mentorship help details/g, 'career mentorship help details']
];

processDirectory(path.join(__dirname, 'src'), replacements);
