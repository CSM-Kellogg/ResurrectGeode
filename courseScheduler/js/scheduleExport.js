export function exportSchedule(CRNs) {
    const homeEllucian = 'https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/registration/registration';
    
    const newPlan = "https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/plan/plan"
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", newPlan, false ); // false for synchronous request
    xmlHttp.send( null );
    
    if (xmlHttp.responseText.match(/<input.*name="SAMLRequest"/)) {
        alert("Please sign in first");
        
        
    }
    
    chrome.tabs.create({url: newPlan});
    console.log( xmlHttp.responseText);
}