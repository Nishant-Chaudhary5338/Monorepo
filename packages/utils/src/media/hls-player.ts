import type { HLSPlayerConfig, HLSPlayerControls } from './types';

export function createHLSPlayer(config: HLSPlayerConfig): HLSPlayerControls {
  const { videoElement, src, autoplay = false, onError, onQualityChange } = config;
  let hlsInstance: any = null;
  let isDestroyed = false;

  // SSR guard
  if (typeof window === 'undefined') {
    return {
      play: () => {},
      pause: () => {},
      seek: () => {},
      setQuality: () => {},
      getQualities: () => [],
      getCurrentTime: () => 0,
      getDuration: () => NaN,
      destroy: () => {},
    };
  }

  if (!videoElement) {
    throw new Error('Video element is required');
  }

  if (!src) {
    throw new Error('HLS source URL is required');
  }

  async function init() {
    if (isDestroyed) return;
    
    try {
      // Dynamic import to avoid requiring hls.js when not needed
      const HlsModule = await import('hls.js');
      const Hls = HlsModule.default;

      if (Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(videoElement);

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoplay && !isDestroyed) {
            videoElement.play().catch((error) => {
              console.error('HLS autoplay failed:', error);
            });
          }
        });

        hlsInstance.on(Hls.Events.ERROR, (_event: unknown, data: any) => {
          if (data.fatal) {
            onError?.(new Error(`HLS fatal error: ${data.type}`));
          }
        });

        hlsInstance.on(Hls.Events.LEVEL_SWITCHED, (_event: unknown, data: any) => {
          onQualityChange?.(data.level);
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = src;
        if (autoplay) {
          videoElement.play().catch((error) => {
            console.error('HLS autoplay failed:', error);
          });
        }
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }

  init();

  return {
    play: async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.error('HLS playback failed:', error);
      }
    },
    pause: () => videoElement.pause(),
    seek: (time: number) => {
      if (Number.isFinite(time) && time >= 0) {
        videoElement.currentTime = Math.min(time, videoElement.duration || 0);
      }
    },
    setQuality: (level: number) => {
      if (hlsInstance && Number.isInteger(level) && level >= 0) {
        hlsInstance.currentLevel = level;
      }
    },
    getQualities: () => {
      if (!hlsInstance?.levels) return [];
      return hlsInstance.levels.map((level: any, index: number) => ({
        index,
        label: level.height ? `${level.height}p` : `Level ${index}`,
      }));
    },
    getCurrentTime: () => videoElement.currentTime,
    getDuration: () => videoElement.duration,
    destroy: () => {
      isDestroyed = true;
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    },
  };
}
