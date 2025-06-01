import catalog from './Catalog.js';

function displayCourseContent(course) {
    const detailContainer = document.getElementById('course-detail');
            const detailTitle = document.getElementById('detail-title');
            const detailBody = document.getElementById('detail-body');
          
            // Show the detail section
            detailContainer.style.display = 'block';
          
            // Set title
            detailTitle.textContent = course['class name'] || 'Course Details';
          
            // Clear previous content
            detailBody.innerHTML = '';
          
            // Populate each field
            for (const [key, value] of Object.entries(course)) {
                // Convert key to "Title Case"
                const label = key
                  .split(/[\s_-]+/)                            // split on space, underscore, or hyphen
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              
                const row = document.createElement('p');
                row.innerHTML = `<strong>${label}:</strong> ${value || '—'}`;
                detailBody.appendChild(row);
            }
}

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

    // Behavior for mouseover
    let courseSelected = false;

    console.log(`results length: ${results.length}`);

    // For each result, print the class as a search result
    results.forEach(course => {
        // Add the content for the search result
        // (is a button because it can be selected to reveal more information)
        const button = document.createElement('button');
        button.className = 'list-group-item list-group-item-action';
        button.textContent = `${course['coursenum']} - ${course['class name']}`;
        
        // Event listeners to display more info on each course
        button.addEventListener("click", () => {
            courseSelected = true;
            displayCourseContent(course);
        });

        button.addEventListener('mouseover', () => {
            if(!courseSelected) {
                displayCourseContent(course);
            }
        });
        
        // Add to results list
        list.appendChild(button);
    });
    
})