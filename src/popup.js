import './style.css';
import signInPage from './scripts/sign-in';
// import sharingPage from './scripts/sharing';

// when the pop-up first appears, show the sign-in page
signInPage.show();

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(request.msg);
    sendResponse('worked');
  },
);

// TODO: automatically go to the sharing page instead of sign-in page when the user is logged in
