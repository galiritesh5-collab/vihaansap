/**
 * downloadFile utility
 * Handles two types of URLs:
 *  1. data: URLs (base64 – from FileReader, produced by local file upload)
 *  2. http/https URLs (Firebase Storage, CDN, external URLs)
 *
 * For data URLs the binary content is already present in memory, so we can
 * create a Blob directly without any network fetch (no CORS issue, no SPA
 * index.html fallback).
 *
 * For http/https URLs we fetch with credentials and convert to Blob.
 * If CORS blocks the fetch we fall back to opening in a new tab.
 */

export const downloadFile = async (url: string, filename: string): Promise<void> => {
  if (!url || url === '#') {
    alert('This file is not available for download. Please ask your admin to re-upload it.');
    return;
  }

  try {
    let blob: Blob;

    if (url.startsWith('data:')) {
      // ---- data URL path (base64 encoded local upload) ----
      const [header, base64] = url.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      blob = new Blob([bytes], { type: mime });
    } else {
      // ---- http/https URL path (Firebase Storage, CDN, etc.) ----
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      blob = await response.blob();
    }

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke after a short delay to allow the download to initiate
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.warn('downloadFile: falling back to window.open()', err);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
