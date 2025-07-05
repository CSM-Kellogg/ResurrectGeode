
// Chat GPT
// The path that this executes from: https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/classSearch/classSearch
document.getElementById("DownloadCatalog").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['getCatalog/searchCourses.js', 'res/utils.js']
        });
    });
});

// Chat GPT
// Open the scheduler
document.getElementById('open-scheduler').addEventListener('click', () => {
    const targetURL = chrome.runtime.getURL("courseScheduler/scheduler.html");
    chrome.runtime.sendMessage({
        action: "openOrFocusTab",
        url: targetURL
    });
});

// Clears some local storage jus in case :)
document.getElementById('clearStorageCatalog').addEventListener('click', ()=>{
    localStorage.removeItem('catalogTmp');
    console.log('cleared catalogTmp');
});


document.getElementById("plan-ahead-debug").addEventListener('click', async ()=> {

    // Signal that the user is being directed
    //let weSentUser = true;

    const homeEllucian = 'https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/registration/registration';
    await chrome.tabs.create({url: homeEllucian});

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "WE_SENT_USER"
        });
    });
});