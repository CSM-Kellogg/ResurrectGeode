/**
 * By: Liam Kellogg, Grey Garner, and ChatGPT
 * 
 * A set of useful functions that don't have a place anywhere else, really.
 */

// shorthands for subjects (e.g. Communications -> LICM)
export const deptShrtHand = {
    "Advanced Manufacturing": "AMFG",
    "Air Force": "AFGN",
    "APPLIED MATHEMATICS AND STATISTICS": "AMS",
    "Biology": "BIOL",
    "Carbon Capture": "CCUS",
    "Chemical & Biological Engin": "CBEN",
    "Civil & Environmental Engin": "CEE",
    "Chemistry, General": "CHGN",
    "Chemistry, Geochemistry": "CHGC",
    "Communications": "LICM",
    "Computer Science": "CSCI",
    "Computer Science Education": "CSED",
    "CSM": "CSM",
    "Data Science": "DSCI",
    "Economics and Business": "EBGN",
    "Engineering Design & Society": "EDS",
    "Electrical Engineering": "EENG",
    "Energy": "ENGY",
    "Finite Element Analysis": "FEGN",
    "Foreign Language": "LIFL",
    "Geological Engineering": "GEGN",
    "Geology": "GEOL",
    "Geophysical Engineering": "GPGN",
    "Geochemical Exploration": "GEGX",
    "Honors Program": "HNRS",
    "Humanities Arts Social Science": "HASS",
    "Materials Science": "MLGN",
    "Mathematics": "MATH",
    "Mathematics Education": "MAED",
    "Mechanical Engineering": "MEGN",
    "Met & Materials Engnrng": "MTGN",
    "Military Science": "MSGN",
    "Mining Engineering": "MNGN",
    "Music": "LIMU",
    "Nuclear Engineering": "NUGN",
    "Petroleum Engineering": "PEGN",
    "Physical Activities": "PAGN",
    "Physics": "PHGN",
    "Robotics": "ROBO",
    "Science Education": "SCED",
    "Space Resources": "SPRS",
    "Systems Courses": "SYGN"
}

// Decodes HTML and the special character encoding used in them.
export function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;

    // repeat until necessary
    if (txt.value != html) {
        return decodeHTML(txt.value);
    }
    return txt.value;
}

// A custom parser for some non JSON-ish string. In particular, the sections
// for a course. Handles escaped characters, double vs. single quotes, commas,
// and braces.
// By: Liam Kellogg
export function customSectionParser(txtbob) {
    let output = [[]];
    let curr_element = "";
    let inString = false;
    let isSingleQuote = false;

    // let output = [];
    // let currentIndex = 0;

    // for(let i = 0; i < txtbob.length; i ++) {
    //     switch(txtbob[i]) {
    //         case '\\':
    //             //escape!
    //             i ++;
    //             curr_element += txtbob[i];
    //             break;
    //         case '[':
    //             if (inString) {
    //                 curr_element += '[';
    //             } else {
    //                 output.push([]);
    //             }
    //             break;
    //         case ']':
    //             if (inString) {
    //                 curr_element += ']';
    //             } else {
    //                 currentIndex ++;
    //             }
    //             break;
    //         case "'":
    //             if (inString) {
    //                 if (isSingleQuote) {
    //                     output[output.length - 1].push(curr_element);
    //                     inString = false;
    //                 } else {
    //                     curr_element += "'";
    //                 }
    //             } else {
    //                 inString = true;
    //                 isSingleQuote = true;
    //             }
    //             break;
    //         case '"':
    //             if (inString) {
    //                 if (!isSingleQuote) {
    //                     output[output.length - 1].push(curr_element);
    //                     inString = false;
    //                 } else {
    //                     curr_element += '"';
    //                 }
    //             } else {
    //                 inString = true;
    //                 isSingleQuote = false;
    //             }
    //             break;
    //         case ',':
    //             if (inString) {
    //                 curr_element += ',';
    //             } else {
    //                 curr_element = '';
    //             }
    //             break;
    //         default:
    //             if (inString) {
    //                 curr_element += txtbob[i];
    //             }
    //     }
    // }
    // output.pop(); // Gets rid of empty []
    // output.pop();


    for(let i = 0; i < txtbob.length; i ++) {
        switch(txtbob[i]) {
            case '\\':
                //escape!
                i ++;
                curr_element += txtbob[i];
                break;
            case '[':
                if (inString) {
                    curr_element += '[';
                }
                break;
            case ']':
                if (inString) {
                    curr_element += ']';
                } else {
                    // New element (maybe idk)
                    output.push([]);
                }
                break;
            case "'":
                if (inString) {
                    if (isSingleQuote) {
                        output[output.length - 1].push(curr_element);
                        inString = false;
                    } else {
                        curr_element += "'";
                    }
                } else {
                    inString = true;
                    isSingleQuote = true;
                }
                break;
            case '"':
                if (inString) {
                    if (!isSingleQuote) {
                        output[output.length - 1].push(curr_element);
                        inString = false;
                    } else {
                        curr_element += '"';
                    }
                } else {
                    inString = true;
                    isSingleQuote = false;
                }
                break;
            case ',':
                if (inString) {
                    curr_element += ',';
                } else {
                    curr_element = '';
                }
                break;
            default:
                if (inString) {
                    curr_element += txtbob[i];
                }
        }
    }
    output.pop(); // Gets rid of empty []
    output.pop();
    return output;
}

// Credit: https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
// Duplicate because service worker scripts cannot run on any chrome:// page.
export async function makeRequest (method, url, body=null, contentType=null, headers=null) {
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