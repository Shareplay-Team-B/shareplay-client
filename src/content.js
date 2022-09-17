// this is a content script that allows us to modify the page we are on: https://developer.chrome.com/docs/extensions/mv3/content_scripts/

import $ from 'jquery';
import io from 'socket.io-client';
import { API_URL } from './scripts/api';

console.log('content.js injected into webpage');

// dummy example code of seraching for the description HTML element of a YouTube video using JQuery
const descriptionElement = $('.ytd-watch-metadata');
console.log('youtube description element: ', descriptionElement);

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
    if (request.greeting === 'hello') { sendResponse({ farewell: 'goodbye' }); }
  },
);
