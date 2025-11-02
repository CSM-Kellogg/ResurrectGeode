### breakManager.js
- Controls breaks in a students' schedule
- Is a singleton class.

### Catalog.js
- Loads in the catalog into a private variable this.#catalogData.
- Is singleton
- Keyword search function (input is string, output are courses that match filter)

### courseAvailability.js
- For some CRN, retrieves waitlist and availability for it

### coursePopup.js
- Front end, displays course information on click

### debug.http
- Various http requests for testing what works
- Requires VSCode extension (should pop up when opening the file for the first time)

### dragHandles.js
- Front end, controls the resizable windows on the website (right pane, left panes)

### generateSchedules.js
- The heart of the schedule creator
- Is singleton
- Absolute mess:
    - displays the schedule for some course list (rich information)
    - Draws the background for the schedule
    - Exports the current schedule to `scheduleExport.js` -> `content.js` -> elluciancloud
    - generates sections for some course list
    - cycle between all iterations of a schedule and the general getters/setters that come with that feature
    - Some time parsers

### optionsPopup.js
- Currently broken, is an optional feature to merge same-time sections together. Defunct with the new scheduleState.js

### savedCourses.js
- Singleton class to store courses the student has chosen. SHOULD ALSO CONTAIN INFORMATION ABOUT DIFFERENT SCHEDULES THE STUDENT HAS SAVED AND PREFERENCES FOR THE STUDENT
- Controls the lower left pane and its display

### scheduleExport.js
- A fairly small function that creates a 'voyage' for content.js to embark on.
- Interfaces between generateSchedules.js and content.js
- The 'voyage' exists in local storage and controls state information on what
    the next step is the 'navigation' in elluciancloud's webpage. This is how
    the program can register a student for classes.

### Scheduler.js
- The interface between the webpage `Scheduler.html` and the rest of the JS files.

### scheduleState.js
- ??? merge with savedCourses the funcitionality is completely overlapping

### tooltip.js
- An on-hover feature for the classes a student has selected to display very quick information

### utils.js
- A general utility belt for some re-used functions:
    - department shorthands from the full name to the 4 letter sequence
    - <Defunct> A way to remove the `&amp;` symbol from many course names. Just
        make a manual one in the future this is an easy regex problem
    - customSectionParser: When loading in the catalog, sections have a
        particular format that isn't easily parseable by `JSON.parse()`. I had to write my own method.