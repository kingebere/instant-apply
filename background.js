//redirect to instantapply when chrome extension is installed

chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "https://instantapply.co"
      });
    }
  });

  // Listen for URL changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Check if the URL of the updated tab has changed
  if (changeInfo.url==='https://mail.google.com/mail/u/0/#inbox?compose=new') {
    // Perform actions based on the URL change
    const newUrl = changeInfo.url;
    console.log('URL changed:', newUrl);

      // Send a message to the content script
      chrome.tabs.sendMessage(tabId, { url: newUrl });
  }
});

