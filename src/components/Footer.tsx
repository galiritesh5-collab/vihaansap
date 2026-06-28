import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, GraduationCap, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#0C3E7B] text-slate-300 border-t border-[#145096]">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" id="footer-grid">
          
          {/* Section 1: About */}
          <div className="space-y-4" id="footer-about">
            <Link to="/" className="flex items-center gap-2 group pointer-events-auto">
              <div className="bg-[#1763B6] p-2 rounded-lg text-white border border-[#1d3f66]">
                <GraduationCap className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-white tracking-tight">
                  SRI VIHAAN
                </span>
                <span className="text-[9px] font-semibold text-orange-500 tracking-widest uppercase">
                  CONSULTING
                </span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Achieve premier global ERP expertise. Sri Vihaan Consulting provides top-tier live online virtual classes, extensive sandbox practice servers, and strategic career mentorship led by experienced Real-Time Industry Experts.
            </p>

            <div className="flex items-center gap-3 pt-2" id="footer-socials">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-[#1763B6] hover:bg-[#F4A62A] hover:text-slate-900 text-slate-300 flex items-center justify-center transition-all duration-200 pointer-events-auto"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-[#1763B6] hover:bg-[#F4A62A] hover:text-slate-900 text-slate-300 flex items-center justify-center transition-all duration-200 pointer-events-auto"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-[#1763B6] hover:bg-[#F4A62A] hover:text-slate-900 text-slate-300 flex items-center justify-center transition-all duration-200 pointer-events-auto"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          
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
                  <Link to="/privacy-policy" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                    Refund Policy
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
{/*               <li>
                <Link to="/login" className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors block pointer-events-auto py-0.5">
                  Student Portal
                </Link>
              </li> */}
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
                <a href="tel:+917075999336" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors pointer-events-auto pt-2 border-t border-[#145096]">
                  <Phone className="w-4 h-4 text-[#F4A62A] shrink-0" />
                  <span>+91 70759 99336</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@srivihaanconsulting.com" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors pointer-events-auto pb-4">
                  <Mail className="w-4 h-4 text-[#F4A62A] shrink-0" />
                  <span className="break-all">info@srivihaanconsulting.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright and policies */}
      <div className="bg-[#091523] py-6 px-4 border-t border-[#122a46]/50 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left space-y-1">
            <p id="copyright-text">
              &copy; {currentYear} <strong>Sri Vihaan Consulting</strong>. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              SAP is a registered trademark of SAP SE. We are an independent skill enhancement consulting and training facility not affiliated directly with SAP SE corporation.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[11px]" id="footer-policy-links">
            <Link to="/terms-conditions" className="hover:text-white transition-colors pointer-events-auto">Terms & Conditions</Link>
            <span className="text-slate-800">|</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors pointer-events-auto">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
