import {timelineManager} from "./timelineManager.js"

// 1. Add Courses (The dates will now fully demonstrate the overlap)
timelineManager.addCourse("Calculus I", ["09/01/2025", "12/15/2025"], [181, 71, 66]);         // Row 0: Long duration
timelineManager.addCourse("Physics Lab", ["09/10/2025", "10/30/2025"], [86, 191, 217]);       // Row 1: Overlaps with Calc I
timelineManager.addCourse("History of Art", ["09/01/2025", "12/10/2025"], [110, 125, 73]);    // Row 2: Same start as Calc I, similar end
timelineManager.addCourse("Philosophy Seminar", ["10/05/2025", "12/20/2025"], [110, 125, 73]); // Row 3: Overlaps significantly
timelineManager.addCourse("Final Project", ["12/01/2025", "12/24/2025"], [110, 125, 73]);      // Row 4: Starts late, ends latest

// 2. Render the timeline
timelineManager.render();