
// Chat GPT
// The path that this executes from: https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/classSearch/classSearch
document.getElementById("DownloadCatalog").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['searchCourses.js', 'utils.js']
    });
  });
});

// Chat GPT
// Open the scheduler
document.getElementById('open-scheduler').addEventListener('click', () => {
  const targetURL = chrome.runtime.getURL("scheduler.html");
  chrome.runtime.sendMessage({
    action: "openOrFocusTab",
    url: targetURL
  });
});
