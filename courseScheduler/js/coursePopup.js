// Displays more content of a selected course
// Collaboration of Liam Kellogg and ChatGPT

import { deptShrtHand } from "./utils.js";
import { getAllEnrollment } from "./courseAvailability.js";

export async function displayCourseContent(course) {
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

    // Add enrollment
    let enrollmentInfo = await getAllEnrollment([course]);

    addInfo('Section availabilities', '');
    let enrollmentInfoTable = createEnrollmentTable(enrollmentInfo);
    infoArea.appendChild(enrollmentInfoTable);
    
    document.body.appendChild(floatBox);

    return floatBox;
}

// Thanks gemini
function createEnrollmentTable(dataObj) {
    
    // 1. Convert object-of-objects to array-of-objects for easier iteration
    // The key (1, 2, etc.) is implicitly the ID/Row Header
    const dataArray = Object.keys(dataObj).map(key => ({
        'CRN': key, // Adding the key as a column named 'ID'
        ...dataObj[key]
    }));

    // 2. Get the column headers from the first object
    const headers = Object.keys(dataArray[0]);

    // 3. Create table elements
    const table = document.createElement('table');
    // Apply essential Bootstrap classes for styling
    table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover'); 

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // --- Create Table Header (<thead>) ---
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // --- Create Table Body (<tbody>) ---
    dataArray.forEach(rowData => {
        const row = document.createElement('tr');
        headers.forEach(headerKey => {
            const td = document.createElement('td');
            // Use the header key to get the corresponding value from the row data
            td.textContent = rowData[headerKey]; 
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    // 4. Assemble and display the table
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}