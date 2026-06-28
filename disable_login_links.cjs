const fs = require('fs');

// 1. Edit Navbar.tsx
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
const searchNav1 = `              <Link
                to="/login"
                className="px-5 py-2.5 text-xs font-semibold text-[#1763B6] border-2 border-[#1763B6] rounded-full hover:bg-slate-50 transition-all pointer-events-auto"
                id="btn-nav-login"
              >
                Student Login
              </Link>`;
navbar = navbar.replace(searchNav1, `{/* ${searchNav1} */}`);

const searchNav2 = `              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold text-sm py-2.5 rounded-lg shadow-sm transition-colors block pointer-events-auto"
                id="btn-mobile-login"
              >
                Student Login
              </Link>`;
navbar = navbar.replace(searchNav2, `{/* ${searchNav2} */}`);

fs.writeFileSync('src/components/Navbar.tsx', navbar);

// 2. Edit Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
const searchFooter = `                <Link to="/login" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                  Student Login
                </Link>`;
footer = footer.replace(searchFooter, `{/* ${searchFooter} */}`);
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log('Navbar and Footer updated');
