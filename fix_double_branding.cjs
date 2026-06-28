const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/Sri Sri Vihaan Consulting Consulting/g, 'Sri Vihaan Consulting');
  newContent = newContent.replace(/Sri Sri Vihaan Consulting/g, 'Sri Vihaan Consulting');
  // Also fix "Placement Guidance or employment" issue from Disclaimer.tsx:
  // "does not guarantee placement guidance or employment" -> "does not guarantee employment"
  newContent = newContent.replace(/does not guarantee placement guidance or employment/g, 'does not guarantee employment');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
