/**
 * 
 * @param {*} CRNs 
 * @returns 
 */
export async function exportSchedule(CRNs) {
    // mmm strings... hungy
    const ellucian = 'https://reg-prod.mines.elluciancloud.com:8118';
    const termSelect = '/StudentRegistrationSsb/ssb/term/termSelection?mode=plan';
    
    // Check if the user has an active session low key - TODO

    // Store classes to add to a plan within a JSON object for localStorage
    // crns are stored as a csv
    let exportObj = {
        state: "Navigate",
        crns: []
    };
    CRNs.forEach(element => { exportObj.crns.push(element); });

    chrome.storage.local.set({'schedulePlan': JSON.stringify(exportObj)}, function() {
        console.log('Courses sent to localStorage');
    });

    // Content.js takes over
    chrome.tabs.create({url: ellucian + termSelect});
}

/* Some Notes

strict-origin-when-cross-origin: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
 - From HTTPS -> HTTPS
*/

