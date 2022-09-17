import $ from 'jquery';

/**
 * Load contents from HTML file and display it in the extension pop-up
 * @param {string} page path of the HTML file to load
 * @param {function} callback function called after the HTML file is loaded and displayed
 */
function loadPage(page, callback) {
  const appContainer = $('#app-container');
  appContainer.load(page, callback);
}

// eslint-disable-next-line import/prefer-default-export
export { loadPage };
