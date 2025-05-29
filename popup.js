// The path that this executes from: https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/classSearch/classSearch
document.getElementById("DownloadCatalog").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['searchCourses.js', 'utils.js']
    });
  });
});

// Open the scheduler
document.getElementById('open-scheduler').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('scheduler.html') });
});
