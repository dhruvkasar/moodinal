import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface VibeCardProps {
  title: string;
  description: string;
  colors: string[];
  onShare: () => void;
}

export const VibeCard: React.FC<VibeCardProps> = ({ title, description, colors, onShare }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, rotate: -5 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', bounce: 0.6, duration: 0.8, delay: 0.5 }}
      className="bg-white p-8 rounded-2xl hard-shadow max-w-md w-full mx-auto relative z-10"
    >
      <h2 className="text-3xl font-bold mb-4 text-slate-800 squiggle-underline inline-block">
        {title}
      </h2>
      <p className="text-slate-600 text-lg mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-3">
          {colors.map((color, i) => (
            <button
              key={i}
              onClick={() => handleCopyColor(color)}
              className="relative w-10 h-10 rounded-full hard-shadow-sm group transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
              style={{ backgroundColor: color }}
              aria-label={`Copy color ${color}`}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                {copiedColor === color ? <Check size={16} className="text-white" /> : <Copy size={16} className="text-white" />}
              </span>
              <AnimatePresence>
                {copiedColor === color && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -30 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute left-1/2 -translate-x-1/2 text-xs font-bold bg-slate-800 text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20"
                  >
                    Copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Click to copy hex
        </span>
      </div>

      <button
        onClick={onShare}
        className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold py-4 px-6 rounded-xl hard-shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
      >
        <Share2 size={20} />
        Share My Vibe
      </button>
    </motion.div>
  );
};
