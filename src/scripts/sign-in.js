import $ from 'jquery';
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged,
} from 'firebase/auth';
import { firebaseApp } from './firebase-config';
import { loadPage } from './util';
import { signIn } from './api';
// eslint-disable-next-line import/no-cycle
import signUpPage from './sign-up';
import googleLogin from '../background';
// eslint-disable-next-line import/no-cycle
import homePage from './home';
// eslint-disable-next-line import/no-cycle
import sharingPage from './sharing';

/**
 * Called when sign-in button is clicked
 */
function handleSignInBtnClick() {
  // get elements from the sign-in page
  const auth = getAuth(firebaseApp);
  const emailInput = $('#email');
  const passwordInput = $('#password');
  // const signInResult = $('#sign-in-result');
  signInWithEmailAndPassword(auth, emailInput?.val(), passwordInput?.val())
    .then(() => {
      console.log('signed in: ', emailInput?.val());
      signIn(
        emailInput?.val(),
        (success) => {
          const successRep = success?.data?.message;
          chrome.storage.sync.set({ user: successRep }, () => {
            console.log(successRep);
          });
          chrome.storage.sync.set({ count: 0 });
        },
        (error) => {
          const serverError = error?.response?.data?.message;
          // eslint-disable-next-line no-alert
          console.log(serverError || 'Unknown server error');
        },
      );
    })
    .catch((error) => {
      // eslint-disable-next-line no-alert
      alert(String(error).slice(37).slice(0, -2));
      document.getElementById('password').value = '';
      document.getElementById('email').value = '';
    });
}

function handleRegisterBtnClick() {
  signUpPage.show();
}

function handleGoogleAuthBtnClick() {
  const auth = getAuth(firebaseApp);
  googleLogin(auth);
  // TODO: can't use google auth until we publish and verify the app by google
  // but the auth button works!!
}

function handleAuthChange() {
  // when the user is logged in, go to the sharing page automatically
  const auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      chrome.storage.sync.get(['key'], (result) => {
        console.log(result.key);
        if (result.key === 'already connected') {
          sharingPage.show();
        } else {
          homePage.show();
        }
      });
    }
  });
}

/**
 * Show the page contents and assign event listeners to buttons on the page
 */
function show() {
  loadPage('pages/sign-in.html', () => {
    handleAuthChange();
    // get elements from the sign-in page
    const signInBtn = $('#sign-in-btn');
    const registerBtn = $('#create-account-btn');
    const googleAuthBtn = $('#google-logo');
    // have buttons call functions when clicked
    signInBtn.on('click', handleSignInBtnClick);
    registerBtn.on('click', handleRegisterBtnClick);
    googleAuthBtn.on('click', handleGoogleAuthBtnClick);
  });
}

/**
 * Export this page as an object
 */
const signInPage = {
  show,
};

// eslint-disable-next-line import/prefer-default-export
export default signInPage;
