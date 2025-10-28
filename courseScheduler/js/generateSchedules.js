/**
 * By: Liam Kellogg, Grey Garner, and some ChatGPT
 * 
 * A class that generates and displays schedules.
 * 
 * savedSchedules keeps the schedules generated for a certain cource list
 * currentIndex tracks the current schedule the student is viewing
 * choiceIndices tracks the choices for the merged sections for a class
 */

import catalog from "./Catalog.js";
import Tooltip from "./tooltip.js"
import breakManager from "./breakManager.js"
import { displayOptionsPopup } from "./optionsPopup.js";

// The minecraft wool colors btw (new textures)
let my_colors = {
    "Red Wool": [181, 71, 66],
    "Light Blue Wool": [86, 191, 217],
    "Green Wool": [110, 125, 73],
    "Orange Wool": [243, 139, 63],
    "Lime Wool": [134, 199, 69],
    "Magenta Wool": [201, 92, 191],
    "Blue Wool": [77, 82, 174],
    "Pink Wool": [240, 157, 184],
    "Cyan Wool": [49, 157, 161],
    "Purple Wool": [138, 74, 188],
    "Yellow Wool": [249, 214, 87],
    "Brown Wool": [137, 97, 72],
    "White Wool": [237, 238, 238],
    "Light Gray Wool": [158, 158, 152],
    "Gray Wool": [88, 95, 99],
    "Black Wool": [61, 63, 69]
};

class genSchedule {
    constructor() {
        if (genSchedule._instance) return genSchedule._instance;
        genSchedule._instance = this;
        this.savedSchedules = [];
        this.currentIndex = 0;
        this.choiceIndices = [];
    }

    // Displays the schedule -- needs some work.
    displaySchedule(someSchedule) {
        if (!someSchedule) {
            console.log("Likely couldn't generate a schedule for you");
            return;
        }

        document.querySelectorAll(".schedule-block").forEach(el => el.remove());
        const colorList = Object.entries(my_colors);
        const colorMap = new Map();
        
        // Creates breaks between classes
        breakManager.display();
        
        // Tooltip to view some class details (events added to schedule blocks)
        Tooltip.resetToolTip();
        
        // Add da colors
        someSchedule.forEach((section, i) => {
            const key = section.parentCourse["class name"];
            if (!colorMap.has(key)) {
                const color = colorList[i % colorList.length][1];
                colorMap.set(key, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`);
            }
        });
        
        let i = 0;
        for (const section of someSchedule) {
            // Gets the parent course of the current class and the color to paint this class
            const key = section.parentCourse["class name"];
            const color = colorMap.get(key);
            
            // Display the schedule block on the schedule grid

            // military time conversion for start and end
            const [start, end] = section.meetingRange.map((time) => this.parseMilitaryTime(time));
            
            //for (const day of section.meetingDays) {
            for (let dayIndex = 0; dayIndex < section.meetingDays.length; dayIndex ++) {
                if (section.meetingDays[dayIndex] == false) continue;
                
                const startHour = Math.floor(start / 60);
                const startMin = start % 60;
                const cell = document.querySelector(`[data-day="${dayIndex}"][data-time="${startHour}:${startMin}"]`);

                if (cell) {
                    const block = document.createElement("div");
                    
                    let header = `<strong class="mb-1">${section.parentCourse['class name']}</strong>`;
                    const currChoice = this.choiceIndices[i];

                    // Add a button to let students change the current professor for a section
                    if (section.CRN.length > 1) {
                        header += `(${currChoice + 1}/${section.CRN.length})`;
                        displayOptionsPopup(cell, someSchedule[i], this.choiceIndices, i);
                    }

                    const tooltipInfo = `${header}
                    <strong>Section:</strong> ${section.sectionCode[currChoice] || "N/A"}
                    <strong>CRN:</strong> ${section.CRN[currChoice] || "Unknown"}
                    <strong>Instructor:</strong> ${section.instructorName[currChoice] || "Unknown"}
                    <strong>Room:</strong> ${section.room[currChoice] || "TBD"}`;

                    // Adds the tool tip events to a parent element
                    Tooltip.createTooltipEvents(block, tooltipInfo);
                    
                    block.className = "schedule-block";
                    block.style.backgroundColor = color;
                    block.style.height = ((end - start) / 15) * cell.offsetHeight + "px";
                    
                    block.textContent = key;
                    
                    cell.appendChild(block);
                } else {
                    console.warn(`couldn't find the cell to place a class...`);
                }
            }

            i ++;
        }
    }
    
    // Draws the background of the schedule as a table
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
                
                if (m % 30 === 0) {
                    const timeCell = document.createElement("td");
                    timeCell.className = "time-cell";
                    timeCell.textContent = formatTime(h, m);
                    timeCell.rowSpan = 2;
                    row.appendChild(timeCell);
                }
                
                for (let d = 0; d < 5; d++) {
                    const cell = document.createElement("td");
                    cell.className = "day-slot";
                    cell.style.position = 'relative';
                    cell.dataset.day = d;
                    cell.dataset.time = `${h}:${m}`;
                    row.appendChild(cell);
                }
                
                scheduleBody.appendChild(row);
            }
        }
    }

    // Returns CRNs of the current schedule
    exportCurrentSchedule() {
        if (this.choiceIndices.length == 0) {
            console.log("No schedule can be created");
            return null;
        }

        let output = [];
        for (let i = 0; i < this.choiceIndices.length; i ++) {
            let tmp = this.savedSchedules[this.currentIndex][i]['CRN'][this.choiceIndices[i]];
            
            // Goober! what the bruh dude
            if (typeof tmp == "string" || tmp instanceof String) tmp = parseInt(tmp);
            output.push(tmp)
        }

        console.log(output);
        return output;
    }
    
    // Generates a schedule from courses considering all sections
    generate(selectedCourses) {
        const allSections = selectedCourses.map(course => {
            // Some sanitization of input - REPLACE WITH A CHECK FOR NULL AND PROPER PARSING
            let sections = course.sectionListing;
            try {
                if (!Array.isArray(sections)) throw new Error("Parsed sectionListing is not an array.");
            } catch (err) {
                console.warn("Skipping course due to bad sectionListing format:", course.sectionListing);
                console.log("SectionListing type:", typeof course.sectionListing, Array.isArray(course.sectionListing));
                return [];
            }
            
            // Gets the sections of each classes and stores it in allSections
            return sections.map(section => {
                if (Array.isArray(section)) {
                    // The map keys for our catalog.csv. I Need to have a better way of storing this
                    let [
                        CRN,              // e.g. '82325'
                        deliveryType,     // e.g. 'Face to Face'
                        sectionCode,      // e.g. 'A'
                        instructorName,
                        instructorEmail,
                        rawMeetingDays,   // e.g. 'true,false,false,true,false' would be monday-thursday
                        rawDates,         // e.g. '08/25/2025,12/19/2025'
                        rawMeetingRange,  // e.g. '1200,1350' (military time)
                        room              // e.g. 'BB 269'
                    ] = section;
                    
                    return {
                        CRN,
                        sectionCode,
                        instructorName,
                        meetingDays: (rawMeetingDays || '')
                        .split(',')
                        .map((day) => 'true' === day), // Kept as booleans for now
                        meetingRange: (rawMeetingRange || '').split(','),
                        room,
                        parentCourse: course
                    };
                } else if (typeof section === "object") {
                    return {
                        ...section,
                        parentCourse: course
                    };
                } else {
                    console.warn("Skipping malformed section:", section);
                    return null;
                }
            }).filter(Boolean); // Only filters out non-null values
        });

        // Handle linked sections here and append the sections to all sections
        selectedCourses.forEach((course) => {
            // For each selected course with linked sections, add those sections
            let m_linkedSections = course['linkedCourses'];
            if (m_linkedSections[0] != null) {
                // Assuming the linked sections for any course are the same course
                let pCourse = catalog.courseFromCRN(m_linkedSections[0]);

                // Could be problematic, but its not my fault that linked sections are inconsistent
                if (allSections.some(c => c.some(s => s.parentCourse['class name'] == pCourse['class name']))) {
                    console.log("Already added linked course");
                    return; // equivalent to continue
                }
                
                allSections.push([]); // Add the linked class
                let c_index = allSections.length - 1;
                
                m_linkedSections.forEach((linkedcrn) => {
                    let sectionIndex = pCourse['sectionListing'].findIndex(section => section[0] == linkedcrn);
                    if (sectionIndex == -1) { // An error like this should fail silently
                        console.log(`Course ${course['class name']} has a linked section with CRN ${linkedcrn} that doesn't exist.`);
                    } else {
                        let linkedSection = pCourse['sectionListing'][sectionIndex];
                        
                        allSections[c_index].push({
                            CRN: linkedcrn.toString(),
                            meetingDays: linkedSection[5].split(',').map((day) => day === "true"),
                            meetingRange: linkedSection[7].split(','),
                            room: linkedSection[8],
                            parentCourse: pCourse,
                        });
                    }
                });
            }
        });

        // Merge sections that have the same time
        allSections.forEach((c) => {
            for (let i = 0; i < c.length; i ++) {
                c[i].CRN = [c[i].CRN];
                c[i].instructorName = [c[i].instructorName];
                c[i].room = [c[i].room];
                c[i].sectionCode = [c[i].sectionCode];

                for (let j = i + 1; j < c.length; j ++) {
                    if (c[i].meetingDays == c[j].meetingDays && c[i].meetingRange.trim().replace(/\s+/g, ' ') === c[j].meetingRange.trim().replace(/\s+/g, ' ')) {
                            
                        c[i].CRN.push(c[j].CRN);
                        c[i].instructorName.push(c[j].instructorName);
                        c[i].room.push(c[j].room);
                        c[i].sectionCode.push(c[j].sectionCode);

                        c.splice(j, 1);
                        j -= 1;
                    }
                }
            }
        });
        
        // Stores all valid schedules
        const validSchedules = [];
        
        // Recursion through a lambda expression...
        // Could be a good standard to have.
        console.log(allSections);

        const recurse = (depth, currentSchedule) => {
            if (depth === allSections.length) { // If we have gone through all sections
                if (!this.hasConflict(currentSchedule)) { // And no conflict
                    validSchedules.push([...currentSchedule]); // Append to valid schedules
                }
                return;
            }
            
            // Build the current schedule from all sections
            for (const section of allSections[depth]) {
                currentSchedule.push(section);
                recurse(depth + 1, currentSchedule);
                currentSchedule.pop();
            }
        };
        
        recurse(0, []); // Start recursion on empty schedule
        
        // Make this give more info about what courses conflict or what the exact error is
        if (!validSchedules[0]) {
            alert("Couldn't generate any schedules with the current selected set/breaks");
            this.currentIndex = "💀";
            this.savedSchedules = [];
            this.updateCounter();
            this.displaySchedule([]); // display empty
            return;
        }

        // Display schedules
        this.savedSchedules = validSchedules;
        this.currentIndex = 0;
        this.#resetChocies();

        this.displaySchedule(validSchedules[0]);
        this.updateCounter();
    }

    // Helper for generate to check for conflicts in a schedule...
    hasConflict(schedule) {
        const timeBlocks = [];
        
        for (const section of schedule) {
            const days = section.meetingDays;
            const timeRange = section.meetingRange;
            
            if (!timeRange) continue;
            
            // Get start and end time for the current section
            const [start, end] = timeRange.map((timeStr) => this.parseMilitaryTime(timeStr));

            // SHOULD be five booleans for [mon,tue,wed,thu,fri] but idk
            for (let i = 0; i < days.length; i ++) {
                if (!days[i]) continue; // Only iterate for meeting days

                // Check for conflict with other courses
                for (const block of timeBlocks) {
                    if (
                        block.day === i &&
                        Math.max(start, block.start) < Math.min(end, block.end)
                    ) {
                        return true; // Conflict with another course
                    }
                }

                // Check for conflict with break blocks
                for (const block of breakManager.getBreakBlocks()) {
                    if (
                        block.day === i &&
                        Math.max(start, block.start) < Math.min(end, block.end)
                    ) {
                        return true; // Conflict with break time
                    }
                }
                timeBlocks.push({ day: i, start, end });
            }
        }
        
        // average ChatGPT comment
        return false; // ✅ No conflicts
    }
    
    // Next and previous button logic for iterating through available schedules
    nextSchedule() {
        if (this.savedSchedules.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.savedSchedules.length;
        this.displaySchedule(this.savedSchedules[this.currentIndex]);
        this.updateCounter();
    }
    
    prevSchedule() {
        if (this.savedSchedules.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.savedSchedules.length) % this.savedSchedules.length;
        this.displaySchedule(this.savedSchedules[this.currentIndex]);
        this.updateCounter();
    }

    #resetChocies() {
        this.choiceIndices = new Array(this.savedSchedules[0].length).fill(0);
    }
    
    // Updates the HTML on the selected schedule as well as the total number of
    // possible schedules
    updateCounter() {
        const counter = document.getElementById("schedule-counter");
        const prevBtn = document.getElementById("prev-schedule");
        const nextBtn = document.getElementById("next-schedule");
        
        const total = this.savedSchedules.length;
        let index = this.currentIndex;
        if (typeof(this.currentIndex) == "number") {
            index += 1;
        }
        
        if (counter) counter.textContent = `${index} / ${total}`;
        
        const shouldDisable = total <= 1;
        if (prevBtn) prevBtn.disabled = shouldDisable;
        if (nextBtn) nextBtn.disabled = shouldDisable;
    }

    // what it does. useful for optionsPopup.js and other future things that modify a schedule
    updateSchedule() {
        this.displaySchedule(this.savedSchedules[this.currentIndex]);
    }
    
    /**
     * 
     * @param {string} timeStr military time as a string
     * @returns An integer -- minutes from midnight
     */
    parseMilitaryTime(timeStr) {
        if (timeStr.length != 4) {
            console.warn('Military time parse cannot be completed with a string that isnt 4 characters');
            return 0;
        }

        let hour = parseInt(timeStr.slice(0,2));
        let minute = parseInt(timeStr.slice(2));
        return hour * 60 + minute;
    }

    /**
    * Parses AM/PM time into an integer of minutes from midnight (e.g `02:00 PM`)
    * @param {string} timeStr 
    * @returns An integer -- minutes from midnight 
    */
    parseTime(timeStr) {
        const cleaned = timeStr.trim().replace(/\s+/g, ' '); // normalize spaces
        const parts = cleaned.split(' ');
        if (parts.length < 2) return null; // malformed
        
        const [time, modifier] = parts;
        let [hour, minute] = time.split(':').map(Number);
        
        if (modifier.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (modifier.toUpperCase() === 'AM' && hour === 12) hour = 0;
        
        return hour * 60 + minute;
    }
}

// Export the signleton class
const genScheduleInstance = new genSchedule();
export default genScheduleInstance;
