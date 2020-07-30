chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data
  // if (changeInfo.url) {
    // url has changed; do something here
    // like send message to content script
    chrome.tabs.sendMessage(tabId, {
      message: "UPDATE",
      url: changeInfo,
    });
  // }
});


