import type { AudioPlayerConfig, AudioPlayerControls } from './types';

export function createAudioPlayer(config: AudioPlayerConfig): AudioPlayerControls {
  const { src, autoplay = false, loop = false, volume = 1 } = config;
  
  // SSR guard - Audio is only available in browser
  if (typeof window === 'undefined' || typeof Audio === 'undefined') {
    return {
      play: () => {},
      pause: () => {},
      setVolume: () => {},
      seek: () => {},
      getCurrentTime: () => 0,
      getDuration: () => NaN,
      destroy: () => {},
    };
  }

  if (!src) {
    throw new Error('Audio source URL is required');
  }

  const audio = new Audio(src);
  audio.autoplay = autoplay;
  audio.loop = loop;
  audio.volume = Math.max(0, Math.min(1, volume));

  return {
    play: async () => {
      try {
        await audio.play();
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    },
    pause: () => audio.pause(),
    setVolume: (v: number) => {
      audio.volume = Math.max(0, Math.min(1, v));
    },
    seek: (time: number) => {
      if (Number.isFinite(time) && time >= 0) {
        audio.currentTime = Math.min(time, audio.duration || 0);
      }
    },
    getCurrentTime: () => audio.currentTime,
    getDuration: () => audio.duration,
    destroy: () => {
      audio.pause();
      audio.src = '';
    },
  };
}
