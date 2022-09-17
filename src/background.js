// this is a service worker for our Chrome extension: https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/

// show pages/help.html when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('/pages/help.html') });
});
