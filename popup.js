
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


document.getElementById("plan-ahead-debug").addEventListener('click', () => {
    const homeEllucian = 'https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/registration/registration';
    
    const newPlan = "https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/plan/plan"

    // Open the new tab
    // chrome.tabs.create({ url: homeEllucian }, function (newTab) {
    //     // Wait until tab finishes loading
    //     chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
    //         if (tabId === newTab.id && changeInfo.status === 'complete') {
    
    //             // Inject content script into the new tab
    //             chrome.scripting.executeScript({
    //                 target: { tabId: tabId },
    //                 files: ['sendCourses/debug.js']
    //             });
    //         }
    //     });
    // });
    
    fetch(newPlan, {
        credentials: "include" // sends cookies/session info
    })
    .then(res => {
        chrome.runtime.sendMessage({ type: "log", message: res.text() });
    })
    .then(html => {
        chrome.runtime.sendMessage({ type: "log", message: `HTML: ${html}` });
        // if (html.includes("login") || html.includes("sign in")) {
        //     chrome.runtime.sendMessage({ type: "log", message: "User is not logged in" });
        //     // Prompt or redirect the user to log in
        // } else {
        //     chrome.runtime.sendMessage({ type: "log", message: "User is logged in" });
        //     // Proceed with form submission or next step
        // }
    })
    .catch(err => chrome.runtime.sendMessage({ type: "log", message: `Error checking login status:${err}` }));
});