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

function checkElem(someXPath) {
    if (getElem(someXPath)) { return true; }
    return false;
}

// Clicks a button given the XPath
function safeClick(someXPath) {
    button = getElem(someXPath);
    
    if (button) {
        button.click();
        //console.log('Button clicked.');
    } else {
        console.log('Button not found.');
        alert('hi')
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

async function getClassData(Alabaster) {
    // Retrieve all data for a class
    Bread = '//section[contains(@aria-labelledby, "classDetails")]';
    let Abby;

    await waitFor( () => {
        Abby = getElem(Bread);
        if (Abby == null) { return false; } else { return true; }
    });

    // Create tmp array then deep copy
    tmpBaster = Abby.textContent.split(/[\n]+/); // Regex uses / to open and close

    tmpBaster = tmpBaster.map(element => element.trim()).filter(element => element !== '');
    Alabaster.push(...tmpBaster); // This ellipsis pushes each element of tmpBaster into Alabaster
}

// Array used for this function only:
fieldNames = ["classDetails", "prereqs"];
// Iterates through each class on the page
async function getPageOfClasses(Alabaster) {
    // I am utilising pass-by-ref, and in this case that means clearing the array
    Alabaster.length = 0;
    
    // tr[1] is the first row
    // td[1] is the first column in the row
    // a is the clickable thing
    safeClick('//tbody/tr[1]/td[1]/a');

    // Wait for elements to load
    try {
        await waitFor(() => getElem('//button[@class="ui-dialog-titlebar-close"]'));
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