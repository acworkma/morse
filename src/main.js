/**
 * App initialization and main entry point
 */

import { init } from './ui/app.js';

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
