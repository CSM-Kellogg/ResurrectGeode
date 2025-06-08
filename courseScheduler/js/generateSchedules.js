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
};

class genSchedule {
    constructor() {
        if (genSchedule._instance) return genSchedule._instance;
        genSchedule._instance = this;
        this.savedSchedules = [];
        this.currentIndex = 0;
    }

    generate(selectedCourses) {
        const allSections = selectedCourses.map(course => {
            //console.log("🔍 sectionListing RAW:", course.sectionListing);
            let sections = course.sectionListing;
            try {
                if (!Array.isArray(sections)) throw new Error("Parsed sectionListing is not an array.");
            } catch (err) {
                console.warn("Skipping course due to bad sectionListing format:", course.sectionListing);
                console.log("SectionListing type:", typeof course.sectionListing, Array.isArray(course.sectionListing));
                return [];
            }

            return sections.map(section => {
                //console.log('mapping',section)
                if (Array.isArray(section)) {
                    //console.log("🎯 Parsed SECTION:", section);
                    //console.log("RAW SECTION ARRAY:", section);
                    const [
                        CRN,              // e.g. '82325'
                        courseType,       // e.g. 'Lecture'
                        deliveryType,     // e.g. 'Face to Face'
                        sectionCode,      // e.g. 'A'
                        instructorName,
                        instructorEmail,
                        rawMeetingDays,   // e.g. 'Monday,Wednesday,Friday'
                        rawDates,         // e.g. '08/25/2025,12/19/2025'
                        rawMeetingRange,  // e.g. '08:00 AM - 08:50 AM,AM,AM'
                        room              // e.g. 'Brown Building, Room 269'
                    ] = section;
                    return {
                        CRN,
                        meetingDays: (rawMeetingDays || '')
                            .split(',')
                            .map(day => day.trim().toLowerCase())
                            .map(day => ({
                                monday: 'M',
                                tuesday: 'T',
                                wednesday: 'W',
                                thursday: 'R',
                                friday: 'F'
                            }[day] || '')
                            ).join(''),
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
            }).filter(Boolean);
        });

        const validSchedules = [];

        const recurse = (depth, currentSchedule) => {
            if (depth === allSections.length) {
                if (!this.hasConflict(currentSchedule)) {
                    validSchedules.push([...currentSchedule]);
                }
                return;
            }

            for (const section of allSections[depth]) {
                currentSchedule.push(section);
                recurse(depth + 1, currentSchedule);
                currentSchedule.pop();
            }
        };

        recurse(0, []);
        console.log(`Generated ${validSchedules.length} valid schedules`);

        this.savedSchedules = validSchedules;
        this.currentIndex = 0;

        this.displaySchedule(validSchedules[0]);
        this.updateCounter();
    }

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

    saveCourse(CRNList) {}

    removeSavedCourse(index) {
        this.savedSchedules.splice(index, 1);
    }
    hasConflict(schedule) {
        const timeBlocks = [];

        for (const section of schedule) {
            const days = section.meetingDays;
            const timeRange = section.meetingRange;

            if (!days || !timeRange || !timeRange.includes(" - ")) continue;

            const [start, end] = timeRange.split(' - ').map(this.parseTime);

            for (const day of days) {
                for (const block of timeBlocks) {
                    if (
                        block.day === day &&
                        Math.max(start, block.start) < Math.min(end, block.end)
                    ) {
                        return true; // ❌ Conflict detected
                    }
                }
                timeBlocks.push({ day, start, end });
            }
        }

        return false; // ✅ No conflicts
    }

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

    displaySchedule(someSchedule) {
        const dayMap = { M: 0, T: 1, W: 2, R: 3, F: 4 };
        document.querySelectorAll(".schedule-block").forEach(el => el.remove());
        const colorList = Object.entries(my_colors);
        const colorMap = new Map();

        someSchedule.forEach((section, i) => {
            const key = section.parentCourse["class name"];
            if (!colorMap.has(key)) {
                const color = colorList[i % colorList.length][1];
                colorMap.set(key, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`);
            }
        });
        for (const section of someSchedule) {
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
            const key = section.parentCourse["class name"];
            const color = colorMap.get(key);

            if (!section.meetingRange || typeof section.meetingRange !== 'string' || !section.meetingRange.includes(' - ')) {
                console.warn("Invalid or missing meetingRange:", section);
                continue;
            }

            const [startStr, endStr] = section.meetingRange.split(' - ');
            const start = this.parseTime(startStr);
            const end = this.parseTime(endStr);

            for (const day of section.meetingDays) {
                const dayIndex = dayMap[day];
                if (dayIndex === undefined) continue;

                for (let t = start; t < end; t += 15) {
                    const hour = Math.floor(t / 60);
                    const minute = t % 60;
                    const cell = document.querySelector(`[data-day="${dayIndex}"][data-time="${hour}:${minute}"]`);
                    if (cell) {
                        const block = document.createElement("div");
                        block.className = "schedule-block";
                        block.style.backgroundColor = color;
                        block.textContent = key;
                        block.style.fontSize = "0.6rem";
                        cell.appendChild(block);
                    }
                }
            }
        }
    }

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
