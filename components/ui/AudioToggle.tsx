'use client';

import { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/audio';

export default function AudioToggle() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!soundEngine) return;
    const unsub = soundEngine.subscribe((isMuted) => setMuted(isMuted));
    return unsub;
  }, []);

  const handleClick = () => {
    soundEngine?.toggleMute();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={muted ? 'Unmute atmospheric audio' : 'Mute atmospheric audio'}
      className="
        group relative flex items-center gap-2
        text-[10px] tracking-widest uppercase font-light
        text-[#F0EDE8]/50 hover:text-[#C9A96E]
        transition-colors duration-300
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]
        rounded-sm px-1.5 py-1 select-none
      "
    >
      {/* Wave animation bars */}
      <span className="flex items-center gap-0.5 h-3" aria-hidden="true">
        <span
          className={`w-0.5 rounded-full bg-current transition-all duration-300 ${
            muted ? 'h-1 opacity-40' : 'h-3 animate-[pulse_1s_ease-in-out_infinite]'
          }`}
        />
        <span
          className={`w-0.5 rounded-full bg-current transition-all duration-300 ${
            muted ? 'h-1.5 opacity-40' : 'h-2 animate-[pulse_1.4s_ease-in-out_infinite_0.2s]'
          }`}
        />
        <span
          className={`w-0.5 rounded-full bg-current transition-all duration-300 ${
            muted ? 'h-1 opacity-40' : 'h-2.5 animate-[pulse_1.2s_ease-in-out_infinite_0.4s]'
          }`}
        />
      </span>
      <span className="hidden sm:inline">
        {muted ? 'SOUND OFF' : 'SOUND ON'}
      </span>
    </button>
  );
}
