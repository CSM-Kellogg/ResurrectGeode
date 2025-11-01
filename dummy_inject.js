// Credit: https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
async function makeRequest (method, url, body=null, contentType=null, headers=null) {
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

        // Optional other headers as JSON object
        if (headers != null) {
            let keys = Object.keys(headers);
            let values = Object.values(headers);

            for (let i = 0; i < keys.length; i ++) {
                xhr.setRequestHeader(keys[i], values[i]);
            }
        }
        
        xhr.send(body);
    });
    
    return xhr;
}

// Clicks a button given the XPath
function safeClick(DOMelement) {
    
    if (DOMelement) {
        DOMelement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    } else {
        console.warn('Button not found.');
    }
}

const ellucian = "https://reg-prod.mines.elluciancloud.com:8118";
const planItem = '/StudentRegistrationSsb/ssb/plan/addPlanItem';
const voyageStart = '/StudentRegistrationSsb/ssb/term/termSelection?mode=plan';

const endptMap = {
    '/StudentRegistrationSsb/ssb/registration/registration': 100,
    '/StudentRegistrationSsb/ssb/term/termSelection?mode=plan': 0,
    '/StudentRegistrationSsb/ssb/plan/selectPlan': 1,
    '/StudentRegistrationSsb/ssb/plan/plan': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=1': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=2': 2,
    '/StudentRegistrationSsb/ssb/plan/plan?select=3': 2
};

