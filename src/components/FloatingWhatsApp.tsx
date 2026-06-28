import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsApp() {
  const phoneNumber = '917075999336'; // +91 70759 99336
  const encodedText = encodeURIComponent('Hi, I want to know about SAP courses.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

  return (
    <div id="whatsapp-float-container" className="fixed bottom-6 right-6 z-50 group">
      {/* Alert tooltip suggestion */}
      <span 
        id="whatsapp-tooltip" 
        className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-medium border border-slate-800"
      >
        Chat on WhatsApp
      </span>
      
      {/* Pulse rings */}
      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25 scale-110"></div>
      
      {/* Real link */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="relative bg-emerald-500 hover:bg-emerald-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white pointer-events-auto"
        id="btn-whatsapp-floating"
        title="Chat on WhatsApp"
      >
        {/* Custom SVG icon reflecting the exact original WhatsApp styling, or a slick custom mix of MessageSquare */}
        <svg 
          className="w-7 h-7 fill-current" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.45 4.817 1.452 5.512 0 10.01-4.437 10.014-9.896.002-2.643-1.03-5.127-2.906-7.004C16.697 1.83 14.215.795 11.585.795 6.071.795 1.573 5.232 1.569 10.69c-.001 1.774.475 3.506 1.378 5.035l-.97 3.541 3.63-.952zm11.381-8.118c-.312-.156-1.85-.913-2.137-1.018-.287-.104-.497-.156-.707.156-.21.312-.813 1.018-.996 1.226-.183.208-.366.234-.678.078-1.787-.893-2.973-1.536-4.148-3.551-.104-.18-.104-.294.02-.412.112-.106.25-.294.375-.441.125-.147.167-.25.25-.417.083-.167.042-.312-.02-.469-.063-.156-.513-1.236-.703-1.691-.184-.445-.37-.384-.507-.391-.13-.007-.28-.007-.429-.007-.15 0-.393.056-.6.281-.207.225-.79.771-.79 1.879s.804 2.17 1.2 2.699c.396.529 1.637 2.5 3.965 3.506.554.24 1.122.383 1.503.498.557.177 1.064.152 1.465.093.447-.066 1.341-.548 1.531-1.077.19-.529.19-.982.133-1.077-.056-.095-.207-.151-.52-.307z"/>
        </svg>
      </a>
    </div>
  );
}
