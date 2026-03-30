import type { VideoPlayerConfig, VideoPlayerControls } from './types';

export function createVideoPlayer(config: VideoPlayerConfig): VideoPlayerControls {
  const { element, sources, controls = true, autoplay = false, muted = false, loop = false } = config;

  // Set sources
  element.innerHTML = '';
  for (const source of sources) {
    const sourceEl = document.createElement('source');
    sourceEl.src = source.src;
    sourceEl.type = source.type;
    element.appendChild(sourceEl);
  }

  element.controls = controls;
  element.autoplay = autoplay;
  element.muted = muted;
  element.loop = loop;

  return {
    play: () => element.play(),
    pause: () => element.pause(),
    setVolume: (volume: number) => {
      element.volume = Math.max(0, Math.min(1, volume));
    },
    setPlaybackRate: (rate: number) => {
      element.playbackRate = rate;
    },
    seek: (time: number) => {
      element.currentTime = time;
    },
    enterFullscreen: () => {
      if (element.requestFullscreen) element.requestFullscreen();
    },
    exitFullscreen: () => {
      if (document.exitFullscreen) document.exitFullscreen();
    },
    getCurrentTime: () => element.currentTime,
    getDuration: () => element.duration,
    destroy: () => {
      element.pause();
      element.innerHTML = '';
    },
  };
}
