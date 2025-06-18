// Another singleton class that generates and saves schedules (also temporarily holds them)
// By: Liam Kellogg, Grey Garner, and some ChatGPT

import catalog from "./Catalog.js";
import { createTooltip } from "./tooltip.js"


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
        this.unavailableBlocks = []; 
        this.unavailableBlocks = [];
        this.breakEditMode = false;
        this.isDraggingBreak = false;
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
                        rawMeetingDays,   // e.g. 'Monday,Wednesday,Friday' OR 'Monday'
                        rawDates,         // e.g. '08/25/2025,12/19/2025'
                        rawMeetingRange,  // e.g. '08:00 AM - 08:50 AM,AM,AM'
                        room              // e.g. 'Brown Building, Room 269'
                    ] = section;
                    
                    if (!rawMeetingDays.includes(',')) {
                        rawMeetingDays += ',';
                    }
                    //console.log(rawMeetingDays);
                    
                    return {
                        CRN,
                        sectionCode,
                        instructorName,
                        meetingDays: (rawMeetingDays || '')
                        .split(',')
                        .map(day => day.trim().toLowerCase())
                        .map(day => ({
                            monday: 'M',
                            tuesday: 'T',
                            wednesday: 'W',
                            thursday: 'R',
                            friday: 'F'
                        }[day] || '')).join(''),
                        meetingRange: (rawMeetingRange || '').split(',')[0].trim(),
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
                
                if (allSections.some(c => c.parentCourse == pCourse)) {
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
                            CRN: linkedcrn,
                            meetingDays: linkedSection[5],
                            meetingRange: linkedSection[7],
                            room: linkedSection[8],
                            parentCourse: pCourse,
                        });
                    }
                });
            }
        });
        
        //console.log(allSections);
        
        // Stores all valid schedules
        const validSchedules = [];
        
        // Recursion through a lambda expression...
        // Could be a good standard to have.
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
        
        // Display schedules
        this.savedSchedules = validSchedules;
        this.currentIndex = 0;
        
        this.displaySchedule(validSchedules[0]);
        this.updateCounter();
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
    
    // Updates the HTML on the selected schedule as well as the total number of
    // possible schedules
    updateCounter() {
        const counter = document.getElementById("schedule-counter");
        const prevBtn = document.getElementById("prev-schedule");
        const nextBtn = document.getElementById("next-schedule");
        
        const total = this.savedSchedules.length;
        const index = this.currentIndex + 1;
        
        if (counter) counter.textContent = `${index} / ${total}`;
        
        const shouldDisable = total <= 1;
        if (prevBtn) prevBtn.disabled = shouldDisable;
        if (nextBtn) nextBtn.disabled = shouldDisable;
    }
    
    // Helper for generate to check for conflicts in a schedule...
    hasConflict(schedule) {
        const timeBlocks = [];
        const dayMap = { M: 0, T: 1, W: 2, R: 3, F: 4 };
        
        for (const section of schedule) {
            const days = section.meetingDays;
            const timeRange = section.meetingRange;
            
            if (!days || !timeRange || !timeRange.includes(" - ")) continue;
            
            const [start, end] = timeRange.split(' - ').map(this.parseTime);
            
            for (const dayChar of days) {
                const day = dayChar;
                const numericDay = dayMap[day];
                
                // Check for conflict with other courses
                for (const block of timeBlocks) {
                    if (
                        block.day === day &&
                        Math.max(start, block.start) < Math.min(end, block.end)
                    ) {
                        return true; // ❌ Conflict with another course
                    }
                }
                
                // Check for conflict with break blocks
                for (const block of this.unavailableBlocks) {
                    if (
                        block.day === numericDay &&
                        Math.max(start, block.start) < Math.min(end, block.end)
                    ) {
                        return true; // ❌ Conflict with break
                    }
                }
                
                timeBlocks.push({ day, start, end });
            }
        }
        
        return false; // ✅ No conflicts
    }
    
    
    /**
    * Parses AM/PM time into an integer of minutes from midnight
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
    
    // Displays the schedule -- needs some work.
    displaySchedule(someSchedule) {
        const dayMap = { M: 0, T: 1, W: 2, R: 3, F: 4 };
        document.querySelectorAll(".schedule-block").forEach(el => el.remove());
        const colorList = Object.entries(my_colors);
        const colorMap = new Map();
        
        // Creates breaks between classes
        document.querySelectorAll(".break-block").forEach(el => el.remove());
        this.unavailableBlocks.forEach(({ day, start, end }) => {
            const startHour = Math.floor(start / 60);
            const startMin = start % 60;
            const cell = document.querySelector(`[data-day="${day}"][data-time="${startHour}:${startMin}"]`);
            if (!cell) return;
            
            const duration = end - start;
            const height = ((duration) / 15) * cell.offsetHeight;
            
            const block = document.createElement("div");
            block.className = "break-block";
            block.style.height = `${height}px`;
            block.textContent = "Break";
            
            cell.appendChild(block);
        });
        
        // Tooltip to view the class details
        let tooltip = document.getElementById("custom-tooltip");
        if (tooltip) {
            tooltip.innerHTML = '';
            tooltip.style.display = "none";
        } else {
            tooltip = document.createElement("div");
            tooltip.id = "custom-tooltip";
            tooltip.className = "custom-tooltip";
            document.body.appendChild(tooltip);
        }
        
        someSchedule.forEach((section, i) => {
            const key = section.parentCourse["class name"];
            if (!colorMap.has(key)) {
                const color = colorList[i % colorList.length][1];
                colorMap.set(key, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`);
            }
        });
        
        for (const section of someSchedule) {
            // Some debug for invalud sections, honestly this logic is a little dodgey
            if (!someSchedule || someSchedule.length === 0) {
                console.warn("⚠️ Skipped empty schedule:", someSchedule);
            }
            if (
                !section.meetingRange ||
                typeof section.meetingRange !== "string" ||
                !section.meetingRange.includes(" - ")
            ) {
                console.warn("❌ Skipped: Invalid meetingRange:", section);
                continue;
            }
            
            if (
                !section.meetingDays ||
                typeof section.meetingDays !== "string" ||
                !section.meetingDays.match(/[MTWRF]/)
            ) {
                console.warn("❌ Skipped: Invalid meetingDays:", section);
                continue;
            }
            
            // Gets the parent course of the current class and the color to paint this class
            const key = section.parentCourse["class name"];
            const color = colorMap.get(key);
            
            // goofy ahh if statement
            if (!section.meetingRange || typeof section.meetingRange !== 'string' || !section.meetingRange.includes(' - ')) {
                console.warn("Invalid or missing meetingRange:", section);
                continue;
            }
            
            // Display the schedule block on the schedule grid
            const [startStr, endStr] = section.meetingRange.split(' - ');
            const start = this.parseTime(startStr);
            const end = this.parseTime(endStr);
            
            for (const day of section.meetingDays) {
                const dayIndex = dayMap[day];
                if (dayIndex === undefined) continue;
                
                const startHour = Math.floor(start / 60);
                const startMin = start % 60;
                const cell = document.querySelector(`[data-day="${dayIndex}"][data-time="${startHour}:${startMin}"]`);

                if (cell) {
                    //createTooltip();
                    const block = document.createElement("div");
                    const instructor = section.instructorName || "Unknown";
                    const crn = section.CRN || "Unknown";
                    const sectionCode = section.sectionCode || "N/A";
                    const room = section.room || "TBD";
                    
                    block.addEventListener("mouseenter", (e) => {
                        tooltip.innerHTML = `<strong class="mb-1">${section.parentCourse['class name']}</strong>
                        <strong>Section:</strong> ${sectionCode}
                        <strong>CRN:</strong> ${crn}
                        <strong>Instructor:</strong> ${instructor}
                        <strong>Room:</strong> ${room}`;
                        tooltip.style.display = "block";
                    });
                    
                    block.addEventListener("mousemove", (e) => {
                        const tooltipRect = tooltip.getBoundingClientRect();
                        const margin = 10;
                        
                        let left = e.clientX + 15;
                        let top = e.clientY + 15;
                        
                        // If tooltip would go off the right edge
                        if (left + tooltipRect.width + margin > window.innerWidth) {
                            left = e.clientX - tooltipRect.width - 15;
                        }
                        
                        // If tooltip would go off the bottom edge
                        if (top + tooltipRect.height + margin > window.innerHeight) {
                            top = e.clientY - tooltipRect.height - 15;
                        }
                        
                        tooltip.style.left = `${left}px`;
                        tooltip.style.top = `${top}px`;
                    });
                    
                    block.addEventListener("mouseleave", () => {
                        tooltip.style.display = "none";
                    });
                    
                    block.className = "schedule-block";
                    block.style.backgroundColor = color;
                    block.style.height = ((end - start) / 15) * cell.offsetHeight + "px";
                    
                    block.textContent = key;
                    
                    cell.appendChild(block);
                }
            }
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

    // Where the break sections are... added to the display?
    enableBreakSelection() {
        let startCell = null;
        let visAid = null;
        
        const cells = document.querySelectorAll("td.day-slot");
        const daZone = document.querySelector('#right-column');

        // Clears state of the edit mode
        function clearState() {
            startCell.classList.remove("selected-break-start");
            startCell = null;
            daZone.removeChild(visAid);
        }

        cells.forEach(cell => {
            cell.addEventListener("click", () => {
                if (!this.breakEditMode) return;

                if (!startCell) {
                    // First click = start
                    startCell = cell;
                    // The div to act as a visual aid
                    visAid = document.createElement('div');
                    visAid.className = 'break-edit-visaid';
                    visAid.style.top = `${cell.getBoundingClientRect().y}px`;
                    visAid.style.left = `${cell.getBoundingClientRect().x}px`;

                    daZone.appendChild(visAid);

                    cell.classList.add("selected-break-start");
                    return;
                }
                
                // Second click = end
                const day1 = parseInt(startCell.dataset.day);
                const day2 = parseInt(cell.dataset.day);
                
                // Must be same day - When this changes to a draggable click get rid of this

                // The change: When multiple days are selected, iterate through
                // all of them on the code below
                if (day1 !== day2) {
                    clearState();
                    return alert("Break must be on the same day.");
                }
                
                const [h1, m1] = startCell.dataset.time.split(':').map(Number);
                const [h2, m2] = cell.dataset.time.split(':').map(Number);
                const start = Math.min(h1 * 60 + m1, h2 * 60 + m2);
                const end = Math.max(h1 * 60 + m1, h2 * 60 + m2) + 15; // include clicked cell
                
                // Prevent duplicates
                const alreadyExists = this.unavailableBlocks.some(b =>
                    b.day === day1 && b.start === start && b.end === end
                );
                if (!alreadyExists) {
                    this.unavailableBlocks.push({ day: day1, start, end });
                }
                
                // Clear state
                clearState();
                
                this.displaySchedule(this.savedSchedules[this.currentIndex] || []);
            });

            // Visual aid
            cell.addEventListener("mouseover", () => {
                if (!this.breakEditMode || !startCell) return;

                let endX = cell.getBoundingClientRect().right;
                let endY = cell.getBoundingClientRect().bottom;

                let originX = startCell.getBoundingClientRect().left;
                let originY = startCell.getBoundingClientRect().top;

                if (endY <= originY) {
                    originY = cell.getBoundingClientRect().top;
                    endY = startCell.getBoundingClientRect().bottom;
                }

                if (endX <= originX) {
                    originX = cell.getBoundingClientRect().left;
                    endX = startCell.getBoundingClientRect().right;
                }

                visAid.style.top = `${originY}px`;
                visAid.style.left = `${originX}px`;
                visAid.style.width = `${endX - originX}px`;
                visAid.style.height = `${endY - originY}px`;
            });
        });
        
        // Clear on outside click
        document.addEventListener("click", (e) => {
            if (!e.target.closest("td.day-slot") && startCell) {
                clearState();
            }
        });
    }
    
    addBreakBlock(day, start, end) {
        this.unavailableBlocks.push({ day, start, end });
    }
    
}

// Export the signleton class
const genScheduleInstance = new genSchedule();
export default genScheduleInstance;
