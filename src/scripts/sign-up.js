import $ from 'jquery';
import { loadPage } from './util';
// eslint-disable-next-line import/no-cycle
import signInPage from './sign-in';

function handleSignUpBtnClick() {}

function handleLoginBtnClick() {
  signInPage.show();
}

function show() {
  loadPage('pages/register.html', () => {
    // get elements from the sign-in page
    const signUpBtn = $('#sign-up-btn');
    const loginBtn = $('#log-in-btn');
    // have buttons call functions when clicked
    signUpBtn.on('click', handleSignUpBtnClick);
    loginBtn.on('click', handleLoginBtnClick);
  });
}

/**
 * Export this page as an object
 */
const signUpPage = {
  show,
};

// eslint-disable-next-line import/prefer-default-export
export default signUpPage;
