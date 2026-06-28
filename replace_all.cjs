const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // 1. Email Updates
  const emailRegex = /riteshgali45@gmail\.com/g;
  if (emailRegex.test(content)) {
    content = content.replace(emailRegex, 'info@srivihaanconsulting.com');
    changed = true;
  }

  // 2. Phone Updates
  // Phone formats seen: +91 70759 99336, +91 70759 99336, 917075999336, +91 70759 99336
  const phoneFormats = [
    { regex: /\+91\s*99080\s*00245/g, replacement: '+91 70759 99336' },
    { regex: /\+91 70759 99336/g, replacement: '+917075999336' },
    { regex: /917075999336/g, replacement: '917075999336' },
    { regex: /\+91\s*XXXXX\s*XXXXX/g, replacement: '+91 70759 99336' },
  ];

  for (const pf of phoneFormats) {
    if (pf.regex.test(content)) {
      content = content.replace(pf.regex, pf.replacement);
      changed = true;
    }
  }
  
  // 3. Web3Forms Key Updates
  const web3FormsRegex1 = /const accessKey = import\.meta\.env\.VITE_WEB3FORMS_ACCESS_KEY;/g;
  if (web3FormsRegex1.test(content)) {
    content = content.replace(web3FormsRegex1, 'const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "5517e9dc-d32d-49db-b800-665bcb388ece";');
    changed = true;
  }
  
  const web3FormsRegex2 = /accessKey === "5517e9dc-d32d-49db-b800-665bcb388ece"/g;
  if (web3FormsRegex2.test(content)) {
    content = content.replace(web3FormsRegex2, 'accessKey === "5517e9dc-d32d-49db-b800-665bcb388ece"');
    changed = true;
  }
  
  if (content.includes('VITE_WEB3FORMS_ACCESS_KEY="5517e9dc-d32d-49db-b800-665bcb388ece"')) {
    content = content.replace('VITE_WEB3FORMS_ACCESS_KEY="YOUR_WEB3FORMS_ACCESS_KEY_HERE"', 'VITE_WEB3FORMS_ACCESS_KEY="5517e9dc-d32d-49db-b800-665bcb388ece"');
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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.html') || fullPath.endsWith('.json') || fullPath.endsWith('.env.example') || fullPath.endsWith('.cjs')) {
      replaceInFile(fullPath);
    }
  }
}

walk('.');
