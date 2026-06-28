const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/placement support/ig, 'placement guidance');
  newContent = newContent.replace(/placement assistance/ig, 'placement guidance');
  newContent = newContent.replace(/placement services/ig, 'placement guidance');
  newContent = newContent.replace(/job placement/ig, 'placement guidance');

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
