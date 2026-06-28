const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  if (content.includes('riteshagli45@gmail.com')) {
    content = content.replace(/riteshagli45@gmail\.com/g, 'info@srivihaanconsulting.com');
    changed = true;
  }
  if (content.includes('support@vihaanconsultancey.com')) {
    content = content.replace(/support@vihaanconsultancey\.com/g, 'info@srivihaanconsulting.com');
    changed = true;
  }
  if (content.includes('info@vihaansipconsultancy.com')) {
    content = content.replace(/info@vihaansipconsultancy\.com/g, 'info@srivihaanconsulting.com');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walk('src');
