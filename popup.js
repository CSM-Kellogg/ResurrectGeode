// Open the scheduler
const targetURL = chrome.runtime.getURL("courseScheduler/scheduler.html");
chrome.runtime.sendMessage({
    action: "openOrFocusTab",
    url: targetURL
});