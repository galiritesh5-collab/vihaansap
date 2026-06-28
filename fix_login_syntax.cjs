const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');
content = content.replace(/\\\\\\`/g, '\\`'); // if there are any
content = content.replace(/\\\`/g, '\`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/pages/Login.tsx', content);
