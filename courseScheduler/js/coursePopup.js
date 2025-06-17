// Displays content of selected course
// Collaboration of Liam Kellogg and ChatGPT

// shorthands for subjects (e.g. Communications -> LICM)
const deptShrtHand = {
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

export function displayCourseContent(course) {
    // Remove previous floating box if present
    let floatBox = document.getElementById('floating-popup');
    if (floatBox) {
        floatBox.innerHTML='';
    } else {
        // create n new one if not
        floatBox = document.createElement('div');
        floatBox.id = 'floating-popup';
        floatBox.className = 'floating-box resize-drag';
    }

    // Close button and header using a template in scheduler.html
    const template = document.getElementById("course-header-template");
    const header = template.content.cloneNode(true);

    header.querySelector(".close-btn").onclick = () => floatBox.remove();

    floatBox.appendChild(header);
    
    // Body of the info box
    const infoArea = document.createElement('div');
    floatBox.appendChild(infoArea);

    // Helper function for adding information to the floatBox
    const addInfo = (label, content) => {
        const container = document.createElement('p');
        container.className = 'm-1';
        container.innerHTML = `<strong>${label}:</strong> ${content}`;
        infoArea.appendChild(container);
    };
    
    const title = document.createElement('h5');
    title.textContent = `${deptShrtHand[course['department']]} ${course['coursenum']} - ${course['class name']}` || 'Course Details';
    infoArea.appendChild(title);

    // Content of course
    addInfo('Campus', course['campus']);
    addInfo('Credits', course['credits']);
    if (course['pre-reqs'] != 'null') addInfo('Prerequisites', course['pre-reqs']);
    else addInfo('Pre-requisites', "No Pre-requisites");
    if (course['mutual-exclusions']) addInfo('Mutual Exclusions', course['mutual exclusions']);
    addInfo('Course Description', course['coursedescription'] || "No course description");
    
    document.body.appendChild(floatBox);

    return floatBox;
}