// By: Liam Kellogg

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

    removeCourse(index) {
        this.courseList.splice(index);
    }

    /**
     * 
     * @param {HTMLElement} parent Displays to the specified html element
     */
    updateDisplay(parent) {
        // Find out what elements need to be deleted and added (doing this later, for now gonna refresh the whole thing)
        let currentCourseList = [];
        Array.from(parent.children).forEach((element) => {
            // Add to the current course list.
        });

        parent.innerHTML = "";

        this.courseList.forEach((element) => {
            const someCourse = document.createElement('div');
            someCourse.innerHTML = element['class name'];
            parent.appendChild(someCourse);
        });
    }

    getCourses() {
        return this.courseList;
    }
}

const savedCourseInstance = new savedCourses();
export default savedCourseInstance;