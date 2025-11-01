class scheduleState {
    constructor() {
        if (scheduleState._instance) return scheduleState._instance;
        
        scheduleState._instance = this;
        this.currentSchedule = {};
    }

    addCourse(courseName, sectionIndex) {
        if (this.currentSchedule.includes(courseName)) {
            console.warn("Course already in schedule, overwriting section index");
            this.currentSchedule[courseName] = sectionIndex;
            return;
        }
    }

    removeCourse(courseName) {
        delete this.currentSchedule[courseName];
    }

    // Returns crn?
    getCourses() {
        
    }

    // key value pair: selectedCourse: courseName, sectionIndex
    // getters and setters: courseName, sectionIndex for some course
    // saved plans using localstorage. Stores crn
}

const scheduleStateInstance = new scheduleState();
export default scheduleStateInstance;