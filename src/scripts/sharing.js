import $ from 'jquery';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from './firebase-config';
import { loadPage } from './util';
// eslint-disable-next-line import/no-cycle
import signInPage from './sign-in';

/**
 * Example of sending a message to our content script and getting a response.
 * This can be used to get stuff like video title, description, etc.
 */
function sendMessageToContentScript() {
  // example sending message to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'VIDEO' }, (response) => {
      console.log('message printing');
      console.log(' TITLE: ', response.title);
      console.log(' VIEWS: ', response.views);
      console.log(' DURATION: ', response.duration);
      console.log(' DESCRIPTION: ', response.shortDesc);
    });
  });
}

sendMessageToContentScript();

function signout() {
  // allow user to sign out of firebase auth
  const auth = getAuth(firebaseApp);
  signOut(auth).then(() => {
    signInPage.show();
  }).catch((error) => {
    console.error(error);
  });
}

/**
 * Show the page contents
 */
function show() {
  loadPage('pages/sharing.html', () => {
    console.log('Page loaded');
    sendMessageToContentScript();
    $('#sign-out-btn').on('click', signout);
  });
}

/**
 * Export this page as an object
 */
const sharingPage = {
  show,
};

// eslint-disable-next-line import/prefer-default-export
export default sharingPage;
