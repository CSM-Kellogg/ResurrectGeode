// Credit: https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
async function makeRequest (method, url, body=null, contentType=null) {
    var xhr = null;
    await new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        
        // Optional Header
        if (contentType != null) {
            xhr.setRequestHeader("Content-Type", contentType);
        }
        
        xhr.send(body);
    });
    
    return xhr;
}

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



*/

/**
 * 
 * @param {*} CRNs 
 * @returns 
 */

export async function exportSchedule(CRNs) {
    // Base website to make our requests to
    const ellucian = 'https://reg-prod.mines.elluciancloud.com:8118';
    
    // The suffix -- different endpoints in the website that navigate to different pages and can make POST requests
    const login = '/StudentRegistrationSsb/saml/login';
    const selectPlan = '/StudentRegistrationSsb/ssb/plan/selectPlan';
    const planCreator = '/StudentRegistrationSsb/ssb/plan/plan';
    const planItem = '/StudentRegistrationSsb/ssb/plan/addPlanItem';
    const submitPlan = '/StudentRegistrationSsb/ssb/plan/submitPlan/batch';
    
    // Check if the user needs to sign in
    var xmlLogin = await makeRequest("GET", ellucian + selectPlan); 
    
    if (xmlLogin.responseText.match(/<input.*name="SAMLRequest"/)) {
        alert("Please sign in first");
        chrome.tabs.create({url: ellucian + login});
        return true;
    }
    
    // Selects the term for fall(80) 2025
    await makeRequest("POST", ellucian + "/StudentRegistrationSsb/ssb/term/search?mode=plan&term=202580");
    
    // This has the possibility of returning that saml redirect thing
    var xmlPlanCreator = await makeRequest("GET", ellucian + planCreator);
    
    // Send the post with payload (this may be un-needed)
    var tmpPOSTSubmission = `term=202580&courseReferenceNumber=${80084}&section=section`;
    await makeRequest("POST", ellucian + planItem, tmpPOSTSubmission, 'application/x-www-form-urlencoded');

    var debugTermFilter = await makeRequest("GET", ellucian + "/StudentRegistrationSsb/ssb/plan/getPlanEvents?termFilter=");

    console.log(debugTermFilter.responseText);

    // Create a plan
    var tmpPOSTplanSubmit = JSON.stringify({
        create: [{
            headerDescription: "HelloThere",
            headerComment: "hi there"
        }]
    });

    await makeRequest("POST", ellucian + submitPlan, tmpPOSTplanSubmit, 'application/json');

    // Add a class to the plan
    const tmpPOSTcourseAdd = JSON.stringify({
        create: [{
            courseReferenceNumber: "80084",
            
            isDeleteAction: false,
            isRegistered: false,
            planStatus: "Pending",
            class: "net.hedtech.banner.student.registration.RegistrationStudentRegistrationPlanCourse",

            selectedPlanAction: {
                class: "net.hedtech.banner.student.registration.RegistrationPlanAction",
                description: null,
                isDeleteAction: false,
                planCourseStatus: "Add"
            }
        }],
        destroy: [],
        update: []
    });

    await makeRequest("POST", ellucian + submitPlan, tmpPOSTcourseAdd, 'application/json'); 
}