import $ from 'jquery';
import {
  getAuth, createUserWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseApp } from './firebase-config';
import { loadPage } from './util';
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
  // sign-in with firebase
  createUserWithEmailAndPassword(auth, emailInput?.val(), passwordInput?.val())
    .then((userCredential) => {
      const { user } = userCredential;
      console.log('user created: ', user);
      // TODO: send this newly created user info to our server endpoint
      // so we can keep track of everyone registered for our service
      // in MongoDB. This can also allow us to implement a 'search for user'
      // feature where we can make a request to our server to find users
      // by username, email, etc. when we want to share stuff with friends
      alert('TODO: make request to our server with this new user data');
      sharingPage.show();
    })
    .catch((error) => {
      console.error(error);
      alert('Error creating user');
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