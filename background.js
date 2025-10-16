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
    } else if (message.action === "getVoyage") {
        // Credit https://stackoverflow.com/questions/37700051/chrome-extension-is-there-any-way-to-make-chrome-storage-local-get-return-so
        new Promise(function(resolve, reject) {
            chrome.storage.local.get(['schedulePlan'], function(item) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else { resolve(item); }
            });
        }).then(function(item) {
            console.log(`Retrieved item -- sending to content script`);
            console.log(item)
            sendResponse(item);
        });

        return true;
    } else {
        console.log(`Unknown message sent: ${message}`);
    }
});