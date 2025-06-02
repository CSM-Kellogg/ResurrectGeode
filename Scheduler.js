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

const topPane = document.getElementById('left-top');
const dragHandle = document.getElementById('drag-handle');
const container = document.querySelector('.left-pane');

let isDragging = false;

dragHandle.addEventListener('mousedown', function (e) {
    isDragging = true;
    document.body.style.cursor = 'row-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    
    const containerRect = container.getBoundingClientRect();
    const offsetY = e.clientY - containerRect.top;
    const minHeight = 100;
    const maxHeight = containerRect.height - minHeight;
    
    // Clamp value
    const newHeight = Math.max(minHeight, Math.min(offsetY, maxHeight));
    topPane.style.height = `${newHeight}px`;
});

document.addEventListener('mouseup', function () {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
    }
});

const leftCol = document.getElementById('left-column');
const verticalDrag = document.getElementById('vertical-drag');
const mainContainer = document.getElementById('main-container');

let isDraggingVert = false;

verticalDrag.addEventListener('mousedown', function (e) {
    isDraggingVert = true;
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', function (e) {
    if (!isDraggingVert) return;
    
    const containerRect = mainContainer.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const minWidth = 200;
    const maxWidth = containerRect.width - minWidth;
    
    const newWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
    leftCol.style.width = `${newWidth}px`;
});

document.addEventListener('mouseup', function () {
    if (isDraggingVert) {
        isDraggingVert = false;
        document.body.style.cursor = '';
    }
});

// Displays content of selected course
// Collaboration of Liam Kellogg and ChatGPT
function displayCourseContent(course) {
    // Remove previous floating box if present
    let floatBox = document.getElementById('floating-popup');
    if (floatBox) {
        floatBox.innerHTML=''
    } else {
        // create n new one if not
        floatBox = document.createElement('div');
        floatBox.id = 'floating-popup';
        floatBox.className = 'floating-box resize-drag';
    }
    
    // Close button and header
    const header = document.createElement('div');
    header.className = 'header d-flex align-items-center justify-content-between p-0 border-bottom';
    floatBox.appendChild(header);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.className = 'close-btn';
    closeBtn.onclick = () => floatBox.remove();
    header.appendChild(closeBtn);

    const headerInfo = document.createElement('h5');
    headerInfo.textContent = "Selected Course Info";
    headerInfo.className = "mb-0 fw-bold text-dark me-auto px-2";
    header.appendChild(headerInfo);
    
    // Title
    const title = document.createElement('h5');
    title.textContent = `${deptShrtHand[course['department']]} ${course['coursenum']} - ${course['class name']}` || 'Course Details';
    floatBox.appendChild(title);
    
    // Helper function
    const addInfo = (label, content) => {
        const container = document.createElement('p');
        container.innerHTML = `<strong>${label}:</strong> ${content}`;
        floatBox.appendChild(container);
    };
    
    // Content
    addInfo('Campus & Credits', `${course['campus']}<br/><strong>Credits:</strong> ${course['credits']}`);
    addInfo('Prerequisites', course['pre-reqs'] || "None");
    addInfo('Mutual Exclusions', course['mutual exclusions'] || "None");
    addInfo('Course Description', course['coursedescription'] || "None");
    addInfo('Section Info', course['sectionListing'] || "None");
    
    document.body.appendChild(floatBox);
    // At the end of the function:
    // makeDraggable(floatBox);
    // makeResizable(floatBox);
}

// Submission to search box
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
    
    console.log(`results length: ${results.length}`);
    
    let selection = false;
    
    // For each result, print the class as a search result
    results.forEach(course => {
        // Add the content for the search result
        // (is a button because it can be selected to reveal more information)
        const button = document.createElement('button');
        button.className = 'list-group-item list-group-item-action';
        button.textContent = `${course['class name']}`;
        
        // Event listeners to display more info on each course
        button.addEventListener("click", () => {
            selection = !selection;
            displayCourseContent(course);
            // display Sections
        });
        
        // Add to results list
        list.appendChild(button);
    });
    
})

function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener

interact('.resize-drag')
.resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },
    
    listeners: {
        move (event) {
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
            
            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'
            
            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top
            
            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
            
            // target.setAttribute('data-x', x)
            // target.setAttribute('data-y', y)
            // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
        }
    },
    modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
            outer: 'parent'
        }),
        
        // minimum size
        interact.modifiers.restrictSize({
            min: { width: 100, height: 50 }
        })
    ],
    
    inertia: true
})
.draggable({
    listeners: { move: window.dragMoveListener },
    inertia: true,
    modifiers: [
        interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
        })
    ]
})