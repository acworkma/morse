/**
 * Clipboard utility for copying text to clipboard
 * Supports modern Clipboard API with execCommand fallback
 */

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<{success: boolean, error?: string}>} Result object
 */
export async function copy(text) {
  // T070: Use Clipboard API if available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      // T072: Handle permission errors gracefully
      return {
        success: false,
        error: err.message || 'Clipboard access denied'
      };
    }
  }

  // T071: Fallback to execCommand for older browsers
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Copy command failed'
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to copy to clipboard'
    };
  }
}
