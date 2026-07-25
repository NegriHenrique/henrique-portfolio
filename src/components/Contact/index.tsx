import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { dict } from '../../utils/i18n';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SOCIAL_LINKS = [
  { title: "LinkedIn", url: "https://www.linkedin.com/in/henrique-negri-rodrigues/", icon: <LinkedinIcon className="w-5 h-5" /> },
  { title: "WhatsApp", url: "https://wa.me/5521988036103", icon: <MessageCircle className="w-5 h-5" /> },
  { title: "E-mail", url: "mailto:henriquenegri83@gmail.com", icon: <Mail className="w-5 h-5" /> }
];

export function Contact() {
  const lang = useAppStore((s) => s.lang);

  return (
    <section id="contato" className="py-32 md:py-40 relative z-10 max-w-7xl mx-auto px-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* Coluna Esquerda: Chamada de Alto Impacto */}
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
            {dict[lang].contact.title1} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              {dict[lang].contact.title2}
            </span>
          </h2>
          
          <p className="mt-8 text-xl text-zinc-400 font-light max-w-md">
            {dict[lang].contact.description}
          </p>
          
          {/* Contatos Secundários (Pílulas Glassmorphic) */}
          <div className="flex flex-wrap gap-4 mt-12">
            {SOCIAL_LINKS.map((link, idx) => (
              <a 
                key={idx}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-3 font-medium group cursor-none"
              >
                <span className="text-zinc-400 group-hover:text-white transition-colors">
                  {link.icon}
                </span>
                <span className="tracking-wide">{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Coluna Direita: O Embed do Cal.com */}
        <div className="w-full bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-2xl relative overflow-hidden">
          <iframe 
            src="https://cal.com/henrique-negri?theme=dark" 
            width="100%" 
            height="600" 
            frameBorder="0" 
            className="rounded-xl overflow-hidden" 
            style={{ background: 'transparent' }}
            title="Agendar Reunião com Henrique Negri"
          ></iframe>
        </div>

      </div>

      {/* Rodapé Integrado (Footer) */}
      <div className="w-full border-t border-white/5 mt-32 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 font-mono uppercase tracking-widest gap-4 md:gap-0">
        <span>© {new Date().getFullYear()} Henrique Negri</span>
        <span>Local Time: BRT (UTC-3)</span>
      </div>

    </section>
  );
}