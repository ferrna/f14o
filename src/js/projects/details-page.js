import { bindProjectChrome } from '../ui-elements/page-transition.js';
import { initProjectFeatures } from './project-features.js';

export function initProjectDetails() {
  if (!document.querySelector('#project-details-container')) return;
  bindProjectChrome();
  initProjectFeatures();
}
