import catalog from './Catalog.js';
import { displayCourseContent } from './coursePopup.js';
import savedCourses from './savedCourses.js';
import genSchedule from './generateSchedules.js';
import genScheduleInstance from './generateSchedules.js';

// Dynamically loads in the schedule background
window.addEventListener("load", (event) => {
  genSchedule.drawBackground();
  genSchedule.enableBreakSelection();
});

//wasn't too sure where to put this, you can move it if you would like:)
document.getElementById("next-schedule").addEventListener("click", () => {
    genSchedule.nextSchedule();
});

document.getElementById("prev-schedule").addEventListener("click", () => {
    genSchedule.prevSchedule();
});

document.getElementById("generate-schedule").addEventListener("click", () => {
    const courses = savedCourses.getCourses();
    if (courses.length === 0) {
        alert("No courses selected. Add some first.");
        return;
    }
    genSchedule.generate(courses);
});

document.getElementById("toggle-break-mode").addEventListener("click", () => {
    genSchedule.breakEditMode = !genSchedule.breakEditMode;
    const btn = document.getElementById("toggle-break-mode");
    btn.textContent = genSchedule.breakEditMode ? "Disable Break Edit Mode" : "Enable Break Edit Mode";
    btn.classList.toggle("btn-danger");
    btn.classList.toggle("btn-success");
});

document.getElementById("clear-breaks").addEventListener("click", () => {
    genSchedule.unavailableBlocks = [];
    genSchedule.displaySchedule(genSchedule.savedSchedules[genSchedule.currentIndex] || []);
});
let intervalId = null;
let currentDirection = null;


document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    console.log(event.key)
    genScheduleInstance.nextSchedule();
  } else if (event.key === "ArrowLeft") {
    console.log(event.key)
    genScheduleInstance.prevSchedule();
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