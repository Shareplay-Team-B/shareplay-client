import $ from 'jquery';
import { loadPage } from './util';
import { signUp } from './api';
// eslint-disable-next-line import/no-cycle
import signInPage from './sign-in';

async function handleSignUpBtnClick() {
  // get elements from the sign-in page
  const emailInput = $('#email');
  const passwordInput = $('#password');
  const usernameInput = $('#username');
  const cpasswordInput = $('#cpassword');
  // const signUpResult = $('#sign-up-result');
  signUp(
    usernameInput?.val(),
    emailInput?.val(),
    passwordInput?.val(),
    cpasswordInput?.val(),
    (success) => {
      const successRep = success?.response?.data?.message;
      console.log(successRep);
      // eslint-disable-next-line no-alert
      alert('Successful in creating user.');
      signInPage.show();
    },
    (error) => {
      const serverError = error?.response?.data?.message;
      // eslint-disable-next-line no-alert
      alert(serverError || 'Unknown server error');
    },
  );
}

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
