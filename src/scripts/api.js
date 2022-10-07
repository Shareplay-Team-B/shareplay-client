import axios from 'axios';

/**
 * URL of our server
 */
const API_URL = 'http://localhost:8080';

/**
 * Request to sign-in endpoint of our server
 * @param {string} username username of the user
 * @param {string} password password of the user
 * @param {function} successCallback function called when API call is successful (status 200)
 * @param {function} errorCallback function called when API has error (ex: status 400 or 500)
 */
function signIn(username, password, successCallback, errorCallback) {
  axios.post(`${API_URL}/api/v1/auth/sign-in`, {
    username: username || '',
    password: password || '',
  }).then(successCallback, errorCallback);
}

/**
 * Request to sign-in endpoint of our server
 * @param {string} username username of the user
 * @param {string} email email of the user
 * @param {string} password password of the user
 * @param {string} cpassword confirmed password of the user
 * @param {function} successCallback function called when API call is successful (status 200)
 * @param {function} errorCallback function called when API has error (ex: status 400 or 500)
 */
function signUp(username, email, password, cpassword, successCallback, errorCallback) {
  axios.post(`${API_URL}/api/v1/auth/sign-up`, {
    username: username || '',
    email: email || '',
    password: password || '',
    cpassword: cpassword || '',
  }).then(successCallback, errorCallback);
}

/**
 * Request for our server to search for a user by their email
 * @param {string} email email of the user to serach for
 */
function searchForUserByEmail(email) {
  // TODO: implement this method
  console.log('searching for user by email: ', email);
}

export {
  API_URL, signIn, signUp, searchForUserByEmail,
};
