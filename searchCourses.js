/**
 * Be careful with variable names... Check with console if unsure
 * 
 */

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
                reject(new Error('waitFor: Timed out'));
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

classDeetSelectors = [
    "CRN", "Campus", "Schedule Type", "Instructional Method", "Section Number",
    "Subject", "Course Number", "Title", "Credit Hours"
];

async function getClassData(Alabaster) {
    Alabaster.length = 0; // Clear the passed by referenced array

    // Class details now exists in a dropdown menu outside of the widget
    // Abby = await getSectionBody('//*[@id="classDetails"]/a',
    //     '//section[contains(@aria-labelledby, "classDetails")]');
    // scoop = Abby.textContent.split(/([\n]|:)+/);

    // // Trims each element and filters out the delimiters
    // scoop = scoop.map(element => element.trim()).filter(
    //     element => element !== '' &&
    //     element !== ":"
    // );

    // // Need to parse out needed information
    // bucket = [];
    // while (scoop.length > 0) {
    //     spoon = scoop.shift();

    //     // For some input "CRN: 80321", this bit gets the "80321"
    //     if (classDeetSelectors.includes(spoon)) {
    //         bucket.push(scoop.shift());
    //     }
    // }
    // // This ellipsis pushes each element
    // Alabaster.push(...bucket);

    // Go to pre-req section ==================================================
    Bethany = await getSectionBody('//*[@id="preReqs"]/a',
        '//section[contains(@aria-labelledby, "preReqs")]');
    scoop = Bethany.textContent.split(/[\n]+/);

    // Trims each element and filters out the delimiters
    scoop = scoop.map(element=>element.trim()).filter(element=>element!=='');
    
    // NEEDS HELP LATER
    if (scoop[1] == "No prerequisite information available.") {
        Alabaster.push(null);
        console.log("No pre-req information, will default to course info.");
    } else { console.log("Prereq info found, please write the code for it"); }

    // Go to instructor meeting times =========================================
    Cathy = await getSectionBody('//h3[@id="facultyMeetingTimes"]/a',
        '//div[@class="meetingTimesContainer"]');

    // Wait for accordion to load
    await waitFor(() => {
        return (Cathy.querySelector('.email') != null);
    });

    // Use query selectors to find data contained
    prof = Cathy.querySelector('.email').textContent;
    profEmail = Cathy.querySelector('.email').href;

    // Get schedule title and keep the days of the week.
    daysOfWeek = Cathy.querySelector('.ui-pillbox')
        .attributes['title']
        .value.split(':')[1];
    
    // I DONT THINK THE ROOM IS IMPORTANT, SO IGNORING THAT FOR NOW

    // Get dates for start and end instruction
    dates = Cathy.querySelector('.dates').textContent.split(' - ');

    // Get time of day and location
    timeAndLoc = Cathy.querySelector('.right').textContent;
    time = timeAndLoc.match(/[^A-z]*(AM|PM)[^A-z]+(AM|PM)/);
    // location = timeAndLoc[len(time):].split('|')[1:]
    classroom = timeAndLoc.slice(time.length).split('|').slice(1);

    Alabaster.push(prof, profEmail, daysOfWeek, dates, time, classroom);

    // Doing Enrollment/waitlist later

    // Go to Mutual Exclusion =================================================
    Diana = await getSectionBody('//h3[@id="mexc"]/a',
        '//section[contains(@aria-labelledby, "mexc")]');
    
    // Wait for the table to load
    let mexcTable;
    await waitFor(() => {
        mexcTable = getElem('//table[@class=basePreqTable]/tbody');
        return (mexcTable != null);
    });

    mexcTable = mexcTable[1] // Get the table body

    // For each <tr>, append to the mutualExc list
    let mexcList;
    Array.from(mexcTable.children).forEach((element) => {
        courseData = element.textContent.split('\n');
        courseData = courseData.map(element => element.trim())
            .filter(element => element !== '');

        mexcList.push(courseData);
    });

    Alabaster.push(mexcList);

    // Go to course description
    
}

// Array used for this function only:
fieldNames = ["classDetails", "prereqs"];
// Iterates through each class on the page
async function getPageOfClasses(Alabaster) {
    // Clear pass-by-reference array
    Alabaster.length = 0;
    
    // tr[1] is the first row
    // td[1] is the first column in the row
    // a is the clickable thing
    safeClick('//tbody/tr[1]/td[1]/a');

    // Wait for elements to load
    try {
        await waitFor(() => getElem('//div[@id="classDetailsContentDetailsDiv"]/section'));
    } catch (e) { console.error(e.message); }

    await getClassData(Alabaster);
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
        // Change the page size to 50
        let elem;
        await waitFor(() => elem = getElem("//*[@class='page-size-select']"));
        
        elem.selectedIndex = 3;
        elem.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Wait for all the elements to load
        await waitFor(() => getElem("//tbody").childElementCount == 50);

        // Search all pages
        Cramner = [];
        await getPageOfClasses(Cramner);

        console.log(Cramner);
    })();
}

main();