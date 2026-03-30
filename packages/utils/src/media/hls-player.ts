import type { HLSPlayerConfig, HLSPlayerControls } from './types';

export function createHLSPlayer(config: HLSPlayerConfig): HLSPlayerControls {
  const { videoElement, src, autoplay = false, onError, onQualityChange } = config;
  let hlsInstance: any = null;

  async function init() {
    try {
      // Dynamic import to avoid requiring hls.js when not needed
      const HlsModule = await import('hls.js');
      const Hls = HlsModule.default;

      if (Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(videoElement);

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoplay) videoElement.play();
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
        if (autoplay) videoElement.play();
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }

  init();

  return {
    play: () => videoElement.play(),
    pause: () => videoElement.pause(),
    seek: (time: number) => {
      videoElement.currentTime = time;
    },
    setQuality: (level: number) => {
      if (hlsInstance) hlsInstance.currentLevel = level;
    },
    getQualities: () => {
      if (!hlsInstance) return [];
      return hlsInstance.levels.map((level: any, index: number) => ({
        index,
        label: level.height ? `${level.height}p` : `Level ${index}`,
      }));
    },
    getCurrentTime: () => videoElement.currentTime,
    getDuration: () => videoElement.duration,
    destroy: () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    },
  };
}
