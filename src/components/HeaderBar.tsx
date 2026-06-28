import { Mail, Phone, Facebook, Instagram, Linkedin, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function HeaderBar() {
  const [lang, setLang] = useState('English');
  const [langOpen, setLangOpen] = useState(false);

  const languages = ['English', 'हिन्दी (Hindi)', 'తెలుగు (Telugu)'];

  return (
    <div id="top-header" className="bg-[#1763B6] text-slate-100 text-xs py-2 px-4 sm:px-8 shadow-sm border-b border-slate-200/10 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        
        {/* Left Side: Contact Information */}
        <div id="header-contact" className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-medium">
          <a 
            href="mailto:info@srivihaanconsulting.com" 
            className="flex items-center gap-1.5 hover:text-[#F4A62A] opacity-90 hover:opacity-100 transition-colors pointer-events-auto"
            id="link-support-email"
          >
            ✉️ <span>info@srivihaanconsulting.com</span>
          </a>
          <a 
            href="tel:+917075999336" 
            className="flex items-center gap-1.5 hover:text-[#F4A62A] opacity-90 hover:opacity-100 transition-colors pointer-events-auto font-medium"
            id="link-support-phone"
          >
            📞 <span>+91 70759 99336</span>
          </a>
        </div>

        {/* Right Side: Language & Social Media Icons */}
        <div id="header-utilities" className="flex items-center gap-5 font-medium">
          {/* Language Selector */}
          <div className="relative" id="lang-selector">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 hover:text-[#F4A62A] transition-colors focus:outline-none pointer-events-auto py-0.5"
              id="lang-selector-button"
            >
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <span>{lang} ▼</span>
            </button>

            {langOpen && (
              <div 
                className="absolute right-0 mt-1.5 bg-[#1763B6] border border-slate-200/10 rounded-md shadow-lg py-1 w-36 z-50 text-slate-200"
                id="lang-dropdown-menu"
              >
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1a3d68] hover:text-white transition-colors block text-xs"
                    id={`lang-opt-${l.toLowerCase().replace(/[^a-z]/g, '')}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[#1A61B0] block">|</span>

          {/* Social Icons */}
          <div className="flex items-center gap-3.5" id="social-links-header">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-orange-400 transition-colors text-slate-300"
              title="Facebook"
              id="header-social-fb"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-orange-400 transition-colors text-slate-300"
              title="Instagram"
              id="header-social-ig"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-orange-400 transition-colors text-slate-300"
              title="LinkedIn"
              id="header-social-li"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
