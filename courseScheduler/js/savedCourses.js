// By: Liam Kellogg
import { decodeHTML } from "./utils.js";
import { displayCourseContent } from './coursePopup.js';

// Is signleton
class savedCourses {
    // Stores course in entirety
    courseList = [];
    parentNode = null;

    // Singleton constructor
    constructor() {
        // If it exists, no need to do anything else
        if (savedCourses._instance) return savedCourses._instance;
        
        // If it therefore not am, create a new instance and initialize it
        savedCourses._instance = this;
        this.courseList = [];

        // There MUST be a better way of handling this but I am unsure :(
        this.parentNode = document.getElementById('saved-courses').children[1];
    }
    
    /**
     * 
     * @param {Course} course appends a course (in its entirety to the saved courses)
     */
    addCourse(course) {
        // Check if course exists already
        if (this.courseList.some(map => map["class name"] === course['class name'])) {
            console.log("course already added");
            return;
        }
        this.courseList.push(course);
        this.updateDisplay(this.parentNode);
    }

    removeCourse(course) {
        // Find course by object name and delete it
        let atIndex = this.courseList.indexOf(course);

        if (atIndex == -1) {
            console.warn("Error removing course, course not found");
            console.log(course);
            console.log(this.courseList);
        } else {
            this.courseList.splice(atIndex, 1);
        }
    }

    /**
     * 
     * @param {HTMLElement} parent Displays to the specified html element
     */
    updateDisplay(parent) {
        // Clear existing list
        parent.innerHTML = '';

        this.courseList.forEach((element) => {

            // Have to sort out this bug in searchCatalog
            let decoded_name = decodeHTML(element['class name']);

            // Retrieve the template
            const template = document.getElementById('saved-course-table-template');
            const tableRow = template.content.cloneNode(true);

            // Add the content and event listeners.
            const nameBtn = tableRow.querySelector('td[data="name"] button');
            nameBtn.innerHTML = decoded_name;
            nameBtn.className = 'list-group-item list-group-item-action';
            nameBtn.addEventListener('click', () => {
                displayCourseContent(element); // Display some info
            });

            tableRow.querySelector('td[data="credits"]').innerHTML = element['credits'];
            
            tableRow.querySelector('td[data="toggler"] button').addEventListener('click', () => {

            });

            tableRow.querySelector('td[data="trash-course"] button').addEventListener('click', () => {
                this.removeCourse(element);
                this.updateDisplay(parent); // Call another update
            });

            parent.appendChild(tableRow);
        });
    }

    getCourses() {
        return this.courseList;
    }
}

const savedCourseInstance = new savedCourses();
export default savedCourseInstance;