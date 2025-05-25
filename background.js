chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openViewer') {
    chrome.tabs.create({ url: chrome.runtime.getURL('viewer.html') });
    sendResponse({ status: 'success' });
  }
}); 