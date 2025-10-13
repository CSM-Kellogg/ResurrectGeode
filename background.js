// ChatGPT - makes a new tab or re-directs the user to the existing tab.
// This doesn't prevent multiple instances of the tab being open
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

// Reset the sendCourse trigger
chrome.storage.sync.set({'state': 0}, function() {
    console.log("The ellucian captain is eepy");
});