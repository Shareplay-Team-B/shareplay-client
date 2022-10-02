import $ from 'jquery';
import { signIn } from './api';
import { loadPage } from './util';
// import sharingPage from './sharing';
import signUpPage from './sign-up';

/**
 * Called when sign-in button is clicked
 */
function handleSignInBtnClick() {
  // get elements from the sign-in page
  const usernameInput = $('#username');
  const passwordInput = $('#password');
  const signInResult = $('#sign-in-result');
  // make HTTP request to our server with sign-in credentials
  signIn(
    usernameInput?.val(),
    passwordInput?.val(),
    (response) => {
      signInResult.text(JSON.stringify(response.data));
    },
    (error) => {
      const serverError = error?.response?.data?.message;
      signInResult.text(serverError || 'Unknown server error');
    },
  );
}

function handleRegisterBtnClick() {
  signUpPage.show();
}

/**
 * Show the page contents and assign event listeners to buttons on the page
 */
function show() {
  loadPage('pages/sign-in.html', () => {
    // get elements from the sign-in page
    const signInBtn = $('#sign-in-btn');
    const registerBtn = $('#create-account-btn');
    // have buttons call functions when clicked
    signInBtn.on('click', handleSignInBtnClick);
    registerBtn.on('click', handleRegisterBtnClick);
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
