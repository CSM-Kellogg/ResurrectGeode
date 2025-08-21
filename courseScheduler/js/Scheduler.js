/**
 * Everything gets loaded in from here.
 * 
 * Also contains some button events, but not all of them. Not sure if software
 * design principles could be realistically applied.
 */

import catalog from './Catalog.js';
import { displayCourseContent } from './coursePopup.js';
import savedCourses from './savedCourses.js';
import genSchedule from './generateSchedules.js';
import breakManager from './breakManager.js';
import { exportSchedule } from './scheduleExport.js';

// Dynamically loads in the schedule background
window.addEventListener("load", (event) => {
    genSchedule.drawBackground();
    breakManager.enableBreakSelection();
    document.getElementById("toggle-break-mode").dispatchEvent(new MouseEvent("click", {bubbles: true}));
    breakManager.editMode = true;
    
    // Okay... this displays a schedule to each cell in the time table
    const cells = document.querySelectorAll("td.day-slot");
    cells.forEach((cell) => {cell.addEventListener("click", () => {
        genSchedule.displaySchedule(genSchedule.savedSchedules[genSchedule.currentIndex] || []);
    });});
});

// wasn't too sure where to put this, you can move it if you would like:)
// Buttons for navigating between the next and previous schedules
document.getElementById("next-schedule").addEventListener("click", () => {
    genSchedule.nextSchedule();
});

document.getElementById("prev-schedule").addEventListener("click", () => {
    genSchedule.prevSchedule();
});

// Button to generate schedules from a course list
document.getElementById("generate-schedule").addEventListener("click", () => {
    const courses = savedCourses.getActiveCourses();
    if (courses.length === 0) {
        alert("No courses selected. Add some first.");
        return;
    }
    genSchedule.generate(courses);
});

// Button to generate schedules from a course list
document.getElementById("export-schedule").addEventListener("click", () => {
    let courses = genSchedule.exportCurrentSchedule();
    
    if (courses == null) {
        alert("No Schedule could be exported");
        return 1;
    }
    
    exportSchedule(courses);
});

// Button for adding breaks to the schedule.
document.getElementById("toggle-break-mode").addEventListener("click", () => {
    breakManager.toggleMode();
    const btn = document.getElementById("toggle-break-mode");
    btn.textContent = breakManager.getMode() ? "Disable Break Edit Mode" : "Enable Break Edit Mode";
    btn.classList.toggle("btn-danger");
    btn.classList.toggle("btn-success");
    btn.classList.toggle("text-light");
});

// Button to clear all breaks
document.getElementById("clear-breaks").addEventListener("click", () => {
    breakManager.clearBreaks();
    genSchedule.displaySchedule(genSchedule.savedSchedules[genSchedule.currentIndex] || []);
});

// Arrow keys for switching between different schedules
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        console.log(event.key)
        genSchedule.nextSchedule();
    } else if (event.key === "ArrowLeft") {
        console.log(event.key)
        genSchedule.prevSchedule();
    }
});

// Submission to search box
// By ChatGPT and Grey Garner
document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const inputValue = document.getElementById('keyword-search').value;
    // Search for matches using the form submission
    await catalog.ready;
    const results = catalog.search(inputValue);
    
    const list = document.getElementById('search-results');
    list.innerHTML = ''; // Clear previous results
    
    // If no results, display accordingly
    if (results.length === 0) {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.textContent = 'No results found';
        list.appendChild(item);
        return;
    }
    
    // For each result, print the class as a search result
    results.forEach(course => {
        // Add the content for the search result
        // (is a button because it can be selected to reveal more information)
        const button = document.createElement('button');
        button.className = 'list-group-item list-group-item-action';
        button.textContent = `${course['class name']}`;
        
        let clickTimer = null;
        
        // Event listeners to display more info on each course
        button.addEventListener("click", () => {
            if (clickTimer !== null) return;
            
            clickTimer = setTimeout(() => {
                clickTimer = null;
                
                // Display the popup box and add in some event listeners. I
                // actually don't know what the 'proper' solution is, but I
                // think that coursePopup shouldn't reference savedCourses.js.
                const floatBox = displayCourseContent(course);
                floatBox.querySelector("#add-course-btn").onclick = () => {
                    savedCourses.addCourse(course); // Is singleton
                };
            }, 250);
        });
        
        button.addEventListener('dblclick', () => {
            clearTimeout(clickTimer);
            clickTimer = null;
            
            // Add a course to the listing (In a table body)
            savedCourses.addCourse(course);
        });
        
        // Add to results list
        list.appendChild(button);
    });
});