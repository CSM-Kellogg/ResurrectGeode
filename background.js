chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

// ChatGPT
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openOrFocusTab") {
    const targetUrl = message.url;

    chrome.tabs.query({}, (tabs) => {
      const existingTab = tabs.find(tab => tab.url && tab.url.includes(targetUrl));

      if (existingTab) {
        // Tab already open - focus it
        chrome.tabs.update(existingTab.id, { active: true });
        chrome.windows.update(existingTab.windowId, { focused: true });
      } else {
        // Open a new tab
        chrome.tabs.create({ url: targetUrl });
      }
    });
  }
});