const fs = require('fs');

let content = fs.readFileSync('src/pages/Courses.tsx', 'utf8');

// Find the map block from activeCourses.map to the end of the map
let mapStart = content.indexOf('{activeCourses.map((course) => {');
let mapEnd = content.indexOf('</div>\n        ) : (', mapStart);
let mapBlock = content.slice(mapStart, mapEnd);

let upcomingBlock = `
          )}
          
          {upcomingCourses.length > 0 && (
            <div className="mt-16 space-y-8" id="upcoming-courses-list">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center space-x-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1 mb-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Coming Soon</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl text-[#1763B6]">Upcoming Courses</h2>
              </div>
              ${mapBlock.replace(/activeCourses\.map/, 'upcomingCourses.map')}
            </div>
          )}
          </>
`;

let targetContent = mapBlock + '</div>';
let replacementContent = mapBlock + '</div>' + upcomingBlock;

fs.writeFileSync('src/pages/Courses.tsx', content.replace(targetContent, replacementContent));
console.log('Fixed Courses.tsx');
