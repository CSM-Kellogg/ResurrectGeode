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

    //console.log(output);

    return output;
}