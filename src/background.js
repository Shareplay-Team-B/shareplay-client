// this is a service worker for our Chrome extension: https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/
import {
  GoogleAuthProvider, signInWithCredential,
} from 'firebase/auth';
// show pages/help.html when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('/pages/help.html') });
});

function googleLogin(auth) {
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    console.log(token);
    if (chrome.runtime.lastError || !token) {
      console.log(`SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`);
      return;
    }

    signInWithCredential(auth, GoogleAuthProvider.credential(null, token))
      .then(() => { console.log('signed in!'); })
      .catch((err) => { console.log(`SSO ended with an error: ${err}`); });
  });
}

export default googleLogin;
