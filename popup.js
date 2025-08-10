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
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", newPlan, false ); // false for synchronous request
    xmlHttp.send( null );
    
    if (xmlHttp.responseText.match(/<input.*name="SAMLRequest"/)) {
        console.log("Gotta sign in bruh");
        
        const targetURL = chrome.runtime.getURL("dummy.html");
        chrome.runtime.sendMessage({
            action: "openOrFocusTab",
            url: targetURL
        });

        fs.writeFile(dummy.html, xmlHttp.responseText, (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('File written successfully!');
            }
        });
    }
    
    console.log( xmlHttp.responseText);
});