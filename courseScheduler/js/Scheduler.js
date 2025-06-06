import catalog from './Catalog.js';
import { displayCourseContent } from './coursePopup.js';
import savedCourss from './savedCourses.js';
import genSchedule from './generateSchedules.js';

// Dynamically loads in the schedule background
window.addEventListener("load", (event) => {
  genSchedule.drawBackground();
});

// Submission to search box
// By ChatGPT and Grey Garner
document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const inputValue = document.getElementById('keyword-search').value;
    // Search for matches using the form submission
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
    
    //console.log(`results length: ${results.length}`);
    
    let selection = false;
    
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
                
                // display Sections
                selection = !selection;
                displayCourseContent(course);
            }, 250);
        });
        
        button.addEventListener('dblclick', () => {
            clearTimeout(clickTimer);
            clickTimer = null;
            
            // Add a course to the listing (In a table body)
            savedCourss.addCourse(course);
        });
        
        // Add to results list
        list.appendChild(button);
    });
});