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

console.log("The captain has been seated");

// Navigates ellucian web pages to export some schedule saved in chrome's local storage

const ellucian = "https://reg-prod.mines.elluciancloud.com:8118"

const endptMap = {
    '/StudentRegistrationSsb/ssb/term/termSelection?mode=plan': 0,
    '/StudentRegistrationSsb/ssb/plan/selectPlan': 1
}

function main(_document) {

    // Not on elluciancloud page at all
    if (!_document.URL.includes(ellucian)) return;

    const currentEndpt = _document.URL.split(ellucian)[1];

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
            break;
        default: break;
    }
}

main(document);