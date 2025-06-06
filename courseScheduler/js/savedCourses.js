// By: Liam Kellogg
import { decodeHTML } from "./utils.js";

// Is signleton
class savedCourses {
    // Stores course in entirety
    courseList = [];

    // Singleton constructor
    constructor() {
        // If it exists, no need to do anything else
        if (savedCourses._instance) return savedCourses._instance;
        
        // If it therefore not am, create a new instance and initialize it
        savedCourses._instance = this;
        this.courseList = [];
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
    }

    removeCourse(course) {
        // Find course by object name and delete it
    }

    /**
     * 
     * @param {HTMLElement} parent Displays to the specified html element
     */
    updateDisplay(parent) {
        // Find out what elements need to be deleted and added (doing this later, for now gonna refresh the whole thing)
        let currentCourseList = [];
        Array.from(parent.children).forEach((element) => {
            let decoded = decodeHTML(element.children[0].innerHTML)
            currentCourseList.push(decoded);
        });

        // Now, add it to the list with the HTML.
        this.courseList.forEach((element) => {

            let decoded_name = decodeHTML(element['class name']);

            console.log(currentCourseList);
            console.log(decoded_name);

            if (!currentCourseList.includes(decoded_name)) {
                const someCourse = document.createElement('tr');
                
                const name = document.createElement('td');
                name.innerHTML = decoded_name;
                someCourse.appendChild(name);
                
                const credits = document.createElement('td');
                credits.innerHTML = element['credits'];
                someCourse.appendChild(credits);

                const toggle = document.createElement('td');
                toggle.innerHTML = '<button>toggle btn</button>';
                someCourse.append(toggle);

                const deleteIt = document.createElement('td');
                const rmbtn = document.createElement('button');
                deleteIt.appendChild(rmbtn);
                rmbtn.innerHTML = '<i class="bi bi-trash"></i>';

                rmbtn.addEventListener('click', () => {
                    this.removeCourse(element);
                    this.updateDisplay(parent); // Call another update
                    console.log("removed");
                });

                someCourse.append(deleteIt);

                parent.appendChild(someCourse);
            }
        });
    }

    getCourses() {
        return this.courseList;
    }
}

const savedCourseInstance = new savedCourses();
export default savedCourseInstance;