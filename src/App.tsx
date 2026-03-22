import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { analyzeMood, MoodAnalysis } from './lib/gemini';
import { audioEngine } from './lib/audio';
import { AuraDisplay } from './components/AuraDisplay';
import { VibeCard } from './components/VibeCard';
import { ConfettiBackground } from './components/ConfettiBackground';
import { SplashScreen } from './components/SplashScreen';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';

const SUGGESTIONS = [
  "Floating on a cloud ☁️",
  "A bit chaotic today 🌪️",
  "Peaceful and quiet 🌿",
  "Ready to conquer the world 🚀"
];

const LOADING_MESSAGES = [
  "Tuning into your frequency...",
  "Consulting the cosmos...",
  "Mixing your aura colors...",
  "Translating your vibe..."
];

import { HackathonCredits } from './components/HackathonCredits';

export default function App() {
  const [mood, setMood] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [mood]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedMood = urlParams.get('mood');
    if (sharedMood) {
      setMood(sharedMood);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    } else {
      setLoadingTextIdx(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeMood(mood);
      setResult(analysis);
      audioEngine.playVibe(analysis.sound_profile);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('API Key')) {
        setError(err.message);
      } else {
        setError('Failed to read your vibe. Try again?');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('mood', encodeURIComponent(mood));
    
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: 'My AI Aura',
          text: `My current vibe is "${result.vibe_title}"! 🌈\n\n${result.vibe_description}\n\nDiscover your aura:`,
          url: url.toString(),
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share is cancelled or fails
        console.log('Native share failed or cancelled, falling back to clipboard');
      }
    }

    try {
      await navigator.clipboard.writeText(url.toString());
      setToast('Vibe URL copied to clipboard!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
      setToast('Failed to copy URL');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMood('');
    audioEngine.stopAll();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mood.trim() && !isAnalyzing) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioEngine.setMuted(newMuted);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Brand Logo */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50">
          <a href="/" className="group relative inline-block" aria-label="moodinal home">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-violet-600">
              moodinal
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-violet-600 rounded-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </a>
        </div>

        {/* Audio Toggle */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors z-50 hard-shadow-sm"
      >
        {isMuted ? <VolumeX size={24} className="text-slate-600" /> : <Volume2 size={24} className="text-slate-600" />}
      </button>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl text-center z-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 text-slate-800">
              What's Your <span className="squiggle-underline">Vibe?</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-12 font-medium px-4">
              Type your feelings, get a color-coded aura, sound, and personalized vibe reading.
            </p>

            <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto w-full px-2 sm:px-0">
              <div className={`relative rounded-2xl hard-shadow bg-white overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-violet-500/50 ${isAnalyzing ? 'scanning-bg' : ''}`}>
                <textarea
                  ref={textareaRef}
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="I'm feeling a bit like a floating cloud..."
                  disabled={isAnalyzing}
                  rows={1}
                  aria-label="Describe your mood"
                  className="w-full pl-5 pr-[110px] sm:pl-8 sm:pr-[140px] py-4 sm:py-6 text-lg sm:text-xl bg-transparent outline-none placeholder:text-slate-400 disabled:opacity-50 resize-none overflow-hidden min-h-[60px] sm:min-h-[76px]"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !mood.trim()}
                  aria-label="Reveal my vibe"
                  className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[44px] sm:h-[52px]"
                >
                  {isAnalyzing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Sparkles size={20} className="sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Reveal</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-pink-500 mt-4 font-bold" role="alert">{error}</p>
              )}
              {isAnalyzing && (
                <motion.p
                  key={loadingTextIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-violet-500 mt-4 font-medium"
                >
                  {LOADING_MESSAGES[loadingTextIdx]}
                </motion.p>
              )}
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6 px-4">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setMood(s)}
                  disabled={isAnalyzing}
                  className="text-sm px-4 py-2 rounded-full bg-white/60 hover:bg-white border border-slate-200 text-slate-600 transition-colors disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result-section"
            className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10"
          >
            <ConfettiBackground />
            
            <div className="h-[400px] lg:h-[600px] flex items-center justify-center relative">
              <AuraDisplay colors={result.color_palette} shape={result.aura_shape} />
            </div>

            <div className="flex flex-col gap-8">
              <VibeCard
                title={result.vibe_title}
                description={result.vibe_description}
                colors={result.color_palette}
                onShare={handleShare}
              />
              
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-800 font-bold underline decoration-2 underline-offset-4 transition-colors self-center lg:self-start"
              >
                Read another vibe
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      <HackathonCredits />
    </>
  );
}
