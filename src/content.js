// this is a content script that allows us to modify the page we are on: https://developer.chrome.com/docs/extensions/mv3/content_scripts/

import $ from 'jquery';
import io from 'socket.io-client';
import { API_URL } from './scripts/api';

console.log('content.js injected into webpage');

// video detail variables
let videoTitle;
let views;
let duration;
let shortDesc;

// dummy example code of seraching for the description HTML element of a YouTube video using JQuery
const descriptionElement = $('.ytd-watch-metadata');
console.log('youtube description element: ', descriptionElement);

// gets youtube video details from the webpage
const getYTVideoDetails = () => {
  // getting video title
  const titleElemParent = $('.title.style-scope.ytd-video-primary-info-renderer');
  const videoTitleElem = titleElemParent.children()[0];
  videoTitle = videoTitleElem.textContent;

  // getting video views
  const viewCountElemParent = $('ytd-video-view-count-renderer');
  const viewCountElem = viewCountElemParent.children()[0];
  views = viewCountElem.textContent;

  // getting video duration
  const timeElem = $('div.ytp-time-display.notranslate').children();
  const totalDurationElem = timeElem.find('span')[2];
  duration = totalDurationElem.textContent;

  // getting video description (doesn't include hashtags of the video)
  shortDesc = $('yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer').children()[0].textContent;

  // print all video details
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log('Video title: ', videoTitle);
  console.log('Views: ', views);
  console.log('Duration: ', duration);
  console.log('short desc: ', shortDesc);
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
};

// use setTimeout to wait for page to load before looking for video details
setTimeout(getYTVideoDetails, 3000);

/* NEED A WORK AROUND TO GET DURATION IF THERES AN AD *
// right now the code grabs the video duration of the ad instead of the
// actual video
// maybe we could check if the div.ytp-ad-persistent-progress-bar-container
// element is present to tell if ad is playing */

// get video element from the HTML page
const video = $('video')[0];
console.log('video element: ', video);

/* EXAMPLE OF VIDEO PAUSING *
// added wait function so that it waits for the page to fully load before trying to pause the video
// I'm not sure if we'll need this once the extension is further built out,
// but I needed it for testing
const wait = () => {
  console.log('video paused');
  video.pause();
};
setTimeout(wait, 2000);
*/

/**
 * Connect to our web socket server to listen for real-time updates and send real-time updates
 */
const socket = io(API_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 1000,
});

socket.on('connect', () => {
  console.log('connected to socket server');
  // send some dummy data as an example to our socket server's 'test-channel'
  const sampleData = { someKey1: 'someValue1', someKey2: 'someValue2' };
  socket.emit('test-channel', sampleData);
});

socket.on('disconnect', () => {
  console.log('disconnected from socket server');
});

/**
 * Example of a message listener, so popup.js can send messages to us and
 * we can handle it here, then we can send a response back to popup.js with some data
 */
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log('got message from popup.js');
    if (request.type === 'VIDEO') {
      sendResponse({
        farewell: 'goodbye', title: videoTitle, views, duration, shortDesc,
      });
    }
  },
);
