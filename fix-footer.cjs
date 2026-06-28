const fs = require('fs');

let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

let newSections = `
          {/* Section 2: Company & Legal */}
          <div className="space-y-8" id="footer-company-legal">
            <div className="space-y-4">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider relative pb-1">
                Company
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#F4A62A]"></span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4 pt-2">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider relative pb-1">
                Legal
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#F4A62A]"></span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Training */}
          <div className="space-y-4" id="footer-training">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider relative pb-1">
              Training
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#F4A62A]"></span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Support */}
          <div className="space-y-4" id="footer-support">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider relative pb-1">
              Support
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#F4A62A]"></span>
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors pointer-events-auto">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors pointer-events-auto">
                  Contact Support
                </Link>
              </li>
              <li className="pt-2">
                <a href="tel:+91 70759 99336" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors pointer-events-auto pt-2 border-t border-[#145096]">
                  <Phone className="w-4 h-4 text-[#F4A62A] shrink-0" />
                  <span>+91 70759 99336</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@vihaanconsultancey.com" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors pointer-events-auto pb-4">
                  <Mail className="w-4 h-4 text-[#F4A62A] shrink-0" />
                  <span className="break-all">support@vihaanconsultancey.com</span>
                </a>
              </li>
            </ul>
          </div>
`;

let startIndex = content.indexOf('{/* Section 2: Quick Links */}');
let endIndex = content.indexOf('</div>\n\n        </div>\n      </div>\n\n      {/* Bottom Bar');
if (startIndex !== -1 && endIndex !== -1) {
    fs.writeFileSync('src/components/Footer.tsx', content.substring(0, startIndex) + newSections + content.substring(endIndex));
    console.log('Fixed Footer.tsx');
} else {
    console.log('Could not find Footer markers', startIndex, endIndex);
}
