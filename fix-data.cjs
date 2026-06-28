const fs = require('fs');

let content = fs.readFileSync('./src/data.ts', 'utf8');

// adding `isUpcoming: true`
content = content.replace(/id: 'sap-hcm',/, "id: 'sap-hcm',\n    isUpcoming: true,");
content = content.replace(/id: 'sap-basis',/, "id: 'sap-basis',\n    isUpcoming: true,");
content = content.replace(/id: 'sap-pp',/, "id: 'sap-pp',\n    isUpcoming: true,");
content = content.replace(/id: 'sap-successfactors',/, "id: 'sap-successfactors',\n    isUpcoming: true,");

fs.writeFileSync('./src/data.ts', content);
console.log('Fixed data.ts');
