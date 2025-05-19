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

function waitFor(predicate, callback, interval = 100, timeout = 10000) {
    const startTime = Date.now();
    hasRun = false;
    
    const check = () => {
        const result = predicate()
        if (result && !hasRun) {
            hasRun = true;
            callback(result);
            return;
        }

        if (Date.now() - startTime > timeout) {
            console.warn('waitFor: Timed out');
            return;
        }  
        setTimeout(check, interval);
    };   
    check();
}

// Assumes we have to wait for it
function gatherSection(sectionXPath) {
    waitFor(
        () => {
            Abby = document.evaluate(
                sectionXPath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (Abby == null) { return false; } else { return true; }
        },
        result => {
            Alabaster = document.evaluate(
                sectionXPath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue.textContent.split(/[\n]+/); // Regex uses / to open and close

            Alabaster.forEach((element) => element.trim() );

            return Alabaster;
        }  
    );
}

// Iterates through each class on the page
function gatherPage() {
    
    // tr[1] is the first row
    // td[1] is the first column in the row
    // a is the clickable thing
    safeClick('//tbody/tr[1]/td[1]/a');

    // Wait for elements to load
    gate = false;
    waitFor(
        () => document.querySelector(".ui-dialog-titlebar-close"),
        result => {
            gate = true;
            Bread = gatherSection('//*[@id="classDetailsContentDetailsDiv"]/section');
            console.log(Bread);
        }
    );

    while (gate == false) {
        slee
    }
}

function initSearch() {
    // Clear all fields
    safeClick('//*[@id="search-clear"]');
    
    // Click the search button
    safeClick('//*[@id="search-go"]');
    
    // Click the drop-down
    dropdownXPath = '//select[@class="page-size-select"]';
    waitFor(
        () => document.querySelector('.page-size-select'),
        elem => {
            elem.selectedIndex = 3;
            elem.dispatchEvent(new Event('change', { bubbles: true }));

            // For each page
            gatherPage();
        }
    );
}

initSearch();

function main() {}

main();