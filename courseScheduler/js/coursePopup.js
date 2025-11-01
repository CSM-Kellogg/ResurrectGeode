// Displays more content of a selected course
// Collaboration of Liam Kellogg and ChatGPT

import { deptShrtHand } from "./utils.js";

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