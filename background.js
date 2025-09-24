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
    } else if (message.action === "chrome.tabs") {
        const m_response = chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Check if a tab was found
            if (tabs.length === 0) {
                return 0;
            } else {
                return tabs[0].id;
            }
        });

        if (chrome.tabs == undefined) sendResponse("chrome tabs is undefined");

        sendResponse(m_response);

        return true;
    }
});