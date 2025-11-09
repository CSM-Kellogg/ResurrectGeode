
class TimelineManager {
    // 1. Singleton pattern implementation
    static instance = null;
    
    // Constants
    MS_PER_DAY = 1000 * 60 * 60 * 24;
    TIMELINE_ELEMENT_ID = "semester-timeline";
    // Bootstrap color classes for courses

    constructor() {
        if (TimelineManager.instance) {
            return TimelineManager.instance;
        }
        this.courses = [];
        this.minDate = null;
        this.maxDate = null;
        this.totalDurationDays = 0;
        TimelineManager.instance = this;
    }

    /**
     * Helper function to safely create a Date object from "MM/DD/YYYY" string.
     * @param {string} dateString - Date in "MM/DD/YYYY" format.
     * @returns {Date}
     */
    _parseDate(dateString) {
        // Creates a Date object, handling the format
        const [month, day, year] = dateString.split('/').map(Number);
        // Date(year, monthIndex, day)
        return new Date(year, month - 1, day);
    }

    /**
     * Helper function to calculate the difference between two dates in days.
     * @param {Date} date1 
     * @param {Date} date2 
     * @returns {number} The difference in days.
     */
    _dateDiffInDays(date1, date2) {
        const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.floor((utc2 - utc1) / this.MS_PER_DAY);
    }

    /**
     * Helper function 1: Adds a course to the timeline manager.
     * @param {string} name - The name of the course.
     * @param {string[]} dateRange - ["MM/DD/YYYY", "MM/DD/YYYY"].
     * @param {Array} RGBColor - An RGB value for the color
     */
    addCourse(name, dateRange, RGBColor) {
        const [startDateString, endDateString] = dateRange;
        const startDate = this._parseDate(startDateString);
        const endDate = this._parseDate(endDateString);

        if (isNaN(startDate) || isNaN(endDate)) {
            console.error("Invalid date format provided for course:", name);
            return;
        }
        
        this.courses.push({ name, startDate, endDate, RGBColor, index: this.courses.length });
        this._updateTimelineRange();
    }

    /**
     * Updates the overall min and max dates of the timeline based on all courses.
     */
    _updateTimelineRange() {
        if (this.courses.length === 0) {
            this.minDate = null;
            this.maxDate = null;
            this.totalDurationDays = 0;
            return;
        }

        // Find the overall minimum start date and maximum end date
        this.minDate = this.courses.reduce((min, course) => 
            course.startDate < min ? course.startDate : min, 
            this.courses[0].startDate
        );

        this.maxDate = this.courses.reduce((max, course) => 
            course.endDate > max ? course.endDate : max, 
            this.courses[0].endDate
        );
        
        // Calculate the total duration in days (add 1 to be inclusive)
        this.totalDurationDays = this._dateDiffInDays(this.minDate, this.maxDate) + 1;
    }

    /**
     * Renders the horizontal timeline in the DOM.
     */
    render() {
        const container = document.getElementById(this.TIMELINE_ELEMENT_ID);
        if (!container) {
            console.error(`Element with ID "${this.TIMELINE_ELEMENT_ID}" not found.`);
            return;
        }

        const rowHeight = 25; // Height for each course bar

        // Clear existing content and prepare the outer timeline container
        container.querySelector('#timeline-labels').innerHTML = '';
        
        const timelineChart = document.getElementById('timeline-chart');
        const labelsContainer = document.getElementById('timeline-labels');

        if (this.totalDurationDays <= 0) return;

        this.courses.forEach(course => {
            // 1. Calculate Start Offset (Days from Min Date)
            const daysFromStart = this._dateDiffInDays(this.minDate, course.startDate);
            
            // 2. Calculate Course Duration (Days)
            const courseDurationDays = this._dateDiffInDays(course.startDate, course.endDate) + 1;

            // 3. Convert days to a Percentage of the Total Duration
            const offsetPercent = (daysFromStart / this.totalDurationDays) * 100;
            const widthPercent = (courseDurationDays / this.totalDurationDays) * 100;
            
            // 4. Calculate vertical position (row) to prevent overlapping labels
            const topPosition = course.index * rowHeight;

            // Create the course bar segment
            const barSegment = document.createElement('div');
            // Use Bootstrap utility classes for styling
            barSegment.className = `p-0 text-white shadow-sm text-center text-wrap`;
            barSegment.style.background = `rgb(${course.RGBColor.join(' ')})`;
            barSegment.setAttribute('title', `${course.name}: ${course.startDate.toLocaleDateString()} - ${course.endDate.toLocaleDateString()}`);

            // Apply custom style for width, left position, and vertical position
            barSegment.style.width = `${widthPercent}%`;
            barSegment.style.left = `${offsetPercent}%`;
            barSegment.style.height = `${rowHeight}px`; // 5px padding/margin
            barSegment.style.position = 'relative';
            barSegment.style.borderRadius = '.25rem'; // Bootstrap rounded corners
            barSegment.style.whiteSpace = 'nowrap';
            barSegment.style.overflow = 'hidden';

            // Add text label for the course
            barSegment.textContent = course.name;

            // Append to the chart container
            timelineChart.appendChild(barSegment);
            
            // Add a corresponding legend/label
            const label = document.createElement('span');
            label.className = `badge rounded-pill me-2 mb-2 ${course.colorClass}`;
            label.textContent = course.name;
            labelsContainer.appendChild(label);
        });
    }
}

// Instantiate the singleton
export const timelineManager = new TimelineManager();