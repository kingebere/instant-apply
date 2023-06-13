//redirect to instantapply when chrome extension is installed

chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "https://instantapply.co"
      });
    }
  });