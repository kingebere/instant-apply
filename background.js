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
const socket = new WebSocket("wss://instantapplywebsockett.onrender.com"); // Replace with your WebSocket server URL

// Listen for WebSocket connection open
socket.addEventListener("open", function () {
  console.log("WebSocket connection established");
});

// Listen for WebSocket errors
socket.addEventListener("error", function (error) {
  console.error("WebSocket error:", error);
});

// Listen for WebSocket messages
socket.addEventListener("message", function (message) {
  const messages = JSON.parse(message.data);
  console.log(message, "event");
  // Display the notification to the user
  chrome.notifications.create({
    type: "basic",
    title: "Notification",
    message: `Email sent to ${messages.email} has been opened ${messages.count} time${messages.count > 1 ? "s" : ""}`,
    iconUrl: "https://instantapply.co/assets/images/instantapply-logo.png",
  }, function (notificationId) {
    if (chrome.runtime.lastError) {
      console.error("Notification creation error:", chrome.runtime.lastError);
    } else {
      console.log("Notification created with ID:", notificationId);
    }
  });
});



//redirect to instantapply when chrome extension is uninstalled
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL('https://instantapply.co');
  }
});
