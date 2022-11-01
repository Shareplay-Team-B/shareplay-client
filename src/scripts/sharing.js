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
      console.log('sharing.js printing response values from content.js');
      // console.log(' VIDEO: ', response.video);
      // console.log(' VIDEO SRC: ', response.video.src);
      console.log(' TITLE: ', response.title);
      console.log(' VIEWS: ', response.views);
      console.log(' DURATION: ', response.duration);
      // console.log(' DESCRIPTION: ', response.shortDesc);

      /* const video = $('#sharing-video')[0];
      video.src = response.video.src; */

      const channelIcon = $('#channelIcon')[0];
      channelIcon.src = response.img;

      const channelName = $('#channelName')[0];
      channelName.innerHTML = response.name;

      const title = $('#title')[0];
      title.innerText = response.title;

      const views = $('#views')[0];
      views.innerText = response.views;

      const duration = $('#duration')[0];
      duration.innerText = response.duration;

      /* const desc = $('#description')[0];
      desc.innerText = response.shortDesc; */
    });
  });
}

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
    setInterval(sendMessageToContentScript, 30);
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
