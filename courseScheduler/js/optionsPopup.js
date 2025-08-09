/**
 * By: Liam Kellogg
 * 
 * A function that displays a popup to change the section of a class.
 * This is a result of merging sections of a class with the same time
 * 
 * @param {HTMLElement} parent The reference to a scheduled class time
 * @param {*} sectionListing Information of the sections that are contained in the scheduled class time
 * @param {*} currentChoices The current choices the user has selected
 * @param {*} index The index of the section in 'some schedule'
 */

import genScheduleInstance from "./generateSchedules.js";

export function displayOptionsPopup(parent, sectionListing, currentChoices, index) {
    parent.addEventListener('click', (event) => {
        let optionsPopup = document.querySelector('#options-popup');

        // Make sure that two copies cant be loaded in at the same time
        if (optionsPopup) {
            optionsPopup.innerHTML = '';
        } else {
            optionsPopup = document.createElement('div');
            optionsPopup.id = 'options-popup';
            optionsPopup.className = 'floating-box resize-drag';
        }

        // Close button and header using a template in scheduler.html
        let template = document.getElementById("course-header-template");
        const header = template.content.cloneNode(true);

        // Modify the header and append to popup
        header.querySelector('#add-course-btn').remove();
        header.querySelector('.fw-bold').innerHTML = "Course Options Select";
        
        header.querySelector(".close-btn").onclick = () => optionsPopup.remove();

        optionsPopup.append(header);

        // Show the options for this class
        const popupBody = document.createElement('div');
        
        // Get the template
        template = document.getElementById("options-popup-template");
        const table = template.content.cloneNode(true);

        // Sample row
        let tableRow = table.querySelector("tbody tr");

        // Add data to the table
        for (let i = 0; i < sectionListing['CRN'].length; i ++) {
            let tmp = tableRow.cloneNode(true);
            
            tmp.children[0].textContent = sectionListing['CRN'][i] || "Uh oh, wym no crn";
            tmp.children[1].textContent = sectionListing['instructorName'][i] || "Unspecified";
            tmp.children[2].textContent = sectionListing['room'][i] || "Unspecified";
            tmp.children[3].textContent = sectionListing['sectionCode'][i] || "Unspecified";

            // Cursor management
            tmp.style.cursor = "pointer";

            tmp.addEventListener('click', (event) => {
                currentChoices[index] = i;
                updateSelection(tmp.parentElement, currentChoices[index]);
                genScheduleInstance.updateSchedule(); // Also update the schedule 
            });

            // Append table row
            table.querySelector('tbody').append(tmp);
        }
        tableRow.remove();

        // highlight the current selection
        updateSelection(table.querySelector('tbody'), currentChoices[index]);

        popupBody.append(table);
        optionsPopup.append(popupBody);

        // Append popup to body
        document.querySelector('body').appendChild(optionsPopup);

    }, {once: true});

    //return currentChoice;
}

function updateSelection(tbody, choice) {
    for (let i = 0; i < tbody.children.length; i ++) {
        if (i == choice) {
            for (const child of tbody.children[i].children) {
                child.style.backgroundColor = '#c0f1fc';
            }
            // I cant set the parent background color helb
        } else {
            for (const child of tbody.children[i].children) {
                child.style.backgroundColor = ''; // Clears the style, apparently
            }
        }
    }
}