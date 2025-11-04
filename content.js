/**
* It seems that this loads when the window has finished(?) loading

As we proceed
* 1. Recognize what webpage we are on
* 2. Keep track of states - Such as login stuff (make a flowchart)
* 3. Send requests that are with the header "same-origin"
* 4. Add a course to a schedule plan


MAKE SAFE EXIT SUCH THAT THE voyage doesn't hang in 'detour' or 'Navigate'. Ensure that
every error point results in an 'idle'
*/


// https://www.bennettnotes.com/notes/fix-receiving-end-does-not-exist/

console.log("content script loaded");

// Navigates ellucian web pages to export some schedule saved in chrome's local storage

const ellucian = "https://reg-prod.mines.elluciancloud.com:8118";
const planItem = '/StudentRegistrationSsb/ssb/plan/addPlanItem';
const voyageStart = '/StudentRegistrationSsb/ssb/term/termSelection?mode=plan';
const getPlan = '/StudentRegistrationSsb/ssb/plan/getPlanEvents?termFilter=';

const endptMap = {
    '/StudentRegistrationSsb/ssb/registration/registration': 100,
    '/StudentRegistrationSsb/ssb/term/termSelection?mode=plan': 0,
    '/StudentRegistrationSsb/ssb/plan/selectPlan': 1,
    '/StudentRegistrationSsb/ssb/plan/plan': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=1': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=2': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=3': 2
};

// Retrieve the status of implementing a schedule plan
let voyagePlan = "helb";

// Credit https://stackoverflow.com/questions/3937000/chrome-extension-accessing-localstorage-in-content-script
chrome.runtime.sendMessage({action: "getVoyage"}, function(response) {
    voyagePlan = JSON.parse(response.schedulePlan);
    
    if (voyagePlan == null || voyagePlan.state == "Idle") {
        console.log("The captain does not concern itself with a voyage.")
        return;
    }
    
    // If the voyage it to be embarked, set sail.
    ellucianCaptain(voyagePlan);
});

async function ellucianCaptain(voyagePlan) {
    console.log("The captain has been seated");
    
    // Not on elluciancloud page at all
    if (!document.URL.includes(ellucian)) return;
    
    const currentEndpt = document.URL.split(ellucian)[1];
    
    // If we are on the plan select, send the post packet
    switch (endptMap[currentEndpt]) {
        // Current bug, need to create active session for user
        case 100:
        if (voyagePlan.state !== "Navigate") return;
        
        console.log("Huh, weird. Since in navigate, moving on by clicking");
        let planAheadElem = document.querySelector('#planningLink');
        safeClick(planAheadElem);
        break;
        case 0:
        if (voyagePlan.state !== "Navigate") return;
        
        console.log('At the term select. Sending the POST request and navigating to plan select');
        
        // Selects the term for spring(10) 2026 and redirects the user using window
        makeRequest("POST", ellucian + "/StudentRegistrationSsb/ssb/term/search?mode=plan&term=202610")
        .then(() => {
            window.location = ellucian + Object.keys(endptMap)[2];
        });
        break;
        case 1:
        if (voyagePlan.state !== "Navigate") return;
        
        console.log('At plan select, reading current number of plans and creating one');
        
        // Get current plans
        const currentPlans = parseInt(document.querySelector('.plan-count').innerHTML.match(/[0-9]+/g)[0]);
        
        // Alert the user if no plan can be created
        if (currentPlans > 2) {
            console.log('Unable to make a new plan, all slots are filled');
            alert('Please delete a plan to free up a spot');
            return;
        }
        
        // We can now create a plan!
        safeClick(document.querySelector('#createPlan'));
        break;
        
        case 2:
        console.log('At course planner, adding courses to plan');
        
        // Get x-syncronizer-token
        var syncToken = document.querySelector('meta[name="synchronizerToken"]').content;
        
        var secHeaders = {
            "X-Synchronizer-Token": syncToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
        };
        
        try {
            // Adding classes
            for (let i = 0; i < voyagePlan.crns.length; i ++) {
                var tmpPOSTSubmission = `term=202610&courseReferenceNumber=${voyagePlan.crns[i]}&section=section`;
                await makeRequest("POST", ellucian + planItem, tmpPOSTSubmission, 'application/x-www-form-urlencoded; charset=UTF-8', secHeaders);
            }
            
            // The exact request here isn't important, just so long as I get some response code in the 200 range
            var tmpPOSTSubmission = `term=202610&courseReferenceNumber=&section=section`;
            makeRequest("POST", ellucian + planItem, tmpPOSTSubmission, 'application/x-www-form-urlencoded; charset=UTF-8', secHeaders)
            .then(() => {
                // After the post to add the course, refresh the page with a new voyage state. This is important to avoid looping.
                // Then, click the summary info link.
                if (voyagePlan.state === "Navigate") {
                    voyagePlan.state = "jankyDetour";
                    chrome.runtime.sendMessage({action: "setVoyage", payload: JSON.stringify(voyagePlan)});
                    window.location.reload();
                } else {
                    console.log("new state");
                    
                    // For all CRNs, perform magic
                    for (let i = 0; i < voyagePlan.crns.length; i ++) {
                        // Select the popup menu for the first row in the last column (add remove menu) and change the style to block.
                        let addRemoveMenu = document.querySelector(`#summaryBody > div.grid-wrapper.grid-without-title > div > table > tbody > tr:nth-child(${i+1}) > td:nth-child(8) > select`);
                        if (addRemoveMenu) {
                            addRemoveMenu.style.display = 'block';
                        }
                        
                        // Now, Set the selector to remove
                        addRemoveMenu.value = 'Remove';
                        addRemoveMenu.dispatchEvent(new Event('change', {bubbles: true}));
                    }
                }
            }).then(() => {
                // Back to add. This is really fricken janky
                for (let i = 0; i < voyagePlan.crns.length; i ++) {
                    let addRemoveMenu = document.querySelector(`#summaryBody > div.grid-wrapper.grid-without-title > div > table > tbody > tr:nth-child(${i+1}) > td:nth-child(8) > select`);
                    addRemoveMenu.value = 'Add';
                    addRemoveMenu.dispatchEvent(new Event('change', {bubbles: true})); 
                }
            }).then(() => {
                // Click the save button and let the user continue from there. We can end the voyage too
                let saveBtn = document.querySelector('#saveButton');
                saveBtn.dispatchEvent(new Event('click', {bubbles: true}));
                
                // End voyage
                voyagePlan.state = 'Idle';
                chrome.runtime.sendMessage({action: "setVoyage", payload: JSON.stringify(voyagePlan)});
                
                alert('Give your plan a name and click save');
            });
        } catch(e) {
            // In case of some error, stop the voyage.
            voyagePlan.state = 'Idle';
            chrome.runtime.sendMessage({action: "setVoyage", payload: JSON.stringify(voyagePlan)});
            
            console.error(e);
        }
        
        break;
        
        default:
        console.log("How did we get here? Stopping voyage...");
        
        voyagePlan.state = 'Idle';
        chrome.runtime.sendMessage({action: "setVoyage", payload: JSON.stringify(voyagePlan)});
        
        break;
    }
}