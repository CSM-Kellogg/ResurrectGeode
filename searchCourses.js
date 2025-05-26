/**
 * Be careful with variable names... Check with console if unsure
 * 
 */

CLASS_DEET_SELECT = [
    "CRN", "Campus", "Schedule Type", "Instructional Method", "Section Number",
    "Subject", "Course Number", "Title", "Credit Hours"
];

function getElem(someXPath) {
    const elem = document.evaluate(
        someXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
    
    return elem
}

// Clicks a button given the XPath
function safeClick(someXPath) {
    button = getElem(someXPath);
    
    if (button) {
        //button.click();
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        //console.log('Button clicked.');
    } else {
        console.log('Button not found.');
        alert('awlfkjal;w');
    }
}

function waitFor(predicate, interval = 100, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const check = () => {
            const result = predicate();
            if (result) {
                resolve(result);
                return;
            }

            if (Date.now() - startTime > timeout) {
                reject(new Error('waitFor: Timed out. Predicate shown above'));
                
                console.log(predicate);

                return;
            }

            setTimeout(check, interval);
        };

        check();
    });
}

async function getSectionBody(headerXPath, target) {
    safeClick(headerXPath);
    let Abby;

    await waitFor(() => {
        Abby = getElem(target);
        // I really don't mind this. Do you?
        return (Abby != null);
    });

    return Abby;
}

// Get class details (sometimes it goes away and I have no idea when that happens)
async function getClassDetailInfo(gypsum) {
    Abby = await getSectionBody('//*[@id="classDetails"]/a',
        '//section[contains(@aria-labelledby, "classDetails")]');
    scoop = Abby.textContent.split(/([\n]|:)+/);

    // Trims each element and filters out the delimiters
    scoop = scoop.map(element => element.trim()).filter(
        element => element !== '' &&
        element !== ":"
    );

    // Need to parse out needed information
    bucket = [];
    while (scoop.length > 0) {
        spoon = scoop.shift();

        // For some input "CRN: 80321", this bit gets the "80321"
        if (CLASS_DEET_SELECT.includes(spoon)) {
            bucket.push(scoop.shift());
        }
    }

    gypsum.push(...bucket);
}

async function getPreReqInfo(gypsum) {
    // Go to pre-req section ==================================================
    Bethany = await getSectionBody('//*[@id="preReqs"]/a',
        '//section[contains(@aria-labelledby, "preReqs")]');
    scoop = Bethany.textContent.split(/[\n]+/);

    // Trims each element and filters out the delimiters
    scoop = scoop.map(element=>element.trim()).filter(element=>element!=='');
    
    // NEEDS HELP LATER
    if (scoop[1] == "No prerequisite information available.") {
        gypsum.push(null);
        console.log("No pre-req information, will default to course info.");
        return gypsum.length - 1;
    } else {
        let prereqTable;
        await waitFor(() => {
            prereqTable = getElem('//table[@class="basePreqTable"]/tbody')
            return (prereqTable != null);
        });
        
        reqClasses = [];
        Array.from(prereqTable.children).forEach((element) => {
            courseData = element.textContent.split('\n');
            courseData = courseData.map(element => element.trim())
                .filter(element => element !== '');

            reqClasses.push(courseData);
        });

        gypsum.push(reqClasses);
        return null;
    }
}

async function getMeetingInfo(gypsum) {
    // Go to instructor meeting times =========================================
    Cathy = await getSectionBody('//h3[@id="facultyMeetingTimes"]/a',
        '//div[@class="meetingTimesContainer"]');

    // Could be void of data
    if (Cathy.textContent == "No specified meeting times") {
        gypsum.push(...[null, null, null, null, null, null]);
        return;
    }
    
    // Wait for accordion to load
    await waitFor(() => {
        return (Cathy.querySelector('.email') != null);
    });

    // Get email and professor name
    prof = Cathy.querySelector('.email').textContent;
    profEmail = Cathy.querySelector('.email').href;

    // Get dates for start and end instruction
    dates = Cathy.querySelector('.dates').textContent.split(' - ');

    // Get schedule title and keep the days of the week.
    sheddule = Cathy.querySelector('.ui-pillbox');
    
    // if the class is asynchronous, then this element DNE
    let daysOfWeek, time, classroom;
    if (sheddule.attributes['title'].value == "Class on: None") { // The class doesn't meet

    } else {
        // Days of the week
        daysOfWeek = sheddule.attributes['title'].value.split(':')[1];
        
        // Get time of day and location
        timeAndLoc = Cathy.querySelector('.right').textContent;
        time = timeAndLoc.match(/[^A-z]*(AM|PM)[^A-z]+(AM|PM)/);
        // location = timeAndLoc[len(time):].split('|')[1:]
        classroom = timeAndLoc.slice(time.length).split('|').slice(1);
    }
    
    // I DONT THINK THE ROOM IS IMPORTANT, SO IGNORING THAT FOR NOW

    gypsum.push(prof, profEmail, daysOfWeek, dates, time, classroom);
}

async function getMutualExclInfo(gypsum) {
    // Go to Mutual Exclusion =================================================
    Diana = await getSectionBody('//h3[@id="mexc"]/a',
        '//section[contains(@aria-labelledby, "mexc")]');
    
    // Check for mutual exlcusions
    if (Diana.textContent.trim().includes("information available")) {
        // No mutual exclusions, returning
        gypsum.push(null);
        return;
    }
    
    // Wait for the table to load
    let mexcTable;
    await waitFor(() => {
        mexcTable = getElem('//table[@class="basePreqTable"]/tbody');
        return (mexcTable != null);
    });

    // For each <tr>, append to the mutualExc list
    let mexcList = [];
    Array.from(mexcTable.children).forEach((element) => {
        courseData = element.textContent.split('\n');
        courseData = courseData.map(element => element.trim())
            .filter(element => element !== '');

        mexcList.push(courseData);
    });

    gypsum.push(mexcList);
}

async function getCourseDescription(gypsum, prereqIndex) {
    Evelyn = await getSectionBody('//h3[@id="courseDescription"]/a',
        '//section[contains(@aria-labelledby, "courseDescription")]');
    
    description = Evelyn.textContent;

    gypsum.push(description);

    // If we couldn't get pre-req info earlier, now is the time
    if (prereqIndex != null && gypsum[prereqIndex] == null) {
        // Parse out the prereq part
        prereqs = description.match(/(Prerequisites: ).*/)
        if (prereqs == null) return
        
        prereqs = prereqs[0].slice(15);
        gypsum[prereqIndex] = prereqs;
    }
}

async function getClassData(Alabaster) {
    Alabaster.length = 0; // Clear the passed by referenced array

    // This ellipsis pushes each element
    await getClassDetailInfo(Alabaster);

    prereqIndex = await getPreReqInfo(Alabaster);
    await getMeetingInfo(Alabaster);

    // Doing Enrollment/waitlist later

    await getMutualExclInfo(Alabaster);
    await getCourseDescription(Alabaster, prereqIndex);
}

// Array used for this function only:
fieldNames = ["classDetails", "prereqs"];
// Iterates through each class on the page
async function getPageOfClasses(quartz, pageRowNum) {
    // Clear pass-by-reference array
    quartz.length = 0;
    
    // tr[1] is the first row
    // td[1] is the first column in the row
    // a is the clickable thing
    for (i = 0; i < pageRowNum; i ++) {
        safeClick(`//tbody/tr[${i+1}]/td[1]/a`);

        // Wait for elements to load
        try {
            await waitFor(() => getElem('//div[@id="classDetailsContentDetailsDiv"]/section'));
        } catch (e) { console.error(e.message); }

        // If for some reason the class cannot be reached, resume and ignore the class
        try {
            amethyst = []
            await getClassData(amethyst);
            quartz.push(...amethyst);
        } catch (e) {
            console.log(`Was unable to parse class, class CRN is: ${amethyst[0]}`);
        }

        // Close the window, we are done here
        safeClick('//*[@class="ui-dialog-titlebar-close"]');

        // Wait for the UI box to go away
        await waitFor(() => {
            return (getElem('//div[@class="ui-widget-overlay ui-front"]') == null);
        });

        //console.log(quartz);
    }
}

// Controls overhead of loading in class pages and ordering the parse of them
async function main() {
    // Clear all fields
    safeClick('//*[@id="search-clear"]');
    
    // Click the search button
    safeClick('//*[@id="search-go"]');
    
    // Click the drop-down
    dropdownXPath = '//select[@class="page-size-select"]';

    (async () => {
        // Search all pages
        let nextBtn;
        do {
            // Change the page size to 50
            let elem;
            await waitFor(() => elem = getElem("//*[@class='page-size-select']"));
            
            elem.selectedIndex = 3;
            elem.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Wait for all the elements to load
            await waitFor(() => getElem("//tbody").childElementCount == 50);
            
            // Get the page data
            Cramner = [];
            await getPageOfClasses(Cramner, 50);

            nextBtn = getElem('//*[@title="Next"]');
            safeClick('//*[@title="Next"]');
        } while(nextBtn.attributes['class'].value.match('enabled') != null);

        // Save the result (Cramner)
    })();

    // Download the csv

}

main();