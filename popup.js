
    chrome.action.onClicked.addListener(async(tab) => { 
    chrome.scripting.executeScript({
        target : {tabId : tab.id},
      files: ["index.js"],
    });
  
    console.log("executing script");
  });