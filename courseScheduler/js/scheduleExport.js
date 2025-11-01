/* Temporary Notes

Returns the currently registered, pending, and waitlisted classes as a JSON

    StudentRegistrationSsb/ssb/plan/getPlanEvents?termFilter=

Old stuff I don't think I'll need but is currently a reference
    
    let fwdURL = JSON.parse(xmlTermSelect.responseText)["fwdURL"];
    var xmlplanCreator = await makeRequest("GET", ellucian + fwdURL);
    xmlResult.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

I wonder if this is the only request I need. The rest may be mote.
It all might end up in this payload
    
    var tmpPOSTplanSubmit = JSON.stringify({
        create: [{
            headerDescription: "HelloThere",
            headerComment: "hi there",
            courseReferenceNumber: "80084",
    
            isDeleteAction: false,
            isRegistered: false,
            planStatus: "Pending",
    
            selectedPlanAction: {
                class: "net.hedtech.banner.student.registration.RegistrationPlanAction",
                description: null,
                isDeleteAction: false,
                planCourseStatus: "Add"
            },
    
            term: "202580"
        }]
    });

Idea:
1. Inject a js script into the plan creator on ellucian for some plan
2. send xhr requests using the synchronizer token and other headers (same origin requests)

*/

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

