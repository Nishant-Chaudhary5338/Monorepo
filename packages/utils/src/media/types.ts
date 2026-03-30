export interface HLSPlayerConfig {
  videoElement: HTMLVideoElement;
  src: string;
  autoplay?: boolean;
  onError?: (error: Error) => void;
  onQualityChange?: (level: number) => void;
}

export interface HLSPlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setQuality: (level: number) => void;
  getQualities: () => { index: number; label: string }[];
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

export interface VideoPlayerConfig {
  element: HTMLVideoElement;
  sources: { src: string; type: string }[];
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export interface VideoPlayerControls {
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  seek: (time: number) => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

export interface AudioPlayerConfig {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
}

export interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}
