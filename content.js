/**
* It seems that this loads when the window has finished(?) loading

As we proceed
* 1. Recognize what webpage we are on
* 2. Keep track of states - Such as login stuff (make a flowchart)
* 3. Send requests that are with the header "same-origin"
* 4. Add a course to a schedule plan
*/


// https://www.bennettnotes.com/notes/fix-receiving-end-does-not-exist/

console.log("content script loaded");

// Navigates ellucian web pages to export some schedule saved in chrome's local storage

const ellucian = "https://reg-prod.mines.elluciancloud.com:8118";
const planItem = '/StudentRegistrationSsb/ssb/plan/addPlanItem';

const endptMap = {
    '/StudentRegistrationSsb/ssb/term/termSelection?mode=plan': 0,
    '/StudentRegistrationSsb/ssb/plan/selectPlan': 1,
    '/StudentRegistrationSsb/ssb/plan/plan': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=1': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=2': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=3': 2
};

function ellucianCaptain() {
    console.log("The captain has been seated");

    // Not on elluciancloud page at all
    if (!document.URL.includes(ellucian)) return;

    const currentEndpt = document.URL.split(ellucian)[1];

    // If we are on the plan select, send the post packet
    switch (endptMap[currentEndpt]) {
        case 0:
            console.log('At the term select. Sending the POST request and clicking the button');

            // Selects the term for fall(80) 2025
            makeRequest("POST", ellucian + "/StudentRegistrationSsb/ssb/term/search?mode=plan&term=202580")
            .then(() => {
                // Click the 'go' button
                safeClick(document.querySelector('#term-go'));
                console.log('here');
            });
            break;
        case 1:
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

            // Adding classes
            var tmpPOSTSubmission = `term=202580&courseReferenceNumber=${81141}&section=section`;
            var secHeaders = {
                "X-Synchronizer-Token": syncToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json, text/javascript, */*; q=0.01'
            };

            makeRequest("POST", ellucian + planItem, tmpPOSTSubmission, 'application/x-www-form-urlencoded; charset=UTF-8', secHeaders)
            .then(() => {
                console.log('getting');
                makeRequest("GET", 'https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/plan/getPlanEvents?termFilter=', null, null, secHeaders);
            });

            // Submitting plan


            // Naming plan and confirming form submission

            break;
        
        default: break;
    }
}

function main() {
    ellucianCaptain();
}

main();