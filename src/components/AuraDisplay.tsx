import { motion } from 'motion/react';
import React, { useId } from 'react';

interface AuraDisplayProps {
  colors: string[];
  shape: string;
}

export const AuraDisplay: React.FC<AuraDisplayProps> = ({ colors, shape }) => {
  const id = useId().replace(/:/g, ''); // Unique ID for SVG filters, safe for URLs
  const safeColors = [
    colors[0] || '#8B5CF6',
    colors[1] || '#F472B6',
    colors[2] || '#FBBF24',
  ];

  const renderAura = () => {
    switch (shape.toLowerCase()) {
      case 'blob':
        return <BlobAura colors={safeColors} id={id} />;
      case 'cloud':
        return <CloudAura colors={safeColors} id={id} />;
      case 'star':
        return <StarAura colors={safeColors} id={id} />;
      case 'wave':
        return <WaveAura colors={safeColors} id={id} />;
      case 'circle':
      default:
        return <CircleAura colors={safeColors} id={id} />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center group"
    >
      {/* Background ambient glow */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-colors duration-1000" 
        style={{ backgroundColor: safeColors[0] }} 
      />
      {renderAura()}
    </motion.div>
  );
};

// --- Production-Ready SVG Aura Styles ---

const BlobAura = ({ colors, id }: { colors: string[], id: string }) => (
  <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible absolute inset-0">
    <defs>
      <filter id={`blob-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise">
          <animate attributeName="baseFrequency" values="0.02;0.025;0.02" dur="15s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="15" />
      </filter>
    </defs>
    <motion.g filter={`url(#blob-${id})`}>
      <motion.circle cx="200" cy="200" r="90" fill={colors[0]}
        animate={{ cx: [200, 240, 160, 200], cy: [200, 160, 240, 200] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx="200" cy="200" r="100" fill={colors[1]}
        animate={{ cx: [200, 150, 250, 200], cy: [200, 250, 150, 200] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx="200" cy="200" r="80" fill={colors[2]}
        animate={{ cx: [200, 220, 180, 200], cy: [200, 180, 220, 200] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
    </motion.g>
  </svg>
);

const CloudAura = ({ colors, id }: { colors: string[], id: string }) => (
  <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible absolute inset-0">
    <defs>
      <filter id={`cloud-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="4" result="noise">
          <animate attributeName="baseFrequency" values="0.01;0.015;0.01" dur="20s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="20" />
      </filter>
    </defs>
    <motion.g filter={`url(#cloud-${id})`}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: '200px 200px' }}
    >
      <circle cx="200" cy="200" r="120" fill={colors[0]} opacity="0.8" />
      <circle cx="240" cy="160" r="100" fill={colors[1]} opacity="0.8" />
      <circle cx="160" cy="240" r="90" fill={colors[2]} opacity="0.8" />
    </motion.g>
  </svg>
);

const StarAura = ({ colors, id }: { colors: string[], id: string }) => (
  <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible absolute inset-0">
    <defs>
      <filter id={`star-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.08 0.008" numOctaves="3" result="noise">
          <animate attributeName="baseFrequency" values="0.08 0.008; 0.1 0.01; 0.08 0.008" dur="10s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <radialGradient id={`grad-${id}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={colors[2]} />
        <stop offset="50%" stopColor={colors[1]} />
        <stop offset="100%" stopColor={colors[0]} />
      </radialGradient>
    </defs>
    <motion.g filter={`url(#star-${id})`}
      animate={{ rotate: [0, -360] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: '200px 200px' }}
    >
      <circle cx="200" cy="200" r="100" fill={`url(#grad-${id})`} />
    </motion.g>
    <circle cx="200" cy="200" r="40" fill="#fff" filter="blur(15px)" opacity="0.9" />
  </svg>
);

const WaveAura = ({ colors, id }: { colors: string[], id: string }) => (
  <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible absolute inset-0">
    <defs>
      <filter id={`wave-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise">
           <animate attributeName="baseFrequency" values="0.015;0.025;0.015" dur="12s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>
    <g filter={`url(#wave-${id})`}>
      <motion.circle cx="200" cy="200" r="40" fill="none" stroke={colors[0]} strokeWidth="30"
        animate={{ r: [40, 160], opacity: [1, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }} />
      <motion.circle cx="200" cy="200" r="40" fill="none" stroke={colors[1]} strokeWidth="30"
        animate={{ r: [40, 160], opacity: [1, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1.33 }} />
      <motion.circle cx="200" cy="200" r="40" fill="none" stroke={colors[2]} strokeWidth="30"
        animate={{ r: [40, 160], opacity: [1, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 2.66 }} />
      <circle cx="200" cy="200" r="60" fill={colors[0]} opacity="0.8" filter="blur(20px)" />
    </g>
  </svg>
);

const CircleAura = ({ colors, id }: { colors: string[], id: string }) => (
  <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible absolute inset-0">
    <defs>
      <filter id={`circle-${id}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="25" result="blur" />
      </filter>
      <linearGradient id={`grad-circle-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={colors[0]} />
        <stop offset="50%" stopColor={colors[1]} />
        <stop offset="100%" stopColor={colors[2]} />
      </linearGradient>
    </defs>
    <motion.g filter={`url(#circle-${id})`}
      animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, 180, 360] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '200px 200px' }}
    >
      <circle cx="200" cy="200" r="120" fill={`url(#grad-circle-${id})`} opacity="0.9" />
    </motion.g>
    <motion.circle cx="200" cy="200" r="90" fill="#fff" opacity="0.3" filter="blur(20px)"
      animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
  </svg>
);
