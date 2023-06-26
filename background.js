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


// Establish a WebSocket connection with the backend server
const socket = new WebSocket("wss://instantapply.co/api/socket"); // Replace with your WebSocket server URL

// Listen for messages from the WebSocket server
socket.addEventListener("message", function (event) {
  const message = JSON.parse(event.data);
  // Display the notification to the user
  chrome.notifications.create({
    type: "basic",
    title: "Notification",
    message: `Email sent to ${message.email} has been opened ${message.count} time${message.count > 1 ? "s" : ""}`,
    iconUrl: "https://instantapply.co/assets/images/instantapply-logo.png",
  });
});


//redirect to instantapply when chrome extension is uninstalled
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL('https://instantapply.co');
  }
});
