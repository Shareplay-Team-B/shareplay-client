// this is a content script that allows us to modify the page we are on: https://developer.chrome.com/docs/extensions/mv3/content_scripts/

import $ from 'jquery';
import io from 'socket.io-client';
import { API_URL } from './scripts/api';

chrome.storage.sync.clear();

// video detail variables
let videoTitle;
let views;
let duration;
let shortDesc;
let img;
let name;

let socket;
const allMessages = [];

// dummy example code of searching for the description HTML element of a YT video using JQuery
const descriptionElement = $('.ytd-watch-metadata');
console.log('youtube description element: ', descriptionElement);

// gets youtube video details from the webpage
function getYTVideoDetails() {
  // getting video title
  const titleElemParent = $('.title.style-scope.ytd-video-primary-info-renderer');
  const videoTitleElem = titleElemParent.children()[0];
  videoTitle = videoTitleElem.textContent;

  // getting channel image
  img = $('yt-img-shadow#avatar.style-scope.ytd-video-owner-renderer.no-transition')[0].children[0].src;
  console.log('img src', img);

  // getting channel name
  console.log('!!!!!!!! GETING CHANNEL NAME !!!!!!!!');
  name = $('ytd-channel-name')[0].children[0].children[0].children[0].innerHTML;
  console.log(name);

  // getting video views
  const viewCountElemParent = $('ytd-video-view-count-renderer');
  const viewCountElem = viewCountElemParent.children()[0];
  views = viewCountElem.textContent;

  // getting video duration
  const timeElem = $('div.ytp-time-display.notranslate').children();
  const totalDurationElem = timeElem.find('span')[2];
  duration = totalDurationElem.textContent;

  // getting video description (doesn't include hashtags of the video)
  // shortDesc = $('yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer')
  // .children()[0].textContent;

  // print all video details
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log('Video title: ', videoTitle);
  console.log('Channel img: ', img);
  console.log('Channel name ', name);
  console.log('Views: ', views);
  console.log('Duration: ', duration);
  console.log('short desc: ', shortDesc);
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
}

/* NEED A WORK AROUND TO GET DURATION IF THERES AN AD *
// right now the code grabs the video duration of the ad instead of the
// actual video
// maybe we could check if the div.ytp-ad-persistent-progress-bar-container
// element is present to tell if ad is playing */

// get video element from the HTML page

// let canUpdate = true;
const video = $('video');
const videoElement = (video.length > 0) ? video[0] : undefined;
console.log('video element: ', videoElement);
console.log('videos', $('video'));

if (videoElement) {
  // eslint-disable-next-line no-unused-vars
  videoElement.onpause = (event) => {
    console.log('paused video');
    if (socket) {
      chrome.storage.sync.get(['party', 'host'], (result) => {
        if (result.host === 'me') {
          socket.emit('video-update', { code: result.party, action: 'pause', time: videoElement.currentTime });
        }
      });
    } else {
      console.log('not connected to shareplay server');
    }
  };

  // eslint-disable-next-line no-unused-vars
  videoElement.onplay = (event) => {
    console.log('play video');
    if (socket) {
      chrome.storage.sync.get(['party', 'host'], (result) => {
        if (result.host === 'me') {
          socket.emit('video-update', { code: result.party, action: 'play', time: videoElement.currentTime });
        }
      });
    } else {
      console.log('not connected to shareplay server');
    }
  };

  // eslint-disable-next-line no-unused-vars
  videoElement.ontimeupdate = (event) => {
    if (videoElement.paused) {
      console.log('time update');
      chrome.storage.sync.get(['host'], (result) => {
        if (result.host === 'me') {
          if (socket) {
            chrome.storage.sync.get(['party'], (result1) => {
              socket.emit('video-update', { code: result1.party, action: 'time-update', time: videoElement.currentTime });
            });
          } else {
            console.log('not connected to shareplay server');
          }
        }
      });
    }
  };
}

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
        videoElement.currentTime = data.time;
      } else if (data?.action === 'pause') {
        videoElement.pause();
        videoElement.currentTime = data.time;
      } else if (data?.action === 'time-update') {
        videoElement.currentTime = data.time;
      }
    }
  });

  socket.on('text-session-client', (data) => {
    console.log(data.sender);
    console.log(data.message);
    chrome.runtime.sendMessage(data, (response) => {
      console.log(response);
    });
    allMessages.push([data.sender, data.message]);
  });

  socket.on('host-left-session', (data) => {
    chrome.storage.sync.get(['host'], (result) => {
      socket.emit('leave-session', { code: data, host: result.host });
    });
    chrome.runtime.sendMessage('left', (response) => {
      console.log(response);
    });
  });

  socket.on('host-left-session', (data) => {
    chrome.storage.sync.get(['host'], (result) => {
      socket.emit('leave-session', { code: data, host: result.host });
    });
    chrome.runtime.sendMessage('left', (response) => {
      console.log(response);
    });
  });
}

/**
 * Example of a message listener, so popup.js can send messages to us and
 * we can handle it here, then we can send a response back to popup.js with some data
 */
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'connect-to-socket') {
      if (socket) {
        sendResponse({ result: 'already connected to socket server' });
      } else {
        if (!socket) {
          socket = io(API_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 1000,
          });
        }
        console.log('setup socket server connection');
        setupSocketListeners();
        if (request?.host === 'me') {
          console.log('request 1', request);
          socket.emit('join-session', { code: request?.party, host: 'me' });
        } else {
          console.log('request 2', request);
          socket.emit('join-session', { code: request?.party });
        }
        chrome.storage.sync.set({ party: request.party });
        chrome.storage.sync.set({ host: request.host });
        sendResponse({ result: 'connected to socket server' });
      }
    } else if (request.type === 'video') {
      getYTVideoDetails();
      sendResponse({
        // eslint-disable-next-line max-len
        title: videoTitle, image: img, names: name, numofviews: views, length: duration, /* shortDesc, */
      });
    } else if (request.type === 'chat') {
      socket.emit('text-session', { state: request.text, code: request.code, name: request.person });
      sendResponse({ result: 'worked' });
    } else if (request.type === 'give-chats') {
      sendResponse({ result: allMessages });
    } else if (request.type === 'join') {
      if (!socket) {
        socket = io(API_URL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 1000,
        });
      }
      console.log('setup socket server connection');
      setupSocketListeners();
      socket.emit('join-session', { code: request?.code, host: request?.host });
      chrome.storage.sync.set({ party: request.code });
      chrome.storage.sync.set({ host: request.host });
      sendResponse({ result: 'joined room' });
    } else if (request.type === 'leave') {
      socket.emit('leave-session', { code: request.code, host: request.host });
      sendResponse({ result: 'left room' });
    }
  },
);
