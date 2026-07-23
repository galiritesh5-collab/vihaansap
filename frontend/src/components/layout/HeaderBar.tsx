import { Mail, Phone, Facebook, Instagram, Linkedin, Youtube, Twitter, MessageCircle, Send, Phone as PhoneIcon, Link2, Github, Layout, Pin } from 'lucide-react';

import { useBrandingConfig } from '../../hooks/useBrandingConfig';
import { useDB } from '../../hooks/useDB';

export default function HeaderBar() {
  
  const db = useDB();
  const { config: brandingConfig } = useBrandingConfig();

  

  return (
    <div id="top-header" className="bg-[#1763B6] text-slate-100 text-xs py-2.5 sm:py-2 shadow-sm border-b border-slate-200/10 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 sm:gap-2 px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Contact Information */}
        <div id="header-contact" className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-2 sm:gap-6 text-[12px] sm:text-xs font-medium w-full sm:w-auto">
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <a 
              href={`mailto:${brandingConfig?.supportEmail}`} 
              className="flex items-center gap-1.5 hover:text-[#F4A62A] opacity-90 hover:opacity-100 transition-colors pointer-events-auto"
              id="link-support-email"
            >
              <Mail className="w-3.5 h-3.5" /> <span>{brandingConfig?.supportEmail || 'info@srivihaanconsulting.com'}</span>
            </a>
            <a 
              href={`tel:${brandingConfig?.primaryMobile}`} 
              className="flex items-center gap-1.5 hover:text-[#F4A62A] opacity-90 hover:opacity-100 transition-colors pointer-events-auto font-medium"
              id="link-support-phone"
            >
              <Phone className="w-3.5 h-3.5" /> <span>{brandingConfig?.primaryMobile || '+91 70759 99336'}</span>
            </a>
          </div>
        </div>

        {/* Right Side: Language & Social Media Icons */}
        <div id="header-utilities" className="flex items-center justify-center w-full sm:w-auto gap-5 font-medium mt-1 sm:mt-0">
          

          {/* Social Icons */}
          <div className="flex items-center gap-3.5" id="social-links-header">
            {brandingConfig?.socialLinks.filter(s => s.enabled).sort((a, b) => a.order - b.order).map(social => {
                const getIcon = () => {
                  switch(social.platform) {
                    case 'Facebook': return <Facebook className="w-3.5 h-3.5" />;
                    case 'Instagram': return <Instagram className="w-3.5 h-3.5" />;
                    case 'LinkedIn': return <Linkedin className="w-3.5 h-3.5" />;
                    case 'YouTube': return <Youtube className="w-3.5 h-3.5" />;
                    case 'Twitter/X': return <Twitter className="w-3.5 h-3.5" />;
                    case 'Threads': return <MessageCircle className="w-3.5 h-3.5" />;
                    case 'Telegram': return <Send className="w-3.5 h-3.5" />;
                    case 'WhatsApp': return <PhoneIcon className="w-3.5 h-3.5" />;
                    case 'Discord': return <MessageCircle className="w-3.5 h-3.5" />;
                    case 'GitHub': return <Github className="w-3.5 h-3.5" />;
                    case 'Medium': return <Layout className="w-3.5 h-3.5" />;
                    case 'Pinterest': return <Pin className="w-3.5 h-3.5" />;
                    default: return <Link2 className="w-3.5 h-3.5" />;
                  }
                };
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-orange-400 transition-colors text-slate-300"
                    title={social.platform}
                  >
                    {getIcon()}
                  </a>
                );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
