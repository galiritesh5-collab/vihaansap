const fs = require('fs');
const path = require('path');

const reviewsPath = path.join(__dirname, 'src/pages/Reviews.tsx');
let content = fs.readFileSync(reviewsPath, 'utf8');

content = content.replace(
  'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" id="reviews-output-grid"',
  'className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8" id="reviews-output-grid"'
);

fs.writeFileSync(reviewsPath, content);
console.log('Updated Reviews.tsx layout');
