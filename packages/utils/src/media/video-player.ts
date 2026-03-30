import type { VideoPlayerConfig, VideoPlayerControls } from './types';

export function createVideoPlayer(config: VideoPlayerConfig): VideoPlayerControls {
  const { element, sources, controls = true, autoplay = false, muted = false, loop = false } = config;

  // SSR guard
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      play: () => {},
      pause: () => {},
      setVolume: () => {},
      setPlaybackRate: () => {},
      seek: () => {},
      enterFullscreen: () => {},
      exitFullscreen: () => {},
      getCurrentTime: () => 0,
      getDuration: () => NaN,
      destroy: () => {},
    };
  }

  if (!element) {
    throw new Error('Video element is required');
  }

  if (!sources?.length) {
    throw new Error('At least one video source is required');
  }

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
    play: async () => {
      try {
        await element.play();
      } catch (error) {
        console.error('Video playback failed:', error);
      }
    },
    pause: () => element.pause(),
    setVolume: (volume: number) => {
      element.volume = Math.max(0, Math.min(1, volume));
    },
    setPlaybackRate: (rate: number) => {
      if (Number.isFinite(rate) && rate > 0) {
        element.playbackRate = rate;
      }
    },
    seek: (time: number) => {
      if (Number.isFinite(time) && time >= 0) {
        element.currentTime = Math.min(time, element.duration || 0);
      }
    },
    enterFullscreen: () => {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch((error) => {
          console.error('Fullscreen request failed:', error);
        });
      }
    },
    exitFullscreen: () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch((error) => {
          console.error('Exit fullscreen failed:', error);
        });
      }
    },
    getCurrentTime: () => element.currentTime,
    getDuration: () => element.duration,
    destroy: () => {
      element.pause();
      element.innerHTML = '';
    },
  };
}
