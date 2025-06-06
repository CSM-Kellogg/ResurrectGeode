// By: Liam Kellogg
import { decodeHTML } from "./utils.js";

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

            const someCourse = document.createElement('tr');
            
            const name = document.createElement('td');
            name.innerHTML = decoded_name;
            someCourse.appendChild(name);
            
            const credits = document.createElement('td');
            credits.innerHTML = element['credits'];
            someCourse.appendChild(credits);

            const toggle = document.createElement('td');
            toggle.innerHTML = '<button>toggled ON</button>';
            someCourse.append(toggle);

            const deleteIt = document.createElement('td');
            const rmbtn = document.createElement('button');
            deleteIt.appendChild(rmbtn);
            rmbtn.innerHTML = '<i class="bi bi-trash"></i>';

            rmbtn.addEventListener('click', () => {
                this.removeCourse(element);
                this.updateDisplay(parent); // Call another update
            });

            someCourse.append(deleteIt);
            parent.appendChild(someCourse);
        });
    }

    getCourses() {
        return this.courseList;
    }
}

const savedCourseInstance = new savedCourses();
export default savedCourseInstance;