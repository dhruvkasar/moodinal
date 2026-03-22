// Web Audio API Engine for Ambient Sounds

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.updateMuteState();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    this.updateMuteState();
  }

  private updateMuteState() {
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
    }
  }

  playTone(freq: number, type: OscillatorType, startTime: number, duration: number, volume: number = 0.1) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    // ADSR Envelope for a pleasant "chime" or "pad" sound
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + duration * 0.1); // Attack
    gain.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + duration * 0.4); // Decay
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Release

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playVibe(profile: string) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Define chords/arpeggios based on profile
    let notes: number[] = [];
    let type: OscillatorType = 'sine';
    let speed = 0.2;
    let duration = 3.0;
    let volume = 0.15;

    switch (profile.toLowerCase()) {
      case 'calm':
        notes = [261.63, 329.63, 392.00, 523.25]; // Cmaj7
        type = 'sine';
        speed = 0.4;
        duration = 4.0;
        break;
      case 'excited':
        notes = [440, 554.37, 659.25, 880, 1108.73]; // A major fast
        type = 'triangle';
        speed = 0.1;
        duration = 2.0;
        volume = 0.1;
        break;
      case 'sad':
        notes = [349.23, 311.13, 261.63, 174.61]; // F minor descending
        type = 'sine';
        speed = 0.6;
        duration = 5.0;
        break;
      case 'happy':
        notes = [523.25, 659.25, 783.99, 1046.50]; // C major high
        type = 'triangle';
        speed = 0.15;
        duration = 2.5;
        volume = 0.1;
        break;
      case 'mystical':
        notes = [293.66, 329.63, 415.30, 493.88, 587.33]; // D Lydian vibe
        type = 'sine';
        speed = 0.3;
        duration = 5.0;
        break;
      case 'energetic':
        notes = [220, 330, 440, 660, 880]; // A power chords
        type = 'square';
        speed = 0.1;
        duration = 1.5;
        volume = 0.03; // Square is loud
        break;
      default:
        notes = [261.63, 329.63, 392.00]; // C major
        type = 'sine';
    }

    // Play arpeggio
    notes.forEach((freq, i) => {
      this.playTone(freq, type, now + i * speed, duration, volume);
    });
    
    // Play a base chord softly underneath
    notes.slice(0, 3).forEach(freq => {
       this.playTone(freq / 2, 'sine', now, duration + notes.length * speed, volume * 0.4);
    });
  }

  stopAll() {
    // With ADSR, notes stop themselves, but we can suspend context if needed
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
      setTimeout(() => {
        if (this.ctx) this.ctx.resume();
      }, 100);
    }
  }
}

export const audioEngine = new AudioEngine();
