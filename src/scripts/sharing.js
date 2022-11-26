import $ from 'jquery';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from './firebase-config';
import { loadPage } from './util';
// eslint-disable-next-line import/no-cycle
import signInPage from './sign-in';
// eslint-disable-next-line import/no-cycle
import homePage from './home';

function afterParty() {
  chrome.storage.sync.clear();
  chrome.storage.sync.set({ key: 'not connected' }, () => {
    console.log('not connected');
  });
  homePage.show();
}

// const allMessages = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'left') {
    afterParty();
  } else if (request.message) {
    const container = document.getElementById('chat');
    chrome.storage.sync.get(['user'], (result) => {
      if (request.sender === result.user) {
        container.innerHTML += `<div class="msg-container sent">
                                  <p class="msg-header">${request.sender}</p>
                                  <p class="msg-sent">${request.message}</p>
                              </div>`;
      } else if (request.sender === 'computer') {
        container.innerHTML += `<div class="computer">
                                  <p><i>${request.message}</i></p>
                              </div>`;
      } else {
        container.innerHTML += `<div class="msg-container recieved">
                                  <p class="msg-header">${request.sender}</p>
                                  <p class="msg-recieved">${request.message}</p>
                              </div>`;
      }
    });
  }
  sendResponse('worked');
});

function addMessages() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'give-chats' }, (response) => {
      const messages = response.result;
      chrome.storage.sync.get(['user'], (result) => {
        for (let i = 0; i < messages.length; i += 1) {
          const container = document.getElementById('chat');
          // eslint-disable-next-line no-loop-func
          if (messages[i][0] === result.user) {
            container.innerHTML += `<div class="msg-container sent">
                                        <p class="msg-header">${messages[i][0]}</p>
                                        <p class="msg-sent">${messages[i][1]}</p>
                                    </div>`;
          } else if (messages[i][0] === 'computer') {
            container.innerHTML += `<div class="computer">
                                        <p><i>${messages[i][1]}</i></p>
                                    </div>`;
          } else {
            container.innerHTML += `<div class="msg-container recieved">
                                        <p class="msg-header">${messages[i][0]}</p>
                                        <p class="msg-recieved">${messages[i][1]}</p>
                                    </div>`;
          }
        }
      });
    });
  });
}

function sendChatMessageToContent() {
  chrome.storage.sync.get(['party', 'user'], (result) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'chat', text: document.getElementById('chat-text').value, code: result.party, person: result.user,
      }, (response) => {
        console.log(response.result);
        document.getElementById('chat-text').value = '';
      });
    });
  });
}

function signout() {
  // allow user to sign out of firebase auth
  const auth = getAuth(firebaseApp);
  signOut(auth).then(() => {
    chrome.storage.sync.get(['party', 'host'], (result) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'leave', code: result.party, host: result.host }, (response) => {
          console.log(response.result);
        });
      });
    });
    chrome.storage.sync.clear();
    chrome.storage.sync.set({ key: 'not connected' }, () => {
      console.log('not connected');
    });
    signInPage.show();
  }).catch((error) => {
    console.error(error);
  });
}

function endParty() {
  chrome.storage.sync.get(['party', 'host'], (result) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'leave', code: result.party, host: result.host }, (response) => {
        console.log(response.result);
      });
    });
  });
  chrome.storage.sync.clear();
  chrome.storage.sync.set({ key: 'not connected' }, () => {
    console.log('not connected');
  });
  homePage.show();
}

function shareCode() {
  chrome.storage.sync.get(['party'], (result) => {
    // eslint-disable-next-line no-alert
    alert(`Party Code: ${result.party}`);
  });
}

/**
 * Show the page contents
 */
function show() {
  loadPage('pages/sharing.html', () => {
    $('#sign-out-btn').on('click', signout);
    $('#txt-chat-btn').on('click', sendChatMessageToContent);
    $('#end-party-btn').on('click', endParty);
    $('#share-btn').on('click', shareCode);
    addMessages();
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
