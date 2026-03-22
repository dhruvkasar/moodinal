import { motion } from 'motion/react';
import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Display for 3 seconds before fading out
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50"
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle background aura that blooms */}
      <motion.div
        className="absolute bg-violet-400/30 blur-[60px] rounded-full pointer-events-none"
        initial={{ width: 50, height: 50, opacity: 0 }}
        animate={{ width: 400, height: 200, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />

      {/* Professional Geometric Morphing Container */}
      <motion.div
        className="relative bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xl"
        initial={{ width: 12, height: 12, borderRadius: 6 }}
        animate={{ 
          width: ['12px', '280px', '280px'],
          height: ['12px', '12px', '88px'],
          borderRadius: ['6px', '6px', '24px']
        }}
        transition={{ 
          duration: 1.4, 
          times: [0, 0.4, 1], 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        {/* Text Reveal */}
        <motion.span
          className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          moodinal
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
