import {makeRequest} from './utils.js'

const ellucian = 'https://reg-prod.mines.elluciancloud.com:8118';
const enrollInfo = '/StudentRegistrationSsb/ssb/searchResults/getEnrollmentInfo';

// Gets the enrollment info for some CRN in the 2026 spring catalog. Parses and returns a JSON object
/* Example

{
    Enrollment Actual: "0",
    Enrollment Maximum: "30",
    Enrollment Seats Available: "30",
    Waitlist Actual: "0",
    Waitlist Capacity: "0",
    Waitlist Seats Available: "0"
}

*/

const mapper = {
    "Enrollment Actual": "Enrolled",
    "Enrollment Maximum": "Capacity",
    "Enrollment Seats Available": "Available Seats",
    "Waitlist Actual": "On waitlist",
    "Waitlist Capacity": "Waitlist Capacity",
    "Waitlist Seats Available": "Available Waitlist Spots"
}

export async function getEnrollmentInfo(CRN) {
    // Make the request
    let xhr = await makeRequest('POST', ellucian + enrollInfo, `term=202610&courseReferenceNumber=${CRN}`, 'application/x-www-form-urlencoded');

    // Parse out the html hubbub
    let tmp = document.createElement('div');

    tmp.innerHTML = xhr.responseText;
    let parsedText = tmp.textContent.split(/\s\s+/).filter(Boolean);

    tmp.remove(); // Preserves storage I think

    // Turn into JSON object
    let output = {};
    parsedText.forEach((line) => {
        let a = line.split(/:\s+/)
        output[a[0]] = a[1];
    });

    let reducedOutput = Object.keys(output).reduce((newObj, oldKey) => {
        const newKey = mapper[oldKey] || oldKey;
        newObj[newKey] = output[oldKey];

        return newObj;
    }, {});

    return reducedOutput;
}

// courses is an array with rich info on each course (see invocation in Sheduler.js)
/**
 * 
 * @param {*} courses courses (rich info, contains list of CRNS)
 * @returns an object with key CRN to value availability object
 */
export async function getAllEnrollment(courses) {
    // Coursename as key for array
    //  crn as key for object
    //      Availability as value
    let output = {};

    for (let i = 0; i < courses.length; i ++) {
        let course = courses[i];
        
        for (let j = 0; j < course.sectionListing.length; j ++) {
            let crn = course.sectionListing[j][0];
            output[crn]  = await getEnrollmentInfo(crn);
        }
    }

    return output;
}