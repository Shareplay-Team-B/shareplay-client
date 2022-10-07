import $ from 'jquery';
import {
  getAuth, createUserWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseApp } from './firebase-config';
import { loadPage } from './util';
import { signUp } from './api';
// eslint-disable-next-line import/no-cycle
import signInPage from './sign-in';
// eslint-disable-next-line import/no-cycle
import sharingPage from './sharing';

function handleSignUpBtnClick() {
  // get firebase auth variables
  const auth = getAuth(firebaseApp);
  // get elements from the sign-in page
  const emailInput = $('#email');
  // const usernameInput = $('#username');
  const passwordInput = $('#password');
  const usernameInput = $('#username');
  const cpasswordInput = $('#cpassword');
  const signUpResult = $('#sign-up-result');
  // sign-in with firebase
  createUserWithEmailAndPassword(auth, emailInput?.val(), passwordInput?.val())
    .then((userCredential) => {
      const { user } = userCredential;
      console.log('user created: ', user);
      // TODO: create validations for the register info
      signUp(
        usernameInput?.val(),
        emailInput?.val(),
        passwordInput?.val(),
        cpasswordInput?.val(),
        (response) => {
          signUpResult.text(JSON.stringify(response.data));
        },
        (error) => {
          const serverError = error?.response?.data?.message;
          signUpResult.text(serverError || 'Unknown server error');
        },
      );
      sharingPage.show();
    })
    .catch((error) => {
      console.error(error);
      console.log('Error creating user');
    });
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
