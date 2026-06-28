const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  if (content.includes('Vihaan SIP')) {
    content = content.replace(/Vihaan SIP/g, 'Vihaan SAP');
    changed = true;
  }
  if (content.includes('VIHAAN SIP')) {
    content = content.replace(/VIHAAN SIP/g, 'VIHAAN SAP');
    changed = true;
  }
  if (content.includes('SIP Consultancy')) {
    content = content.replace(/SIP Consultancy/g, 'SAP Consultancy');
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
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.html') || fullPath.endsWith('.json')) {
      replaceInFile(fullPath);
    }
  }
}

walk('.');
