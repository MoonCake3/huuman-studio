// ─── HUUMAN STUDIO Audio Atmosphere (Web Audio API Synthesizer) ─────────────
// Zero external dependencies. Browser autoplay policy compliant.

type AudioListener = (muted: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isMutedState = true; // Default muted
  private listeners: Set<AudioListener> = new Set();

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMutedState ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Web Audio unsupported
    }
  }

  public subscribe(fn: AudioListener): () => void {
    this.listeners.add(fn);
    fn(this.isMutedState);
    return () => this.listeners.delete(fn);
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMutedState = !this.isMutedState;

    if (this.isMutedState) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      this.stopDrone();
    } else {
      this.masterGain.gain.setTargetAtTime(1, this.ctx.currentTime, 0.1);
      this.startDrone();
      this.playChime(660, 0.08);
    }

    this.listeners.forEach((fn) => fn(this.isMutedState));
    return this.isMutedState;
  }

  // Subtle ambient harmonic drone (deep resonant midnight space)
  private startDrone() {
    if (!this.ctx || !this.masterGain || this.isMutedState || this.droneOsc1) return;

    try {
      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.035, now + 3);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(240, now);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, now); // A1

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(110.2, now); // Slight detuned A2

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch {
      // Ignore audio failure
    }
  }

  private stopDrone() {
    if (!this.droneOsc1 || !this.droneGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.setTargetAtTime(0, now, 0.2);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
        } catch {
          // ignore
        }
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.droneGain = null;
        this.droneFilter = null;
      }, 300);
    } catch {
      // ignore
    }
  }

  // Glass ping interaction sound
  public playChime(freq = 880, vol = 0.04) {
    if (this.isMutedState || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // ignore
    }
  }

  // Tactile low click
  public playClick(vol = 0.05) {
    if (this.isMutedState || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Soft whisper chime for hover states
  public playHover(freq = 520, vol = 0.02) {
    if (this.isMutedState || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.06);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = typeof window !== 'undefined' ? new SoundEngine() : null;
