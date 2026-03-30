import type { AudioPlayerConfig, AudioPlayerControls } from './types';

export function createAudioPlayer(config: AudioPlayerConfig): AudioPlayerControls {
  const { src, autoplay = false, loop = false, volume = 1 } = config;
  const audio = new Audio(src);
  audio.autoplay = autoplay;
  audio.loop = loop;
  audio.volume = volume;

  return {
    play: () => audio.play(),
    pause: () => audio.pause(),
    setVolume: (v: number) => {
      audio.volume = Math.max(0, Math.min(1, v));
    },
    seek: (time: number) => {
      audio.currentTime = time;
    },
    getCurrentTime: () => audio.currentTime,
    getDuration: () => audio.duration,
    destroy: () => {
      audio.pause();
      audio.src = '';
    },
  };
}
