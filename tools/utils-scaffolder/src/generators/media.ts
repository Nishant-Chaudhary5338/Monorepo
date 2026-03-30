// ============================================================================
// MEDIA MODULE GENERATOR
// ============================================================================

export function generateMediaModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// MEDIA MODULE - Media utilities for files, images, audio, video
// ============================================================================

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'unknown';

/**
 * Detects media type from file extension
 * @param filename - File name or path
 * @returns Media type string
 * @example getMediaType('photo.jpg') // 'image'
 */
export function getMediaType(filename: string): MediaType {
  if (!filename) return 'unknown';
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'];
  const videoExts = ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'm4v'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'opus'];
  const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (docExts.includes(ext)) return 'document';
  return 'unknown';
}

/**
 * Formats duration in seconds to human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 * @example formatDuration(3661) // '1:01:01'
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return \`\${hrs}:\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  }
  return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
}

/**
 * Parses a resolution string (e.g., '1920x1080')
 * @param resolution - Resolution string
 * @returns Parsed width and height
 * @example parseResolution('1920x1080') // { width: 1920, height: 1080 }
 */
export function parseResolution(resolution: string): { width: number; height: number } | null {
  if (!resolution) return null;
  const match = resolution.match(/^(\\d+)\\s*[x×]\\s*(\\d+)$/);
  if (!match) return null;
  return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
}

/**
 * Calculates aspect ratio from width and height
 * @param width - Width value
 * @param height - Height value
 * @returns Aspect ratio string (e.g., '16:9')
 * @example getAspectRatio(1920, 1080) // '16:9'
 */
export function getAspectRatio(width: number, height: number): string {
  if (!width || !height) return '';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return \`\${width / divisor}:\${height / divisor}\`;
}

/**
 * Gets file extension from filename
 * @param filename - File name or path
 * @returns Lowercase extension without dot
 * @example getFileExtension('photo.JPG') // 'jpg'
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

/**
 * Gets filename without extension
 * @param filename - File name or path
 * @returns Filename without extension
 * @example getFileName('photo.jpg') // 'photo'
 */
export function getFileName(filename: string): string {
  if (!filename) return '';
  const base = filename.split('/').pop() || filename;
  const parts = base.split('.');
  return parts.length > 1 ? parts.slice(0, -1).join('.') : base;
}

/**
 * Validates if a file has an allowed extension
 * @param filename - File name to check
 * @param allowedExts - Array of allowed extensions
 * @returns True if extension is allowed
 * @example isAllowedFileType('photo.jpg', ['jpg', 'png']) // true
 */
export function isAllowedFileType(filename: string, allowedExts: string[]): boolean {
  const ext = getFileExtension(filename);
  return allowedExts.map((e) => e.toLowerCase()).includes(ext);
}

/**
 * Generates a data URL from a Blob or File
 * @param blob - Blob or File object
 * @returns Promise resolving to data URL
 */
export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a data URL to a Blob
 * @param dataUrl - Data URL string
 * @returns Blob object
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}
`,
    'media.test.ts': `import { describe, it, expect } from 'vitest'
import {
  getMediaType, formatDuration, parseResolution, getAspectRatio,
  getFileExtension, getFileName, isAllowedFileType,
} from './index'

describe('Media Module', () => {
  describe('getMediaType', () => {
    it('detects image types', () => {
      expect(getMediaType('photo.jpg')).toBe('image')
      expect(getMediaType('icon.png')).toBe('image')
    })
    it('detects video types', () => {
      expect(getMediaType('video.mp4')).toBe('video')
    })
    it('detects audio types', () => {
      expect(getMediaType('song.mp3')).toBe('audio')
    })
    it('returns unknown for unrecognized', () => {
      expect(getMediaType('file.xyz')).toBe('unknown')
    })
  })

  describe('formatDuration', () => {
    it('formats seconds to mm:ss', () => {
      expect(formatDuration(65)).toBe('1:05')
    })
    it('formats hours to h:mm:ss', () => {
      expect(formatDuration(3661)).toBe('1:01:01')
    })
    it('handles zero', () => {
      expect(formatDuration(0)).toBe('0:00')
    })
  })

  describe('parseResolution', () => {
    it('parses valid resolution', () => {
      expect(parseResolution('1920x1080')).toEqual({ width: 1920, height: 1080 })
    })
    it('returns null for invalid', () => {
      expect(parseResolution('invalid')).toBeNull()
    })
  })

  describe('getAspectRatio', () => {
    it('calculates aspect ratio', () => {
      expect(getAspectRatio(1920, 1080)).toBe('16:9')
      expect(getAspectRatio(1024, 768)).toBe('4:3')
    })
  })

  describe('getFileExtension', () => {
    it('returns lowercase extension', () => {
      expect(getExtension('photo.JPG')).toBe('jpg')
      expect(getExtension('file.tar.gz')).toBe('gz')
    })
  })

  describe('getFileName', () => {
    it('returns name without extension', () => {
      expect(getFileName('photo.jpg')).toBe('photo')
      expect(getFileName('/path/to/file.png')).toBe('file')
    })
  })

  describe('isAllowedFileType', () => {
    it('validates allowed types', () => {
      expect(isAllowedFileType('photo.jpg', ['jpg', 'png'])).toBe(true)
      expect(isAllowedFileType('file.exe', ['jpg', 'png'])).toBe(false)
    })
  })
})
`,
  };
}