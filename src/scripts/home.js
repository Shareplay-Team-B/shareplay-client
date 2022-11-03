import $ from 'jquery';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from './firebase-config';
import { loadPage } from './util';
// eslint-disable-next-line import/no-cycle
import signInPage from './sign-in';
// eslint-disable-next-line import/no-cycle
import sharingPage from './sharing';

function sendVideoMessageToContentScript() {
  // example sending message to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'video' }, (response) => {
      // console.log(' VIDEO: ', response.video);
      // console.log(' VIDEO SRC: ', response.video.src);
      console.log(' TITLE: ', response.title);
      console.log(' VIEWS: ', response.numofviews);
      console.log(' DURATION: ', response.length);
      // console.log(' DESCRIPTION: ', response.shortDesc);

      /* const video = $('#sharing-video')[0];
      video.src = response.video.src; */

      const channelIcon = $('#channelIcon')[0];
      channelIcon.src = response.image;

      const channelName = $('#channelName')[0];
      channelName.innerHTML = response.names;

      const title = $('#title')[0];
      title.innerText = response.title;

      const views = $('#views')[0];
      views.innerText = response.numofviews;

      const duration = $('#duration')[0];
      duration.innerText = response.length;

      /* const desc = $('#description')[0];
      desc.innerText = response.shortDesc; */
    });
  });
}

function sendSocketMessageToContentScript() {
  // example sending message to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'connect-to-socket' }, (response) => {
      console.log('connection: ', response.result);
      if (response) {
        sharingPage.show();
      } else {
        // eslint-disable-next-line no-alert
        alert('Socket error!!');
      }
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

function hostParty() {
  sendSocketMessageToContentScript();
}

/**
 * Show the page contents
 */
function show() {
  loadPage('pages/home.html', () => {
    sendVideoMessageToContentScript();
    $('#sign-out-btn').on('click', signout);
    $('#host-party-btn').on('click', hostParty);
  });
}

/**
 * Export this page as an object
 */
const homePage = {
  show,
};

// eslint-disable-next-line import/prefer-default-export
export default homePage;
