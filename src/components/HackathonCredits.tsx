import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Instagram } from 'lucide-react';

interface Member {
  name: string;
  github: string;
  instagram: string;
}

const MEMBERS: Member[] = [
  {
    name: 'Aditya',
    github: 'https://github.com/adimestry',
    instagram: 'https://www.instagram.com/aditya_mestry_x007/',
  },
  {
    name: 'Dhruv',
    github: 'https://github.com/dhruvkasar',
    instagram: 'https://www.instagram.com/dhruvvkasar/',
  }
];

export const HackathonCredits: React.FC = () => {
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveMember(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMember = (name: string) => {
    setActiveMember(prev => prev === name ? null : name);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm border border-slate-200/50">
      <span>Built by</span>
      <div className="flex items-center gap-1.5">
        {MEMBERS.map((member, idx) => (
          <React.Fragment key={member.name}>
            <div className="relative">
              <button
                onClick={() => toggleMember(member.name)}
                className={`hover:text-violet-600 font-bold transition-colors ${activeMember === member.name ? 'text-violet-600' : 'text-slate-800'}`}
              >
                {member.name}
              </button>
              
              <AnimatePresence>
                {activeMember === member.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex items-center gap-1 bg-slate-900 text-white p-1.5 rounded-xl shadow-xl border border-slate-700"
                  >
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 hover:text-violet-400 rounded-lg transition-colors" aria-label={`${member.name} GitHub`}>
                      <Github size={18} />
                    </a>
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 hover:text-pink-400 rounded-lg transition-colors" aria-label={`${member.name} Instagram`}>
                      <Instagram size={18} />
                    </a>
                    {/* Little triangle pointer */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-b border-r border-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {idx < MEMBERS.length - 1 && <span className="text-slate-400">&amp;</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
