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

function ellucianCaptain(voyagePlan) {
    console.log("The captain has been seated");

    // Not on elluciancloud page at all
    if (!document.URL.includes(ellucian)) return;

    const currentEndpt = document.URL.split(ellucian)[1];

    // If we are on the plan select, send the post packet
    switch (endptMap[currentEndpt]) {
        case 0:
            if (voyagePlan.state !== "Navigate") return;

            console.log('At the term select. Sending the POST request and navigating to plan select');

            // Selects the term for fall(80) 2025 and redirects the user using window
            makeRequest("POST", ellucian + "/StudentRegistrationSsb/ssb/term/search?mode=plan&term=202580")
            .then(() => {
                window.location = ellucian + Object.keys(endptMap)[1];
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

            // Adding classes
            var tmpPOSTSubmission = `term=202580&courseReferenceNumber=${81141}&section=section`;
            var secHeaders = {
                "X-Synchronizer-Token": syncToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json, text/javascript, */*; q=0.01'
            };

            // Tmp testings
            holyBlob = {
                "create": [
                    {
                        "activeIndicator": true,
                        "attached": false,
                        "attribute": null,
                        "authorizationReason": null,
                        "authorizationRequired": false,
                        "availableActions": [
                            {
                                "class": "net.hedtech.banner.student.registration.RegistrationPlanAction",
                                "description": "Add",
                                "isDeleteAction": false,
                                "planCourseStatus": "Add"
                            },
                            {
                                "class": "net.hedtech.banner.student.registration.RegistrationPlanAction",
                                "description": "Remove",
                                "isDeleteAction": true,
                                "planCourseStatus": "Remove"
                            }
                        ],
                        "campus": null,
                        "class": "net.hedtech.banner.student.registration.RegistrationStudentRegistrationPlanCourse",
                        "college": null,
                        "comment": null,
                        "completionDate": null,
                        "courseDisplay": "111",
                        "courseNumber": "111",
                        "courseReferenceNumber": "81141",
                        "courseRegistrationStatusDescription": null,
                        "courseTitle": "CALCULUS FOR SCIENTISTS AND ENGINEERS I",
                        "creditHours": 4,
                        "credits": null,
                        "criticalIndicator": false,
                        "dataOrigin": null,
                        "department": null,
                        "dirty": false,
                        "dirtyPropertyNames": [],
                        "durationUnit": null,
                        "dwAttributeSummary": null,
                        "dwChoiceDescription": null,
                        "dwGroupNumber": null,
                        "dwGroupSelection": false,
                        "dwUniqueId": null,
                        "errors": {
                            "errors": []
                        },
                        "gradingMode": "S",
                        "gradingModeDescription": "Standard Letter",
                        "id": null,
                        "instructionalMethod": "TR",
                        "instructionalMethodDescription": "Face to Face",
                        "instructors": [],
                        "isDeleteAction": false,
                        "isRegistered": false,
                        "lastModified": null,
                        "learnerRegStartFromDate": null,
                        "learnerRegStartToDate": null,
                        "level": null,
                        "levelDescription": null,
                        "lockIndicator": false,
                        "message": null,
                        "numberOfUnits": null,
                        "overrideDurationIndicator": false,
                        "partOfTerm": "F01",
                        "partOfTermDescription": "Full Term-Fall",
                        "partOfTermEndDate": "12/19/2025",
                        "partOfTermStartDate": "08/25/2025",
                        "planNumber": null,
                        "planStatus": "Pending",
                        "properties": {
                            "college": null,
                            "scheduleTypeDescription": "Lecture",
                            "subject": "MATH",
                            "criticalIndicator": false,
                            "planStatus": "Pending",
                            "section": "B",
                            "partOfTerm": "F01",
                            "learnerRegStartToDate": null,
                            "instructors": [],
                            "dwAttributeSummary": null,
                            "overrideDurationIndicator": false,
                            "courseTitle": "CALCULUS FOR SCIENTISTS AND ENGINEERS I",
                            "sourceCode": null,
                            "gradingMode": "S",
                            "instructionalMethod": "TR",
                            "durationUnit": null,
                            "activeIndicator": true,
                            "isDeleteAction": false,
                            "sequenceNumber": null,
                            "courseRegistrationStatusDescription": null,
                            "level": null,
                            "instructionalMethodDescription": "Face to Face",
                            "campus": null,
                            "registrationCreditHour": null,
                            "courseReferenceNumber": "81141",
                            "planNumber": null,
                            "creditHours": 4,
                            "dwUniqueId": null,
                            "scheduleType": "L",
                            "gradingModeDescription": "Standard Letter",
                            "partOfTermDescription": "Full Term-Fall",
                            "isRegistered": false,
                            "lastModified": null,
                            "startDate": null,
                            "registrationStatusDate": null,
                            "partOfTermStartDate": "08/25/2025",
                            "levelDescription": null,
                            "selectedStartEndDate": null,
                            "credits": null,
                            "lockIndicator": false,
                            "partOfTermEndDate": "12/19/2025",
                            "dwChoiceDescription": null,
                            "dataOrigin": null,
                            "term": "202580",
                            "attribute": null,
                            "department": null,
                            "availableActions": [
                                {
                                    "class": "net.hedtech.banner.student.registration.RegistrationPlanAction",
                                    "description": "Add",
                                    "isDeleteAction": false,
                                    "planCourseStatus": "Add"
                                },
                                {
                                    "class": "net.hedtech.banner.student.registration.RegistrationPlanAction",
                                    "description": "Remove",
                                    "isDeleteAction": true,
                                    "planCourseStatus": "Remove"
                                }
                            ],
                            "authorizationReason": null,
                            "dwGroupNumber": null,
                            "courseNumber": "111",
                            "selectedPlanAction": {
                                "class": "net.hedtech.banner.student.registration.RegistrationPlanAction",
                                "description": null,
                                "isDeleteAction": false,
                                "planCourseStatus": "Add"
                            },
                            "tuid": 189040730,
                            "message": null,
                            "dwGroupSelection": false,
                            "numberOfUnits": null,
                            "authorizationRequired": false,
                            "learnerRegStartFromDate": null,
                            "courseDisplay": "111",
                            "comment": null,
                            "completionDate": null
                        },
                        "registrationCreditHour": null,
                        "registrationStatusDate": null,
                        "scheduleType": "L",
                        "scheduleTypeDescription": "Lecture",
                        "section": "B",
                        "selectedPlanAction": {
                            "class": "net.hedtech.banner.student.registration.RegistrationPlanAction",
                            "description": null,
                            "isDeleteAction": false,
                            "planCourseStatus": "Add"
                        },
                        "selectedStartEndDate": null,
                        "sequenceNumber": null,
                        "sourceCode": null,
                        "startDate": null,
                        "subject": "MATH",
                        "term": "202580",
                        "tuid": 189040730,
                        "version": null
                    }
                ],
                "update": [],
                "destroy": []
            }
            
            makeRequest("POST", "https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/plan/submitPlan/batch", JSON.stringify(holyBlob), 'application/json, text/javascript, */*; q=0.01', secHeaders)
            .then(() => {
                console.log("done with sending the unholy blob");
            });

            // End tmp testings

            /*makeRequest("POST", ellucian + planItem, tmpPOSTSubmission, 'application/x-www-form-urlencoded; charset=UTF-8', secHeaders)
            .then(() => {
                if (voyagePlan.state === "Navigate") {
                    voyagePlan.state = "jankyDetour";
                    chrome.runtime.sendMessage({action: "setVoyage", payload: JSON.stringify(voyagePlan)});
                    window.location.reload();
                } else {
                    console.log("new state");

                    safeClick(document.querySelector('#newSummaryInfoLink'));
                }
                
                if (document.querySelector("#summaryInfo") != null) {
                    return true;
                } else {
                    return new Promise(function(resolve, reject) {
                        let foo = document.querySelector('#newSummaryInfo').style.display;

                        if (foo == '') {
                            resolve(true);
                        }
                    });
                }
            }).then(() => {
                console.log('hi');  
            });*/

            break;
        
        default:
            console.log("How did we get here?");

            break;
    }
}