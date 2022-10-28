// this is a content script that allows us to modify the page we are on: https://developer.chrome.com/docs/extensions/mv3/content_scripts/

import $ from 'jquery';
import io from 'socket.io-client';
import { API_URL } from './scripts/api';

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

/* NEED A WORK AROUND TO GET DURATION IF THERES AN AD *
// right now the code grabs the video duration of the ad instead of the
// actual video
// maybe we could check if the div.ytp-ad-persistent-progress-bar-container
// element is present to tell if ad is playing */

// get video element from the HTML page
let socket;
// let canUpdate = true;
const video = $('video')[0];
const videoElement = (video.length > 0) ? video[0] : undefined;
console.log('video element: ', videoElement);

if (videoElement) {
  // eslint-disable-next-line no-unused-vars
  videoElement.onpause = (event) => {
    console.log('paused video');
    if (socket) {
      socket.emit('video-update', { action: 'pause', time: videoElement.currentTime });
    } else {
      console.log('not connected to shareplay server');
    }
  };

  // eslint-disable-next-line no-unused-vars
  videoElement.onplay = (event) => {
    console.log('play video');
    if (socket) {
      socket.emit('video-update', { action: 'play', time: videoElement.currentTime });
    } else {
      console.log('not connected to shareplay server');
    }
  };

  // eslint-disable-next-line no-unused-vars
  videoElement.ontimeupdate = (event) => {
    console.log('time update');
    if (socket) {
      socket.emit('video-update', { action: 'time-update', time: videoElement.currentTime });
    } else {
      console.log('not connected to shareplay server');
    }
  };
}

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

function setupSocketListeners() {
  socket.on('connect', () => {
    console.log('connected to socket server');
  });

  socket.on('disconnect', () => {
    socket = undefined;
    console.log('disconnected from socket server');
  });

  socket.on('video-update-client', (data) => {
    console.log('got new video data: ', data);
    if (videoElement) {
      if (data?.action === 'play') {
        videoElement.play();
      } else if (data?.action === 'pause') {
        videoElement.pause();
      }
      videoElement.currentTime = data.time;
    }
  });
}

/**
 * Example of a message listener, so popup.js can send messages to us and
 * we can handle it here, then we can send a response back to popup.js with some data
 */
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'connect-to-socket') {
      console.log('working');
      if (socket) {
        sendResponse({ result: 'already connected to socket server' });
      } else {
        socket = io(API_URL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 1000,
        });
        setupSocketListeners();
        sendResponse({ result: 'connected to socket server' });
      }
    } else if (request.type === 'video') {
      // use setTimeout to wait for page to load before looking for video details
      setTimeout(getYTVideoDetails, 3000);
    }
  },
);
