const fs = require('fs');

let content = fs.readFileSync('src/pages/Courses.tsx', 'utf8');

// The block to replace: From `{filteredCourses.length > 0 ? (` to `) : (`
let blockStart = content.indexOf('{filteredCourses.length > 0 ? (');
let blockEnd = content.indexOf(') : (', blockStart);
let block = content.slice(blockStart, blockEnd);

// Replace filteredCourses to activeCourses inside the active mapped block
let activeBlock = block.replace(/\{filteredCourses\.map/g, '{activeCourses.map');
activeBlock = activeBlock.replace('{filteredCourses.length > 0 ? (', '{activeCourses.length > 0 && (\n          <div className="space-y-8" id="courses-list-items">\n            {activeCourses.map');
// The original block has the <div className="space-y-8" id="courses-list-items"> right after the ternary.
activeBlock = activeBlock.substring(0, activeBlock.lastIndexOf('}')) + '}'; // Remove the end of ternary array

let upcomingBlock = activeBlock.replace(/\{activeCourses\.map/g, '{upcomingCourses.map');
upcomingBlock = upcomingBlock.replace(/\{activeCourses\.length > 0 && \(/g, '{upcomingCourses.length > 0 && (\n          <div className="mt-16 space-y-8" id="upcoming-courses-list">\n            <div className="text-center mb-8">\n              <h2 className="font-display font-extrabold text-2xl text-[#1763B6]">Upcoming Courses</h2>\n              <p className="text-slate-500 text-sm mt-2">Coming Soon</p>\n            </div>');

// let's just use string replacement
// Let's do it manually with file edits
