// Another singleton class that generates and saves schedules (also temporarily holds them)

// The minecraft wool colors btw (new textures)
let my_colors = {
    "Red Wool": [161, 39, 34],
    "Orange Wool": [240, 118, 19],
    "Magenta Wool": [189, 68, 179],
    "Light Blue Wool": [58, 175, 217],
    "Yellow Wool": [248, 198, 39],
    "Lime Wool": [112, 185, 25],
    "Pink Wool": [237, 141, 172],
    "Gray Wool": [62, 68, 71],
    "Light Gray Wool": [142, 142, 134],
    "Cyan Wool": [21, 137, 145],
    "Purple Wool": [121, 42, 172],
    "Blue Wool": [53, 57, 157],
    "Brown Wool": [114, 71, 40],
    "Green Wool": [84, 109, 27],
    "White Wool": [233, 236, 236],
    "Black Wool": [20, 21, 25]
}


class genSchedule {
    
    // Singleton constructor
    constructor() {
        // If it exists, no need to do anything else
        if (genSchedule._instance) return genSchedule._instance;
        
        // If it therefore not am, create a new instance and initialize it
        genSchedule._instance = this;
        
        // Constructor starts here
        this.savedSchedules = [];
    }
    
    /**
    * 
    * @param {list} selectedCourses A list of selected courses (the map object) likely from savedCourses.js
    */
    generate(selectedCourses) {
        // Returns a list of CRNs or some string saying what the conflicts are
        
        // I need to retrieve the sections from each course. Eventually, this supports linked courses.
    }
    
    saveCourse(CRNList) {
        
    }
    
    removeSavedCourse(index) {
        this.savedSchedules.splice(index, 1);
    }
    
    // These "SHOULDNT" have conflicts
    displaySchedule(someSchedule) {
        someSchedule = [80976, 80123, 80454]; // Debug for now
        
        // background with days and timestamps should be given
        // clear classes
    }
    
    // Draw the background to the schedule dynamically
    // By Chat GPT ( NOT CLEANED YET )
    drawBackground() {
        const scheduleBody = document.getElementById("scheduleBody");
        
        function formatTime(h, m) {
            const hour = h % 12 === 0 ? 12 : h % 12;
            const suffix = h < 12 ? "AM" : "PM";
            return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
        }
        
        for (let h = 6; h < 22; h++) {
            for (let m of [0, 15, 30, 45]) {
                const row = document.createElement("tr");
                
                // Time cell every 30 minutes (spanning 2 rows)
                if (m % 30 === 0) {
                    const timeCell = document.createElement("td");
                    timeCell.className = "time-cell";
                    timeCell.textContent = formatTime(h, m);
                    timeCell.rowSpan = 2;
                    row.appendChild(timeCell);
                }
                
                // Day cells
                for (let d = 0; d < 5; d++) {
                    const cell = document.createElement("td");
                    cell.className = "day-slot";
                    cell.dataset.day = d;
                    cell.dataset.time = `${h}:${m}`;
                    row.appendChild(cell);
                }
                
                scheduleBody.appendChild(row);
            }
        }
    }
}

const genScheduleInstance = new genSchedule();
export default genScheduleInstance;