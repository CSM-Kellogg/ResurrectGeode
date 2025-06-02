import catalog from './Catalog.js';

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

function addInfo(parent, label, value) {
    const element = document.createElement('p');
    element.innerHTML = `<strong>${label}:</strong> ${value}`
    parent.appendChild(element);

    return element;
}

function displayCourseContent(course) {
    const detailContainer = document.getElementById('course-detail');
    const detailTitle = document.getElementById('detail-title');
    const detailBody = document.getElementById('detail-body');
    
    // Show the detail section
    detailContainer.style.display = 'block';
    
    /** Populate each field in a specific order
     * 1. ShorthandDeptName: courseNum - course name
     * 2. campus, credits
     * 3. Pre-reqs, co-reqs, mutual exclusions
     * 4. Course description
     * 5 (for now). Section info
     */

    // Clear previous content
    detailBody.innerHTML = '';

    // Set title of course
    detailTitle.textContent = `${deptShrtHand[course['department']]} 
        ${course['coursenum']} - ${course['class name']}` || 'Course Details';
    
    // Campus and credits line (just a little weird)
    addInfo(detailBody, 'Campus', `${course['campus']}<br/><strong>Credits:</strong> ${course['credits']}`);

    // Pre-reqs
    // TODO: update when searchCourses is updated
    addInfo(detailBody, 'Prerequisites', course['pre-reqs'] || "None");

    // co-reqs
    // TODO: update when searchCOurses is updated

    // mutual exclusions
    // TODO: Make this look nice
    addInfo(detailBody, 'Mutual Exclusions', course['mutual exclusions'] || "None");

    // Course description
    addInfo(detailBody, 'Course Description', course["coursedescription"] || "None");

    // Sec. info (delete later)
    addInfo(detailBody, 'Section Info', course['sectionListing']);
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
        button.textContent = `${course['class name']}`;
        
        // Event listeners to display more info on each course
        button.addEventListener("click", () => {
            courseSelected = true;
            displayCourseContent(course);
            // display Sections
        });

        button.addEventListener('mouseover', () => {
            if(!courseSelected) {
                displayCourseContent(course);
                // display Sections
            }
        });
        
        // Add to results list
        list.appendChild(button);
    });
    
})