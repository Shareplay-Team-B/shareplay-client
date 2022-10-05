import $ from 'jquery';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseApp } from './firebase-config';
// import { signIn } from './api';
import { loadPage } from './util';
// eslint-disable-next-line import/no-cycle
import sharingPage from './sharing';
// eslint-disable-next-line import/no-cycle
import signUpPage from './sign-up';

/**
 * Called when sign-in button is clicked
 */
function handleSignInBtnClick() {
  // get firebase auth variables
  const auth = getAuth(firebaseApp);
  // get elements from the sign-in page
  const emailInput = $('#email');
  // const usernameInput = $('#username');
  const passwordInput = $('#password');
  const signInResult = $('#sign-in-result');
  // sign-in with firebase
  signInWithEmailAndPassword(auth, emailInput?.val(), passwordInput?.val())
    .then((userCredential) => {
      console.log('signed in: ', userCredential);
    })
    .catch((error) => {
      console.error(error);
      signInResult.text('Error signing in');
    });
}

function handleRegisterBtnClick() {
  signUpPage.show();
}

function handleGoogleAuthBtnClick() {
  // TODO: remove this cuz sign in with Google is kinda messed up on
  // Chrome Extensions using Manifest V3 since it loads external scripts
  // It might be possible, but is a lot of work:
  // https://stackoverflow.com/questions/72514608/google-chrome-extension-manifest-version-3-to-handle-google-sign-ins
}

function handleAuthChange() {
  // when the user is logged in, go to the sharing page automatically
  const auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
      sharingPage.show();
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
