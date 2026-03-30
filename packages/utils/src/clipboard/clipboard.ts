export async function copyToClipboard(text: string): Promise<boolean> {
  // SSR guard
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  if (!text?.trim()) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
}

export async function readFromClipboard(): Promise<string | null> {
  // SSR guard
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return null;
  }

  try {
    if (navigator.clipboard?.readText) {
      return await navigator.clipboard.readText();
    }
    return null;
  } catch (error) {
    console.error('Read from clipboard failed:', error);
    return null;
  }
}
